<?php

namespace Tests\Feature;

use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Session\TokenMismatchException;
use Tests\TestCase;

/**
 * Subclass that disables the unit-test bypass so we can verify real token
 * mismatch behaviour without going through the HTTP test client.
 */
class TestableVerifyCsrfToken extends VerifyCsrfToken
{
    protected function runningUnitTests(): bool
    {
        return false;
    }
}

class CsrfTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Verify that VerifyCsrfToken is registered in the web middleware group.
     */
    public function test_csrf_middleware_is_registered_in_web_stack(): void
    {
        $kernel     = $this->app->make(\Illuminate\Contracts\Http\Kernel::class);
        $middleware = $kernel->getMiddlewareGroups()['web'] ?? [];

        $this->assertContains(
            \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
            $middleware,
            'ValidateCsrfToken must be present in the web middleware group.'
        );
    }

    /**
     * Verify that a POST with a mismatched CSRF token is rejected.
     *
     * Laravel's VerifyCsrfToken skips token validation when running unit tests
     * (runningUnitTests() → true), so we use a subclass that removes that bypass
     * and invoke the middleware directly.
     */
    public function test_post_without_csrf_token_is_rejected(): void
    {
        $middleware = $this->app->make(TestableVerifyCsrfToken::class);

        $request = \Illuminate\Http\Request::create('/kontakt', 'POST', ['_token' => 'bad-token']);

        // Attach a session carrying a *different* token so tokensMatch() returns false.
        $session = $this->app->make(\Illuminate\Session\Store::class);
        $session->put('_token', 'correct-token');
        $request->setLaravelSession($session);

        $this->expectException(TokenMismatchException::class);

        $middleware->handle($request, fn () => response('ok'));
    }
}
