import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4 py-12">
            <div className="mb-6">
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:'18px',height:'18px'}} className="text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </span>
                    <span className="text-xl font-bold text-white tracking-tight">AdBoard</span>
                </Link>
            </div>
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                {children}
            </div>
        </div>
    );
}
