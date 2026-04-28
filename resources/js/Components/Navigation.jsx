import { useState, useRef, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { useTheme } from '@/hooks/useTheme';

function NavLink({ href, active, children }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                active
                    ? 'text-white bg-white/10'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
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
            className="block px-3 py-2.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
            {children}
        </Link>
    );
}

const NOTIF_ICONS = {
    ad_expiring:              'clock',
    new_review:               'star',
    review_updated:           'edit',
    review_deleted:           'trash',
    ad_updated_by_admin:      'edit',
    ad_deleted_by_admin:      'trash',
    profile_updated_by_admin: 'user',
};

function NotifIcon({ type }) {
    const icon = NOTIF_ICONS[type] ?? 'bell';
    if (icon === 'clock') return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    if (icon === 'star') return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
    if (icon === 'edit') return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
    if (icon === 'trash') return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
    if (icon === 'user') return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
}

function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Prebaci na svetlu temu' : 'Prebaci na tamnu temu'}
            className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        >
            {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}

export default function Navigation() {
    const { auth, pendingReportsCount, unreadMessagesCount, unreadFeedbackCount, unreadNotificationsCount, recentNotifications, savedAdsCount } = usePage().props;
    const user = auth?.user;
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [bellOpen, setBellOpen] = useState(false);
    const bellRef = useRef(null);
    const [localNotifications, setLocalNotifications] = useState(recentNotifications);
    const [localSavedCount, setLocalSavedCount] = useState(savedAdsCount);

    // Sync dropdown items when Inertia updates shared props (page navigation)
    useEffect(() => { setLocalNotifications(recentNotifications); }, [recentNotifications]);
    useEffect(() => { setLocalSavedCount(savedAdsCount); }, [savedAdsCount]);

    useEffect(() => {
        const handler = (e) => setLocalSavedCount(prev => Math.max(0, prev + e.detail.delta));
        window.addEventListener('saved-ads-changed', handler);
        return () => window.removeEventListener('saved-ads-changed', handler);
    }, []);

    const handleDropdownView = (n) => {
        if (!n.read_at) {
            axios.patch(`/obaveštenja/${n.id}/procitano`);
            setLocalNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read_at: 'now' } : x));
        }
        setBellOpen(false);
        if (n.data.url) router.visit(n.data.url);
    };

    const handleMarkAllRead = () => {
        router.post('/obaveštenja/procitaj-sve', {}, {
            preserveScroll: true,
            only: ['unreadNotificationsCount', 'recentNotifications'],
            onSuccess: () => setLocalNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? 'now' }))),
        });
        setBellOpen(false);
    };

    useEffect(() => {
        const handler = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') {
                setBellOpen(false);
                setDropdownOpen(false);
                setOpen(false);
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const { url: currentPath } = usePage();

    const logout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <nav id="navbar" className="bg-black border-b border-neutral-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Left: Logo + links */}
                    <div id="navbar-left" className="flex items-center gap-8">
                        <Link href="/" className="shrink-0 flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
                                <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" style={{width:'18px',height:'18px'}} className="text-white">
                                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                </svg>
                            </span>
                            <span className="text-lg font-bold text-white tracking-tight">AdBoard</span>
                        </Link>

                        <div id="navbar-links" className="hidden lg:flex items-center gap-0.5">
                            <NavLink href="/" active={currentPath === '/'}>Početna</NavLink>

                            {user && user.isAdmin && (
                                <>
                                    <NavLink href="/admin/statistika" active={currentPath === '/admin/statistika'}>Statistika</NavLink>
                                    <NavLink href="/admin/oglasi" active={currentPath.startsWith('/admin/oglasi')}>Oglasi</NavLink>
                                    <NavLink href="/admin/kategorije" active={currentPath.startsWith('/admin/kategorije')}>Kategorije</NavLink>
                                    <NavLink href="/admin/korisnici" active={currentPath.startsWith('/admin/korisnici')}>Korisnici</NavLink>
                                    <Link
                                        href="/admin/prijave"
                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            currentPath.startsWith('/admin/prijave')
                                                ? 'text-white bg-white/10'
                                                : 'text-neutral-300 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        Prijave
                                        {pendingReportsCount > 0 && (
                                            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                                                {pendingReportsCount > 9 ? '9+' : pendingReportsCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link
                                        href="/admin/poruke"
                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            currentPath.startsWith('/admin/poruke')
                                                ? 'text-white bg-white/10'
                                                : 'text-neutral-300 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        Poruke
                                        {unreadMessagesCount > 0 && (
                                            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                                                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                                            </span>
                                        )}
                                    </Link>
                                    <Link
                                        href="/admin/utisci"
                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            currentPath.startsWith('/admin/utisci')
                                                ? 'text-white bg-white/10'
                                                : 'text-neutral-300 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        Utisci
                                        {unreadFeedbackCount > 0 && (
                                            <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                                                {unreadFeedbackCount > 9 ? '9+' : unreadFeedbackCount}
                                            </span>
                                        )}
                                    </Link>
                                </>
                            )}

                            {user && !user.isAdmin && (
                                <>
                                    <NavLink href="/moji-oglasi" active={currentPath === '/moji-oglasi'}>Moji oglasi</NavLink>
                                    <Link
                                        href="/sacuvani"
                                        className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            currentPath === '/sacuvani'
                                                ? 'text-white bg-white/10'
                                                : 'text-neutral-300 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        Sačuvani
                                        {localSavedCount > 0 && (
                                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[1rem] h-4 px-1 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                                                {localSavedCount}
                                            </span>
                                        )}
                                    </Link>
                                    <NavLink href="/obrisani-oglasi" active={currentPath === '/obrisani-oglasi'}>Obrisani</NavLink>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: User menu */}
                    <div id="navbar-right" className="hidden lg:flex items-center gap-3">
                        {!user?.isAdmin && (
                            <Link
                                href={user ? "/postavi-oglas" : "/login"}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Postavi oglas
                            </Link>
                        )}

                        <ThemeToggle />

                        {/* Bell */}
                        {user && !user.isAdmin && (
                            <div id="navbar-bell" className="relative" ref={bellRef}>
                                <button
                                    onClick={() => setBellOpen(!bellOpen)}
                                    className="relative p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                                    aria-label="Obaveštenja"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadNotificationsCount > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                                        </span>
                                    )}
                                </button>

                                {bellOpen && (
                                    <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1rem)] bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-xl z-30">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-neutral-700">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">Obaveštenja</span>
                                            {unreadNotificationsCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    className="text-xs text-orange-600 hover:text-orange-700"
                                                >
                                                    Označi sve kao pročitano
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-neutral-700">
                                            {localNotifications.length === 0 ? (
                                                <p className="text-sm text-gray-400 dark:text-neutral-500 text-center py-8">Nema obaveštenja</p>
                                            ) : localNotifications.map(n => (
                                                <button
                                                    key={n.id}
                                                    onClick={() => handleDropdownView(n)}
                                                    className={`w-full text-left flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors ${!n.read_at ? 'bg-orange-50/40 dark:bg-orange-900/20' : ''}`}
                                                >
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.read_at ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400'}`}>
                                                        <NotifIcon type={n.data.type} />
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-800 dark:text-neutral-200 leading-tight">{n.data.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{n.data.message}</p>
                                                        <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">{n.created_at}</p>
                                                    </div>
                                                    {!n.read_at && <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-1.5" />}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="px-4 py-3 border-t border-gray-100 dark:border-neutral-700">
                                            <Link
                                                href="/obaveštenja"
                                                onClick={() => setBellOpen(false)}
                                                className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium"
                                            >
                                                Vidi sva obaveštenja
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2.5 text-sm font-medium text-neutral-300 hover:text-white focus:outline-none transition"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={`/storage/${user.avatar}`}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-neutral-700"
                                        />
                                    ) : (
                                        <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                    <span>{user.name}</span>
                                    <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-xl py-1 z-20">
                                            <Link
                                                href="/profil"
                                                className="block px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Moj profil
                                            </Link>
                                            <div className="border-t border-gray-100 dark:border-neutral-700 my-1" />
                                            <button
                                                onClick={logout}
                                                className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                Odjavi se
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                    Prijava
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    Registracija
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile: Postavi oglas button */}
                    {!user?.isAdmin && (
                        <Link
                            href={user ? "/postavi-oglas" : "/login"}
                            className="lg:hidden flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3 py-2.5 rounded-lg transition-colors min-h-[44px]"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Postavi
                        </Link>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label={open ? 'Zatvori meni' : 'Otvori meni'}
                        aria-expanded={open}
                        aria-controls="navbar-mobile-menu"
                        className="lg:hidden p-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition"
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
                <div id="navbar-mobile-menu" className="lg:hidden border-t border-neutral-800 bg-black">
                    <div className="px-4 py-3 space-y-0.5">
                        {!user?.isAdmin && (
                            <MobileNavLink href={user ? "/postavi-oglas" : "/login"}>Postavi oglas</MobileNavLink>
                        )}
                        <MobileNavLink href="/">Oglasi</MobileNavLink>
                        {user && user.isAdmin && (
                            <>
                                <MobileNavLink href="/admin/statistika">Statistika</MobileNavLink>
                                <MobileNavLink href="/admin/oglasi">Oglasi</MobileNavLink>
                                <MobileNavLink href="/admin/kategorije">Kategorije</MobileNavLink>
                                <MobileNavLink href="/admin/korisnici">Korisnici</MobileNavLink>
                                <MobileNavLink href="/admin/prijave">
                                    Prijave {pendingReportsCount > 0 && `(${pendingReportsCount})`}
                                </MobileNavLink>
                                <MobileNavLink href="/admin/poruke">
                                    Poruke {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
                                </MobileNavLink>
                                <MobileNavLink href="/admin/utisci">
                                    Utisci {unreadFeedbackCount > 0 && `(${unreadFeedbackCount})`}
                                </MobileNavLink>
                            </>
                        )}
                        {user && !user.isAdmin && (
                            <>
                                <MobileNavLink href="/moji-oglasi">Moji oglasi</MobileNavLink>
                                <MobileNavLink href="/sacuvani">
                                    Sačuvani {localSavedCount > 0 && `(${localSavedCount})`}
                                </MobileNavLink>
                                <MobileNavLink href="/obrisani-oglasi">Obrisani</MobileNavLink>
                                <MobileNavLink href="/obaveštenja">
                                    Obaveštenja {unreadNotificationsCount > 0 && `(${unreadNotificationsCount})`}
                                </MobileNavLink>
                            </>
                        )}
                        <div className="pt-1">
                            <ThemeToggle />
                        </div>
                    </div>
                    {user ? (
                        <div className="px-4 py-3 border-t border-neutral-800">
                            <div className="flex items-center gap-3 mb-3">
                                {user.avatar ? (
                                    <img src={`/storage/${user.avatar}`} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-neutral-700" />
                                ) : (
                                    <span className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <div>
                                    <p className="text-sm font-semibold text-white">{user.name}</p>
                                    <p className="text-xs text-neutral-400">{user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <MobileNavLink href="/profil">Moj profil</MobileNavLink>
                                <button
                                    onClick={logout}
                                    className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/5 rounded-md transition-colors"
                                >
                                    Odjavi se
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 py-3 border-t border-neutral-800 flex gap-3">
                            <Link href="/login" className="flex-1 text-center py-2 text-sm font-medium text-neutral-300 border border-neutral-700 rounded-lg hover:bg-white/5 transition-colors">
                                Prijava
                            </Link>
                            <Link href="/register" className="flex-1 text-center py-2 text-sm font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                                Registracija
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
