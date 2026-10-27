<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered()
    {
        $response = $this->get(route('login'));

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen()
    {
        $user = User::factory()->create();

        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/');
    }

    public function test_users_can_not_authenticate_with_invalid_password()
    {
        $user = User::factory()->create();

        $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_unknown_email_and_wrong_password_get_the_same_error()
    {
        $user = User::factory()->create();

        $this->post(route('login'), ['email' => 'nobody@example.com', 'password' => 'password']);
        $unknownEmail = session('errors')->getBag('default')->toArray();

        $this->post(route('login'), ['email' => $user->email, 'password' => 'wrong-password']);
        $wrongPassword = session('errors')->getBag('default')->toArray();

        $this->assertSame($unknownEmail, $wrongPassword);
        $this->assertGuest();
    }
}
