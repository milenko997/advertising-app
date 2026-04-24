import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';
import axios from 'axios';

export default function FavoritesIndex({ ads, favoritedIds: initialFavoritedIds, search: initialSearch = '' }) {
    const [adList, setAdList] = useState(ads.data);
    const [favoritedIds, setFavoritedIds] = useState(initialFavoritedIds);
    const [currentPage, setCurrentPage] = useState(ads.current_page);
    const [hasMore, setHasMore] = useState(ads.current_page < ads.last_page);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const debounceRef = useRef(null);

    useEffect(() => {
        setAdList(ads.data);
        setCurrentPage(ads.current_page);
        setHasMore(ads.current_page < ads.last_page);
    }, [ads]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get('/sacuvani', { search: value }, { preserveState: true, replace: true });
        }, 400);
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/sacuvani?page=${nextPage}&search=${encodeURIComponent(search)}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head><title>Sačuvani oglasi — AdBoard</title></Head>
            <div id="page-favorites" className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Sačuvani oglasi</h1>
                        {adList.length > 0 && (
                            <p className="text-sm text-gray-500 mt-0.5">{ads.total} sačuvan{ads.total === 1 ? '' : 'ih'} oglas{ads.total === 1 ? '' : 'a'}</p>
                        )}
                    </div>

                    {/* Search input */}
                    <div className="mb-6">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Pretraži sačuvane oglase…"
                            className="w-full sm:w-80 px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>

                    {adList.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            {search ? (
                                <p className="text-gray-500 font-medium mb-1">Nema sačuvanih oglasa koji odgovaraju pretrazi.</p>
                            ) : (
                                <>
                                    <p className="text-gray-500 font-medium mb-1">Nemate sačuvanih oglasa.</p>
                                    <p className="text-sm text-gray-400 mb-4">Sačuvajte oglase koji vas zanimaju da biste ih lako pronašli.</p>
                                    <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition">
                                        Pretraži oglase
                                    </Link>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            <div id="section-favorites-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {adList.map(ad => (
                                    <AdCard key={ad.id} ad={ad} favoritedIds={favoritedIds} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-8 text-center">
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
