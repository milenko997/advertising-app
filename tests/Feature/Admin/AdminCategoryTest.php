<?php

namespace Tests\Feature\Admin;

use App\Http\Middleware\VerifyCsrfToken;
use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(VerifyCsrfToken::class);
    }

    public function test_admin_can_delete_empty_category(): void
    {
        $category = Category::factory()->create();

        $this->actingAs(User::factory()->admin()->create())
            ->delete(route('admin.kategorije.destroy', $category))
            ->assertSessionHas('success');

        $this->assertModelMissing($category);
    }

    public function test_category_with_ads_cannot_be_deleted(): void
    {
        $category = Category::factory()->create();
        $ad       = Advertisement::factory()->create(['category_id' => $category->id]);
        $ad->delete();

        $this->actingAs(User::factory()->admin()->create())
            ->delete(route('admin.kategorije.destroy', $category))
            ->assertSessionHas('error');

        $this->assertModelExists($category);
        $this->assertSoftDeleted($ad);
    }

    public function test_category_with_subcategories_cannot_be_deleted(): void
    {
        $parent = Category::factory()->create();
        $child  = Category::factory()->create(['parent_id' => $parent->id]);

        $this->actingAs(User::factory()->admin()->create())
            ->delete(route('admin.kategorije.destroy', $parent))
            ->assertSessionHas('error');

        $this->assertModelExists($parent);
        $this->assertModelExists($child);
    }
}
