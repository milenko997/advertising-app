# SEO

## Sitemaps

`/sitemap.xml` is a sitemap index (`SitemapController`) that points to:

- `/sitemap-static.xml`: home, contact, FAQ, terms, privacy, about
- `/sitemap-categories.xml`: every category page
- `/sitemap-cities.xml`: category pages per city
- `/sitemap-advertisements.xml`: every active ad

Submit `https://transporteri.rs/sitemap.xml` in Google Search Console.

## Meta and social sharing tags

`resources/views/app.blade.php` renders the title, description, canonical URL, Open Graph and Twitter card tags from the `meta` data each page sends. An ad page uses the ad's title, description and main image, so a shared link on Viber, WhatsApp or Facebook shows a preview. Pages without their own data fall back to the site description and `/og-default.png`.
