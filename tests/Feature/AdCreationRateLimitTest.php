<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AdCreationRateLimitTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    private function adPayload(int $categoryId): array
    {
        return [
            'title'        => 'Test Ad',
            'description'  => 'Some description that is long enough',
            'availability' => 'available',
            'phone'        => '0612345678',
            'location'     => 'Belgrade',
            'category_id'  => $categoryId,
        ];
    }

    public function test_user_is_blocked_after_five_ad_creations(): void
    {
        $user     = User::factory()->customer()->create();
        $category = Category::factory()->create();

        // Simulate 5 previous hits for this user's rate limiter key
        $key = 'ad-creation:' . $user->id;
        for ($i = 0; $i < 5; $i++) {
            RateLimiter::hit($key, 3600);
        }

        $this->actingAs($user)
            ->post(route('advertisements.store'), $this->adPayload($category->id))
            ->assertSessionHasErrors('rate_limit');

        $this->assertDatabaseMissing('advertisements', ['user_id' => $user->id]);
    }

    public function test_user_can_create_ad_before_limit_is_reached(): void
    {
        $user     = User::factory()->customer()->create();
        $category = Category::factory()->create();

        // 4 previous hits — one slot left
        $key = 'ad-creation:' . $user->id;
        for ($i = 0; $i < 4; $i++) {
            RateLimiter::hit($key, 3600);
        }

        $this->actingAs($user)
            ->post(route('advertisements.store'), $this->adPayload($category->id))
            ->assertRedirect(route('advertisements.user'));

        $this->assertDatabaseHas('advertisements', ['user_id' => $user->id]);
    }

    public function test_rate_limit_is_per_user(): void
    {
        $userA    = User::factory()->customer()->create();
        $userB    = User::factory()->customer()->create();
        $category = Category::factory()->create();

        // Only userA is at the limit
        $keyA = 'ad-creation:' . $userA->id;
        for ($i = 0; $i < 5; $i++) {
            RateLimiter::hit($keyA, 3600);
        }

        $this->actingAs($userB)
            ->post(route('advertisements.store'), $this->adPayload($category->id))
            ->assertRedirect(route('advertisements.user'));

        $this->assertDatabaseHas('advertisements', ['user_id' => $userB->id]);
    }
}
