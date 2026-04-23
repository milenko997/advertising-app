# Advertising App

A marketplace for posting and browsing advertisements, built with Laravel, React, and Inertia.js.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 8.x, PHP 8.0+ |
| Frontend | React 19, Inertia.js, Tailwind CSS 3 |
| Database | SQLite (local) / MySQL or PostgreSQL (production) |
| Assets | Vite |
| Images | Intervention Image (GD) |

## Requirements

- PHP >= 8.0 with extensions: `pdo`, `mbstring`, `gd`, `sqlite3` (local) or `pdo_mysql` (production)
- Composer
- Node.js >= 18 and npm

---

## Local Development Setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd advertising-app
composer install
npm install
```

### 2. Environment

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and verify:

```env
APP_URL=http://localhost
APP_DEBUG=true

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

### 3. Database

```bash
touch database/database.sqlite
php artisan migrate
```

Optionally seed with sample categories, users, and advertisements:

```bash
php artisan db:seed
```

> Note: Seeded ads will not have images since the storage folder is empty. Upload images manually after seeding.

### 4. Storage symlink

```bash
php artisan storage:link
```

### 5. Start the app

Run these two commands in separate terminals:

```bash
# Terminal 1 — backend
php artisan serve

# Terminal 2 — frontend assets (hot reload)
npm run dev
```

Visit [http://localhost:8000](http://localhost:8000)

### One-liner (quick start)

```bash
composer install && npm install && cp .env.example .env && php artisan key:generate && touch database/database.sqlite && php artisan migrate --seed && php artisan storage:link && npm run dev &  php artisan serve
```

---

## Creating an Admin User

Via Tinker:

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'name'     => 'Admin',
    'email'    => 'admin@example.com',
    'password' => bcrypt('your-password'),
    'role'     => 'admin',
]);
```

Or promote an existing user:

```php
\App\Models\User::where('email', 'user@example.com')->update(['role' => 'admin']);
```

---

## Production Deployment

### 1. Upload and install

```bash
git clone <repo-url> .
composer install --no-dev --optimize-autoloader
npm install
npm run build
```

### 2. Environment

```bash
cp .env.example .env
php artisan key:generate
```

Fill in `.env` with production values:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_user
DB_PASSWORD=your_password

SESSION_SECURE_COOKIE=true

MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

### 3. Database, storage, and cache

```bash
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 4. Permissions

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 5. Web server

Point the document root to the `public/` directory.

**Nginx:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/advertising-app/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**Apache** (`.htaccess` is already included in `public/`):

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/advertising-app/public
    <Directory /var/www/advertising-app/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

---

## Image Storage

Uploaded images are stored in `storage/app/public/ads/` and served via the `public/storage` symlink. The `storage/` directory is excluded from git — **back it up separately** on the production server and make sure your deploy process does not delete it.

---

## Useful Commands

```bash
# Clear all caches
php artisan optimize:clear

# Fresh migration with seed (local only)
php artisan migrate:fresh --seed

# View application logs
tail -f storage/logs/laravel.log
```
