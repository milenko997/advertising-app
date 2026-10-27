# Security

## reCAPTCHA v3

Registration, login and the contact form send a reCAPTCHA v3 token. The `RecaptchaToken` validation rule checks it with Google, including that the token was issued for that form's action. Set `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` to enable it. With both empty (local development, tests), the check is skipped.

## Rate limits

Defined in `App\Providers\AppServiceProvider`:

| Limiter | Limit | Keyed by |
|---|---|---|
| `ad-creation` | 5 per hour | user |
| `login` | 10 per minute | IP |
| `password-reset` | 5 per minute | IP (reset link and confirm password) |
| `contact` | 5 per hour | IP |
| `feedback` | 10 per hour | IP |
| `report` | 5 per hour | user, or IP for guests |
| `review` | 10 per minute | user |

## Content Security Policy

`App\Http\Middleware\ContentSecurityPolicy` sends a CSP header on every page:

- Scripts must carry a per-request nonce; Vite gets it through `Vite::useCspNonce`.
- Google domains are allowed only as far as reCAPTCHA needs them.

When you add a third-party script, extend the policy there.

## Passwords and accounts

- Login and password reset never reveal whether an email is registered. At login, an unknown email is still checked against a dummy password hash, so the response time doesn't give it away either.
- Changing the email or password requires the current password, and so does deleting the account.
- Admins never handle user passwords. New accounts get a set-password link instead.

## Sessions and cookies

- `SESSION_SECURE_COOKIE=true` in production.
- `SameSite` defaults to `lax` (`SESSION_SAME_SITE`).
- The app only uses Laravel's session guard. There are no API tokens.

## Uploads

Every upload passes through `ImageService`, which:
- checks type, size and dimensions;
- re-encodes the image, so nothing from the original file is served directly;
- strips EXIF data.

See [advertisements.md](advertisements.md#images) for the limits.
