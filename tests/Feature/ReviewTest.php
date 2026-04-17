<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_authenticated_user_can_leave_review(): void
    {
        $reviewer = User::factory()->customer()->create();
        $target   = User::factory()->customer()->create();

        $this->actingAs($reviewer)
            ->post(route('reviews.store', $target), ['rating' => 5, 'comment' => 'Great!'])
            ->assertRedirect();

        $this->assertDatabaseHas('reviews', [
            'reviewer_id'      => $reviewer->id,
            'reviewed_user_id' => $target->id,
            'rating'           => 5,
        ]);
    }

    public function test_user_cannot_review_themselves(): void
    {
        $user = User::factory()->customer()->create();

        $this->actingAs($user)
            ->post(route('reviews.store', $user), ['rating' => 5])
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertDatabaseMissing('reviews', ['reviewer_id' => $user->id, 'reviewed_user_id' => $user->id]);
    }

    public function test_user_cannot_review_same_person_twice(): void
    {
        $reviewer = User::factory()->customer()->create();
        $target   = User::factory()->customer()->create();

        Review::create(['reviewer_id' => $reviewer->id, 'reviewed_user_id' => $target->id, 'rating' => 4]);

        $this->actingAs($reviewer)
            ->post(route('reviews.store', $target), ['rating' => 5])
            ->assertRedirect()
            ->assertSessionHas('error');

        $this->assertDatabaseCount('reviews', 1);
    }

    public function test_owner_can_update_their_review(): void
    {
        $reviewer = User::factory()->customer()->create();
        $target   = User::factory()->customer()->create();
        $review   = Review::create(['reviewer_id' => $reviewer->id, 'reviewed_user_id' => $target->id, 'rating' => 3]);

        $this->actingAs($reviewer)
            ->put("/recenzije/{$review->id}", ['rating' => 5, 'comment' => 'Changed my mind'])
            ->assertRedirect();

        $this->assertDatabaseHas('reviews', ['id' => $review->id, 'rating' => 5]);
    }

    public function test_non_owner_cannot_update_review(): void
    {
        $reviewer = User::factory()->customer()->create();
        $other    = User::factory()->customer()->create();
        $target   = User::factory()->customer()->create();
        $review   = Review::create(['reviewer_id' => $reviewer->id, 'reviewed_user_id' => $target->id, 'rating' => 3]);

        $this->actingAs($other)
            ->put("/recenzije/{$review->id}", ['rating' => 1])
            ->assertForbidden();
    }

    public function test_owner_can_delete_their_review(): void
    {
        $reviewer = User::factory()->customer()->create();
        $target   = User::factory()->customer()->create();
        $review   = Review::create(['reviewer_id' => $reviewer->id, 'reviewed_user_id' => $target->id, 'rating' => 3]);

        $this->actingAs($reviewer)
            ->delete("/recenzije/{$review->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_non_owner_cannot_delete_review(): void
    {
        $reviewer = User::factory()->customer()->create();
        $other    = User::factory()->customer()->create();
        $target   = User::factory()->customer()->create();
        $review   = Review::create(['reviewer_id' => $reviewer->id, 'reviewed_user_id' => $target->id, 'rating' => 3]);

        $this->actingAs($other)
            ->delete("/recenzije/{$review->id}")
            ->assertForbidden();
    }

    public function test_admin_can_delete_any_review(): void
    {
        $admin    = User::factory()->admin()->create();
        $reviewer = User::factory()->customer()->create();
        $target   = User::factory()->customer()->create();
        $review   = Review::create(['reviewer_id' => $reviewer->id, 'reviewed_user_id' => $target->id, 'rating' => 3]);

        $this->actingAs($admin)
            ->delete("/recenzije/{$review->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_guest_cannot_leave_review(): void
    {
        $target = User::factory()->customer()->create();

        $this->post(route('reviews.store', $target), ['rating' => 5])
            ->assertRedirect(route('login'));
    }
}
