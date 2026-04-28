import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 py-12">
            <div className="mb-6">
                <Link href="/" className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
                        <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" style={{width:'18px',height:'18px'}} className="text-white">
                            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                        </svg>
                    </span>
                    <span className="text-xl font-bold text-white tracking-tight">AdBoard</span>
                </Link>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8">
                {children}
            </div>
        </div>
    );
}
