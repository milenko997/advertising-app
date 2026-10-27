# Users and accounts

## Roles

`App\Enums\UserRole` has three roles:

| Role | Can |
|---|---|
| `customer` | post and manage own ads, save favorites, write reviews, report ads |
| `admin` | everything in the [admin panel](admin.md), but cannot post ads; can manage customers, not other admins |
| `super_admin` | like admin, plus create, edit and promote admins; cannot be edited or deleted from the panel |

The role is not mass assignable: code that sets it uses `forceCreate` or sets the attribute directly.

## Registration and login

- Registration (`/registracija`) and login (`/prijava`) are protected by reCAPTCHA v3 when keys are configured; see [security.md](security.md).
- Accounts are either **individual** or **company**. A company account also has a company profile (company name, city, website) shown on the public profile.
- Login is limited to 10 attempts per minute per IP. A wrong email and a wrong password give the same message, so the form doesn't reveal which emails are registered.
- Forgotten password: `/zaboravljena-lozinka` sends a reset link (5 requests per minute per IP). The response is the same whether the email exists or not.
- Accounts created by an admin get an email with a link to set their own password; the admin never sees or sends a password.

## Profile

At `/profil` users change their name, phone, avatar and company details. Changing the **email** or the **password** requires the current password. A password change triggers a confirmation email.

Each user also has a public profile (`/korisnik/{slug}`) with their active ads and reviews.

## Reviews

Logged-in users can leave one review (1–5 stars and an optional comment) per user they review; a second attempt is refused, also when two requests race. They can edit and delete their own reviews. The reviewed user is notified by email and in the app. Review actions are limited to 10 per minute.

## Notifications

In-app notifications are listed at `/obavestenja` and in the bell menu. They are sent when:

- an ad expires in 7 days
- an admin edits, renews or deletes the user's ad
- an admin edits the user's profile
- someone writes, edits or deletes a review of the user

Most of these also send an email. Emails go through the queue (`QUEUE_CONNECTION=database` in production), so a slow mail server never slows down the page.

## Deleting an account

Users delete their account at `/profil` after confirming their password. The account is disabled immediately; `DeleteUserDataJob` then removes their ads, images and avatar in the background and sends a goodbye email. Admin deletions from the panel work the same way.
