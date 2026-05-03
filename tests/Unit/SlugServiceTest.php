<?php

namespace Tests\Unit;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use App\Services\SlugService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SlugServiceTest extends TestCase
{
    use RefreshDatabase;

    private SlugService $slugService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->slugService = new SlugService();
    }

    public function test_generates_slug_from_title(): void
    {
        $slug = $this->slugService->generate('Hello World');

        $this->assertEquals('hello-world', $slug);
    }

    public function test_generates_unique_slug_when_taken(): void
    {
        $category = Category::factory()->create();
        $user     = User::factory()->customer()->create();

        Advertisement::factory()->create([
            'user_id'     => $user->id,
            'category_id' => $category->id,
            'slug'        => 'test-ad',
            'title'       => 'Test Ad',
        ]);

        $slug = $this->slugService->generate('Test Ad');

        $this->assertEquals('test-ad-1', $slug);
    }

    public function test_excludes_current_ad_when_updating(): void
    {
        $category = Category::factory()->create();
        $user     = User::factory()->customer()->create();

        $ad = Advertisement::factory()->create([
            'user_id'     => $user->id,
            'category_id' => $category->id,
            'slug'        => 'my-ad',
            'title'       => 'My Ad',
        ]);

        $slug = $this->slugService->generate('My Ad', $ad->id);

        $this->assertEquals('my-ad', $slug);
    }

    public function test_includes_soft_deleted_slugs_in_uniqueness_check(): void
    {
        $category = Category::factory()->create();
        $user     = User::factory()->customer()->create();

        $ad = Advertisement::factory()->create([
            'user_id'     => $user->id,
            'category_id' => $category->id,
            'slug'        => 'deleted-ad',
            'title'       => 'Deleted Ad',
        ]);
        $ad->delete();

        $slug = $this->slugService->generate('Deleted Ad');

        $this->assertEquals('deleted-ad-1', $slug);
    }
}
