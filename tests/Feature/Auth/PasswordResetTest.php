<?php

namespace Tests\Feature\Auth;

use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered()
    {
        $response = $this->get(route('password.request'));

        $response->assertStatus(200);
    }

    public function test_reset_password_link_can_be_requested()
    {
        Mail::fake();

        $user = User::factory()->create();

        $this->post(route('password.email'), ['email' => $user->email]);

        Mail::assertQueued(ResetPasswordMail::class, fn ($mail) => $mail->hasTo($user->email));
    }

    public function test_reset_password_screen_can_be_rendered()
    {
        Mail::fake();

        $user = User::factory()->create();

        $this->post(route('password.email'), ['email' => $user->email]);

        $token = $this->queuedResetToken();

        $this->get(route('password.reset', ['token' => $token]))->assertStatus(200);
    }

    public function test_password_can_be_reset_with_valid_token()
    {
        Mail::fake();

        $user = User::factory()->create();

        $this->post(route('password.email'), ['email' => $user->email]);

        $response = $this->post(route('password.update'), [
            'token' => $this->queuedResetToken(),
            'email' => $user->email,
            'password' => 'Password1234',
            'password_confirmation' => 'Password1234',
        ]);

        $response->assertSessionHasNoErrors();
    }

    private function queuedResetToken(): string
    {
        $mail = Mail::queued(ResetPasswordMail::class)->first();

        $this->assertNotNull($mail, 'ResetPasswordMail was not queued.');

        return basename(parse_url($mail->resetUrl, PHP_URL_PATH));
    }
}
