<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;

class ContentSecurityPolicy
{
    public function handle(Request $request, Closure $next)
    {
        if (!app()->environment('local')) {
            $nonce = base64_encode(random_bytes(16));
            view()->share('cspNonce', $nonce);
            Vite::useCspNonce($nonce);
        }

        $response = $next($request);

        if (app()->environment('local')) {
            return $response;
        }

        $response->headers->set('Content-Security-Policy', implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'nonce-{$nonce}' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.googletagmanager.com",
            "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com",
            "connect-src 'self' https://www.google.com/recaptcha/ https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
            "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-ancestors 'none'",
        ]));
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }
}
