<?php

namespace Tests\Feature\Admin;

use App\Mail\AdDeletedByAdminMail;
use App\Mail\AdRenewedByAdminMail;
use App\Models\Advertisement;
use App\Models\Category;
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

    public function test_index_can_be_filtered_by_category_including_subcategories(): void
    {
        $parent = Category::factory()->create();
        $child  = Category::factory()->create(['parent_id' => $parent->id]);
        $other  = Category::factory()->create();

        $inParent = Advertisement::factory()->create(['category_id' => $parent->id, 'expires_at' => now()->addDays(30)]);
        $inChild  = Advertisement::factory()->create(['category_id' => $child->id, 'expires_at' => now()->subDay()]);
        Advertisement::factory()->create(['category_id' => $other->id]);

        $admin = $this->admin();
        $ids   = fn ($ads) => collect($ads)->pluck('id')->sort()->values()->all();

        $this->actingAs($admin)
            ->get(route('admin.oglasi.index', ['category' => $parent->id]))
            ->assertInertia(fn ($page) => $page
                ->where('category', $parent->id)
                ->where('ads.data', fn ($ads) => $ids($ads) === collect([$inParent->id, $inChild->id])->sort()->values()->all())
                ->where('counts.all', 2)
                ->where('counts.expired', 1)
                ->has('categories', 2)
            );

        $this->actingAs($admin)
            ->get(route('admin.oglasi.index', ['category' => $child->id, 'status' => 'expired']))
            ->assertInertia(fn ($page) => $page
                ->where('ads.data', fn ($ads) => $ids($ads) === [$inChild->id])
            );

        $this->actingAs($admin)
            ->get(route('admin.oglasi.index', ['category' => 999999]))
            ->assertInertia(fn ($page) => $page
                ->where('category', null)
                ->has('ads.data', 3)
            );
    }

    public function test_index_can_be_filtered_by_user(): void
    {
        $owner = $this->customer();
        $other = $this->customer();
        $this->customer(); // has no ads, so isn't offered in the filter

        $ownAds = Advertisement::factory()->count(2)->create(['user_id' => $owner->id]);
        Advertisement::factory()->create(['user_id' => $other->id]);

        $admin = $this->admin();

        $this->actingAs($admin)
            ->get(route('admin.oglasi.index', ['user' => $owner->id]))
            ->assertInertia(fn ($page) => $page
                ->where('user', $owner->id)
                ->where('ads.data', fn ($ads) => collect($ads)->pluck('id')->sort()->values()->all() === $ownAds->pluck('id')->sort()->values()->all())
                ->where('counts.all', 2)
                ->where('users', fn ($users) => collect($users)->pluck('id')->sort()->values()->all() === collect([$owner->id, $other->id])->sort()->values()->all())
            );

        $this->actingAs($admin)
            ->get(route('admin.oglasi.index', ['user' => 999999]))
            ->assertInertia(fn ($page) => $page
                ->where('user', null)
                ->has('ads.data', 3)
            );
    }

    // ── Renew ─────────────────────────────────────────────────────────────────

    public function test_admin_can_renew_expired_ad(): void
    {
        Mail::fake();
        $ad = Advertisement::factory()->create();
        $ad->forceFill(['created_at' => now()->subDays(70), 'expires_at' => now()->subDays(10)])->save();

        $this->actingAs($this->admin())
            ->patch(route('admin.advertisements.renew', $ad))
            ->assertRedirect()
            ->assertSessionHas('success');

        $ad->refresh();
        $this->assertTrue($ad->expires_at->gt(now()->addDays(Advertisement::EXPIRY_DAYS - 1)));
        Mail::assertQueued(AdRenewedByAdminMail::class, fn ($mail) => $mail->hasTo($ad->user->email));
        $this->assertSame('ad_renewed_by_admin', $ad->user->notifications()->first()->data['type']);
        $this->assertTrue($ad->created_at->gt(now()->subMinute()));
    }

    public function test_admin_cannot_renew_active_ad(): void
    {
        $ad = Advertisement::factory()->create();
        $ad->forceFill(['created_at' => now()->subDays(10), 'expires_at' => now()->addDays(50)])->save();

        $this->actingAs($this->admin())
            ->patch(route('admin.advertisements.renew', $ad))
            ->assertSessionHas('error');

        $this->assertTrue($ad->fresh()->created_at->lt(now()->subDays(9)));
    }

    public function test_customer_cannot_use_admin_renew(): void
    {
        $ad = Advertisement::factory()->create();
        $ad->forceFill(['expires_at' => now()->subDay()])->save();

        $this->actingAs($this->customer())
            ->patch(route('admin.advertisements.renew', $ad))
            ->assertForbidden();

        $this->assertTrue($ad->fresh()->isExpired());
    }

    public function test_category_filter_only_lists_categories_with_ads(): void
    {
        $parent = Category::factory()->create(['parent_id' => null]);
        $used   = Category::factory()->create(['parent_id' => $parent->id]);
        $unused = Category::factory()->create(['parent_id' => $parent->id]);
        $empty  = Category::factory()->create(['parent_id' => null]);
        Advertisement::factory()->create(['category_id' => $used->id]);

        $this->actingAs($this->admin())
            ->get(route('admin.oglasi.index'))
            ->assertInertia(function ($page) use ($parent, $used, $unused, $empty) {
                $categories = collect($page->toArray()['props']['categories']);
                $this->assertSame([$parent->id], $categories->pluck('id')->intersect([$parent->id, $empty->id])->values()->all());
                $children = collect($categories->firstWhere('id', $parent->id)['children'])->pluck('id')->all();
                $this->assertContains($used->id, $children);
                $this->assertNotContains($unused->id, $children);
            });
    }

    public function test_bulk_renew_only_renews_expired_ads(): void
    {
        Mail::fake();
        $expired = Advertisement::factory()->create();
        $expired->forceFill(['expires_at' => now()->subDay()])->save();
        $active = Advertisement::factory()->create();
        $active->forceFill(['created_at' => now()->subDays(10), 'expires_at' => now()->addDays(50)])->save();

        $this->actingAs($this->admin())
            ->post(route('admin.advertisements.bulk'), ['action' => 'renew', 'ids' => [$expired->id, $active->id]])
            ->assertSessionHas('success', 'Obnovljeno 1 od 2 izabranih oglasa.');

        $this->assertFalse($expired->fresh()->isExpired());
        $this->assertTrue($active->fresh()->created_at->lt(now()->subDays(9)));
        Mail::assertQueued(AdRenewedByAdminMail::class, 1);
    }
}
