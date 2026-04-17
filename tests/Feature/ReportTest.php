<?php

namespace Tests\Feature;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\Report;
use App\Models\User;
use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReportTest extends TestCase
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

    public function test_guest_cannot_report_ad(): void
    {
        $owner = User::factory()->customer()->create();
        $ad    = $this->makeAd($owner);

        $this->post(route('advertisements.report', $ad), ['type' => 'duplicate_spam'])
            ->assertRedirect(route('login'));
    }

    public function test_user_can_report_ad(): void
    {
        $owner    = User::factory()->customer()->create();
        $reporter = User::factory()->customer()->create();
        $ad       = $this->makeAd($owner);

        $this->actingAs($reporter)
            ->post(route('advertisements.report', $ad), ['type' => 'duplicate_spam'])
            ->assertRedirect();

        $this->assertDatabaseHas('reports', [
            'advertisement_id' => $ad->id,
            'reporter_id'      => $reporter->id,
            'type'             => 'duplicate_spam',
        ]);
    }

    public function test_owner_cannot_report_own_ad(): void
    {
        $owner = User::factory()->customer()->create();
        $ad    = $this->makeAd($owner);

        $this->actingAs($owner)
            ->post(route('advertisements.report', $ad), ['type' => 'duplicate_spam'])
            ->assertSessionHasErrors('type');
    }

    public function test_invalid_report_type_is_rejected(): void
    {
        $owner    = User::factory()->customer()->create();
        $reporter = User::factory()->customer()->create();
        $ad       = $this->makeAd($owner);

        $this->actingAs($reporter)
            ->post(route('advertisements.report', $ad), ['type' => 'invalid_type'])
            ->assertSessionHasErrors('type');
    }

    public function test_duplicate_report_updates_existing(): void
    {
        $owner    = User::factory()->customer()->create();
        $reporter = User::factory()->customer()->create();
        $ad       = $this->makeAd($owner);

        $this->actingAs($reporter)
            ->post(route('advertisements.report', $ad), ['type' => 'wrong_category']);

        $this->actingAs($reporter)
            ->post(route('advertisements.report', $ad), ['type' => 'wrong_category']);

        $this->assertDatabaseCount('reports', 1);
    }
}
