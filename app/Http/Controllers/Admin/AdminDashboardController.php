<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Feedback;
use App\Models\Report;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $now  = now();
        $today = $now->copy()->startOfDay();
        $week  = $now->copy()->subDays(7);
        $month = $now->copy()->subDays(30);

        // ── Ads ──────────────────────────────────────────────────────────
        $totalAds    = Advertisement::withTrashed()->count();
        $activeAds   = Advertisement::active()->count();
        $expiredAds  = Advertisement::whereNotNull('expires_at')
                            ->where('expires_at', '<', $now)->count();
        $pinnedAds   = Advertisement::where('is_pinned', true)->count();
        $adsToday    = Advertisement::where('created_at', '>=', $today)->count();
        $adsThisWeek = Advertisement::where('created_at', '>=', $week)->count();
        $totalViews  = (int) Advertisement::sum('views');

        // ── Users ─────────────────────────────────────────────────────────
        $totalCustomers  = User::where('role', 'customer')->count();
        $newThisWeek     = User::where('role', 'customer')->where('created_at', '>=', $week)->count();
        $newThisMonth    = User::where('role', 'customer')->where('created_at', '>=', $month)->count();

        // ── Reviews ───────────────────────────────────────────────────────
        $totalReviews = Review::count();
        $avgRating    = round((float) Review::avg('rating'), 1);

        // ── Inbox ─────────────────────────────────────────────────────────
        $pendingReports   = Report::where('resolved', false)->count();
        $unreadMessages   = ContactMessage::where('read', false)->count();
        $unreadFeedbacks  = Feedback::where('read', false)->count();

        // ── Ads per day — last 30 days ─────────────────────────────────
        $adsPerDay = Advertisement::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', $month)
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date');

        // Fill gaps so every day in range has a value
        $chartData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->format('Y-m-d');
            $chartData[] = [
                'date'  => $now->copy()->subDays($i)->format('d.m'),
                'count' => $adsPerDay[$date] ?? 0,
            ];
        }

        // ── Top categories by active ad count + views ─────────────────
        $topCategories = Category::withCount(['advertisements' => function ($q) {
                $q->active();
            }])
            ->withSum(['advertisements' => function ($q) {
                $q->active();
            }], 'views')
            ->orderByDesc('advertisements_count')
            ->limit(8)
            ->get(['id', 'name', 'parent_id'])
            ->map(fn ($c) => [
                'name'  => $c->name,
                'count' => $c->advertisements_count,
                'views' => (int) ($c->advertisements_sum_views ?? 0),
            ]);

        // ── Recent ads ────────────────────────────────────────────────
        $recentAds = Advertisement::with('user:id,name,slug')
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
            ]);

        // ── Recent users ──────────────────────────────────────────────
        $recentUsers = User::where('role', 'customer')
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
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'ads' => [
                    'total'     => $totalAds,
                    'active'    => $activeAds,
                    'expired'   => $expiredAds,
                    'pinned'    => $pinnedAds,
                    'today'     => $adsToday,
                    'thisWeek'  => $adsThisWeek,
                    'views'     => $totalViews,
                ],
                'users' => [
                    'total'      => $totalCustomers,
                    'newWeek'    => $newThisWeek,
                    'newMonth'   => $newThisMonth,
                ],
                'reviews' => [
                    'total'  => $totalReviews,
                    'avg'    => $avgRating,
                ],
                'inbox' => [
                    'reports'   => $pendingReports,
                    'messages'  => $unreadMessages,
                    'feedbacks' => $unreadFeedbacks,
                ],
            ],
            'chartData'     => $chartData,
            'topCategories' => $topCategories,
            'recentAds'     => $recentAds,
            'recentUsers'   => $recentUsers,
        ]);
    }
}
