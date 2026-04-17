<?php

namespace Tests\Feature;

use App\Models\Advertisement;
use App\Models\Favorite;
use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_guest_cannot_toggle_favorite(): void
    {
        $ad = Advertisement::factory()->create();

        $this->post(route('favorites.toggle', $ad))->assertRedirect(route('login'));
    }

    public function test_user_can_favorite_an_ad(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create();

        $this->actingAs($user)
            ->post(route('favorites.toggle', $ad))
            ->assertOk()
            ->assertJson(['saved' => true]);

        $this->assertDatabaseHas('favorites', ['user_id' => $user->id, 'advertisement_id' => $ad->id]);
    }

    public function test_user_can_unfavorite_an_ad(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create();
        Favorite::create(['user_id' => $user->id, 'advertisement_id' => $ad->id, 'created_at' => now()]);

        $this->actingAs($user)
            ->post(route('favorites.toggle', $ad))
            ->assertOk()
            ->assertJson(['saved' => false]);

        $this->assertDatabaseMissing('favorites', ['user_id' => $user->id, 'advertisement_id' => $ad->id]);
    }

    public function test_user_cannot_favorite_expired_ad(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create(['expires_at' => now()->subDay()]);

        $this->actingAs($user)
            ->post(route('favorites.toggle', $ad))
            ->assertForbidden();
    }

    public function test_favorites_index_requires_authentication(): void
    {
        $this->get(route('favorites.index'))->assertRedirect(route('login'));
    }

    public function test_user_can_view_their_favorites(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create();
        Favorite::create(['user_id' => $user->id, 'advertisement_id' => $ad->id, 'created_at' => now()]);

        $this->actingAs($user)
            ->get(route('favorites.index'))
            ->assertOk()
            ->assertSee($ad->title);
    }
}
