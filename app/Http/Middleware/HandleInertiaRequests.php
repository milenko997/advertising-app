<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Feedback;
use App\Models\Report;
use Illuminate\Http\Request;
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
                    'isAdmin' => $user->isAdmin(),
                ] : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
            'pendingReportsCount' => $user?->isAdmin()
                ? Report::where('resolved', false)->count()
                : 0,
            'unreadMessagesCount' => $user?->isAdmin()
                ? ContactMessage::where('read', false)->count()
                : 0,
            'unreadFeedbackCount' => $user?->isAdmin()
                ? Feedback::where('read', false)->count()
                : 0,
            'categories' => Category::with('children')
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
                ])->values(),
        ]);
    }
}
