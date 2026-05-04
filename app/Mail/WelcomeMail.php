<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class WelcomeMail extends Mailable
{
    public function __construct(public string $displayName) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Dobrodošli na Transporteri!');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.welcome');
    }
}
