<?php

namespace App\Jobs;

use App\Mail\AccountDeletedMail;
use App\Models\Advertisement;
use App\Models\AdvertisementImage;
use App\Models\Favorite;
use App\Models\User;
use App\Services\ImageService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class DeleteUserDataJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private int $userId,
        private string $name,
        private string $email,
        private ?string $avatar,
    ) {}

    public function handle(ImageService $imageService): void
    {
        $adIds = Advertisement::withTrashed()->where('user_id', $this->userId)->pluck('id');

        if ($adIds->isNotEmpty()) {
            $mainImages    = Advertisement::withTrashed()->whereIn('id', $adIds)->pluck('image')->filter();
            $galleryImages = AdvertisementImage::whereIn('advertisement_id', $adIds)->pluck('path')->filter();

            $favUserIds = Favorite::whereIn('advertisement_id', $adIds)->pluck('user_id')->unique();
            Favorite::whereIn('advertisement_id', $adIds)->delete();
            foreach ($favUserIds as $uid) {
                Cache::forget('favorite_ids_' . $uid);
                Cache::forget('saved_ads_count_' . $uid);
            }

            AdvertisementImage::whereIn('advertisement_id', $adIds)->delete();

            foreach ($galleryImages as $path) {
                $imageService->delete($path);
            }
            foreach ($mainImages as $path) {
                $imageService->delete($path);
            }

            Advertisement::withTrashed()->whereIn('id', $adIds)->forceDelete();
        }

        $imageService->delete($this->avatar);

        User::withTrashed()->where('id', $this->userId)->forceDelete();

        try {
            Mail::to($this->email)->queue(new AccountDeletedMail($this->name));
        } catch (\Exception) {}
    }
}
