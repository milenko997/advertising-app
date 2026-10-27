<?php

namespace Tests\Unit;

use App\Services\ImageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ImageServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    private function storedSize(string $path): array
    {
        return getimagesizefromstring(Storage::disk('public')->get($path));
    }

    public function test_ad_photo_is_stored_as_webp_within_max_dimension(): void
    {
        $path = (new ImageService)->store(UploadedFile::fake()->image('photo.jpg', 4000, 3000));

        $this->assertStringStartsWith('ads/', $path);
        $this->assertStringEndsWith('.webp', $path);

        [$width, $height, $type] = $this->storedSize($path);
        $this->assertSame(IMAGETYPE_WEBP, $type);
        $this->assertSame([1920, 1440], [$width, $height]);
    }

    public function test_tall_portrait_photo_is_limited_by_height(): void
    {
        $path = (new ImageService)->store(UploadedFile::fake()->image('tall.jpg', 1000, 4000));

        [$width, $height] = $this->storedSize($path);
        $this->assertSame([480, 1920], [$width, $height]);
    }

    public function test_avatar_is_scaled_to_avatar_size(): void
    {
        $path = (new ImageService)->store(UploadedFile::fake()->image('me.png', 2000, 2000), 'avatars');

        $this->assertStringStartsWith('avatars/', $path);
        [$width, $height] = $this->storedSize($path);
        $this->assertSame([512, 512], [$width, $height]);
    }

    public function test_small_image_is_not_upscaled(): void
    {
        $path = (new ImageService)->store(UploadedFile::fake()->image('small.png', 300, 200));

        [$width, $height] = $this->storedSize($path);
        $this->assertSame([300, 200], [$width, $height]);
    }
}
