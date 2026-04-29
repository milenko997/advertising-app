<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        @php $meta = view()->shared('meta', []); @endphp
        <title>{{ $meta['title'] ?? config('app.name') }}</title>
        <meta name="description" content="{{ $meta['description'] ?? 'Srpski marketplace za oglase.' }}" />
        <meta property="og:site_name"   content="{{ config('app.name') }}" />
        <meta property="og:type"        content="{{ $meta['type'] ?? 'website' }}" />
        <meta property="og:title"       content="{{ $meta['title'] ?? config('app.name') }}" />
        <meta property="og:description" content="{{ $meta['description'] ?? 'Srpski marketplace za oglase.' }}" />
        <meta property="og:url"         content="{{ $meta['url'] ?? url()->current() }}" />
        @isset($meta['image'])
        <meta property="og:image"       content="{{ $meta['image'] }}" />
        <meta name="twitter:card"       content="summary_large_image" />
        @else
        <meta name="twitter:card"       content="summary" />
        @endisset
        <meta name="twitter:title"      content="{{ $meta['title'] ?? config('app.name') }}" />
        <meta name="twitter:description" content="{{ $meta['description'] ?? 'Srpski marketplace za oglase.' }}" />
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
