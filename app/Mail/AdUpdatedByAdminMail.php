<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class AdUpdatedByAdminMail extends Mailable
{
    public function __construct(
        public string $displayName,
        public string $adTitle,
        public string $adSlug,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Vaš oglas je izmenjen — Transporteri');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.ad_updated_by_admin');
    }
}
