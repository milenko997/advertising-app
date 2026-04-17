<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ProfileUpdatedByAdminNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'profile_updated_by_admin',
            'title'   => 'Profil izmenjen od strane admina',
            'message' => 'Vaš profil je izmenjen od strane administratora.',
            'url'     => '/profil',
        ];
    }
}
