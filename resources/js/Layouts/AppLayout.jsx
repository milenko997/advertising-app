import { usePage } from '@inertiajs/react';
import Navigation from '@/Components/Navigation';

export default function AppLayout({ children, header }) {
    const { flash } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                        {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
                        {flash.error}
                    </div>
                </div>
            )}

            <main>{children}</main>
        </div>
    );
}
