<?php
/**
 * Generates all static brand assets:
 *   public/og-default.png       1200×630 Open Graph image
 *   public/apple-touch-icon.png 180×180  iOS home-screen icon
 *   public/favicon-32x32.png    32×32
 *   public/favicon-16x16.png    16×16
 *   public/favicon.ico          multi-size ICO (16+32+48)
 *
 * Run once:  php generate-assets.php
 */

$pub       = __DIR__ . '/public';
$fontBold  = '/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf';
$fontReg   = '/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf';

// Brand palette
$BG     = [17,  24,  39];   // #111827
$ORANGE = [234, 88,  12];   // #ea580c
$WHITE  = [255, 255, 255];
$GRAY   = [107, 114, 128];  // #6b7280
$LGRAY  = [156, 163, 175];  // #9ca3af

/* ── helpers ──────────────────────────────────────────────── */

function alloc($img, array $rgb)
{
    return imagecolorallocate($img, ...$rgb);
}

function allocAlpha($img, array $rgb, int $a)
{
    return imagecolorallocatealpha($img, $rgb[0], $rgb[1], $rgb[2], $a);
}

/**
 * Axis-aligned filled rounded rectangle.
 * GD's filled shapes are not antialiased, so we over-sample at 2× and then
 * scale down for smoother edges on large canvases.
 */
function rrect($img, int $x, int $y, int $w, int $h, int $r, $color): void
{
    // horizontal and vertical bars
    imagefilledrectangle($img, $x + $r, $y,     $x + $w - $r, $y + $h,     $color);
    imagefilledrectangle($img, $x,      $y + $r, $x + $w,     $y + $h - $r, $color);
    // four arc corners
    imagefilledellipse($img, $x + $r,       $y + $r,       $r * 2, $r * 2, $color);
    imagefilledellipse($img, $x + $w - $r,  $y + $r,       $r * 2, $r * 2, $color);
    imagefilledellipse($img, $x + $r,       $y + $h - $r,  $r * 2, $r * 2, $color);
    imagefilledellipse($img, $x + $w - $r,  $y + $h - $r,  $r * 2, $r * 2, $color);
}

/** Center a TTF string horizontally; returns the x for imagettftext. */
function centerX($img, float $size, string $font, string $text, int $canvasW): int
{
    $bb = imagettfbbox($size, 0, $font, $text);
    $w  = $bb[2] - $bb[0];
    return (int)(($canvasW - $w) / 2) - $bb[0];
}

/** Baseline y so the text cap-height is vertically centred in $boxH. */
function centerY(float $size, string $font, string $text, int $boxY, int $boxH): int
{
    $bb = imagettfbbox($size, 0, $font, $text);
    $h  = abs($bb[7] - $bb[1]);    // cap-height approximation
    return (int)($boxY + ($boxH + $h) / 2) - abs($bb[1]);
}

/* ── ICO writer (embeds PNG streams in an ICO container) ───── */
/* Accepts either GdImage objects or file-path strings.         */

function writeIco(array $sizes, string $path): void
{
    $streams = [];
    foreach ($sizes as $img) {
        if (is_string($img)) {
            $streams[] = file_get_contents($img);
        } else {
            ob_start();
            imagepng($img);
            $streams[] = ob_get_clean();
        }
    }

    $count      = count($streams);
    $headerSize = 6 + 16 * $count;
    $offset     = $headerSize;

    $dir  = pack('vvv', 0, 1, $count);
    $data = '';

    foreach ($streams as $i => $png) {
        $len  = strlen($png);
        $item = $sizes[$i];
        if (is_string($item)) {
            [$w, $h] = getimagesize($item);
        } else {
            $w = imagesx($item);
            $h = imagesy($item);
        }
        $dir .= pack('CCCCvvVV',
            $w > 255 ? 0 : $w,
            $h > 255 ? 0 : $h,
            0, 0,        // palette colour count, reserved
            1,           // colour planes
            32,          // bits per pixel
            $len,
            $offset
        );
        $offset += $len;
        $data   .= $png;
    }

    file_put_contents($path, $dir . $data);
}

/* ════════════════════════════════════════════════════════════
   1.  OG IMAGE  1200 × 630
   ════════════════════════════════════════════════════════════ */

$W = 1200; $H = 630;
$og = imagecreatetruecolor($W, $H);
imageantialias($og, true);
imagealphablending($og, true);

$cBg  = alloc($og, $BG);
$cOrg = alloc($og, $ORANGE);
$cWh  = alloc($og, $WHITE);
$cGr  = alloc($og, $GRAY);
$cLGr = alloc($og, $LGRAY);

// Background
imagefilledrectangle($og, 0, 0, $W, $H, $cBg);

// Subtle orange glow behind the icon (layered semi-transparent ellipses)
foreach ([120 => 115, 90 => 108, 60 => 100, 30 => 90] as $alpha => $radius) {
    $glow = allocAlpha($og, $ORANGE, $alpha);
    imagefilledellipse($og, 200, (int)($H / 2), $radius * 2, $radius * 2, $glow);
}

// --- Left logo mark: orange rounded square 160×160 ---
$iconSize = 160;
$iconX    = 200 - (int)($iconSize / 2);   // centered at x=200
$iconY    = (int)(($H - $iconSize) / 2);  // vertically centered
rrect($og, $iconX, $iconY, $iconSize, $iconSize, 28, $cOrg);

// White "T" inside the orange square
$tSize = 96;
$tX    = $iconX + centerX($og, $tSize, $fontBold, 'T', $iconSize);
$tY    = centerY($tSize, $fontBold, 'T', $iconY, $iconSize);
imagettftext($og, $tSize, 0, $tX, $tY, $cWh, $fontBold, 'T');

// Thin vertical separator line
$sepX = 340;
imagefilledrectangle($og, $sepX, 120, $sepX + 1, $H - 120, allocAlpha($og, $WHITE, 110));

// --- Right side text ---
$textAreaX = 380;
$textAreaW = $W - $textAreaX - 60;

// "TRANSPORTERI" wordmark
$titleSize = 78;
$titleText = 'TRANSPORTERI';
$titleBB   = imagettfbbox($titleSize, 0, $fontBold, $titleText);
$titleX    = $textAreaX;
$titleY    = (int)($H / 2) - 30;
imagettftext($og, $titleSize, 0, $titleX, $titleY, $cWh, $fontBold, $titleText);

// Orange underline beneath the title
$underY = $titleY + 14;
imagefilledrectangle($og, $textAreaX, $underY, $textAreaX + 280, $underY + 4, $cOrg);

// Tagline
$tagSize = 26;
$tagText  = 'Oglasnik za transport i logistiku u Srbiji';
$tagX     = $textAreaX;
$tagY     = $titleY + 60;
imagettftext($og, $tagSize, 0, $tagX, $tagY, $cLGr, $fontReg, $tagText);

// URL
$urlSize = 19;
$urlText  = 'transporteri.rs';
$urlX     = $textAreaX;
$urlY     = $H - 52;
imagettftext($og, $urlSize, 0, $urlX, $urlY, $cOrg, $fontBold, $urlText);

// Top + bottom orange strips
imagefilledrectangle($og, 0, 0,      $W, 6,  $cOrg);
imagefilledrectangle($og, 0, $H - 6, $W, $H, $cOrg);

imagepng($og, $pub . '/og-default.png', 9);
imagedestroy($og);
echo "✓ og-default.png\n";

/* ════════════════════════════════════════════════════════════
   2.  FAVICON PNGs + ICO + APPLE TOUCH ICON
       Rendered from favicon.svg via Chrome headless so the
       truck icon is pixel-perfect at every size.
   ════════════════════════════════════════════════════════════ */

// Render the SVG at 512×512 using Chrome headless
$html = <<<HTML
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>*{margin:0;padding:0}html,body{width:512px;height:512px;overflow:hidden;background:transparent}</style>
</head><body>
<svg viewBox="0 0 36 36" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="36" height="36" rx="8" fill="#ea580c"/>
  <g transform="translate(7 7) scale(0.917)">
    <path fill="white" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </g>
</svg>
</body></html>
HTML;

$tmpHtml = sys_get_temp_dir() . '/favicon-render.html';
$tmpPng  = sys_get_temp_dir() . '/favicon-512.png';
file_put_contents($tmpHtml, $html);

exec("google-chrome --headless --no-sandbox --disable-gpu --screenshot={$tmpPng} --window-size=512,512 'file://{$tmpHtml}' 2>/dev/null");

$src = imagecreatefrompng($tmpPng);

function resizeTo($src, int $size, string $out): void {
    $dst = imagecreatetruecolor($size, $size);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $t = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $size, $size, $t);
    imagealphablending($dst, true);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $size, $size, imagesx($src), imagesy($src));
    imagepng($dst, $out, 9);
    imagedestroy($dst);
    echo '✓ ' . basename($out) . " ({$size}×{$size})\n";
}

resizeTo($src, 16,  $pub . '/favicon-16x16.png');
resizeTo($src, 32,  $pub . '/favicon-32x32.png');
resizeTo($src, 48,  $pub . '/favicon-48x48.png');
resizeTo($src, 180, $pub . '/apple-touch-icon.png');
imagedestroy($src);

writeIco([
    $pub . '/favicon-16x16.png',
    $pub . '/favicon-32x32.png',
    $pub . '/favicon-48x48.png',
], $pub . '/favicon.ico');
echo "✓ favicon.ico\n";

unlink($tmpHtml);
unlink($tmpPng);

echo "\nAll assets generated in public/\n";
