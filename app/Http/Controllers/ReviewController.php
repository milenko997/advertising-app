<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\User;
use App\Notifications\NewReviewNotification;
use App\Notifications\ReviewDeletedNotification;
use App\Notifications\ReviewUpdatedNotification;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Auth-gate route: sets intended URL so after login the user returns here,
     * then we redirect them to the profile page.
     */
    public function loginThenReview(User $user)
    {
        return redirect("/korisnik/{$user->slug}#reviews");
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

        $user->notify(new NewReviewNotification(auth()->user(), $validated['rating']));

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

        $reviewedUser = $review->reviewedUser;

        $review->update([
            'rating'  => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
        ]);

        if ($reviewedUser) {
            $reviewedUser->notify(new ReviewUpdatedNotification(auth()->user(), $validated['rating']));
        }

        return back()->with('success', 'Recenzija je ažurirana.');
    }

    public function destroy(Review $review)
    {
        if (auth()->id() !== $review->reviewer_id) {
            abort(403);
        }

        $reviewedUser = $review->reviewedUser;
        $reviewer = auth()->user();

        $review->delete();

        if ($reviewedUser) {
            $reviewedUser->notify(new ReviewDeletedNotification($reviewer));
        }

        return back()->with('success', 'Recenzija je obrisana.');
    }
}
