<?php

namespace App\Http\Controllers;

use App\Http\Resources\AdvertisementResource;
use App\Models\Advertisement;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    use \App\Http\Controllers\Concerns\HasPagination;
    public function index(Request $request)
    {
        $favoritedIds = Favorite::idsForUser(auth()->id());

        $ads = Advertisement::whereIn('id', $favoritedIds)
            ->active()
            ->with('category')
            ->latest()
            ->paginate(20);

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'ads'     => $ads->map(fn ($ad) => AdvertisementResource::make($ad)->resolve())->values()->all(),
                'hasMore' => $ads->hasMorePages(),
            ]);
        }

        $items = $ads->getCollection()->map(fn ($ad) => AdvertisementResource::make($ad)->resolve());

        return Inertia::render('Favorites/Index', [
            'ads'          => $this->paginationData($ads, $items->values()->all()),
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

        Cache::forget('favorite_ids_' . $userId);
        Cache::forget('saved_ads_count_' . $userId);

        return response()->json(['saved' => $saved]);
    }
}
