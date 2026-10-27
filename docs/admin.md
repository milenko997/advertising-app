# Admin panel

Every page under `/admin` requires an admin or super admin account (`isAdmin` middleware). The admin menu shows: Statistika, Oglasi, Kategorije, Korisnici, Dnevnik, Prijave and Utisci.

## Dashboard (`/admin/statistika`)

- Ad counts: total (deleted ads are not counted), active, expired, pinned, posted today and this week, and total views.
- New users this week and month, and the review count with the average rating.
- Open reports and unread feedback, an ads-per-day chart for the last 30 days, top categories, and the newest ads and users.

The numbers are cached for 5 minutes.

## Ads (`/admin/oglasi`)

**Filters.** All of these combine, and only filters that are set appear in the URL (e.g. `/admin/oglasi?status=expired&user=5`):

- text search (title, location, user name, category)
- status, with a count for each:
  - **Aktivan**: active
  - **Ističe uskoro**: expires within 7 days
  - **Istekao**: expired
- category: only categories that have ads are offered, and a main category includes its subcategories
- user: only users who have ads are offered. Clicking an owner's name in the list filters by that user.

**Each row** shows the status badge and expiry date. The title opens the ad in a new tab. Row actions are:

- **Obnovi**: shown only on expired ads
- **Global** and **Kategorija**: pin toggles
- **Izmeni**: edit the ad
- **Obriši**: delete the ad

**Bulk actions** on the selected rows:
- **Prikači izabrane** and **Otkači izabrane**: pin and unpin
- **Obnovi istekle**: renews only the expired ads among the selection and reports how many were renewed
- **Obriši izabrane**: delete

**What owners are told.** Editing, renewing or deleting an ad notifies its owner by email and in the app. See [advertisements.md](advertisements.md) for how renewal and pinning work.

## Categories (`/admin/kategorije`)

Two levels: main categories and subcategories. A category that still has subcategories or ads (deleted ones included) cannot be deleted, so ads are never lost through a category delete. Changes clear the cached navigation menu.

## Users (`/admin/korisnici`)

Admins create, edit and delete users:

- **Create**: the new user gets an email with a link to set their own password.
- **Edit**: the user is notified.
- **Delete**: the account is disabled immediately and its data is removed in the background.

Only a super admin can create, edit or promote admins. See [users.md](users.md#roles).

## Reports and feedback

- **Prijave** (`/admin/prijave`): reported ads, newest first. Each report can be marked as resolved, reopened or deleted. The menu badge shows how many are still open.
- **Utisci** (`/admin/utisci`): feedback sent through the site's feedback form. Each entry can be marked as read or deleted. The menu badge shows how many are unread.

## Audit log (`/admin/dnevnik`)

Every change made in the admin panel is recorded in `admin_actions`: who did it, when, and a description. The description stores names and titles as they were at that moment, so entries stay readable after the ad, user or category is deleted. It covers:

- **Ads**: edit, delete, renew, pin and unpin, single and bulk
- **Users**: create, edit, delete
- **Categories**: create, rename, delete
- **Reports**: resolve, reopen, delete
- **Feedback**: delete

The page shows the newest entries first, 50 per page, with a filter by action. To record a new kind of action, call `AdminAction::record('key', 'description')` and add the key's label to `AdminAction::LABELS`.

Actions an admin takes through the regular, non-admin pages are not logged (for example deleting someone's review from the ad page).
