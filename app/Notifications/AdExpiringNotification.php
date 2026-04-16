<?php

namespace App\Notifications;

use App\Models\Advertisement;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AdExpiringNotification extends Notification
{
    use Queueable;

    public function __construct(private Advertisement $ad) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'ad_expiring',
            'title'   => 'Oglas ističe za 7 dana',
            'message' => "Vaš oglas \"{$this->ad->title}\" ističe za 7 dana. Obnovite ga da ostane aktivan.",
            'url'     => "/oglas/{$this->ad->slug}",
        ];
    }
}
