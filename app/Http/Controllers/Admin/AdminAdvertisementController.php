<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Models\Category;
use App\Notifications\AdDeletedByAdminNotification;
use App\Notifications\AdUpdatedByAdminNotification;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAdvertisementController extends Controller
{
    use \App\Http\Controllers\Concerns\HasPagination;
    public function __construct(private ImageService $imageService) {}

    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $paginator = Advertisement::with('category', 'user')
            ->when($search, fn ($q) => $q->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")
                ->orWhereHas('user', fn ($q) => $q->where('name', 'like', "%{$search}%"))
                ->orWhereHas('category', fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ))
            ->latest()
            ->paginate(21);

        $ads = $paginator->getCollection()->map(fn ($ad) => [
            'id'          => $ad->id,
            'title'       => $ad->title,
            'description' => $ad->description,
            'price'       => $ad->price,
            'is_pinned'          => (bool) $ad->is_pinned,
            'is_pinned_category' => (bool) $ad->is_pinned_category,
            'created_at'  => $ad->created_at->format('d.m.Y'),
            'category'    => $ad->category ? ['name' => $ad->category->name] : null,
            'user'        => $ad->user ? ['name' => $ad->user->name] : null,
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads,
                'hasMore' => $paginator->hasMorePages(),
                'search'  => $search,
            ]);
        }

        return Inertia::render('Admin/Advertisements/Index', [
            'ads'    => $this->paginationData($paginator, $ads->values()->all()),
            'search' => $search,
        ]);
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
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'payload'      => 'nullable|string|max:255',
            'availability' => 'required|in:available,on_request',
            'price'        => 'nullable|string|max:255',
            'phone'        => 'required|string|min:8|max:15',
            'location'     => 'required|string',
            'category_id'  => 'required|exists:categories,id',
            'image'        => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'images.*'     => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $advertisement->title        = $request->title;
        $advertisement->description  = $request->description;
        $advertisement->payload      = $request->payload;
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
        }

        if ($request->hasFile('images')) {
            if ($advertisement->images()->count() + count($request->file('images')) > 10) {
                return back()->withErrors(['images' => 'Ne možete dodati više od 10 slika u galeriju.']);
            }

            $nextOrder = $advertisement->images()->max('order') + 1;
            foreach ($request->file('images') as $i => $file) {
                $advertisement->images()->create([
                    'path'  => $this->imageService->store($file),
                    'order' => $nextOrder + $i,
                ]);
            }
        }

        return redirect()->route('admin.oglasi.index')->with('success', 'Oglas je ažuriran.');
    }

    public function togglePin(Advertisement $advertisement)
    {
        $advertisement->update(['is_pinned' => !$advertisement->is_pinned]);

        return back()->with('success', $advertisement->is_pinned ? 'Oglas je prikačen.' : 'Oglas je otkačen.');
    }

    public function togglePinCategory(Advertisement $advertisement)
    {
        $advertisement->update(['is_pinned_category' => !$advertisement->is_pinned_category]);

        return back()->with('success', $advertisement->is_pinned_category ? 'Oglas je prikačen u kategoriji.' : 'Oglas je otkačen iz kategorije.');
    }

    public function destroy(Advertisement $advertisement)
    {
        $owner = $advertisement->user;
        $title = $advertisement->title;

        $advertisement->delete();

        if ($owner) {
            $owner->notify(new AdDeletedByAdminNotification($title));
        }

        return redirect()->route('admin.oglasi.index')->with('success', 'Oglas je obrisan.');
    }

    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:delete,pin,unpin',
            'ids'    => 'required|array|min:1',
            'ids.*'  => 'integer|exists:advertisements,id',
        ]);

        $ads = Advertisement::whereIn('id', $request->ids);

        match ($request->action) {
            'delete' => $ads->get()->each(function ($ad) {
                $owner = $ad->user;
                $title = $ad->title;
                $ad->delete();
                if ($owner) {
                    $owner->notify(new AdDeletedByAdminNotification($title));
                }
            }),
            'pin'    => $ads->update(['is_pinned' => true]),
            'unpin'  => $ads->update(['is_pinned' => false]),
        };

        $count = count($request->ids);
        $label = match ($request->action) {
            'delete' => "Obrisano {$count} oglasa.",
            'pin'    => "Prikačeno {$count} oglasa.",
            'unpin'  => "Otkačeno {$count} oglasa.",
        };

        return back()->with('success', $label);
    }
}
