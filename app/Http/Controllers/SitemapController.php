<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\Category;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemaps = [
            ['loc' => url('/sitemap-static.xml'),         'lastmod' => now()->toDateString()],
            ['loc' => url('/sitemap-categories.xml'),     'lastmod' => now()->toDateString()],
            ['loc' => url('/sitemap-advertisements.xml'), 'lastmod' => now()->toDateString()],
        ];

        return response()
            ->view('sitemaps.index', compact('sitemaps'))
            ->header('Content-Type', 'application/xml');
    }

    public function static()
    {
        $urls = [
            ['loc' => url('/'),                        'changefreq' => 'daily',   'priority' => '1.0'],
            ['loc' => url('/o-nama'),                  'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => url('/kontakt'),                 'changefreq' => 'monthly', 'priority' => '0.4'],
            ['loc' => url('/cesta-pitanja'),           'changefreq' => 'monthly', 'priority' => '0.5'],
            ['loc' => url('/uslovi-koriscenja'),       'changefreq' => 'yearly',  'priority' => '0.3'],
            ['loc' => url('/politika-privatnosti'),    'changefreq' => 'yearly',  'priority' => '0.3'],
        ];

        return response()
            ->view('sitemaps.urlset', compact('urls'))
            ->header('Content-Type', 'application/xml');
    }

    public function categories()
    {
        $categories = Category::with('parent')->get();

        $urls = $categories->map(function ($category) {
            if ($category->parent_id) {
                $loc = route('advertisements.byCategory', [
                    'parent' => $category->parent->slug,
                    'child'  => $category->slug,
                ]);
            } else {
                $loc = route('advertisements.byCategory', [
                    'parent' => $category->slug,
                ]);
            }

            return ['loc' => $loc, 'changefreq' => 'daily', 'priority' => '0.8'];
        })->all();

        return response()
            ->view('sitemaps.urlset', compact('urls'))
            ->header('Content-Type', 'application/xml');
    }

    public function advertisements()
    {
        $urls = Advertisement::active()
            ->orderByDesc('updated_at')
            ->limit(50000)
            ->get(['slug', 'updated_at'])
            ->map(fn ($ad) => [
                'loc'        => route('advertisements.show', $ad->slug),
                'lastmod'    => $ad->updated_at->toDateString(),
                'changefreq' => 'weekly',
                'priority'   => '0.6',
            ])
            ->all();

        return response()
            ->view('sitemaps.urlset', compact('urls'))
            ->header('Content-Type', 'application/xml');
    }
}
