<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class ReviewUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private User $reviewer, private int $rating) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $stars = str_repeat('★', $this->rating) . str_repeat('☆', 5 - $this->rating);

        return [
            'type'    => 'review_updated',
            'title'   => 'Recenzija izmenjena',
            'message' => "{$this->reviewer->name} je izmenio/la recenziju {$stars}",
            'url'     => "/korisnik/{$notifiable->slug}#reviews",
        ];
    }
}
