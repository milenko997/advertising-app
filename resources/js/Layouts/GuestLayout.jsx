import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
            <div className="mb-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </span>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">AdBoard</span>
                </Link>
            </div>
            <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                {children}
            </div>
        </div>
    );
}
