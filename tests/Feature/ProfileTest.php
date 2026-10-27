<?php

namespace Tests\Feature;

use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
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
                'current_password' => 'password',
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

    public function test_changing_email_requires_current_password(): void
    {
        $user = User::factory()->customer()->create(['name' => 'Me', 'email' => 'me@example.com']);

        $this->actingAs($user)
            ->put(route('profile.update'), ['name' => 'Me', 'email' => 'attacker@example.com'])
            ->assertSessionHasErrors('current_password');

        $this->actingAs($user)
            ->put(route('profile.update'), ['name' => 'Me', 'email' => 'attacker@example.com', 'current_password' => 'wrong-password'])
            ->assertSessionHasErrors('current_password');

        $this->assertEquals('me@example.com', $user->fresh()->email);
    }

    public function test_avatar_with_huge_dimensions_is_rejected_before_processing(): void
    {
        Storage::fake('public');
        $user = User::factory()->customer()->create(['name' => 'Me', 'email' => 'me@example.com']);

        $this->actingAs($user)
            ->put(route('profile.update'), [
                'name'   => 'Me',
                'email'  => 'me@example.com',
                'avatar' => UploadedFile::fake()->image('huge.png', 9000, 10),
            ])
            ->assertSessionHasErrors('avatar');

        $this->assertNull($user->fresh()->avatar);
        $this->assertEmpty(Storage::disk('public')->allFiles());
    }
}
