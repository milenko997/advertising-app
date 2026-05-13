<?php

namespace Tests\Feature;

use App\Models\Advertisement;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ByCategoryWithCityTest extends TestCase
{
    use RefreshDatabase;

    private Category $parent;
    private Category $child;

    protected function setUp(): void
    {
        parent::setUp();

        $this->parent = Category::factory()->create(['slug' => 'kamioni']);
        $this->child  = Category::factory()->create([
            'slug'      => 'tegljaci',
            'parent_id' => $this->parent->id,
        ]);
    }

    // ── Accessibility ─────────────────────────────────────────────────────────

    public function test_parent_city_page_is_accessible_to_guests(): void
    {
        $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'beograd',
        ]))->assertOk();
    }

    public function test_child_city_page_is_accessible_to_guests(): void
    {
        $this->get(route('advertisements.byCategoryChildCity', [
            'parent' => $this->parent->slug,
            'child'  => $this->child->slug,
            'city'   => 'novi-sad',
        ]))->assertOk();
    }

    // ── 404 cases ─────────────────────────────────────────────────────────────

    public function test_unknown_location_slug_returns_empty_results(): void
    {
        $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'atlantida',
        ]))->assertOk();
    }

    public function test_unknown_parent_category_returns_404(): void
    {
        $this->get(route('advertisements.byCategoryCity', [
            'parent' => 'nepostojeca-kategorija',
            'city'   => 'beograd',
        ]))->assertNotFound();
    }

    public function test_child_not_belonging_to_parent_returns_404(): void
    {
        $otherChild = Category::factory()->create(['slug' => 'other-child']);

        $this->get(route('advertisements.byCategoryChildCity', [
            'parent' => $this->parent->slug,
            'child'  => $otherChild->slug,
            'city'   => 'beograd',
        ]))->assertNotFound();
    }

    // ── City filtering ────────────────────────────────────────────────────────

    public function test_only_ads_in_matching_city_are_shown(): void
    {
        Advertisement::factory()->create([
            'category_id' => $this->parent->id,
            'title'       => 'Kamion iz Beograda',
            'location'    => 'Beograd',
        ]);
        Advertisement::factory()->create([
            'category_id' => $this->parent->id,
            'title'       => 'Kamion iz Novog Sada',
            'location'    => 'Novi Sad',
        ]);

        $response = $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'beograd',
        ]));

        $response->assertOk();
        $response->assertSee('Kamion iz Beograda', false);
        $response->assertDontSee('Kamion iz Novog Sada', false);
    }

    public function test_ads_from_child_categories_appear_on_parent_city_page(): void
    {
        Advertisement::factory()->create([
            'category_id' => $this->child->id,
            'title'       => 'Tegljac iz Beograda',
            'location'    => 'Beograd',
        ]);

        $response = $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'beograd',
        ]));

        $response->assertOk();
        $response->assertSee('Tegljac iz Beograda', false);
    }

    public function test_child_city_page_shows_only_child_category_ads(): void
    {
        Advertisement::factory()->create([
            'category_id' => $this->child->id,
            'title'       => 'Tegljac Beograd',
            'location'    => 'Beograd',
        ]);
        Advertisement::factory()->create([
            'category_id' => $this->parent->id,
            'title'       => 'Opsti kamion Beograd',
            'location'    => 'Beograd',
        ]);

        $response = $this->get(route('advertisements.byCategoryChildCity', [
            'parent' => $this->parent->slug,
            'child'  => $this->child->slug,
            'city'   => 'beograd',
        ]));

        $response->assertOk();
        $response->assertSee('Tegljac Beograd', false);
        $response->assertDontSee('Opsti kamion Beograd', false);
    }

    public function test_expired_ads_are_not_shown(): void
    {
        Advertisement::factory()->create([
            'category_id' => $this->parent->id,
            'title'       => 'Istekao oglas Beograd',
            'location'    => 'Beograd',
            'expires_at'  => now()->subDay(),
        ]);

        $response = $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'beograd',
        ]));

        $response->assertOk();
        $response->assertDontSee('Istekao oglas Beograd', false);
    }

    public function test_pinned_ads_with_city_match_are_included(): void
    {
        Advertisement::factory()->create([
            'category_id'        => $this->parent->id,
            'title'              => 'Istaknuti oglas Beograd',
            'location'           => 'Beograd',
            'is_pinned_category' => true,
        ]);

        $response = $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'beograd',
        ]));

        $response->assertOk();
        $response->assertSee('Istaknuti oglas Beograd', false);
    }

    public function test_pinned_ads_from_wrong_city_are_excluded(): void
    {
        Advertisement::factory()->create([
            'category_id'        => $this->parent->id,
            'title'              => 'Istaknuti Novi Sad oglas',
            'location'           => 'Novi Sad',
            'is_pinned_category' => true,
        ]);

        $response = $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'beograd',
        ]));

        $response->assertOk();
        $response->assertDontSee('Istaknuti Novi Sad oglas', false);
    }

    // ── Meta tags ─────────────────────────────────────────────────────────────

    public function test_city_page_title_includes_category_and_city(): void
    {
        $response = $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'beograd',
        ]));

        $response->assertOk();
        $response->assertSee('Beograd', false);
        $response->assertSee($this->parent->name, false);
    }

    public function test_city_page_has_og_title_with_city(): void
    {
        $response = $this->get(route('advertisements.byCategoryCity', [
            'parent' => $this->parent->slug,
            'city'   => 'nis',
        ]));

        $response->assertOk();
        $response->assertSee('og:title', false);
        $response->assertSee('Niš', false);
    }

    // ── AJAX pagination ───────────────────────────────────────────────────────

    public function test_ajax_request_returns_json(): void
    {
        Advertisement::factory()->create([
            'category_id' => $this->parent->id,
            'location'    => 'Beograd',
        ]);

        $response = $this->withHeader('X-Requested-With', 'XMLHttpRequest')
            ->get(route('advertisements.byCategoryCity', [
                'parent' => $this->parent->slug,
                'city'   => 'beograd',
            ]));

        $response->assertOk();
        $response->assertJsonStructure(['ads', 'hasMore']);
    }

    public function test_ajax_response_only_contains_city_ads(): void
    {
        Advertisement::factory()->create([
            'category_id' => $this->parent->id,
            'title'       => 'Beograd oglas',
            'location'    => 'Beograd',
        ]);
        Advertisement::factory()->create([
            'category_id' => $this->parent->id,
            'title'       => 'Nis oglas',
            'location'    => 'Niš',
        ]);

        $response = $this->withHeader('X-Requested-With', 'XMLHttpRequest')
            ->get(route('advertisements.byCategoryCity', [
                'parent' => $this->parent->slug,
                'city'   => 'beograd',
            ]));

        $response->assertOk();
        $ads = $response->json('ads');
        $this->assertNotEmpty($ads);
        foreach ($ads as $ad) {
            $this->assertStringContainsStringIgnoringCase('beograd', $ad['location']);
        }
    }

    // ── Sitemap ───────────────────────────────────────────────────────────────

    public function test_cities_sitemap_is_accessible(): void
    {
        $this->get(route('sitemap.cities'))->assertOk();
    }

    public function test_cities_sitemap_includes_url_when_ads_exist(): void
    {
        Advertisement::factory()->create([
            'category_id' => $this->parent->id,
            'location'    => 'Beograd',
        ]);

        $response = $this->get(route('sitemap.cities'));

        $response->assertOk();
        $response->assertSee('kategorija/' . $this->parent->slug . '/beograd', false);
    }

    public function test_cities_sitemap_excludes_url_when_no_ads(): void
    {
        $response = $this->get(route('sitemap.cities'));

        $response->assertOk();
        $response->assertDontSee('kategorija/' . $this->parent->slug . '/beograd', false);
    }
}
