<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favoritedIds = Favorite::idsForUser(auth()->id());

        $ads = Advertisement::whereIn('id', $favoritedIds)
            ->with('category')
            ->latest()
            ->paginate(20);

        if ($request->ajax()) {
            return response()->json([
                'html'    => view('partials.ad-cards', compact('ads', 'favoritedIds'))->render(),
                'hasMore' => $ads->hasMorePages(),
            ]);
        }

        return view('favorites.index', compact('ads', 'favoritedIds'));
    }

    public function toggle(Advertisement $advertisement)
    {
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
