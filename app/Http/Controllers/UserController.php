<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
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
            ->paginate(20);

        $formatAd = fn ($ad) => [
            'id'           => $ad->id,
            'slug'         => $ad->slug,
            'title'        => $ad->title,
            'description'  => $ad->description,
            'price'        => $ad->price,
            'vehicle_type' => $ad->vehicle_type,
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
        ]);
    }
}
