<?php

namespace Tests\Feature\Admin;

use App\Models\Advertisement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_total_ads_excludes_deleted_ads(): void
    {
        Advertisement::factory()->count(2)->create();
        Advertisement::factory()->create()->delete();

        $this->actingAs(User::factory()->admin()->create())
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->where('stats.ads.total', 2));
    }
}
