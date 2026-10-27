# Monitoring

## Error mails

Set `ERROR_MAIL_TO` in `shared/.env`, and every unexpected error (one that would show a 500 page or fail a queued job) is mailed there right away. Each mail contains:

- the error and the file and line where it happened
- the URL, or the console command
- the user id, when someone is logged in
- the time and the stack trace

How it works:

- **Once an hour per error.** The same error, from the same place in the code, is mailed at most once an hour. A broken page that every visitor hits sends one mail, not thousands.
- **Sent right away, not queued.** The mail is not queued, because the queue itself might be what is broken. It needs working `MAIL_*` settings.
- **Never hides the original error.** If the mail fails, for example because the database or the mail server is down, the original error is still written to `storage/logs/laravel.log`.
- **Normal errors don't count.** Expected errors, such as 404, validation errors, or 403 for missing permissions, are not reported.

The code is in `App\Exceptions\ErrorMailer`, registered in `bootstrap/app.php`. If `ERROR_MAIL_TO` is empty, no mails are sent.

## Uptime

`/up` is Laravel's health route. It returns 200 only when the application boots.

To be alerted when the site is down, point an external monitor at `https://transporteri.rs/up`, for example a free UptimeRobot HTTP(s) monitor with a 5-minute interval.

## Backups and deploys

- **Nightly backups.** Set `HEALTHCHECK_URL` in the backup settings, and healthchecks.io mails you when a night's backup doesn't arrive. See [backups.md](backups.md#configuration).
- **Deploys and manual backups.** Both run in GitHub Actions. GitHub emails you when a run fails.

## Logs

- **Application:** `/var/www/advertising-app/shared/storage/logs/laravel.log`
- **Nightly backup:** `/home/deploy/backup.log`
- **Web server:** `/var/log/nginx/`
