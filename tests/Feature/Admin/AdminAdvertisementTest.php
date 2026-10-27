<?php

namespace Tests\Feature\Admin;

use App\Mail\AdDeletedByAdminMail;
use App\Models\Advertisement;
use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
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

    public function test_update_rejects_images_that_are_not_an_array(): void
    {
        Storage::fake('public');
        $ad = Advertisement::factory()->create();

        $this->actingAs($this->admin())
            ->put(route('admin.oglasi.update', $ad), [
                'title'        => 'Admin Updated Title',
                'description'  => 'Updated description text here',
                'availability' => 'available',
                'phone'        => '0612345678',
                'location'     => 'Belgrade',
                'category_id'  => $ad->category_id,
                'images'       => UploadedFile::fake()->image('single.jpg'),
            ])
            ->assertSessionHasErrors('images');
    }

    public function test_ad_deletion_emails_are_queued_not_sent_inline(): void
    {
        Mail::fake();
        $ads = Advertisement::factory()->count(2)->create();

        $this->actingAs($this->admin())
            ->delete(route('admin.oglasi.destroy', $ads[0]));

        $this->actingAs($this->admin())
            ->post(route('admin.advertisements.bulk'), ['action' => 'delete', 'ids' => [$ads[1]->id]]);

        Mail::assertNothingSent();
        Mail::assertQueued(AdDeletedByAdminMail::class, 2);
    }
}
