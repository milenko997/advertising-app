import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                active
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children }) {
    return (
        <Link
            href={href}
            className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
        >
            {children}
        </Link>
    );
}

export default function Navigation() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const logout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Left: Logo + links */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="shrink-0 text-xl font-bold text-indigo-600 tracking-tight">
                            AdBoard
                        </Link>

                        <div className="hidden sm:flex items-center gap-1">
                            <NavLink href="/" active={currentPath === '/'}>Home</NavLink>

                            {user && user.isAdmin && (
                                <>
                                    <NavLink href="/admin/advertisements" active={currentPath.startsWith('/admin/advertisements')}>Advertisements</NavLink>
                                    <NavLink href="/admin/categories" active={currentPath.startsWith('/admin/categories')}>Categories</NavLink>
                                    <NavLink href="/admin/customers" active={currentPath.startsWith('/admin/customers')}>Customers</NavLink>
                                </>
                            )}

                            {user && !user.isAdmin && (
                                <>
                                    <NavLink href="/my-advertisements" active={currentPath === '/my-advertisements'}>My Ads</NavLink>
                                    <NavLink href="/advertisements/create" active={currentPath === '/advertisements/create'}>Post Ad</NavLink>
                                    <NavLink href="/favorites" active={currentPath === '/favorites'}>Saved</NavLink>
                                    <NavLink href="/advertisements/trash" active={currentPath === '/advertisements/trash'}>Trash</NavLink>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: User menu */}
                    <div className="hidden sm:flex items-center">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none transition"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={`/storage/${user.avatar}`}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                    <span>{user.name}</span>
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-20">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <div className="border-t border-gray-100 my-1" />
                                            <button
                                                onClick={logout}
                                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="sm:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        {open ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="sm:hidden border-t border-gray-200 bg-gray-50">
                    <div className="px-4 py-3 space-y-1">
                        <MobileNavLink href="/">Home</MobileNavLink>
                        {user && user.isAdmin && (
                            <>
                                <MobileNavLink href="/admin/advertisements">Advertisements</MobileNavLink>
                                <MobileNavLink href="/admin/categories">Categories</MobileNavLink>
                                <MobileNavLink href="/admin/customers">Customers</MobileNavLink>
                            </>
                        )}
                        {user && !user.isAdmin && (
                            <>
                                <MobileNavLink href="/my-advertisements">My Ads</MobileNavLink>
                                <MobileNavLink href="/advertisements/create">Post Ad</MobileNavLink>
                                <MobileNavLink href="/favorites">Saved</MobileNavLink>
                                <MobileNavLink href="/advertisements/trash">Trash</MobileNavLink>
                            </>
                        )}
                    </div>
                    {user && (
                        <div className="px-4 py-3 border-t border-gray-200">
                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <div className="mt-2 space-y-1">
                                <MobileNavLink href="/profile">My Profile</MobileNavLink>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
