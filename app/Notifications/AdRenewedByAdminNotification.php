<?php

namespace App\Notifications;

use App\Models\Advertisement;
use Illuminate\Notifications\Notification;

class AdRenewedByAdminNotification extends Notification
{

    public function __construct(private Advertisement $ad) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'ad_renewed_by_admin',
            'title'   => 'Oglas obnovljen od strane admina',
            'message' => "Vaš oglas \"{$this->ad->title}\" je obnovljen i aktivan je do {$this->ad->expires_at->format('d.m.Y')}.",
            'url'     => "/oglas/{$this->ad->slug}",
        ];
    }
}
