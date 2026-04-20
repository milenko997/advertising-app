import { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

export default function AdminAdvertisementsIndex({ ads: initialAds, search: initialSearch = '' }) {
    const [adList, setAdList] = useState(initialAds.data);
    const [currentPage, setCurrentPage] = useState(initialAds.current_page);
    const [hasMore, setHasMore] = useState(initialAds.current_page < initialAds.last_page);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(new Set());
    const [search, setSearch] = useState(initialSearch);
    const debounceRef = useRef(null);

    useEffect(() => {
        setAdList(initialAds.data);
        setCurrentPage(initialAds.current_page);
        setHasMore(initialAds.current_page < initialAds.last_page);
        setSelected(new Set());
    }, [initialAds]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get('/admin/oglasi', { search: value }, { preserveState: true, replace: true });
        }, 400);
    };

    const allSelected = adList.length > 0 && selected.size === adList.length;
    const someSelected = selected.size > 0;

    const toggleAll = () => {
        if (allSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(adList.map(a => a.id)));
        }
    };

    const toggleOne = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const destroy = (id) => {
        if (!confirm('Da li ste sigurni?')) return;
        router.delete(`/admin/oglasi/${id}`, {
            onSuccess: () => {
                setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
                setAdList(prev => prev.filter(a => a.id !== id));
            },
        });
    };

    const togglePin = (id) => {
        router.patch(`/admin/oglasi/${id}/pin`, {}, {
            preserveScroll: true,
            only: ['flash'],
            onSuccess: () => {
                const d = new Date(); const today = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
                setAdList(prev => prev.map(a => a.id === id ? { ...a, is_pinned: !a.is_pinned, pinned_at: !a.is_pinned ? today : null } : a));
            },
        });
    };

    const togglePinCategory = (id) => {
        router.patch(`/admin/oglasi/${id}/pin-category`, {}, {
            preserveScroll: true,
            only: ['flash'],
            onSuccess: () => {
                const d = new Date(); const today = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
                setAdList(prev => prev.map(a => a.id === id ? { ...a, is_pinned_category: !a.is_pinned_category, pinned_category_at: !a.is_pinned_category ? today : null } : a));
            },
        });
    };

    const bulkAction = (action) => {
        const ids = [...selected];
        if (action === 'delete' && !confirm(`Obrisati ${ids.length} izabrani oglas(e)?`)) return;
        router.post('/admin/oglasi/bulk-action', { action, ids }, {
            preserveScroll: true,
            onSuccess: () => {
                if (action === 'delete') {
                    setAdList(prev => prev.filter(a => !ids.includes(a.id)));
                } else {
                    setAdList(prev => prev.map(a => ids.includes(a.id) ? { ...a, is_pinned: action === 'pin' } : a));
                }
                setSelected(new Set());
            },
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/admin/oglasi?page=${nextPage}&search=${encodeURIComponent(search)}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div id="page-admin-ads" className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-4">
                        <input
                            type="search"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Pretraži po naslovu, korisniku, kategoriji, lokaciji…"
                            className="w-full sm:w-96 px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>

                    {/* Bulk toolbar */}
                    {someSelected && (
                        <div className="mb-4 flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                            <span className="text-sm font-semibold text-orange-700">
                                {selected.size} izabrano
                            </span>
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={() => bulkAction('pin')}
                                    className="px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-200 transition inline-flex items-center gap-1"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                    </svg>
                                    Prikači izabrane
                                </button>
                                <button
                                    onClick={() => bulkAction('unpin')}
                                    className="px-3 py-1.5 text-xs font-semibold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Otkači izabrane
                                </button>
                                <button
                                    onClick={() => bulkAction('delete')}
                                    className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Obriši izabrane
                                </button>
                                <button
                                    onClick={() => setSelected(new Set())}
                                    className="ml-1 text-gray-400 hover:text-gray-600 transition"
                                    title="Clear selection"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleAll}
                                            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Naslov</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategorija</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Korisnik</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cena</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {adList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                                            {search ? 'Nema oglasa koji odgovaraju pretrazi.' : 'Nema oglasa.'}
                                        </td>
                                    </tr>
                                ) : adList.map(ad => (
                                    <tr
                                        key={ad.id}
                                        className={`hover:bg-gray-50 transition-colors ${selected.has(ad.id) ? 'bg-orange-50' : ''}`}
                                    >
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(ad.id)}
                                                onChange={() => toggleOne(ad.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-4 w-48">
                                            <p className="font-medium text-gray-900 text-sm truncate max-w-[11rem]">{ad.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[11rem]">{ad.description}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{ad.category?.name}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600">{ad.user?.name}</td>
                                        <td className="px-4 py-4 text-sm font-semibold text-orange-600 whitespace-nowrap">{ad.price || '—'}</td>
                                        <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">{ad.created_at}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Global pin */}
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <button
                                                        onClick={() => togglePin(ad.id)}
                                                        title={ad.is_pinned ? `Prikačeno: ${ad.pinned_at} — klikni za uklanjanje` : 'Prikači globalno'}
                                                        className={`px-2 py-1.5 text-xs font-medium rounded-lg transition inline-flex items-center gap-1 ${
                                                            ad.is_pinned
                                                                ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
                                                                : 'border border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                                        </svg>
                                                        Global
                                                    </button>
                                                    {ad.is_pinned && (
                                                        <span className="text-[10px] text-amber-600">{ad.pinned_at ?? '—'}</span>
                                                    )}
                                                </div>
                                                {/* Category pin */}
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <button
                                                        onClick={() => togglePinCategory(ad.id)}
                                                        title={ad.is_pinned_category ? `Prikačeno: ${ad.pinned_category_at} — klikni za uklanjanje` : 'Prikači u kategoriji'}
                                                        className={`px-2 py-1.5 text-xs font-medium rounded-lg transition inline-flex items-center gap-1 ${
                                                            ad.is_pinned_category
                                                                ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
                                                                : 'border border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                                        </svg>
                                                        Kategorija
                                                    </button>
                                                    {ad.is_pinned_category && (
                                                        <span className="text-[10px] text-blue-600">{ad.pinned_category_at ?? '—'}</span>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/admin/oglasi/${ad.id}/edit`}
                                                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    Izmeni
                                                </Link>
                                                <button
                                                    onClick={() => destroy(ad.id)}
                                                    className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Obriši
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

                </div>
            </div>
        </AppLayout>
    );
}
