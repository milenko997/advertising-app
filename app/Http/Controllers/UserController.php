<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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

        return view('users.show', compact('user', 'ads'));
    }
}
