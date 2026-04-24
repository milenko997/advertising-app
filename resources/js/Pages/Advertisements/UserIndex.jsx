import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

const AVAILABILITY_LABEL = { available: 'Dostupno', on_request: 'Na upit' };

export default function UserIndex({ ads: initialAds }) {
    const [adList, setAdList] = useState(initialAds.data);
    const [currentPage, setCurrentPage] = useState(initialAds.current_page);
    const [hasMore, setHasMore] = useState(initialAds.current_page < initialAds.last_page);
    const [loading, setLoading] = useState(false);

    const handleDelete = (id) => {
        if (!confirm('Premesti oglas u otpad?')) return;
        router.delete(`/oglasi/${id}`, {
            onSuccess: () => setAdList(prev => prev.filter(a => a.id !== id)),
        });
    };

    const handleRenew = (id) => {
        router.patch(`/oglasi/${id}/obnovi`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setAdList(prev => prev.map(a => a.id === id ? { ...a, is_expired: false } : a));
            },
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/moji-oglasi?page=${nextPage}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head><title>Moji oglasi — AdBoard</title></Head>
            <div id="page-my-ads" className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Moji oglasi</h1>
                            <p className="text-sm text-gray-500 mt-0.5">{initialAds.total} oglas{initialAds.total === 1 ? '' : initialAds.total >= 2 && initialAds.total <= 4 ? 'a' : 'a'}</p>
                        </div>
                        <Link
                            href="/postavi-oglas"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Postavi oglas
                        </Link>
                    </div>

                    {adList.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                            <svg className="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 mb-4">Još nemate oglasa.</p>
                            <Link
                                href="/postavi-oglas"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition"
                            >
                                Postavi prvi oglas
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div id="section-my-ads-list" className="space-y-3">
                                {adList.map(ad => (
                                    <div key={ad.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-200 hover:shadow-sm transition-all">
                                        {/* Top row: thumbnail + info */}
                                        <div className="flex gap-3">
                                            {ad.image ? (
                                                <img
                                                    src={`/storage/${ad.image}`}
                                                    alt={ad.title}
                                                    className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg shrink-0"
                                                />
                                            ) : (
                                                <div className="w-20 h-16 sm:w-24 sm:h-20 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/oglas/${ad.slug}`}
                                                    className="font-semibold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1 text-sm sm:text-base"
                                                >
                                                    {ad.title}
                                                </Link>
                                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ad.description}</p>
                                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                    {ad.availability && (
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                                                            ad.availability === 'available'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                            {AVAILABILITY_LABEL[ad.availability] || ad.availability}
                                                        </span>
                                                    )}
                                                    {ad.price && <span className="text-xs font-semibold text-orange-600">{ad.price}</span>}
                                                    {ad.is_expired ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-red-100 text-red-600">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Isteklo
                                                        </span>
                                                    ) : ad.expires_at && (
                                                        <span className="text-xs text-gray-400">Ističe {ad.expires_at}</span>
                                                    )}
                                                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        {ad.views ?? 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom row: actions */}
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                            {ad.is_expired && (
                                                <button
                                                    onClick={() => handleRenew(ad.id)}
                                                    className="px-3 py-1.5 border border-emerald-300 rounded-lg text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition"
                                                >
                                                    Obnovi
                                                </button>
                                            )}
                                            <Link
                                                href={`/oglasi/uredi/${ad.slug}`}
                                                className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                Izmeni
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(ad.id)}
                                                className="px-3 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition"
                                            >
                                                Obriši
                                            </button>
                                            <span className="ml-auto text-xs text-gray-400">{ad.created_at}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition disabled:opacity-50"
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
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
