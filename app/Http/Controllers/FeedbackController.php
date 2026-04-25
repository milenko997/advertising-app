<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|min:5|max:1000',
            'page'    => 'nullable|string|max:255',
            'email'   => auth()->check() ? 'nullable' : 'nullable|email:rfc|max:255',
        ]);

        Feedback::create([
            'user_id' => auth()->id(),
            'email'   => auth()->check() ? auth()->user()->email : $request->email,
            'message' => $request->message,
            'page'    => $request->page ? strip_tags($request->page) : null,
        ]);

        return response()->json(['ok' => true]);
    }
}
