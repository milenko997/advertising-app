<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AdDeletedByAdminMail;
use App\Mail\AdUpdatedByAdminMail;
use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use App\Notifications\AdDeletedByAdminNotification;
use App\Notifications\AdUpdatedByAdminNotification;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdminAdvertisementController extends Controller
{
    use \App\Http\Controllers\Concerns\HasPagination;
    public function __construct(private ImageService $imageService) {}

    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $status = in_array($request->input('status'), self::STATUSES, true) ? $request->input('status') : '';

        $categories = Category::orderBy('name')->get(['id', 'name', 'parent_id']);
        $category   = $categories->firstWhere('id', (int) $request->input('category'));

        // A parent category also matches the ads in its subcategories
        $categoryIds = $category
            ? $categories->where('parent_id', $category->id)->pluck('id')->push($category->id)
            : null;

        // Only users who actually have ads are worth offering in the filter
        $users = User::whereHas('advertisements')->orderBy('name')->get(['id', 'name', 'email']);
        $user  = $users->firstWhere('id', (int) $request->input('user'));

        $base = Advertisement::query()
            ->when($categoryIds, fn ($q) => $q->whereIn('category_id', $categoryIds))
            ->when($user, fn ($q) => $q->where('user_id', $user->id))
            ->when($search, fn ($q) => $q->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                ->orWhereHas('category', fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ));

        $paginator = (clone $base)
            ->with('category', 'user')
            ->when($status, fn ($q) => $this->whereStatus($q, $status))
            ->latest()
            ->paginate(21)
            ->withQueryString();

        $ads = $paginator->getCollection()->map(fn ($ad) => [
            'id'          => $ad->id,
            'title'       => $ad->title,
            'slug'        => $ad->slug,
            'description' => $ad->description,
            'price'       => $ad->price,
            'is_pinned'          => (bool) $ad->is_pinned,
            'is_pinned_category' => (bool) $ad->is_pinned_category,
            'pinned_at'          => $ad->pinned_at?->format('d.m.Y'),
            'pinned_category_at' => $ad->pinned_category_at?->format('d.m.Y'),
            'created_at'  => $ad->created_at->format('d.m.Y'),
            'expires_at'  => $ad->expires_at?->format('d.m.Y'),
            'status'      => $this->status($ad),
            'category'    => $ad->category ? ['name' => $ad->category->name] : null,
            'user'        => $ad->user ? ['id' => $ad->user->id, 'name' => $ad->user->name] : null,
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads,
                'hasMore' => $paginator->hasMorePages(),
                'search'  => $search,
            ]);
        }

        $counts = ['all' => (clone $base)->count()];
        foreach (self::STATUSES as $s) {
            $counts[$s] = $this->whereStatus(clone $base, $s)->count();
        }

        return Inertia::render('Admin/Advertisements/Index', [
            'ads'    => $this->paginationData($paginator, $ads->values()->all()),
            'search' => $search,
            'status'     => $status,
            'counts'     => $counts,
            'category'   => $category?->id,
            'user'       => $user?->id,
            'users'      => $users->map(fn ($u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email]),
            'categories' => $this->categoriesWithAds($categories, $category),
        ]);
    }

    /**
     * Filter options: only categories that have ads (a parent also counts the ads in its
     * subcategories), plus the selected one so the dropdown never loses the current filter.
     */
    private function categoriesWithAds($categories, ?Category $selected)
    {
        // Keyed by id so the lookups below don't scan the whole list
        $used = Advertisement::distinct()->pluck('category_id')
            ->push($selected?->id)
            ->filter()
            ->flip();

        return $categories->whereNull('parent_id')
            ->map(fn ($parent) => [
                'id'       => $parent->id,
                'name'     => $parent->name,
                'children' => $categories->where('parent_id', $parent->id)
                    ->filter(fn ($child) => $used->has($child->id))
                    ->values()
                    ->map(fn ($child) => ['id' => $child->id, 'name' => $child->name]),
            ])
            ->filter(fn ($parent) => $used->has($parent['id']) || $parent['children']->isNotEmpty())
            ->values();
    }

    private const STATUSES = ['active', 'expiring', 'expired'];

    /**
     * Query counterpart of status(); keep the two in sync.
     */
    private function whereStatus($query, string $status)
    {
        $now  = now();
        $soon = now()->addDays(7);

        return match ($status) {
            'expired'  => $query->whereNotNull('expires_at')->where('expires_at', '<=', $now),
            'expiring' => $query->where('expires_at', '>', $now)->where('expires_at', '<=', $soon),
            'active'   => $query->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', $soon)),
        };
    }

    /**
     * "expiring" uses the same 7-day window as the ads:notify-expiring reminder.
     */
    private function status(Advertisement $ad): string
    {
        return match (true) {
            $ad->isExpired()                                                  => 'expired',
            $ad->expires_at !== null && $ad->expires_at->lte(now()->addDays(7)) => 'expiring',
            default                                                           => 'active',
        };
    }

    public function edit(Advertisement $advertisement)
    {
        $advertisement->load('images');
        $categories = Category::orderBy('name')->get(['id', 'name', 'slug', 'parent_id']);

        return Inertia::render('Admin/Advertisements/Edit', [
            'advertisement' => [
                'id'           => $advertisement->id,
                'title'        => $advertisement->title,
                'description'  => $advertisement->description,
                'payload'      => $advertisement->payload,
                'availability' => $advertisement->availability,
                'price'        => $advertisement->price,
                'phone'        => $advertisement->phone,
                'location'     => $advertisement->location,
                'category_id'  => $advertisement->category_id,
                'image'        => $advertisement->image,
                'images'       => $advertisement->images->map(fn ($img) => [
                    'id'    => $img->id,
                    'path'  => $img->path,
                    'order' => $img->order,
                ])->values(),
            ],
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Advertisement $advertisement)
    {
        $request->validate([
            'title'        => 'required|string|min:5|max:255',
            'description'  => 'required|string|min:10|max:5000',
            'payload'      => 'nullable|string|min:2|max:100',
            'availability' => 'required|in:available,on_request',
            'price'        => 'nullable|string|max:100',
            'phone'        => ['required', 'regex:/^\+?[0-9][0-9 \-\(\)\.]{5,19}$/'],
            'location'     => 'required|string|min:2|max:255',
            'category_id'  => 'required|exists:categories,id',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240|dimensions:max_width=8192,max_height=8192',
            'images'       => 'nullable|array|max:10',
            'images.*'     => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240|dimensions:max_width=8192,max_height=8192',
        ]);

        if ($request->hasFile('images') &&
            $advertisement->images()->count() + count($request->file('images')) > 10) {
            return back()->withErrors(['images' => 'Ne možete dodati više od 10 slika u galeriju.']);
        }

        $advertisement->title        = $request->title;
        $advertisement->description  = strip_tags($request->description);
        $advertisement->payload      = $request->payload ? strip_tags($request->payload) : null;
        $advertisement->availability = $request->availability;
        $advertisement->price        = $request->price;
        $advertisement->phone        = $request->phone;
        $advertisement->location     = $request->location;
        $advertisement->category_id  = $request->category_id;

        if ($request->hasFile('image')) {
            $this->imageService->delete($advertisement->image);
            $advertisement->image = $this->imageService->store($request->file('image'));
        } elseif ($request->input('remove_image') == '1') {
            $this->imageService->delete($advertisement->image);
            $advertisement->image = null;
        }

        $advertisement->save();

        if ($advertisement->user) {
            $advertisement->user->notify(new AdUpdatedByAdminNotification($advertisement));

            try {
                Mail::to($advertisement->user->email)->queue(new AdUpdatedByAdminMail(
                    $advertisement->user->name,
                    $advertisement->title,
                    $advertisement->slug,
                ));
            } catch (\Exception) {}
        }

        if ($request->hasFile('images')) {
            $nextOrder = $advertisement->images()->max('order') + 1;
            foreach ($request->file('images') as $i => $file) {
                $advertisement->images()->create([
                    'path'  => $this->imageService->store($file),
                    'order' => $nextOrder + $i,
                ]);
            }
        }

        Cache::forget('nav_categories');

        return redirect()->route('admin.oglasi.index')->with('success', 'Oglas je ažuriran.');
    }

    public function togglePin(Advertisement $advertisement)
    {
        $pinning = !$advertisement->is_pinned;
        $advertisement->is_pinned = $pinning;
        $advertisement->pinned_at = $pinning ? now() : null;
        $advertisement->save();

        return back()->with('success', $pinning ? 'Oglas je globalno prikačen.' : 'Oglas je otkačen.');
    }

    public function togglePinCategory(Advertisement $advertisement)
    {
        $pinning = !$advertisement->is_pinned_category;
        $advertisement->is_pinned_category = $pinning;
        $advertisement->pinned_category_at = $pinning ? now() : null;
        $advertisement->save();

        return back()->with('success', $pinning ? 'Oglas je prikačen u kategoriji.' : 'Oglas je otkačen iz kategorije.');
    }

    public function renew(Advertisement $advertisement)
    {
        if (!$advertisement->isExpired()) {
            return back()->with('error', 'Samo istekli oglasi mogu da se obnove.');
        }

        $advertisement->renew();

        return back()->with('success', 'Oglas je obnovljen na još ' . Advertisement::EXPIRY_DAYS . ' dana.');
    }

    public function destroy(Advertisement $advertisement)
    {
        $owner = $advertisement->user;
        $title = $advertisement->title;

        $advertisement->delete();

        if ($owner) {
            $owner->notify(new AdDeletedByAdminNotification($title));

            try {
                Mail::to($owner->email)->queue(new AdDeletedByAdminMail($owner->name, $title));
            } catch (\Exception) {}
        }

        Cache::forget('nav_categories');

        return redirect()->route('admin.oglasi.index')->with('success', 'Oglas je obrisan.');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,pin,unpin',
            'ids'    => 'required|array|min:1|max:100',
            'ids.*'  => 'integer|exists:advertisements,id',
        ]);

        $ads = Advertisement::whereIn('id', $request->ids);

        match ($request->action) {
            'delete' => $ads->with('user')->get()->each(function ($ad) {
                $owner = $ad->user;
                $title = $ad->title;
                $ad->delete();
                if ($owner) {
                    $owner->notify(new AdDeletedByAdminNotification($title));

                    try {
                        Mail::to($owner->email)->queue(new AdDeletedByAdminMail($owner->name, $title));
                    } catch (\Exception) {}
                }
            }),
            'pin'   => $ads->update(['is_pinned' => true,  'pinned_at' => now()]),
            'unpin' => $ads->update(['is_pinned' => false, 'pinned_at' => null]),
        };

        $count = count($request->ids);
        $label = match ($request->action) {
            'delete' => "Obrisano {$count} oglasa.",
            'pin'    => "Prikačeno {$count} oglasa.",
            'unpin'  => "Otkačeno {$count} oglasa.",
        };

        if ($request->action === 'delete') {
            Cache::forget('nav_categories');
        }

        return back()->with('success', $label);
    }
}
