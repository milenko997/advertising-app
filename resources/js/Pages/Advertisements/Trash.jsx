import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

export default function Trash({ ads: initialAds }) {
    const [adList, setAdList] = useState(initialAds.data);
    const [currentPage, setCurrentPage] = useState(initialAds.current_page);
    const [hasMore, setHasMore] = useState(initialAds.current_page < initialAds.last_page);
    const [loading, setLoading] = useState(false);

    const restore = (id) => {
        router.patch(`/oglasi/${id}/vrati`, {}, {
            onSuccess: () => setAdList(prev => prev.filter(a => a.id !== id)),
        });
    };

    const forceDelete = (id) => {
        if (!confirm('Ovo se ne može poništiti. Da li ste sigurni?')) return;
        router.delete(`/oglasi/trajno-brisi/${id}`, {
            onSuccess: () => setAdList(prev => prev.filter(a => a.id !== id)),
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/obrisani-oglasi?page=${nextPage}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div id="page-trash" className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Obrisani oglasi</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Obrisani oglasi se trajno uklanjaju nakon 30 dana.</p>
                    </div>
                    {adList.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <p className="text-gray-500">Otpad je prazan.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {adList.map(ad => (
                                    <div key={ad.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 opacity-75">
                                        {ad.image ? (
                                            <img
                                                src={`/storage/${ad.image}`}
                                                alt={ad.title}
                                                className="w-24 h-20 object-cover rounded-lg shrink-0 grayscale"
                                            />
                                        ) : (
                                            <div className="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-700">{ad.title}</p>
                                                    <p className="text-sm text-gray-400 mt-0.5 truncate">{ad.description}</p>
                                                    <p className="text-xs text-red-500 mt-2">Obrisano: {ad.deleted_at}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => restore(ad.id)}
                                                        className="px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                    >
                                                        Vrati
                                                    </button>
                                                    <button
                                                        onClick={() => forceDelete(ad.id)}
                                                        className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                    >
                                                        Trajno obriši
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-6 text-center">
                                    <button
                                        onClick={loadMore}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-indigo-300 transition disabled:opacity-50"
                                    >
                                        {loading && (
                                            <svg className="w-4 h-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
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
