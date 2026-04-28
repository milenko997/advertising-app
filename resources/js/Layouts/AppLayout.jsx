import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Navigation from '@/Components/Navigation';
import Footer from '@/Components/Footer';
import FeedbackButton from '@/Components/FeedbackButton';
import StarField from '@/Components/StarField';

export default function AppLayout({ children, header }) {
    const { flash } = usePage().props;
    const [successDismissed, setSuccessDismissed] = useState(false);
    const [errorDismissed, setErrorDismissed]     = useState(false);

    return (
        <div id="app" className="relative min-h-screen bg-zinc-50 dark:bg-neutral-900">
            <StarField />
            <div className="relative z-10 flex flex-col min-h-screen">
            <Navigation />

            {flash?.success && !successDismissed && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div id="flash-success" role="alert" className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="flex-1">{flash.success}</span>
                        <button onClick={() => setSuccessDismissed(true)} aria-label="Zatvori" className="ml-auto text-emerald-500 hover:text-emerald-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            {flash?.error && !errorDismissed && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div id="flash-error" role="alert" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1">{flash.error}</span>
                        <button onClick={() => setErrorDismissed(true)} aria-label="Zatvori" className="ml-auto text-red-500 hover:text-red-700 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {header && (
                <header className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        {header}
                    </div>
                </header>
            )}

            <main id="main-content">{children}</main>
            <Footer />
            <FeedbackButton />
            </div>
        </div>
    );
}
