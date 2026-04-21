<?php

namespace App\Console\Commands;

use App\Models\Advertisement;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class UnpinExpiredAds extends Command
{
    protected $signature = 'ads:unpin-expired';
    protected $description = 'Unpin ads whose 30-day pin period has expired';

    public function handle(): void
    {
        $cutoff = now()->subDays(30);

        $global = Advertisement::where('is_pinned', true)
            ->whereNotNull('pinned_at')
            ->where('pinned_at', '<=', $cutoff)
            ->update(['is_pinned' => false, 'pinned_at' => null]);

        $category = Advertisement::where('is_pinned_category', true)
            ->whereNotNull('pinned_category_at')
            ->where('pinned_category_at', '<=', $cutoff)
            ->update(['is_pinned_category' => false, 'pinned_category_at' => null]);

        Cache::forget('nav_categories');

        $this->info("Unpinned: {$global} global, {$category} category.");
    }
}
