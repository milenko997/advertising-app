<?php

namespace Tests\Feature\Admin;

use App\Models\Advertisement;
use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAdvertisementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    private function customer(): User
    {
        return User::factory()->customer()->create();
    }

    // ── Access control ────────────────────────────────────────────────────────

    public function test_guest_cannot_access_admin_advertisements(): void
    {
        $this->get(route('admin.oglasi.index'))->assertRedirect(route('login'));
    }

    public function test_customer_cannot_access_admin_advertisements(): void
    {
        $this->actingAs($this->customer())
            ->get(route('admin.oglasi.index'))
            ->assertForbidden();
    }

    public function test_admin_can_view_advertisement_list(): void
    {
        $ad = Advertisement::factory()->create();

        $this->actingAs($this->admin())
            ->get(route('admin.oglasi.index'))
            ->assertOk()
            ->assertSee($ad->title);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    public function test_admin_can_update_any_advertisement(): void
    {
        $admin = $this->admin();
        $ad    = Advertisement::factory()->create();

        $this->actingAs($admin)
            ->put(route('admin.oglasi.update', $ad), [
                'title'        => 'Admin Updated Title',
                'description'  => 'Updated description text here',
                'availability' => 'available',
                'phone'        => '0612345678',
                'location'     => 'Belgrade',
                'category_id'  => $ad->category_id,
            ])
            ->assertRedirect(route('admin.oglasi.index'));

        $this->assertDatabaseHas('advertisements', ['id' => $ad->id, 'title' => 'Admin Updated Title']);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    public function test_admin_can_delete_any_advertisement(): void
    {
        $admin = $this->admin();
        $ad    = Advertisement::factory()->create();

        $this->actingAs($admin)
            ->delete(route('admin.oglasi.destroy', $ad))
            ->assertRedirect(route('admin.oglasi.index'));

        $this->assertSoftDeleted('advertisements', ['id' => $ad->id]);
    }
}
