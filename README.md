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

### 6. Automatic deploys (GitHub Actions)

`.github/workflows/deploy.yml` ("Deploy to prod") deploys every change on `main` without downtime:

- **Direct push to `main`** → tests run, then it deploys automatically.
- **Merged pull request** → tests run, then the deploy waits until someone opens the run in the Actions tab and clicks **Review deployments → Approve and deploy**.
- **Manual run** → Actions → *Deploy to prod* → **Run workflow** deploys the current `main`.

There is no maintenance mode. Each deploy is prepared in its own directory next to the live site, and the site switches over in one step at the end:

```
/var/www/advertising-app/          <- DEPLOY_PATH
├── current -> releases/20261027163000-449096f
├── releases/                      <- last 5 deploys, for rollbacks
└── shared/
    ├── .env
    └── storage/                   <- uploaded images, logs, sessions
```

A deploy uploads the code with the frontend already built (the server needs no Node.js), links `shared/.env` and `shared/storage`, runs `composer install --no-dev`, caches config/routes/views, runs `migrate --force` and only then points `current` at the new release and restarts queue workers. If anything fails before the switch, the half-built release is deleted and visitors keep getting the previous version. Migrations run while the previous release is still serving, so they must not break it (add columns before using them, drop them in a later deploy).

**Rollback:** `cd /var/www/advertising-app && ln -sfn releases/<older-release> current.new && mv -Tf current.new current`.

#### One-time server setup

1. Create the layout and move the existing `.env` and `storage/` into `shared/` (adjust the old path if your app lives elsewhere):

   ```bash
   cd /var/www/advertising-app
   mkdir -p releases shared
   cp .env shared/.env
   cp -a storage shared/storage
   ```

2. Run the first deploy (push to `main` or **Run workflow**). It creates `current`.
3. Point the web server at `current/public` and reload it. With Nginx keep `$realpath_root` in `fastcgi_param SCRIPT_FILENAME` (as in the config above), so PHP-FPM picks up each new release immediately:

   ```nginx
   root /var/www/advertising-app/current/public;
   ```

4. Copy anything uploaded since step 1 (`cp -a storage/. shared/storage/`), then update the cron entry and queue worker (Supervisor) to use `/var/www/advertising-app/current/artisan`. Once the site works from `current`, the old app files in `/var/www/advertising-app` (everything except `current`, `releases` and `shared`) can be removed.

#### One-time GitHub setup (repository **Settings**)

1. **Secrets and variables → Actions → New repository secret**:

   | Secret | Value |
   |---|---|
   | `SSH_HOST` | Server hostname or IP |
   | `SSH_USER` | User that owns the app directory (not root) |
   | `SSH_PORT` | Optional, defaults to `22` |
   | `SSH_PRIVATE_KEY` | Private key of a deploy-only key pair (see below) |
   | `SSH_KNOWN_HOSTS` | Output of `ssh-keyscan -p <port> <host>`, so the runner only trusts your server |
   | `DEPLOY_PATH` | Base directory on the server, e.g. `/var/www/advertising-app` |

2. **Environments → New environment** `production-approval` → enable **Required reviewers** and add yourself. Without it, merged pull requests are refused instead of deployed. The `production` environment needs no rules (GitHub creates it on the first deploy).

Deploy key: run `ssh-keygen -t ed25519 -f deploy_key -N ""` locally, append `deploy_key.pub` to `~/.ssh/authorized_keys` of `SSH_USER` on the server, and paste `deploy_key` into the `SSH_PRIVATE_KEY` secret. The server needs PHP and Composer on the `PATH` of that user; it does not need git or Node.js.

### 7. Backups (Cloudflare R2)

`deploy/backup.sh` runs every night as the `deploy` user. It dumps the database (`php artisan backup:dump-database`) and uses [restic](https://restic.net) to upload it, together with `shared/.env` and `shared/storage/app` (uploaded images), to a Cloudflare R2 bucket. Backups are encrypted before they leave the server and incremental, so only new or changed files are uploaded. It keeps 14 daily, 8 weekly and 12 monthly snapshots.

Settings live in `/home/deploy/.config/transporteri-backup.env` (not in git):

```env
RESTIC_REPOSITORY=s3:https://<ACCOUNT_ID>.r2.cloudflarestorage.com/transporteri-backup
RESTIC_PASSWORD_FILE=/home/deploy/.config/restic-password
AWS_ACCESS_KEY_ID=<R2 access key id>
AWS_SECRET_ACCESS_KEY=<R2 secret access key>
AWS_DEFAULT_REGION=auto
# Optional: healthchecks.io ping URL, it mails you when a backup does not arrive
HEALTHCHECK_URL=
```

Keep a copy of the restic password outside the server (password manager). Without it the backups cannot be decrypted.

Cron (`/etc/cron.d/transporteri-backup`):

```
0 3 * * * deploy /bin/bash /var/www/advertising-app/current/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

**Restore** (as `deploy`, after `set -a; . ~/.config/transporteri-backup.env; set +a`):

```bash
restic snapshots                                  # list backups
restic restore latest --target /tmp/restore       # or a snapshot id instead of latest
# database: /tmp/restore/home/deploy/backup/database.sql (mysql < file, or copy the SQLite file)
# images:   /tmp/restore/var/www/advertising-app/shared/storage/app
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
