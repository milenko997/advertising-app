<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $paginator = $request->user()
            ->notifications()
            ->latest()
            ->paginate(20);

        $notifications = $paginator->getCollection()->map(fn ($n) => [
            'id'         => $n->id,
            'data'       => $n->data,
            'read_at'    => $n->read_at?->format('d.m.Y H:i'),
            'created_at' => $n->created_at->format('d.m.Y H:i'),
        ])->values();

        if ($request->ajax() && !$request->hasHeader('X-Inertia')) {
            return response()->json([
                'notifications' => $notifications,
                'hasMore'       => $paginator->hasMorePages(),
            ]);
        }

        return Inertia::render('Notifications/Index', [
            'notifications' => [
                'data'         => $notifications,
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    public function markRead(Request $request, string $id)
    {
        $user = $request->user();

        $user->notifications()->where('id', $id)->first()?->markAsRead();
        Cache::forget('unread_notifications_' . $user->id);

        return back();
    }

    public function markAllRead(Request $request)
    {
        $user = $request->user();

        $user->unreadNotifications()->update(['read_at' => now()]);
        Cache::forget('unread_notifications_' . $user->id);

        return back();
    }

    public function destroy(Request $request, string $id)
    {
        $request->user()
            ->notifications()
            ->where('id', $id)
            ->delete();

        return back();
    }
}
