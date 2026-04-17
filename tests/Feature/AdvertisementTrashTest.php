<?php

namespace Tests\Feature;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdvertisementTrashTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    private function makeAd(User $owner): Advertisement
    {
        $category = Category::factory()->create();
        return Advertisement::factory()->create([
            'user_id'     => $owner->id,
            'category_id' => $category->id,
        ]);
    }

    public function test_guest_cannot_view_trash(): void
    {
        $this->get(route('advertisements.trash'))->assertRedirect(route('login'));
    }

    public function test_user_can_view_trash(): void
    {
        $user = User::factory()->customer()->create();

        $this->actingAs($user)
            ->get(route('advertisements.trash'))
            ->assertOk();
    }

    public function test_user_can_soft_delete_ad(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = $this->makeAd($user);

        $this->actingAs($user)
            ->delete(route('advertisements.destroy', $ad->id))
            ->assertRedirect(route('advertisements.user'));

        $this->assertSoftDeleted('advertisements', ['id' => $ad->id]);
    }

    public function test_user_can_restore_own_ad(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = $this->makeAd($user);
        $ad->delete();

        $this->actingAs($user)
            ->patch(route('advertisements.restore', $ad->id))
            ->assertRedirect(route('advertisements.trash'));

        $this->assertDatabaseHas('advertisements', ['id' => $ad->id, 'deleted_at' => null]);
    }

    public function test_user_cannot_restore_other_users_ad(): void
    {
        $owner = User::factory()->customer()->create();
        $other = User::factory()->customer()->create();
        $ad    = $this->makeAd($owner);
        $ad->delete();

        $this->actingAs($other)
            ->patch(route('advertisements.restore', $ad->id))
            ->assertForbidden();
    }

    public function test_user_can_force_delete_own_ad(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = $this->makeAd($user);
        $ad->delete();

        $this->actingAs($user)
            ->delete(route('advertisements.forceDelete', $ad->id))
            ->assertRedirect(route('advertisements.trash'));

        $this->assertDatabaseMissing('advertisements', ['id' => $ad->id]);
    }

    public function test_user_cannot_force_delete_other_users_ad(): void
    {
        $owner = User::factory()->customer()->create();
        $other = User::factory()->customer()->create();
        $ad    = $this->makeAd($owner);
        $ad->delete();

        $this->actingAs($other)
            ->delete(route('advertisements.forceDelete', $ad->id))
            ->assertForbidden();
    }

    public function test_user_can_renew_expired_ad(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = $this->makeAd($user);
        $ad->update(['expires_at' => now()->subDays(1)]);

        $this->actingAs($user)
            ->patch(route('advertisements.renew', $ad->id))
            ->assertRedirect();

        $this->assertTrue($ad->fresh()->expires_at->isFuture());
    }

    public function test_other_user_cannot_renew_ad(): void
    {
        $owner = User::factory()->customer()->create();
        $other = User::factory()->customer()->create();
        $ad    = $this->makeAd($owner);

        $this->actingAs($other)
            ->patch(route('advertisements.renew', $ad->id))
            ->assertForbidden();
    }
}
