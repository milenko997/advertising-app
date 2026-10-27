<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RecaptchaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.recaptcha.secret' => 'test-secret']);
    }

    private function fakeGoogle(array $result): void
    {
        Http::fake(['www.google.com/recaptcha/*' => Http::response($result)]);
    }

    private function login(array $extra = [])
    {
        $user = User::factory()->create();

        return $this->post(route('login'), ['email' => $user->email, 'password' => 'password'] + $extra);
    }

    public function test_login_without_token_is_rejected_when_recaptcha_is_configured(): void
    {
        Http::fake();

        $this->login()->assertSessionHasErrors('recaptcha_token');
        $this->assertGuest();
        Http::assertNothingSent();
    }

    public function test_login_with_valid_token_passes(): void
    {
        $this->fakeGoogle(['success' => true, 'score' => 0.9, 'action' => 'login']);

        $this->login(['recaptcha_token' => 'token'])->assertSessionHasNoErrors();
        $this->assertAuthenticated();
    }

    public function test_token_for_another_action_is_rejected(): void
    {
        $this->fakeGoogle(['success' => true, 'score' => 0.9, 'action' => 'contact']);

        $this->login(['recaptcha_token' => 'token'])->assertSessionHasErrors('recaptcha_token');
        $this->assertGuest();
    }

    public function test_low_score_is_rejected(): void
    {
        $this->fakeGoogle(['success' => true, 'score' => 0.1, 'action' => 'login']);

        $this->login(['recaptcha_token' => 'token'])->assertSessionHasErrors('recaptcha_token');
        $this->assertGuest();
    }

    public function test_recaptcha_is_skipped_when_secret_is_not_configured(): void
    {
        config(['services.recaptcha.secret' => '']);
        Http::fake();

        $this->login()->assertSessionHasNoErrors();
        $this->assertAuthenticated();
        Http::assertNothingSent();
    }

    public function test_production_csp_allows_recaptcha_and_analytics(): void
    {
        $this->app['env'] = 'production';
        config(['services.recaptcha.site_key' => 'site-key', 'services.google_analytics.id' => 'G-TEST']);

        $response = $this->get('/');
        $csp = $response->headers->get('Content-Security-Policy');

        $this->assertStringContainsString('https://www.google.com/recaptcha/', $csp);
        $this->assertStringContainsString('frame-src https://www.google.com/recaptcha/', $csp);
        $this->assertStringContainsString('https://www.googletagmanager.com', $csp);

        preg_match("/'nonce-([^']+)'/", $csp, $nonce);
        preg_match_all('/<script\b[^>]*>/', $response->getContent(), $tags);

        foreach ($tags[0] as $tag) {
            // Inertia's page-data JSON block is never executed, so CSP doesn't apply to it.
            if (str_contains($tag, 'type="application/json"')) {
                continue;
            }
            $this->assertStringContainsString('nonce="' . $nonce[1] . '"', $tag);
        }
    }
}
