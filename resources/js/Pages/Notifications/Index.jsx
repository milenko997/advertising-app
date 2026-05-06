import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

const TYPE_CONFIG = {
    ad_expiring:              { icon: 'clock',   color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20' },
    new_review:               { icon: 'star',    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    review_updated:           { icon: 'edit',    color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    review_deleted:           { icon: 'trash',   color: 'text-gray-500',   bg: 'bg-gray-50 dark:bg-neutral-700' },
    ad_updated_by_admin:      { icon: 'edit',    color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
    ad_deleted_by_admin:      { icon: 'trash',   color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20' },
    profile_updated_by_admin: { icon: 'user',    color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
};

function NotificationIcon({ type }) {
    const cfg = TYPE_CONFIG[type] ?? { icon: 'bell', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-neutral-700' };
    return (
        <span className={`w-10 h-10 rounded-full ${cfg.bg} ${cfg.color} flex items-center justify-center shrink-0`}>
            {cfg.icon === 'clock' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            {cfg.icon === 'star' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            )}
            {cfg.icon === 'edit' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            )}
            {cfg.icon === 'trash' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
            {cfg.icon === 'user' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )}
            {cfg.icon === 'bell' && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            )}
        </span>
    );
}

export default function NotificationsIndex({ notifications: initialData }) {
    const [list, setList] = useState(initialData.data);
    const [currentPage, setCurrentPage] = useState(initialData.current_page);
    const [hasMore, setHasMore] = useState(initialData.current_page < initialData.last_page);
    const [loading, setLoading] = useState(false);

    const markRead = (id) => {
        router.patch(`/obavestenja/${id}/procitano`, {}, {
            preserveScroll: true,
            only: ['unreadNotificationsCount', 'recentNotifications'],
            onSuccess: () => setList(prev => prev.map(n => n.id === id ? { ...n, read_at: 'now' } : n)),
        });
    };

    const handleView = (id, url) => {
        const n = list.find(n => n.id === id);
        if (n && !n.read_at) {
            axios.patch(`/obavestenja/${id}/procitano`);
            setList(prev => prev.map(n => n.id === id ? { ...n, read_at: 'now' } : n));
        }
        router.visit(url);
    };

    const markAllRead = () => {
        router.post('/obavestenja/procitaj-sve', {}, {
            preserveScroll: true,
            onSuccess: () => setList(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? 'now' }))),
        });
    };

    const destroy = (id) => {
        router.delete(`/obavestenja/${id}`, {
            preserveScroll: true,
            onSuccess: () => setList(prev => prev.filter(n => n.id !== id)),
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/obavestenja?page=${nextPage}`);
            setList(prev => [...prev, ...data.notifications]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    const unreadCount = list.filter(n => !n.read_at).length;

    return (
        <AppLayout>
            <Head title="Obaveštenja"><meta name="robots" content="noindex, nofollow" /></Head>
            <div id="page-notifications" className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Obaveštenja</h1>
                            {unreadCount > 0 && (
                                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">{unreadCount} nepročitano</p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                            >
                                Označi sve kao pročitano
                            </button>
                        )}
                    </div>

                    {list.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                            <svg className="w-14 h-14 text-gray-200 dark:text-neutral-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <p className="text-gray-400 dark:text-neutral-500">Nema obaveštenja.</p>
                        </div>
                    ) : (
                        <div id="section-notification-list" className="space-y-2">
                            {list.map(n => (
                                <div
                                    key={n.id}
                                    className={`flex gap-4 bg-white dark:bg-neutral-800 border rounded-xl p-4 transition-all ${
                                        !n.read_at
                                            ? 'border-orange-200 dark:border-orange-800 shadow-sm'
                                            : 'border-gray-100 dark:border-neutral-700'
                                    }`}
                                >
                                    <NotificationIcon type={n.data.type} />

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={`text-sm font-semibold ${!n.read_at ? 'text-gray-900 dark:text-neutral-100' : 'text-gray-600 dark:text-neutral-400'}`}>
                                                    {n.data.title}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">{n.data.message}</p>
                                            </div>
                                            {!n.read_at && (
                                                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-gray-400 dark:text-neutral-500">{n.created_at}</span>
                                            {n.data.url && (
                                                <button
                                                    onClick={() => handleView(n.id, n.data.url)}
                                                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                                                >
                                                    Pogledaj →
                                                </button>
                                            )}
                                            {!n.read_at && (
                                                <button
                                                    onClick={() => markRead(n.id)}
                                                    className="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    Označi kao pročitano
                                                </button>
                                            )}
                                            <button
                                                onClick={() => destroy(n.id)}
                                                aria-label="Obriši obaveštenje"
                                                className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-600 ml-auto"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Obriši
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-orange-300 transition disabled:opacity-50"
                            >
                                {loading && (
                                    <svg className="w-4 h-4 animate-spin text-orange-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                                {loading ? 'Učitavanje…' : 'Učitaj još'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
