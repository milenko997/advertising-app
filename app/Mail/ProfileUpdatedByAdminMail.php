<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ProfileUpdatedByAdminMail extends Mailable
{
    public function __construct(public string $displayName) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Vaš profil je izmenjen — Transporteri');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.profile_updated_by_admin');
    }
}
