<?php

namespace App\Support;

class Vite
{
    public static function tags(array $entries): string
    {
        $hotFile = public_path('hot');

        // Dev mode: Vite dev server is running
        if (file_exists($hotFile)) {
            $url = rtrim(file_get_contents($hotFile));

            // React Refresh preamble — must run before any React module
            $preamble = '<script type="module">' . "\n"
                . '            import RefreshRuntime from "' . $url . '/@react-refresh";' . "\n"
                . '            RefreshRuntime.injectIntoGlobalHook(window);' . "\n"
                . '            window.$RefreshReg$ = () => {};' . "\n"
                . '            window.$RefreshSig$ = () => (type) => type;' . "\n"
                . '            window.__vite_plugin_react_preamble_installed__ = true;' . "\n"
                . '        </script>';

            $tags = [
                $preamble,
                '<script type="module" src="' . $url . '/@vite/client"></script>',
            ];

            foreach ($entries as $entry) {
                if (str_ends_with($entry, '.css')) {
                    $tags[] = '<link rel="stylesheet" href="' . $url . '/' . $entry . '">';
                } else {
                    $tags[] = '<script type="module" src="' . $url . '/' . $entry . '"></script>';
                }
            }

            return implode("\n        ", $tags);
        }

        // Production: read built manifest
        $manifestPath = public_path('build/manifest.json');
        if (!file_exists($manifestPath)) {
            return '<!-- Vite assets not built -->';
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        $tags = [];
        $addedCss = [];

        foreach ($entries as $entry) {
            $chunk = $manifest[$entry] ?? null;
            if (!$chunk) continue;

            foreach ($chunk['css'] ?? [] as $css) {
                if (!in_array($css, $addedCss)) {
                    $tags[] = '<link rel="stylesheet" href="/build/' . $css . '">';
                    $addedCss[] = $css;
                }
            }

            if (str_ends_with($entry, '.css')) {
                $tags[] = '<link rel="stylesheet" href="/build/' . $chunk['file'] . '">';
            } else {
                $tags[] = '<script type="module" src="/build/' . $chunk['file'] . '"></script>';
            }
        }

        return implode("\n        ", $tags);
    }
}
