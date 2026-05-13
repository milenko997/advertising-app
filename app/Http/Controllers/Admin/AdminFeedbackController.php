<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AdminFeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = Feedback::with('user')
            ->orderByRaw('`read` ASC, created_at DESC')
            ->paginate(30)
            ->through(fn ($fb) => [
                'id'         => $fb->id,
                'message'    => $fb->message,
                'page'       => $fb->page,
                'read'       => $fb->read,
                'email'      => $fb->email,
                'created_at' => $fb->created_at->format('d.m.Y H:i'),
                'user'       => $fb->user ? ['name' => $fb->user->name] : null,
            ]);

        return Inertia::render('Admin/Feedbacks/Index', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function markRead(Feedback $feedback)
    {
        $feedback->update(['read' => true]);

        Cache::forget('badge_feedback');

        return back();
    }

    public function destroy(Feedback $feedback)
    {
        $feedback->delete();

        Cache::forget('badge_feedback');

        return back()->with('success', 'Povratna informacija je obrisana.');
    }
}
