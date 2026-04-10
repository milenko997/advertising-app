import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

// inertiajs/inertia-laravel v1 renders <div id="app" data-page="...">,
// but @inertiajs/react v3 expects <script type="application/json" data-page="app">.
// Read the page data manually from the div and pass it via the `page` option.
const appEl = document.getElementById('app');
const initialPage = appEl ? JSON.parse(appEl.dataset.page) : null;

createInertiaApp({
    page: initialPage,
    title: (title) => title ? `${title} - AdBoard` : 'AdBoard',
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el ?? appEl).render(<App {...props} />);
    },
    progress: {
        color: '#6366f1',
    },
});
