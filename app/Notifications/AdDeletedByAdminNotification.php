<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;

class AdDeletedByAdminNotification extends Notification
{

    public function __construct(private string $adTitle) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'ad_deleted_by_admin',
            'title'   => 'Oglas obrisan od strane admina',
            'message' => "Vaš oglas \"{$this->adTitle}\" je obrisan od strane administratora.",
            'url'     => '/moji-oglasi',
        ];
    }
}
