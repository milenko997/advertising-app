<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(\App\Services\ImageService::class);
        $this->app->singleton(\App\Services\SlugService::class);
    }

    public function boot(): void
    {
        Password::defaults(fn () => Password::min(10)->mixedCase()->numbers()->uncompromised());

        RateLimiter::for('api', fn (Request $r) =>
            Limit::perMinute(60)->by($r->user()?->id ?? $r->ip())
        );

        RateLimiter::for('ad-creation', fn (Request $r) =>
            Limit::perHour(5)->by($r->user()?->id ?? $r->ip())->response(fn () =>
                back()->withErrors(['rate_limit' => 'You have reached the limit of 5 ads per hour. Please wait before posting again.'])
            )
        );

        RateLimiter::for('contact',        fn (Request $r) => Limit::perHour(5)->by($r->ip()));
        RateLimiter::for('feedback',       fn (Request $r) => Limit::perHour(10)->by($r->ip()));
        RateLimiter::for('login',          fn (Request $r) => Limit::perMinute(10)->by($r->ip()));
        RateLimiter::for('password-reset', fn (Request $r) => Limit::perMinute(5)->by($r->ip()));
        RateLimiter::for('report',         fn (Request $r) => Limit::perMinute(5)->by($r->user()?->id ?? $r->ip()));
        RateLimiter::for('review',         fn (Request $r) => Limit::perMinute(10)->by($r->user()?->id ?? $r->ip()));
    }
}
