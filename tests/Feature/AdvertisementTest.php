<?php

namespace Tests\Feature;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdvertisementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    // ── Public access ─────────────────────────────────────────────────────────

    public function test_public_index_is_accessible_to_guests(): void
    {
        $this->get(route('home'))->assertOk();
    }

    public function test_public_index_eager_loads_relationships(): void
    {
        $ad = Advertisement::factory()->create();

        $this->get(route('home'))
            ->assertOk()
            ->assertSee($ad->title);
    }

    public function test_show_is_accessible_to_guests(): void
    {
        $ad = Advertisement::factory()->create();

        $this->get(route('advertisements.show', $ad->slug))->assertOk();
    }

    // ── Auth guards ───────────────────────────────────────────────────────────

    public function test_create_requires_authentication(): void
    {
        $this->get(route('advertisements.create'))->assertRedirect(route('login'));
    }

    public function test_store_requires_authentication(): void
    {
        $this->post(route('advertisements.store'))->assertRedirect(route('login'));
    }

    public function test_edit_requires_authentication(): void
    {
        $ad = Advertisement::factory()->create();

        $this->get(route('advertisements.edit', $ad->slug))->assertRedirect(route('login'));
    }

    // ── CRUD ──────────────────────────────────────────────────────────────────

    public function test_customer_can_create_advertisement(): void
    {
        $user     = User::factory()->customer()->create();
        $category = Category::factory()->create();

        $this->actingAs($user)
            ->post(route('advertisements.store'), [
                'title'        => 'My Test Ad',
                'description'  => 'Some description that is long enough',
                'availability' => 'available',
                'phone'        => '0612345678',
                'location'     => 'Belgrade',
                'category_id'  => $category->id,
            ])
            ->assertRedirect(route('advertisements.user'));

        $this->assertDatabaseHas('advertisements', ['title' => 'My Test Ad', 'user_id' => $user->id]);
    }

    public function test_store_validates_required_fields(): void
    {
        $user = User::factory()->customer()->create();

        $this->actingAs($user)
            ->post(route('advertisements.store'), [])
            ->assertSessionHasErrors(['title', 'description', 'availability', 'phone', 'location', 'category_id']);
    }

    public function test_owner_can_edit_their_advertisement(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->get(route('advertisements.edit', $ad->slug))
            ->assertOk();
    }

    public function test_non_owner_cannot_edit_advertisement(): void
    {
        $owner = User::factory()->customer()->create();
        $other = User::factory()->customer()->create();
        $ad    = Advertisement::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($other)
            ->get(route('advertisements.edit', $ad->slug))
            ->assertForbidden();
    }

    public function test_owner_can_update_advertisement(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->put(route('advertisements.update', $ad->slug), [
                'title'        => 'Updated Title',
                'description'  => 'Updated description that is long enough',
                'availability' => 'available',
                'phone'        => '0612345678',
                'location'     => 'Novi Sad',
                'category_id'  => $ad->category_id,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('advertisements', ['id' => $ad->id, 'title' => 'Updated Title']);
    }

    public function test_non_owner_cannot_update_advertisement(): void
    {
        $owner = User::factory()->customer()->create();
        $other = User::factory()->customer()->create();
        $ad    = Advertisement::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($other)
            ->put(route('advertisements.update', $ad->slug), [
                'title'        => 'Hacked Title',
                'description'  => 'Some description that is long enough',
                'availability' => 'available',
                'phone'        => '0612345678',
                'location'     => 'Belgrade',
                'category_id'  => $ad->category_id,
            ])
            ->assertForbidden();
    }

    public function test_owner_can_soft_delete_advertisement(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->delete(route('advertisements.destroy', $ad->id))
            ->assertRedirect(route('advertisements.user'));

        $this->assertSoftDeleted('advertisements', ['id' => $ad->id]);
    }

    public function test_non_owner_cannot_delete_advertisement(): void
    {
        $owner = User::factory()->customer()->create();
        $other = User::factory()->customer()->create();
        $ad    = Advertisement::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($other)
            ->delete(route('advertisements.destroy', $ad->id))
            ->assertForbidden();
    }

    // ── Trash / restore ───────────────────────────────────────────────────────

    public function test_owner_can_restore_soft_deleted_advertisement(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create(['user_id' => $user->id]);
        $ad->delete();

        $this->actingAs($user)
            ->patch(route('advertisements.restore', $ad->id))
            ->assertRedirect(route('advertisements.trash'));

        $this->assertNotSoftDeleted('advertisements', ['id' => $ad->id]);
    }

    public function test_non_owner_cannot_restore_advertisement(): void
    {
        $owner = User::factory()->customer()->create();
        $other = User::factory()->customer()->create();
        $ad    = Advertisement::factory()->create(['user_id' => $owner->id]);
        $ad->delete();

        $this->actingAs($other)
            ->patch(route('advertisements.restore', $ad->id))
            ->assertForbidden();
    }

    public function test_owner_can_force_delete_advertisement(): void
    {
        $user = User::factory()->customer()->create();
        $ad   = Advertisement::factory()->create(['user_id' => $user->id]);
        $ad->delete();

        $this->actingAs($user)
            ->delete(route('advertisements.forceDelete', $ad->id))
            ->assertRedirect(route('advertisements.trash'));

        $this->assertDatabaseMissing('advertisements', ['id' => $ad->id]);
    }

    public function test_non_owner_cannot_force_delete_advertisement(): void
    {
        $owner = User::factory()->customer()->create();
        $other = User::factory()->customer()->create();
        $ad    = Advertisement::factory()->create(['user_id' => $owner->id]);
        $ad->delete();

        $this->actingAs($other)
            ->delete(route('advertisements.forceDelete', $ad->id))
            ->assertForbidden();
    }
}
