# Backups

## What is backed up

`deploy/backup.sh` runs every night at 03:00 as the `deploy` user. It saves three things:

- the database, dumped with `php artisan backup:dump-database` (`mysqldump` for MySQL, `VACUUM INTO` for SQLite)
- `shared/.env`, which holds `APP_KEY` and the passwords a restore needs
- `shared/storage/app`, which holds all uploaded images

[restic](https://restic.net) uploads them to the Cloudflare R2 bucket `transporteri-backup`. The data is encrypted before it leaves the server. Backups are incremental, so each night only uploads new or changed files.

The script runs one backup at a time, so the nightly run and a manual run never overlap. The database dump is readable only by `deploy` and is deleted once uploaded.

## Retention

- **Nightly snapshots** (tag `nightly`): the last 14 daily, 8 weekly and 12 monthly are kept.
- **Manual snapshots** (tag `manual`): the last 10 are kept.

Data that no snapshot still uses is removed from R2 (`--prune`).

## Manual backup

GitHub → **Actions** → **Backup now** → **Run workflow**. The workflow connects to the server with the deploy secrets, runs the same script and lists the latest snapshots in the run summary.

The database is also copied before every deploy's migrations, to `shared/backups/`. See [deployment.md](deployment.md#what-a-deploy-does).

## Configuration

Settings live in `/home/deploy/.config/transporteri-backup.env`, which is not in git:

```env
RESTIC_REPOSITORY=s3:https://<ACCOUNT_ID>.r2.cloudflarestorage.com/transporteri-backup
RESTIC_PASSWORD_FILE=/home/deploy/.config/restic-password
AWS_ACCESS_KEY_ID=<R2 access key id>
AWS_SECRET_ACCESS_KEY=<R2 secret access key>
AWS_DEFAULT_REGION=auto
# Optional: healthchecks.io ping URL; you get a mail when a nightly backup does not arrive
HEALTHCHECK_URL=
```

**Keep a copy of the restic password (`restic-password`) outside the server, in a password manager.** Without it the backups cannot be decrypted.

Where to find the values in the Cloudflare dashboard:
- **Account ID**: the 32-character code in the dashboard URL, `dash.cloudflare.com/<account id>/...`.
- **Access Key ID** and **Secret Access Key**: R2 → **Manage API tokens** → create an account API token with **Object Read & Write** on the `transporteri-backup` bucket only.

## One-time setup

This has already been done on the production server.

As root, install restic with `apt-get install -y restic`, fill in the three placeholder values below, and run:

```bash
F=/home/deploy/.config/transporteri-backup.env
mkdir -p /home/deploy/.config
echo 'RESTIC_REPOSITORY=s3:https://<ACCOUNT_ID>.r2.cloudflarestorage.com/transporteri-backup' > $F
echo 'RESTIC_PASSWORD_FILE=/home/deploy/.config/restic-password' >> $F
echo 'AWS_ACCESS_KEY_ID=<R2 access key id>' >> $F
echo 'AWS_SECRET_ACCESS_KEY=<R2 secret access key>' >> $F
echo 'AWS_DEFAULT_REGION=auto' >> $F
openssl rand -base64 32 > /home/deploy/.config/restic-password
chown -R deploy:deploy /home/deploy/.config
chmod 600 /home/deploy/.config/*
sudo -u deploy -H bash -c 'set -a; . ~/.config/transporteri-backup.env; set +a; restic init'
```

Then add the cron entry `/etc/cron.d/transporteri-backup`:

```
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
0 3 * * * deploy /bin/bash /var/www/advertising-app/current/deploy/backup.sh >> /home/deploy/backup.log 2>&1
```

## Checking backups

```bash
tail -5 /home/deploy/backup.log
sudo -u deploy -H bash -c 'set -a; . ~/.config/transporteri-backup.env; set +a; restic snapshots'
```

After a successful night, the log ends with `Database dumped to ...` and `restic snapshots` lists a new snapshot from around 03:00.

## Restore

As `deploy`, first load the settings with `set -a; . ~/.config/transporteri-backup.env; set +a`. Then:

```bash
restic snapshots                              # list backups
restic restore latest --target /tmp/restore   # or a snapshot id instead of latest
```

The restored files are at:

- **Database**: `/tmp/restore/home/deploy/backup/database.sql`. For MySQL, import it with `mysql <database> < database.sql`. For SQLite, the file is the database itself.
- **Images**: `/tmp/restore/var/www/advertising-app/shared/storage/app`. Copy them back into `shared/storage/app`.
- **`.env`**: `/tmp/restore/var/www/advertising-app/shared/.env`.
