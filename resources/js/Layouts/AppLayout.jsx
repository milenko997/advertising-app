import { usePage } from '@inertiajs/react';
import Navigation from '@/Components/Navigation';

export default function AppLayout({ children }) {
    const { flash } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {flash.error}
                    </div>
                </div>
            )}

            <main>{children}</main>
        </div>
    );
}
