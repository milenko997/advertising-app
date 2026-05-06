<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @php $meta = view()->shared('meta', []); @endphp
        <title>{{ $meta['title'] ?? config('app.name') }}</title>
        <meta name="description" content="{{ $meta['description'] ?? 'Transporteri je srpski marketplace za oglase o kamionima, kombijima, prikolicama i logističkim uslugama. Pronađite pouzdane prevoznike ili postavite oglas besplatno.' }}" />
        <meta property="og:site_name"   content="{{ config('app.name') }}" />
        <meta property="og:type"        content="{{ $meta['type'] ?? 'website' }}" />
        <meta property="og:title"       content="{{ $meta['title'] ?? config('app.name') }}" />
        <meta property="og:description" content="{{ $meta['description'] ?? 'Transporteri je srpski marketplace za oglase o kamionima, kombijima, prikolicama i logističkim uslugama. Pronađite pouzdane prevoznike ili postavite oglas besplatno.' }}" />
        <meta property="og:url"         content="{{ $meta['url'] ?? url()->current() }}" />
        <link rel="canonical"           href="{{ $meta['url'] ?? url()->current() }}" />
        @isset($meta['image'])
        <meta property="og:image"       content="{{ $meta['image'] }}" />
        <meta name="twitter:card"       content="summary_large_image" />
        @else
        <meta name="twitter:card"       content="summary" />
        @endisset
        <meta name="twitter:title"      content="{{ $meta['title'] ?? config('app.name') }}" />
        <meta name="twitter:description" content="{{ $meta['description'] ?? 'Transporteri je srpski marketplace za oglase o kamionima, kombijima, prikolicama i logističkim uslugama. Pronađite pouzdane prevoznike ili postavite oglas besplatno.' }}" />
        {{-- Favicons --}}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        @inertiaHead
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
        <script @isset($cspNonce) nonce="{{ $cspNonce }}" @endisset>
            (function(){
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            })();
        </script>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
