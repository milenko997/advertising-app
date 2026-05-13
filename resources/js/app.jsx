import './bootstrap';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';

router.on('navigate', () => {
    if (window.gtag && window.gaId) {
        window.gtag('config', window.gaId, { page_path: window.location.pathname });
    }
});

createInertiaApp({
    title: (title) => title ? `${title} — Transporteri` : 'Transporteri',
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#6366f1',
    },
});
