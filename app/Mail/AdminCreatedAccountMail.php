<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class AdminCreatedAccountMail extends Mailable
{
    public function __construct(
        public string $displayName,
        public string $email,
        public string $password,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Vaš nalog je kreiran — Transporteri');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.admin_created_account');
    }
}
