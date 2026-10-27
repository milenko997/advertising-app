<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;

class ImageService
{
    private const MAX_DIMENSION    = 1920; // longest side for ad photos
    private const AVATAR_DIMENSION = 512;  // avatars are only ever shown small
    private const MAX_BYTES        = 1024 * 1024; // 1 MB stored limit
    private const QUALITY          = 80;
    private const MIN_QUALITY      = 40;

    public function store(UploadedFile $file, string $directory = 'ads'): string
    {
        $driver  = extension_loaded('imagick') ? new ImagickDriver() : new GdDriver();
        $image   = (new ImageManager($driver))->decodePath($file->getRealPath());

        // WebP is much smaller than JPEG at the same visual quality; fall back if this PHP build lacks it
        $webp    = $driver->supports(Format::WEBP);
        $encoder = fn (int $quality) => $webp
            ? new WebpEncoder(quality: $quality, strip: true)
            : new JpegEncoder(quality: $quality, strip: true);

        // Scale down so the longest side fits, preserving aspect ratio (covers tall portrait shots too)
        $max = $directory === 'avatars' ? self::AVATAR_DIMENSION : self::MAX_DIMENSION;
        $image->scaleDown(width: $max, height: $max);

        // Strip EXIF (incl. GPS location) and lower quality until it fits
        $quality = self::QUALITY;
        do {
            $encoded = $image->encode($encoder($quality));
            $quality -= 10;
        } while (strlen((string) $encoded) > self::MAX_BYTES && $quality >= self::MIN_QUALITY);

        // If still oversized after reaching minimum quality, halve dimensions and re-encode
        if (strlen((string) $encoded) > self::MAX_BYTES) {
            $image->scale(width: (int) ($image->width() / 2));
            $encoded = $image->encode($encoder(self::MIN_QUALITY));
        }

        $path = $directory . '/' . Str::random(40) . ($webp ? '.webp' : '.jpg');
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
