<?php

namespace App\Queries;

use App\Enums\UserRole;
use App\Models\Advertisement;
use App\Models\Category;
use App\Models\Feedback;
use App\Models\Report;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardStatsQuery
{
    public function get(): array
    {
        return Cache::remember('dashboard_stats', 300, function () {
            $now   = now();
            $week  = $now->copy()->subDays(7);
            $month = $now->copy()->subDays(30);

            return [
                'stats' => [
                    'ads' => [
                        'total'    => Advertisement::withTrashed()->count(),
                        'active'   => Advertisement::active()->count(),
                        'expired'  => Advertisement::whereNotNull('expires_at')->where('expires_at', '<', $now)->count(),
                        'pinned'   => Advertisement::where('is_pinned', true)->count(),
                        'today'    => Advertisement::where('created_at', '>=', $now->copy()->startOfDay())->count(),
                        'thisWeek' => Advertisement::where('created_at', '>=', $week)->count(),
                        'views'    => (int) Advertisement::sum('views'),
                    ],
                    'users' => [
                        'total'    => User::where('role', UserRole::Customer)->count(),
                        'newWeek'  => User::where('role', UserRole::Customer)->where('created_at', '>=', $week)->count(),
                        'newMonth' => User::where('role', UserRole::Customer)->where('created_at', '>=', $month)->count(),
                    ],
                    'reviews' => [
                        'total' => Review::count(),
                        'avg'   => round((float) Review::avg('rating'), 1),
                    ],
                    'inbox' => [
                        'reports'   => Report::where('resolved', false)->count(),
                        'feedbacks' => Feedback::where('read', false)->count(),
                    ],
                ],
                'chartData'     => $this->chartData($now, $month),
                'topCategories' => $this->topCategories(),
                'recentAds'     => $this->recentAds(),
                'recentUsers'   => $this->recentUsers(),
            ];
        });
    }

    private function chartData($now, $month): array
    {
        $adsPerDay = Advertisement::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', $month)
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        $chartData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->format('Y-m-d');
            $chartData[] = [
                'date'  => $now->copy()->subDays($i)->format('d.m'),
                'count' => $adsPerDay[$date] ?? 0,
            ];
        }

        return $chartData;
    }

    private function topCategories(): array
    {
        return Category::withCount(['advertisements' => fn ($q) => $q->active()])
            ->withSum(['advertisements' => fn ($q) => $q->active()], 'views')
            ->orderByDesc('advertisements_count')
            ->limit(8)
            ->get(['id', 'name', 'parent_id'])
            ->map(fn ($c) => [
                'name'  => $c->name,
                'count' => $c->advertisements_count,
                'views' => (int) ($c->advertisements_sum_views ?? 0),
            ])
            ->toArray();
    }

    private function recentAds(): array
    {
        return Advertisement::with('user:id,name,slug')
            ->latest()
            ->limit(5)
            ->get(['id', 'title', 'slug', 'user_id', 'created_at', 'is_pinned'])
            ->map(fn ($ad) => [
                'id'         => $ad->id,
                'title'      => $ad->title,
                'slug'       => $ad->slug,
                'user_name'  => $ad->user?->name,
                'user_slug'  => $ad->user?->slug,
                'created_at' => $ad->created_at->format('d.m.Y'),
                'is_pinned'  => $ad->is_pinned,
            ])
            ->toArray();
    }

    private function recentUsers(): array
    {
        return User::where('role', UserRole::Customer)
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'slug', 'email', 'avatar', 'created_at'])
            ->map(fn ($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'slug'       => $u->slug,
                'email'      => $u->email,
                'avatar'     => $u->avatar,
                'created_at' => $u->created_at->format('d.m.Y'),
            ])
            ->toArray();
    }
}
