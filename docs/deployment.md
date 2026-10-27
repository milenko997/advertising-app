# Deployment

Production runs on Ubuntu 24.04 with nginx, PHP 8.3-FPM and MySQL, behind Cloudflare. Code reaches the server only through GitHub Actions; nobody runs `git pull` on the server.

## Automatic deploys

`.github/workflows/deploy.yml` ("Deploy to prod") deploys every change on `main` without downtime:

- **Direct push to `main`**: tests run, then it deploys automatically.
- **Merged pull request**: tests run, then the deploy waits until someone opens the run in the Actions tab and clicks **Review deployments → Approve and deploy**.
- **Manual run**: Actions → *Deploy to prod* → **Run workflow** deploys the current `main`.

There is no maintenance mode. Each deploy is prepared in its own directory next to the live site, and the site switches over in one step at the end:

```
/var/www/advertising-app/          <- DEPLOY_PATH
├── current -> releases/20261027163000-449096f
├── releases/                      <- last 5 deploys, for rollbacks
└── shared/
    ├── .env
    ├── storage/                   <- uploaded images, logs, sessions
    └── backups/                   <- database copies taken before migrations
```

### What a deploy does

The `test` job installs dependencies, builds the frontend and runs the test suite. The server needs no Node.js, because the built assets are uploaded with the code. The `deploy` job then:

1. Uploads the code to `releases/<time>-<sha>/` and links `shared/.env`, `shared/storage` and `public/storage`.
2. Runs `composer install --no-dev` and caches config, routes and views.
3. Saves a copy of the database to `shared/backups/pre-deploy-<release>.sql` (the last 5 are kept).
4. Runs `migrate --force`.
5. Points `current` at the new release in one atomic step, restarts the queue workers and reloads PHP-FPM.
6. Checks that `/` and `/prijava` answer 200 from the server's own nginx. If they don't, it points `current` back at the previous release, deletes the broken one and fails the run.
7. Deletes all but the 5 newest releases.

If anything fails before step 5, the half-built release is deleted and visitors keep getting the previous version.

### Migrations

Migrations run while the previous release is still serving traffic, so they must not break it:
- Adding tables and columns is always safe.
- To rename or drop a column, first deploy code that no longer uses it, then drop it in a later deploy.

An automatic rollback (step 6) restores the code, not the database. To undo a migration, restore the `pre-deploy` copy, or run `php artisan migrate:rollback --step=1` in the release that contains that migration **before** switching back.

### Manual rollback

```bash
cd /var/www/advertising-app && ls releases/
ln -sfn releases/<older-release> current.new && mv -Tf current.new current
sudo systemctl reload php8.3-fpm
```

## Scheduler and queue

- **Scheduler:** `/etc/cron.d/transporteri` runs `php artisan schedule:run` every minute as `www-data` from `current`. The schedule (`routes/console.php`) is:
  - `ads:notify-expiring` daily at 08:00
  - `ads:unpin-expired` daily at 00:00
- **Queue:** `QUEUE_CONNECTION=database`. A Supervisor program (`/etc/supervisor/conf.d/transporteri-worker.conf`) runs `php /var/www/advertising-app/current/artisan queue:work --sleep=3 --tries=3 --timeout=90` as `www-data`. Each deploy restarts it with `queue:restart`.

## One-time server setup

These steps have already been done on the production server and are kept here for a new server.

1. Create a `deploy` user in the `www-data` group. It owns the app directory and is the user GitHub Actions logs in as.
2. Allow it to reload PHP-FPM without a password, in `/etc/sudoers.d/deploy`:
   ```
   deploy ALL=(root) NOPASSWD: /usr/bin/systemctl reload php8.3-fpm
   ```
3. Create the layout and put the production `.env` and `storage/` in `shared/`:
   ```bash
   cd /var/www/advertising-app
   mkdir -p releases shared
   cp .env shared/.env
   cp -a storage shared/storage
   chmod 640 shared/.env
   setfacl -R -m u:www-data:rwX,u:deploy:rwX shared/storage
   setfacl -R -d -m u:www-data:rwX,u:deploy:rwX shared/storage
   ```
4. Run the first deploy (push to `main` or **Run workflow**). It creates `current`.
5. Point nginx at `current/public` and reload it:
   ```nginx
   root /var/www/advertising-app/current/public;
   ```
   Keep `$realpath_root` in `fastcgi_param SCRIPT_FILENAME` so PHP-FPM picks up each new release immediately.
6. Point the cron entry and the Supervisor worker at `/var/www/advertising-app/current/artisan`.

The `deploy` user needs PHP and Composer on its `PATH`. It does not need git or Node.js. For database dumps it needs `mysqldump` (package `mysql-client` or `mariadb-client`).

## One-time GitHub setup (repository **Settings**)

1. **Secrets and variables → Actions → New repository secret**:

   | Secret | Value |
   |---|---|
   | `SSH_HOST` | Server IP. Use the origin IP, not the Cloudflare one. |
   | `SSH_USER` | `deploy` |
   | `SSH_PORT` | Optional, defaults to `22` |
   | `SSH_PRIVATE_KEY` | Private key of a deploy-only key pair (see below) |
   | `SSH_KNOWN_HOSTS` | Output of `ssh-keyscan -p <port> <host>`, so the runner only trusts this server |
   | `DEPLOY_PATH` | `/var/www/advertising-app` |

2. **Environments → New environment** `production-approval` → enable **Required reviewers** and add yourself. Without it, merged pull requests are refused instead of deployed. The `production` environment needs no rules (GitHub creates it on the first deploy).

**Deploy key:** generate it on the server, so the private key never leaves it except into the secret:
```bash
ssh-keygen -t ed25519 -N "" -f /root/github-deploy-key
cat /root/github-deploy-key.pub >> /home/deploy/.ssh/authorized_keys
cat /root/github-deploy-key
```
Paste the whole private key, including the `-----BEGIN`/`-----END` lines, into `SSH_PRIVATE_KEY`, then delete both files.

## Production `.env`

The keys that differ from local development:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://transporteri.rs

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

SESSION_SECURE_COOKIE=true
QUEUE_CONNECTION=database

MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@transporteri.rs

RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
ERROR_MAIL_TO=...
```

After editing `shared/.env`, run `php artisan config:cache` in `current`, or deploy again.
