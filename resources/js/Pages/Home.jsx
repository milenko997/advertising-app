import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';
import Sidebar from '@/Components/Sidebar';
import axios from 'axios';

export default function Home({ ads, pinnedAds = [], search, location, favoritedIds }) {
    const [adList, setAdList] = useState(ads.data);
    const [currentPage, setCurrentPage] = useState(ads.current_page);
    const [hasMore, setHasMore] = useState(ads.current_page < ads.last_page);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState(search ?? '');
    const [locationValue, setLocationValue] = useState(location ?? '');

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const params = new URLSearchParams(window.location.search);
            params.set('page', nextPage);
            const { data } = await axios.get(`/?${params}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/', { search: searchValue, location: locationValue }, { preserveState: false });
    };

    const clearSearch = () => {
        setSearchValue('');
        setLocationValue('');
        router.get('/');
    };

    return (
        <AppLayout>
            <Head>
                <title>AdBoard — Transport & Freight Marketplace in Serbia</title>
                <meta name="description" content="Browse trucks, vans, trailers, and logistics services across Serbia. Find transport professionals or post your own ad on AdBoard." />
                <meta property="og:type"        content="website" />
                <meta property="og:site_name"   content="AdBoard" />
                <meta property="og:title"       content="AdBoard — Transport & Freight Marketplace in Serbia" />
                <meta property="og:description" content="Browse trucks, vans, trailers, and logistics services across Serbia. Find transport professionals or post your own ad on AdBoard." />
            </Head>

            <div id="page-home" className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6 items-start">

                        {/* Sidebar */}
                        <Sidebar />

                        {/* Main content */}
                        <div id="home-content" className="flex-1 min-w-0">

                            {/* Search bar */}
                            <form id="section-search" onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
                                <div className="relative flex-1">
                                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={e => setSearchValue(e.target.value)}
                                        placeholder="Pretraži oglase…"
                                        className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="relative">
                                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        value={locationValue}
                                        onChange={e => setLocationValue(e.target.value)}
                                        placeholder="Lokacija…"
                                        className="border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="shrink-0 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Pretraži
                                </button>
                                {(searchValue || locationValue) && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Obriši
                                    </button>
                                )}
                            </form>

                            {/* Pinned ads */}
                            {pinnedAds.length > 0 && !search && (
                                <div id="section-pinned-ads" className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                        </svg>
                                        <span className="text-sm font-semibold text-gray-700">Istaknuti oglasi</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {pinnedAds.map(ad => (
                                            <AdCard key={ad.id} ad={ad} favoritedIds={favoritedIds} />
                                        ))}
                                    </div>
                                    <div className="mt-8 border-t border-gray-200" />
                                </div>
                            )}

                            {search && (
                                <p className="text-sm text-gray-500 mb-5">
                                    <span className="font-semibold text-gray-700">{ads.total}</span> rezultat(a) za "
                                    <span className="text-indigo-600">{search}</span>"
                                </p>
                            )}

                            {adList.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                    <svg className="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-gray-500">
                                        {search ? `Nema rezultata za "${search}".` : 'Još nema oglasa.'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div id="section-ad-list" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {adList.map(ad => (
                                            <AdCard key={ad.id} ad={ad} favoritedIds={favoritedIds} />
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div className="mt-8 text-center">
                                            <button
                                                id="btn-load-more"
                                                onClick={loadMore}
                                                disabled={loading}
                                                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-indigo-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
            </div>
        </AppLayout>
    );
}
