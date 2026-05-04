<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    public function __construct(private string $token) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject('Resetovanje lozinke — Transporteri')
            ->greeting('Poštovani ' . $notifiable->name . ',')
            ->line('Primili smo zahtev za resetovanje lozinke Vašeg naloga.')
            ->action('Resetujte lozinku', $url)
            ->line('Ovaj link će isteći za 60 minuta.')
            ->line('Ukoliko niste Vi zatražili resetovanje lozinke, možete ignorisati ovaj email.')
            ->salutation('Srdačan pozdrav, Tim Transporteri');
    }
}
