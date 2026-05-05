import { Link } from '@inertiajs/react';
import StarField from '@/Components/StarField';
import Logo from '@/Components/Logo';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-zinc-100 dark:bg-black px-4 py-12">
            <StarField />
            <div className="relative z-10 mb-6">
                <Link href="/" className="text-gray-900 dark:text-white inline-block">
                    <Logo height={36} />
                </Link>
            </div>
            <div className="relative z-10 w-full max-w-md bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8">
                {children}
            </div>
        </div>
    );
}
