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

    public function test_index_shows_expiry_status_of_each_ad(): void
    {
        $expired  = Advertisement::factory()->create(['expires_at' => now()->subDay()]);
        $expiring = Advertisement::factory()->create(['expires_at' => now()->addDays(3)]);
        $active   = Advertisement::factory()->create(['expires_at' => now()->addDays(30)]);

        $this->actingAs($this->admin())
            ->get(route('admin.oglasi.index'))
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Advertisements/Index')
                ->where('ads.data', fn ($ads) => collect($ads)->pluck('status', 'id')->sortKeys()->all() === collect([
                    $expired->id  => 'expired',
                    $expiring->id => 'expiring',
                    $active->id   => 'active',
                ])->sortKeys()->all())
            );
    }

    public function test_index_can_be_filtered_by_status_and_counts_each_status(): void
    {
        $expired  = Advertisement::factory()->count(2)->create(['expires_at' => now()->subDay()]);
        $expiring = Advertisement::factory()->create(['expires_at' => now()->addDays(3)]);
        Advertisement::factory()->create(['expires_at' => now()->addDays(30)]);

        $admin = $this->admin();

        $this->actingAs($admin)
            ->get(route('admin.oglasi.index', ['status' => 'expired']))
            ->assertInertia(fn ($page) => $page
                ->where('status', 'expired')
                ->where('ads.data', fn ($ads) => collect($ads)->pluck('id')->sort()->values()->all() === $expired->pluck('id')->sort()->values()->all())
                ->where('counts', ['all' => 4, 'active' => 1, 'expiring' => 1, 'expired' => 2])
            );

        $this->actingAs($admin)
            ->get(route('admin.oglasi.index', ['status' => 'expiring']))
            ->assertInertia(fn ($page) => $page
                ->where('ads.data', fn ($ads) => collect($ads)->pluck('id')->all() === [$expiring->id])
            );

        $this->actingAs($admin)
            ->get(route('admin.oglasi.index', ['status' => 'bogus']))
            ->assertInertia(fn ($page) => $page
                ->where('status', '')
                ->has('ads.data', 4)
            );
    }
}
