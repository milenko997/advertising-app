<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Favorite;
use App\Models\Feedback;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id'      => $user->id,
                    'name'    => $user->name,
                    'email'   => $user->email,
                    'avatar'  => $user->avatar,
                    'slug'    => $user->slug,
                    'isAdmin'      => $user->isAdmin(),
                    'isSuperAdmin' => $user->isSuperAdmin(),
                ] : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'pendingReportsCount' => $user?->isAdmin()
                ? Cache::remember('badge_reports', 60, fn () => Report::where('resolved', false)->count())
                : 0,
            'unreadMessagesCount' => $user?->isAdmin()
                ? Cache::remember('badge_messages', 60, fn () => ContactMessage::where('read', false)->count())
                : 0,
            'unreadFeedbackCount' => $user?->isAdmin()
                ? Cache::remember('badge_feedback', 60, fn () => Feedback::where('read', false)->count())
                : 0,
            'savedAdsCount' => $user && !$user->isAdmin()
                ? Cache::remember('saved_ads_count_' . $user->id, 60, fn () => Favorite::where('user_id', $user->id)->count())
                : 0,
            'unreadNotificationsCount' => $user && !$user->isAdmin()
                ? Cache::remember('unread_notifications_' . $user->id, 60, fn () => $user->unreadNotifications()->count())
                : 0,
            'recentNotifications' => $user && !$user->isAdmin()
                ? Cache::remember('recent_notifications_' . $user->id, 60, fn () =>
                    $user->notifications()->latest()->take(5)->get()->map(fn ($n) => [
                        'id'         => $n->id,
                        'data'       => $n->data,
                        'read_at'    => $n->read_at?->format('d.m.Y H:i'),
                        'created_at' => $n->created_at->diffForHumans(),
                    ])->values()->all()
                )
                : [],
            'appUrl' => rtrim(config('app.url'), '/'),
            'categories' => Cache::remember('nav_categories', 300, fn () => Category::with(['children' => function ($q) {
                    $q->whereHas('advertisements', fn ($q) => $q->active());
                }])
                ->whereNull('parent_id')
                ->orderBy('name')
                ->get()
                ->map(fn ($c) => [
                    'id'       => $c->id,
                    'name'     => $c->name,
                    'slug'     => $c->slug,
                    'children' => $c->children->map(fn ($ch) => [
                        'id'   => $ch->id,
                        'name' => $ch->name,
                        'slug' => $ch->slug,
                    ])->values(),
                ])
                ->filter(fn ($c) => $c['children']->isNotEmpty() ||
                    \App\Models\Advertisement::where('category_id', $c['id'])->active()->exists()
                )
                ->values()),
        ]);
    }
}
