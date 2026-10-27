#!/usr/bin/env bash
# Nightly encrypted backup of the database, uploaded files and .env to Cloudflare R2 (restic).
# Runs from /etc/cron.d/transporteri-backup as the deploy user. Keys and the repository live in
# ~/.config/transporteri-backup.env, outside git. See README, "7. Backups".
set -euo pipefail

APP=${APP:-/var/www/advertising-app}
set -a
. "${BACKUP_CONFIG:-$HOME/.config/transporteri-backup.env}"
set +a

# Fixed path, so every snapshot stores the dump at the same place and restores are predictable
dump_dir="$HOME/backup"
mkdir -p "$dump_dir"
trap 'rm -f "$dump_dir/database.sql"' EXIT

php "$APP/current/artisan" backup:dump-database "$dump_dir/database.sql"

restic backup --quiet --tag nightly \
    "$dump_dir/database.sql" \
    "$APP/shared/.env" \
    "$APP/shared/storage/app"

restic forget --quiet --tag nightly --prune \
    --keep-daily 14 --keep-weekly 8 --keep-monthly 12

# Optional dead man's switch: healthchecks.io mails you when this ping stops arriving
if [ -n "${HEALTHCHECK_URL:-}" ]; then
    curl -fsS -m 10 --retry 3 -o /dev/null "$HEALTHCHECK_URL" || true
fi
