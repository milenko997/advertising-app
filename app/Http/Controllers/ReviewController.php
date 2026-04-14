<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Auth-gate route: sets intended URL so after login the user returns here,
     * then we redirect them to the profile page.
     */
    public function loginThenReview(User $user)
    {
        return redirect("/user/{$user->slug}#reviews");
    }

    public function store(Request $request, User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Ne možete ostaviti recenziju sebi.');
        }

        if (Review::where('reviewer_id', auth()->id())->where('reviewed_user_id', $user->id)->exists()) {
            return back()->with('error', 'Već ste ostavili recenziju ovom korisniku.');
        }

        $validated = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        Review::create([
            'reviewer_id'      => auth()->id(),
            'reviewed_user_id' => $user->id,
            'rating'           => $validated['rating'],
            'comment'          => $validated['comment'] ?? null,
        ]);

        return back()->with('success', 'Recenzija je dodata.');
    }

    public function update(Request $request, Review $review)
    {
        if (auth()->id() !== $review->reviewer_id) {
            abort(403);
        }

        $validated = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update([
            'rating'  => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return back()->with('success', 'Recenzija je ažurirana.');
    }

    public function destroy(Review $review)
    {
        if (auth()->id() !== $review->reviewer_id) {
            abort(403);
        }

        $review->delete();

        return back()->with('success', 'Recenzija je obrisana.');
    }
}
