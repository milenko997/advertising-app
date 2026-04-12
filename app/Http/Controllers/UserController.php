<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function show(Request $request, User $user)
    {
        $ads = $user->advertisements()
            ->with('category')
            ->latest()
            ->paginate(21);

        $formatAd = fn ($ad) => [
            'id'           => $ad->id,
            'slug'         => $ad->slug,
            'title'        => $ad->title,
            'description'  => $ad->description,
            'price'        => $ad->price,
            'availability' => $ad->availability,
            'payload'      => $ad->payload,
            'route'        => $ad->route,
            'image'        => $ad->image,
            'location'     => $ad->location,
            'user_id'      => $ad->user_id,
            'created_at'   => $ad->created_at?->format('d.m.Y'),
            'category'     => $ad->category ? ['name' => $ad->category->name] : null,
        ];

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads->map($formatAd)->values()->all(),
                'hasMore' => $ads->hasMorePages(),
            ]);
        }

        $favoritedIds = Favorite::idsForUser(Auth::id());

        $reviews = Review::with('reviewer')
            ->where('reviewed_user_id', $user->id)
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

        $myReview = Auth::check()
            ? Review::where('reviewer_id', Auth::id())
                ->where('reviewed_user_id', $user->id)
                ->first()
            : null;

        return Inertia::render('Users/Show', [
            'user' => [
                'id'     => $user->id,
                'name'   => $user->name,
                'slug'   => $user->slug,
                'avatar' => $user->avatar,
            ],
            'ads' => [
                'data'         => $ads->map($formatAd)->values()->all(),
                'current_page' => $ads->currentPage(),
                'last_page'    => $ads->lastPage(),
                'total'        => $ads->total(),
            ],
            'favoritedIds' => $favoritedIds,
            'reviews'      => $reviews,
            'avgRating'    => $avgRating,
            'myReview'     => $myReview ? [
                'id'      => $myReview->id,
                'rating'  => $myReview->rating,
                'comment' => $myReview->comment,
            ] : null,
        ]);
    }
}
