import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { auth, categories } = usePage().props;
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-3">
                            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </span>
                            <span className="text-base font-bold text-gray-900 tracking-tight">AdBoard</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            The marketplace for transport and freight professionals. Find vehicles, routes, and logistics partners.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Platform</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                    Browse Ads
                                </Link>
                            </li>
                            {auth?.user && !auth.user.isAdmin && (
                                <>
                                    <li>
                                        <Link href="/advertisements/create" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                            Post an Ad
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/my-advertisements" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                            My Ads
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/favorites" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                            Saved Ads
                                        </Link>
                                    </li>
                                </>
                            )}
                            {!auth?.user && (
                                <>
                                    <li>
                                        <Link href="/register" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                            Create Account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/login" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                                            Sign In
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Categories */}
                    {categories?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
                            <ul className="space-y-2.5">
                                {categories.slice(0, 6).map(cat => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/category/${cat.slug}`}
                                            className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Contact / Info */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
                        <ul className="space-y-2.5">
                            <li className="flex items-start gap-2 text-sm text-gray-500">
                                <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:info@adboard.com" className="hover:text-indigo-600 transition-colors">
                                    info@adboard.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-500">
                                <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:+381000000000" className="hover:text-indigo-600 transition-colors">
                                    +381 00 000 0000
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-500">
                                <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Belgrade, Serbia
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © {year} AdBoard. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5">
                        <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms of Use</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
