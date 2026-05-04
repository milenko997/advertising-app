<?php

namespace App\Console\Commands;

use App\Mail\AdExpiringMail;
use App\Models\Advertisement;
use App\Notifications\AdExpiringNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class NotifyExpiringAds extends Command
{
    protected $signature   = 'ads:notify-expiring';
    protected $description = 'Send notifications to users whose ads expire in 7 days';

    public function handle(): void
    {
        $target = Carbon::today()->addDays(7);

        Advertisement::with('user')
            ->whereDate('expires_at', $target)
            ->chunkById(100, function ($ads) {
                foreach ($ads as $ad) {
                    if (!$ad->user) continue;

                    $ad->user->notify(new AdExpiringNotification($ad));

                    try {
                        Mail::to($ad->user->email)->send(new AdExpiringMail(
                            $ad->user->name,
                            $ad->title,
                            $ad->slug,
                            $ad->expires_at->format('d.m.Y'),
                        ));
                    } catch (\Exception) {}
                }
            });

        $this->info('Expiring ad notifications sent.');
    }
}
