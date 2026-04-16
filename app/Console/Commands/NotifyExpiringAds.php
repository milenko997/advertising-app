<?php

namespace App\Console\Commands;

use App\Models\Advertisement;
use App\Notifications\AdExpiringNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class NotifyExpiringAds extends Command
{
    protected $signature   = 'ads:notify-expiring';
    protected $description = 'Send notifications to users whose ads expire in 7 days';

    public function handle(): void
    {
        $target = Carbon::today()->addDays(7);

        Advertisement::with('user')
            ->whereDate('expires_at', $target)
            ->get()
            ->each(function (Advertisement $ad) {
                if ($ad->user) {
                    $ad->user->notify(new AdExpiringNotification($ad));
                }
            });

        $this->info('Expiring ad notifications sent.');
    }
}
