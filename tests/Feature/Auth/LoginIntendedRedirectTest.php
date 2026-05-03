<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginIntendedRedirectTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_visiting_create_ad_is_redirected_to_login(): void
    {
        $this->get(route('advertisements.create'))
            ->assertRedirect(route('login'));
    }

    public function test_login_redirects_to_intended_url_after_visiting_create_ad(): void
    {
        $user = User::factory()->customer()->create();

        // Store the intended URL in session (simulates guest hitting a protected route)
        $this->withSession(['url.intended' => route('advertisements.create')])
            ->post(route('login'), [
                'email'    => $user->email,
                'password' => 'password',
            ])
            ->assertRedirect(route('advertisements.create'));
    }

    public function test_login_falls_back_to_home_without_intended_url(): void
    {
        $user = User::factory()->customer()->create();

        $this->post(route('login'), [
            'email'    => $user->email,
            'password' => 'password',
        ])
        ->assertRedirect('/');
    }

    public function test_registration_redirects_to_intended_url(): void
    {
        $this->withSession(['url.intended' => route('advertisements.create')])
            ->post(route('register'), [
                'name'                  => 'New User',
                'email'                 => 'newuser@example.com',
                'password'              => 'Password1234',
                'password_confirmation' => 'Password1234',
            ])
            ->assertRedirect(route('advertisements.create'));
    }
}
