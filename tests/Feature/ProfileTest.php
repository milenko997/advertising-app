<?php

namespace Tests\Feature;

use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_guest_cannot_view_profile(): void
    {
        $this->get(route('profile.show'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_profile(): void
    {
        $user = User::factory()->customer()->create();

        $this->actingAs($user)
            ->get(route('profile.show'))
            ->assertOk();
    }

    public function test_user_can_update_profile(): void
    {
        $user = User::factory()->customer()->create(['name' => 'Old Name', 'email' => 'old@example.com']);

        $this->actingAs($user)
            ->put(route('profile.update'), [
                'name'  => 'New Name',
                'email' => 'new@example.com',
                'phone' => null,
            ])
            ->assertRedirect();

        $this->assertEquals('New Name', $user->fresh()->name);
        $this->assertEquals('new@example.com', $user->fresh()->email);
    }

    public function test_profile_update_requires_unique_email(): void
    {
        $user  = User::factory()->customer()->create(['email' => 'me@example.com']);
        $other = User::factory()->customer()->create(['email' => 'taken@example.com']);

        $this->actingAs($user)
            ->put(route('profile.update'), [
                'name'  => 'Me',
                'email' => 'taken@example.com',
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_user_can_keep_own_email_on_update(): void
    {
        $user = User::factory()->customer()->create(['name' => 'Me', 'email' => 'me@example.com']);

        $this->actingAs($user)
            ->put(route('profile.update'), [
                'name'  => 'Me Updated',
                'email' => 'me@example.com',
            ])
            ->assertSessionDoesntHaveErrors('email');

        $this->assertEquals('Me Updated', $user->fresh()->name);
    }

    public function test_user_can_change_password(): void
    {
        $user = User::factory()->customer()->create(['password' => bcrypt('OldPassword1')]);

        $this->actingAs($user)
            ->put(route('profile.password'), [
                'current_password'      => 'OldPassword1',
                'password'              => 'NewPassword1',
                'password_confirmation' => 'NewPassword1',
            ])
            ->assertRedirect();

        $this->assertTrue(\Illuminate\Support\Facades\Hash::check('NewPassword1', $user->fresh()->password));
    }

    public function test_wrong_current_password_is_rejected(): void
    {
        $user = User::factory()->customer()->create(['password' => bcrypt('CorrectPassword1')]);

        $this->actingAs($user)
            ->put(route('profile.password'), [
                'current_password'      => 'WrongPassword1',
                'password'              => 'NewPassword1',
                'password_confirmation' => 'NewPassword1',
            ])
            ->assertSessionHasErrors('current_password');
    }
}
