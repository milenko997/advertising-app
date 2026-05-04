<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Notifications\Notification;

class ReviewDeletedNotification extends Notification
{

    public function __construct(private User $reviewer) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'review_deleted',
            'title'   => 'Recenzija obrisana',
            'message' => "{$this->reviewer->name} je obrisao/la svoju recenziju.",
            'url'     => "/korisnik/{$notifiable->slug}#recenzije",
        ];
    }
}
