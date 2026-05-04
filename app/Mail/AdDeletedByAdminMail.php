<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class AdDeletedByAdminMail extends Mailable
{
    public function __construct(
        public string $displayName,
        public string $adTitle,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Vaš oglas je uklonjen — Transporteri');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.ad_deleted_by_admin');
    }
}
