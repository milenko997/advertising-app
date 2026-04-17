<?php

namespace App\Notifications;

use App\Models\Advertisement;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class AdUpdatedByAdminNotification extends Notification implements ShouldQueue
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
            'type'    => 'ad_updated_by_admin',
            'title'   => 'Oglas izmenjen od strane admina',
            'message' => "Vaš oglas \"{$this->ad->title}\" je izmenjen od strane administratora.",
            'url'     => "/oglas/{$this->ad->slug}",
        ];
    }
}
