<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ReviewDeletedMail extends Mailable
{
    public function __construct(
        public string $displayName,
        public string $reviewerName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Recenzija obrisana — Transporteri');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.review_deleted');
    }
}
