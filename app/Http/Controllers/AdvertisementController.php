<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HasPagination;
use App\Http\Resources\AdvertisementResource;
use App\Models\Advertisement;
use App\Models\Category;
use App\Models\Favorite;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdvertisementController extends Controller
{
    use HasPagination;

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
            'ads'          => $this->paginationData($ads, $this->formatAds($ads)),
            'pinnedAds'    => $pinnedAds,
            'search'       => $search,
            'location'     => $location,
            'favoritedIds' => Favorite::idsForUser(Auth::id()),
        ]);
    }

    public function show($slug)
    {
        $ad = Advertisement::with('user', 'category', 'images')->where('slug', $slug)->firstOrFail();

        view()->share('meta', [
            'title'       => $ad->title . ' — ' . config('app.name'),
            'description' => Str::limit(strip_tags($ad->description), 160),
            'image'       => $ad->image ? url('storage/' . $ad->image) : null,
            'url'         => url('/oglas/' . $ad->slug),
            'type'        => 'product',
        ]);

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

        view()->share('meta', [
            'title'       => $category->name . ' — ' . config('app.name'),
            'description' => 'Pregledajte oglase u kategoriji ' . $category->name . ' na ' . config('app.name') . '.',
            'url'         => url()->current(),
        ]);

        return Inertia::render('Advertisements/ByCategory', [
            'category'     => ['id' => $category->id, 'name' => $category->name, 'slug' => $category->slug],
            'ads'          => $this->paginationData($ads, $this->formatAds($ads)),
            'location'     => $location,
            'favoritedIds' => Favorite::idsForUser(Auth::id()),
        ]);
    }

    private function formatAd($ad): array
    {
        return AdvertisementResource::make($ad)->resolve();
    }

    private function formatAds($paginator): array
    {
        return $paginator->map(fn ($ad) => $this->formatAd($ad))->values()->all();
    }
}
