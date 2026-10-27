#!/usr/bin/env bash
# Nightly encrypted backup of the database, uploaded files and .env to Cloudflare R2 (restic).
# Runs from /etc/cron.d/transporteri-backup as the deploy user. Keys and the repository live in
# ~/.config/transporteri-backup.env, outside git. See README, "7. Backups".
set -euo pipefail

APP=${APP:-/var/www/advertising-app}
set -a
. "${BACKUP_CONFIG:-$HOME/.config/transporteri-backup.env}"
set +a

# The dump and restic cache hold the whole database: keep them private to this user
umask 077
# Fixed path, so every snapshot stores the dump at the same place and restores are predictable
dump_dir="$HOME/backup"
mkdir -p "$dump_dir"
# Cron and the "Backup now" workflow share the dump path and the repository: one run at a time
exec 9>"$dump_dir/.lock"
flock 9
trap 'rm -f "$dump_dir/database.sql"' EXIT

php "$APP/current/artisan" backup:dump-database "$dump_dir/database.sql"

# "manual" for the Backup now workflow, so manual runs don't take the place of nightly snapshots
tag=${BACKUP_TAG:-nightly}

restic backup --quiet --tag "$tag" \
    "$dump_dir/database.sql" \
    "$APP/shared/.env" \
    "$APP/shared/storage/app"

restic forget --quiet --tag nightly --keep-daily 14 --keep-weekly 8 --keep-monthly 12
restic forget --quiet --tag manual --keep-last 10 --prune

# Optional dead man's switch: healthchecks.io mails you when the nightly ping stops arriving
if [ -n "${HEALTHCHECK_URL:-}" ] && [ "$tag" = nightly ]; then
    curl -fsS -m 10 --retry 3 -o /dev/null "$HEALTHCHECK_URL" || true
fi
