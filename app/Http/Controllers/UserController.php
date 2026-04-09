<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show(Request $request, User $user)
    {
        $ads = $user->advertisements()
            ->with('category')
            ->latest()
            ->paginate(20);

        if ($request->ajax()) {
            return response()->json([
                'html'    => view('partials.ad-cards', compact('ads'))->render(),
                'hasMore' => $ads->hasMorePages(),
            ]);
        }

        $favoritedIds = Favorite::idsForUser(Auth::id());

        return view('users.show', compact('user', 'ads', 'favoritedIds'));
    }
}
