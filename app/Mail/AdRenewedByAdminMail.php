<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class AdRenewedByAdminMail extends Mailable
{
    public function __construct(
        public string $displayName,
        public string $adTitle,
        public string $adSlug,
        public string $expiresAt,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Vaš oglas je obnovljen — Transporteri');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.ad_renewed_by_admin');
    }
}
