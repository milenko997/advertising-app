<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAdvertisementRequest;
use App\Http\Requests\UpdateAdvertisementRequest;
use App\Http\Resources\AdvertisementResource;
use App\Models\Advertisement;
use App\Models\AdvertisementImage;
use App\Models\Category;
use App\Models\Favorite;
use App\Models\Review;
use App\Services\ImageService;
use App\Services\SlugService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdvertisementController extends Controller
{
    public function __construct(
        private ImageService $imageService,
        private SlugService $slugService,
    ) {}

    public function publicIndex(Request $request)
    {
        $search   = $request->get('search');
        $location = $request->get('location');

        $pinnedAds = [];
        if (!$search && !$location) {
            $pinnedAds = Advertisement::with('user', 'category')
                ->active()
                ->where('is_pinned', true)
                ->latest()
                ->get()
                ->map(fn ($ad) => $this->formatAd($ad))
                ->values()
                ->all();
        }

        $pinnedIds = collect($pinnedAds)->pluck('id')->all();

        $ads = Advertisement::with('user', 'category')
            ->active()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                      ->orWhere('description', 'like', '%' . $search . '%')
                      ->orWhere('location', 'like', '%' . $search . '%')
                      ->orWhereHas('category', fn ($q) => $q->where('name', 'like', '%' . $search . '%'));
                });
            })
            ->when($location, fn ($q) => $q->where('location', 'like', '%' . $location . '%'))
            ->when(!empty($pinnedIds), fn ($q) => $q->whereNotIn('id', $pinnedIds))
            ->latest()
            ->paginate(21);

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $this->formatAds($ads),
                'hasMore' => $ads->hasMorePages(),
            ]);
        }

        return Inertia::render('Home', [
            'ads'          => $this->paginationData($ads),
            'pinnedAds'    => $pinnedAds,
            'search'       => $search,
            'location'     => $location,
            'favoritedIds' => Favorite::idsForUser(Auth::id()),
        ]);
    }

    public function userIndex(Request $request)
    {
        $paginator = Advertisement::with('category')
            ->where('user_id', Auth::id())
            ->orderByRaw("CASE WHEN expires_at IS NULL OR expires_at > datetime('now') THEN 0 ELSE 1 END")
            ->latest()
            ->paginate(20);

        $ads = $paginator->getCollection()->map(fn ($ad) => $this->formatAd($ad))->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads,
                'hasMore' => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Advertisements/UserIndex', [
            'ads' => [
                'data'         => $ads,
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Advertisements/Create', [
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug', 'parent_id']),
        ]);
    }

    public function store(StoreAdvertisementRequest $request)
    {
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->imageService->store($request->file('image'));
        }

        $ad = Advertisement::create([
            'user_id'      => Auth::id(),
            'title'        => $request->title,
            'slug'         => $this->slugService->generate($request->title),
            'description'  => $request->description,
            'payload'      => $request->payload,

            'availability' => $request->availability,
            'price'        => $request->price,
            'image'        => $imagePath,
            'phone'        => $request->phone,
            'location'     => $request->location,
            'category_id'  => $request->category_id,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $i => $file) {
                $ad->images()->create([
                    'path'  => $this->imageService->store($file),
                    'order' => $i,
                ]);
            }
        }

        return redirect()->route('advertisements.user')->with('success', 'Oglas je uspešno kreiran.');
    }

    public function show($slug)
    {
        $ad = Advertisement::with('user', 'category', 'images')->where('slug', $slug)->firstOrFail();

        // Increment view counter once per session per ad, skip for the owner
        $sessionKey = 'viewed_ad_' . $ad->id;
        if (!Auth::check() || Auth::id() !== $ad->user_id) {
            if (!session()->has($sessionKey)) {
                $ad->increment('views');
                session()->put($sessionKey, true);
            }
        }

        $isSaved = Auth::check()
            ? Auth::user()->favorites()->where('advertisement_id', $ad->id)->exists()
            : false;

        $reviews = [];
        $avgRating = null;
        $myReview = null;

        if ($ad->user) {
            $reviews = Review::with('reviewer')
                ->where('reviewed_user_id', $ad->user_id)
                ->latest()
                ->get()
                ->map(fn ($r) => [
                    'id'         => $r->id,
                    'rating'     => $r->rating,
                    'comment'    => $r->comment,
                    'created_at' => $r->created_at->format('d.m.Y'),
                    'reviewer'   => [
                        'id'     => $r->reviewer->id,
                        'name'   => $r->reviewer->name,
                        'slug'   => $r->reviewer->slug,
                        'avatar' => $r->reviewer->avatar,
                    ],
                ])->values()->all();

            $avgRating = count($reviews) > 0
                ? round(collect($reviews)->avg('rating'), 1)
                : null;

            if (Auth::check()) {
                $raw = Review::where('reviewer_id', Auth::id())
                    ->where('reviewed_user_id', $ad->user_id)
                    ->first();
                $myReview = $raw ? ['id' => $raw->id, 'rating' => $raw->rating, 'comment' => $raw->comment] : null;
            }
        }

        return Inertia::render('Advertisements/Show', [
            'ad'        => $this->formatAd($ad),
            'isSaved'   => $isSaved,
            'reviews'   => $reviews,
            'avgRating' => $avgRating,
            'myReview'  => $myReview,
        ]);
    }

    public function edit($slug)
    {
        $ad = Advertisement::with('category', 'images')->where('slug', $slug)->firstOrFail();
        $this->authorize('update', $ad);

        return Inertia::render('Advertisements/Edit', [
            'ad'         => $this->formatAd($ad),
            'categories' => Category::orderBy('name')->get(['id', 'name', 'slug', 'parent_id']),
        ]);
    }

    public function update(UpdateAdvertisementRequest $request, $slug)
    {
        $ad = Advertisement::where('slug', $slug)->firstOrFail();
        $this->authorize('update', $ad);

        $ad->title        = $request->title;
        $ad->description  = $request->description;
        $ad->payload      = $request->payload;
        $ad->availability = $request->availability;
        $ad->price        = $request->price;
        $ad->phone        = $request->phone;
        $ad->location     = $request->location;
        $ad->category_id  = $request->category_id;

        if ($request->title !== $ad->getOriginal('title')) {
            $ad->slug = $this->slugService->generate($request->title, $ad->id);
        }

        if ($request->hasFile('image')) {
            $this->imageService->delete($ad->image);
            $ad->image = $this->imageService->store($request->file('image'));
        } elseif ($request->input('remove_image')) {
            $this->imageService->delete($ad->image);
            $ad->image = null;
        }

        $ad->save();

        if ($request->hasFile('images')) {
            $nextOrder = $ad->images()->max('order') + 1;
            foreach ($request->file('images') as $i => $file) {
                $ad->images()->create([
                    'path'  => $this->imageService->store($file),
                    'order' => $nextOrder + $i,
                ]);
            }
        }

        return redirect()->route('advertisements.show', $ad->slug)->with('success', 'Oglas je uspešno ažuriran.');
    }

    public function destroy($id)
    {
        $ad = Advertisement::findOrFail($id);
        $this->authorize('delete', $ad);
        $ad->delete();

        return redirect()->route('advertisements.user')->with('success', 'Oglas je uspešno obrisan.');
    }

    public function destroyImage(AdvertisementImage $image)
    {
        $this->authorize('update', $image->advertisement);
        $this->imageService->delete($image->path);
        $image->delete();

        return back()->with('success', 'Slika je uklonjena.');
    }

    public function trash(Request $request)
    {
        $paginator = Advertisement::onlyTrashed()
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(20);

        $ads = $paginator->getCollection()->map(fn ($ad) => [
            'id'          => $ad->id,
            'title'       => $ad->title,
            'description' => $ad->description,
            'image'       => $ad->image,
            'deleted_at'  => $ad->deleted_at->format('d.m.Y'),
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads,
                'hasMore' => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Advertisements/Trash', [
            'ads' => [
                'data'         => $ads,
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    public function forceDelete($id)
    {
        $ad = Advertisement::onlyTrashed()->findOrFail($id);
        $this->authorize('forceDelete', $ad);
        $ad->forceDelete();

        return redirect()->route('advertisements.trash')->with('success', 'Oglas je trajno obrisan.');
    }

    public function restore($id)
    {
        $ad = Advertisement::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $ad);
        $ad->restore();

        return redirect()->route('advertisements.trash')->with('success', 'Oglas je uspešno vraćen.');
    }

    public function byCategory(Request $request, string $parent, ?string $child = null)
    {
        $parentCategory = Category::where('slug', $parent)->firstOrFail();
        $category = $child
            ? Category::where('slug', $child)->where('parent_id', $parentCategory->id)->firstOrFail()
            : $parentCategory;

        $location = $request->get('location');
        $ads = $category->advertisements()->with('user', 'category')
            ->active()
            ->when($location, fn ($q) => $q->where('location', 'like', '%' . $location . '%'))
            ->latest()
            ->paginate(21);

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $this->formatAds($ads),
                'hasMore' => $ads->hasMorePages(),
            ]);
        }

        return Inertia::render('Advertisements/ByCategory', [
            'category'     => ['id' => $category->id, 'name' => $category->name, 'slug' => $category->slug],
            'ads'          => $this->paginationData($ads),
            'location'     => $location,
            'favoritedIds' => Favorite::idsForUser(Auth::id()),
        ]);
    }

    public function renew($id)
    {
        $ad = Advertisement::withTrashed()->findOrFail($id);
        $this->authorize('update', $ad);

        $ad->expires_at = now()->addDays(Advertisement::EXPIRY_DAYS);
        $ad->save();

        return back()->with('success', 'Oglas je obnovljen na još ' . Advertisement::EXPIRY_DAYS . ' dana.');
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function formatAd($ad): array
    {
        return AdvertisementResource::make($ad)->resolve();
    }

    private function formatAds($paginator): array
    {
        return $paginator->map(fn ($ad) => $this->formatAd($ad))->values()->all();
    }

    private function paginationData($paginator): array
    {
        return [
            'data'         => $this->formatAds($paginator),
            'current_page' => $paginator->currentPage(),
            'last_page'    => $paginator->lastPage(),
            'total'        => $paginator->total(),
        ];
    }
}
