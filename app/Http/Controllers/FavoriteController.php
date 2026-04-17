<?php

namespace App\Http\Controllers;

use App\Http\Resources\AdvertisementResource;
use App\Models\Advertisement;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favoritedIds = Favorite::idsForUser(auth()->id());

        $ads = Advertisement::whereIn('id', $favoritedIds)
            ->with('category')
            ->latest()
            ->paginate(20);

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads->map(fn ($ad) => AdvertisementResource::make($ad)->resolve())->values()->all(),
                'hasMore' => $ads->hasMorePages(),
            ]);
        }

        return Inertia::render('Favorites/Index', [
            'ads' => [
                'data'         => $ads->map(fn ($ad) => AdvertisementResource::make($ad)->resolve())->values()->all(),
                'current_page' => $ads->currentPage(),
                'last_page'    => $ads->lastPage(),
                'total'        => $ads->total(),
            ],
            'favoritedIds' => $favoritedIds,
        ]);
    }

    public function toggle(Advertisement $advertisement)
    {
        abort_unless(!$advertisement->isExpired(), 403);

        $userId   = auth()->id();
        $existing = Favorite::where('user_id', $userId)
            ->where('advertisement_id', $advertisement->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $saved = false;
        } else {
            Favorite::create([
                'user_id'          => $userId,
                'advertisement_id' => $advertisement->id,
                'created_at'       => now(),
            ]);
            $saved = true;
        }

        return response()->json(['saved' => $saved]);
    }
}
