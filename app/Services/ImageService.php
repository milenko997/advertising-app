<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;

class ImageService
{
    private const MAX_WIDTH   = 1920;
    private const MAX_BYTES   = 2 * 1024 * 1024; // 2 MB stored limit
    private const MIN_QUALITY = 20;

    public function store(UploadedFile $file, string $directory = 'ads'): string
    {
        $manager = new ImageManager(new Driver());
        $image   = $manager->decodePath($file->getRealPath());

        // Scale down to max width while preserving aspect ratio
        $image->scaleDown(width: self::MAX_WIDTH);

        // Start at 85% quality, reduce until under 2 MB
        $quality = 85;
        do {
            $encoded = $image->encode(new JpegEncoder(quality: $quality));
            $quality -= 10;
        } while (strlen((string) $encoded) > self::MAX_BYTES && $quality >= self::MIN_QUALITY);

        $path = $directory . '/' . Str::random(40) . '.jpg';
        Storage::disk('public')->put($path, (string) $encoded);

        return $path;
    }

    public function delete(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}
