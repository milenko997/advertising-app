# Transporteri

Transporteri ([transporteri.rs](https://transporteri.rs)) is a Serbian marketplace for transport and logistics ads: trucks, vans, trailers and transport services. Carriers and companies post ads, visitors browse them by category and city and contact the advertiser directly, and admins moderate everything from an admin panel.

Built with Laravel, React and Inertia.js.

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12, PHP 8.2+ (production runs 8.3) |
| Frontend | React 19, Inertia.js 2, Tailwind CSS 3 |
| Assets | Vite |
| Database | SQLite (local), MySQL (production) |
| Images | Intervention Image (GD), stored as WebP |

How each feature works, and how production is deployed and backed up, is described in [`docs/`](docs/README.md).

---

## Requirements

- PHP 8.2+ with `pdo`, `mbstring`, `gd` and `pdo_sqlite` (local) or `pdo_mysql` (production)
- Composer
- Node.js 18+ and npm

## Local setup

### 1. Install dependencies

```bash
git clone git@github.com:milenko997/advertising-app.git
cd advertising-app
composer install
npm install
```

### 2. Environment

```bash
cp .env.example .env
php artisan key:generate
```

In `.env`, set the database to an absolute path and enable debugging:

```env
APP_URL=http://localhost:8000
APP_DEBUG=true

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/advertising-app/database/database.sqlite
```

Optional: `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` (forms work without reCAPTCHA when both are empty) and `MAIL_*` (use `MAIL_MAILER=log` to write mails to the log instead of sending them).

### 3. Database and sample data

```bash
touch database/database.sqlite
php artisan migrate
php artisan storage:link
```

To fill the app with sample categories, users and ads, set the seed passwords in `.env` first, then seed:

```env
SEED_ADMIN_NAME=Admin
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=password
SEED_USER_PASSWORD=password
```

```bash
php artisan db:seed
```

Seeded ads have no images; upload some through the app.

### 4. Run

In two terminals:

```bash
php artisan serve   # http://localhost:8000
npm run dev         # Vite with hot reload
```

### Admin account

`db:seed` creates the admin from the `SEED_ADMIN_*` values. Without seeding, create one in `php artisan tinker`. The `role` field is not mass assignable, so use `forceCreate`:

```php
\App\Models\User::forceCreate([
    'name'     => 'Admin',
    'email'    => 'admin@example.com',
    'password' => bcrypt('your-password'),
    'role'     => 'admin',   // or 'super_admin', see docs/users.md
]);
```

## Tests

```bash
php artisan test
```

The suite uses an in-memory SQLite database and also runs in GitHub Actions before every deploy.

## Useful commands

```bash
php artisan optimize:clear          # clear all caches
php artisan migrate:fresh --seed    # rebuild the local database (local only)
tail -f storage/logs/laravel.log    # application log
```
