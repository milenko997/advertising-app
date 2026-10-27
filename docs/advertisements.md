# Advertisements

## Posting an ad

Only customer accounts can post ads (admins moderate, they don't post). The form at `/postavi-oglas` takes:

- title, description, category (a main category or a subcategory)
- location, phone, price (free text) and availability (`available` or `on_request`)
- payload (optional, e.g. load capacity)
- a main image and up to 10 gallery images

HTML is stripped from the description and payload. The slug is generated from the title, with a fallback when the title has no usable characters.

A user can post at most **5 ads per hour**. The limit is checked before the images are processed, so a blocked request costs nothing.

## Images

`App\Services\ImageService` processes every upload (ad photos and avatars):

- accepts JPEG, PNG, GIF and WebP up to 10 MB and 8192×8192 pixels
- resizes to 1920 px on the longest side (avatars to 512 px)
- stores WebP (JPEG if the PHP build has no WebP support) of at most 1 MB, lowering quality and then size until it fits
- strips EXIF data, including GPS location

Files go to `storage/app/public/ads/` (avatars to `avatars/`) and are served through the `public/storage` symlink. Removing an image from an ad deletes the file.

## Expiry and renewal

An ad is active for **60 days** (`Advertisement::EXPIRY_DAYS`), counted from `expires_at`. Expired ads disappear from listings and search but their page still opens.

- **7 days before expiry** the owner gets an in-app notification and an email (`ads:notify-expiring`, daily at 08:00).
- **Renewing** (`Advertisement::renew()`) sets a new 60-day period and resets `created_at`, which moves the ad back to the top of the listings. Because of that, only **expired** ads can be renewed. The owner renews from "Moji oglasi" or "Obrisani oglasi"; admins renew from the admin ad list, one by one or in bulk, and the owner is then notified by email and in the app.

## Deleting and the trash

When owners delete an ad it is soft-deleted and moves to "Obrisani oglasi" (`/obrisani-oglasi`), where they can restore it or delete it permanently (which also removes its images). Admin deletions are soft deletes as well, and the owner gets an email and a notification.

## Pinning

Admins can pin an ad in two places:

- **Global**: shown at the top of the home page (only when no search or location filter is used)
- **Category**: shown at the top of its category

Pins last **30 days**; `ads:unpin-expired` (daily at 00:00) removes older ones. Only active ads are shown as pinned.

## Listing and search

- Home page (`/`): active ads, newest first, with global pins on top; search by text and filter by location.
- Category pages: `/kategorija/{parent}/{child?}` and the same with a city, e.g. `/kategorija/kamioni/beograd`. A main category includes its subcategories' ads.
- Ad page: `/oglas/{slug}`. A visitor's view counts once per day (tracked in the session), and the owner's own visits don't count. The owner sees the count in "Moji oglasi". The page also shows the advertiser's reviews.

## Favorites

Logged-in users save ads with the heart button; saved ads are listed at `/sacuvani` (only those still active). Expired ads can't be saved.

## Reports

Any visitor can report an ad (at most 5 reports per hour) with one of these reasons:

- wrong category
- duplicate or spam
- breaks the rules
- ignore all ads of this user

Reports show up in the admin panel; see [admin.md](admin.md#reports-and-feedback).
