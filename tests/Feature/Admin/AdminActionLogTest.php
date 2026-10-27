<?php

namespace Tests\Feature\Admin;

use App\Http\Middleware\VerifyCsrfToken;
use App\Models\AdminAction;
use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AdminActionLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
        Mail::fake();
    }

    public function test_ad_deletion_is_logged_with_admin_and_title(): void
    {
        $admin = User::factory()->admin()->create(['name' => 'Glavni Admin']);
        $ad    = Advertisement::factory()->create(['title' => 'Kombi za selidbe']);

        $this->actingAs($admin)->delete(route('admin.oglasi.destroy', $ad));

        $entry = AdminAction::sole();
        $this->assertSame('ad_deleted', $entry->action);
        $this->assertSame($admin->id, $entry->admin_id);
        $this->assertSame('Glavni Admin', $entry->admin_name);
        $this->assertStringContainsString('Kombi za selidbe', $entry->description);
    }

    public function test_category_rename_is_logged(): void
    {
        $category = Category::factory()->create(['name' => 'Kamioni', 'parent_id' => null]);

        $this->actingAs(User::factory()->admin()->create())
            ->put(route('admin.kategorije.update', $category), ['name' => 'Teretna vozila']);

        $this->assertSame('Kategorija „Kamioni“ → „Teretna vozila“', AdminAction::sole()->description);
    }

    public function test_log_page_lists_entries_and_filters_by_action(): void
    {
        $admin = User::factory()->admin()->create();
        $this->actingAs($admin);
        AdminAction::record('ad_renewed', 'Oglas A');
        AdminAction::record('ad_deleted', 'Oglas B');

        $this->get(route('admin.actions.index', ['action' => 'ad_deleted']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Actions/Index')
                ->has('actions.data', 1)
                ->where('actions.data.0.description', 'Oglas B')
            );
    }

    public function test_customers_cannot_see_the_log(): void
    {
        $this->actingAs(User::factory()->customer()->create())
            ->get(route('admin.actions.index'))
            ->assertForbidden();
    }
}
