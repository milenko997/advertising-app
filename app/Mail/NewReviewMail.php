<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class NewReviewMail extends Mailable
{
    public function __construct(
        public string $displayName,
        public string $reviewerName,
        public int $rating,
        public string $userSlug,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Nova recenzija — Transporteri');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.new_review');
    }
}
