import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-12">
            <div className="mb-6">
                <Link href="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
                    AdBoard
                </Link>
            </div>
            <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                {children}
            </div>
        </div>
    );
}
