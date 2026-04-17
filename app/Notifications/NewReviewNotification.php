<?php

namespace App\Notifications;

use App\Models\Review;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewReviewNotification extends Notification implements ShouldQueue
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
            'type'    => 'new_review',
            'title'   => 'Nova recenzija',
            'message' => "{$this->reviewer->name} je ostavio/la recenziju {$stars}",
            'url'     => "/korisnik/{$notifiable->slug}#reviews",
        ];
    }
}
