<?php

namespace Tests\Feature;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MetaTagsTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_renders_default_meta_title(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertSee('<title>', false);
    }

    public function test_ad_detail_page_renders_ad_title_in_meta(): void
    {
        $ad = Advertisement::factory()->create(['title' => 'My Special Truck']);

        $response = $this->get(route('advertisements.show', $ad->slug));

        $response->assertOk();
        $response->assertSee('My Special Truck', false);
        $response->assertSee('og:title', false);
    }

    public function test_ad_detail_page_renders_og_image_when_image_exists(): void
    {
        $ad = Advertisement::factory()->create(['image' => 'ads/test.jpg']);

        $response = $this->get(route('advertisements.show', $ad->slug));

        $response->assertOk();
        $response->assertSee('og:image', false);
        $response->assertSee('ads/test.jpg', false);
    }

    public function test_category_page_renders_category_name_in_meta(): void
    {
        $category = Category::factory()->create(['name' => 'Trucks', 'slug' => 'trucks']);

        $response = $this->get(route('advertisements.byCategory', $category->slug));

        $response->assertOk();
        $response->assertSee('Trucks', false);
    }

    public function test_user_profile_page_renders_user_name_in_meta(): void
    {
        $user = User::factory()->customer()->create(['name' => 'John Driver']);

        $response = $this->get(route('user.show', $user->slug));

        $response->assertOk();
        $response->assertSee('John Driver', false);
    }

    public function test_contact_page_has_meta_title(): void
    {
        $this->get(route('contact'))
            ->assertOk()
            ->assertSee('Kontakt', false);
    }

    public function test_faq_page_has_meta_title(): void
    {
        $this->get(route('faq'))
            ->assertOk()
            ->assertSee('pitanja', false);
    }
}
