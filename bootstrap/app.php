<?php

use App\Http\Middleware\ContentSecurityPolicy;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsCustomer;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustHosts();

        $middleware->web(append: [
            HandleInertiaRequests::class,
            ContentSecurityPolicy::class,
        ]);

        $middleware->alias([
            'isAdmin'    => IsAdmin::class,
            'isCustomer' => IsCustomer::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Response $response, Request $request) {
            if (!$request->expectsJson() && in_array($response->getStatusCode(), [403, 404, 419, 429, 500, 503])) {
                return Inertia::render('Error', ['status' => $response->getStatusCode()])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }
        });
    })
    ->create();
