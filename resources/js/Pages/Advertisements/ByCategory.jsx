import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';
import Sidebar from '@/Components/Sidebar';
import axios from 'axios';

export default function ByCategory({ category, ads, pinnedCategoryAds = [], location, favoritedIds }) {
    const [adList, setAdList] = useState(ads.data);
    const [currentPage, setCurrentPage] = useState(ads.current_page);
    const [hasMore, setHasMore] = useState(ads.current_page < ads.last_page);
    const [loading, setLoading] = useState(false);
    const [locationValue, setLocationValue] = useState(location ?? '');

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const params = new URLSearchParams(window.location.search);
            params.set('page', nextPage);
            const { data } = await axios.get(`${window.location.pathname}?${params}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(window.location.pathname, { location: locationValue }, { preserveState: false });
    };

    return (
        <AppLayout>
            <Head>
                <title>{`${category.name} — AdBoard`}</title>
                <meta name="description" content={`Pregledajte oglase u kategoriji ${category.name} na AdBoard-u — srpskom marketplaceu za transport i teretne usluge.`} />
                <meta property="og:title"       content={`${category.name} — AdBoard`} />
                <meta property="og:description" content={`Pregledajte oglase u kategoriji ${category.name} na AdBoard-u — srpskom marketplaceu za transport i teretne usluge.`} />
                <meta property="og:type"        content="website" />
                <meta property="og:site_name"   content="AdBoard" />
                <meta property="og:image"       content={`${window.location.origin}/og-default.png`} />
                <meta property="og:url"         content={window.location.href} />
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content={`${category.name} — AdBoard`} />
                <meta name="twitter:description" content={`Pregledajte oglase u kategoriji ${category.name} na AdBoard-u — srpskom marketplaceu za transport i teretne usluge.`} />
                <meta name="twitter:image"       content={`${window.location.origin}/og-default.png`} />
            </Head>

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        {/* Sidebar */}
                        <Sidebar currentParent={category.slug} />

                        {/* Main content */}
                        <div id="page-by-category" className="flex-1 min-w-0">

                            <div className="mb-6 space-y-3">
                                <h1 className="text-xl font-bold text-gray-900">{category.name}</h1>

                                {/* Location filter */}
                                <form onSubmit={handleSearch} className="flex items-center gap-2">
                                    <div className="relative flex-1 sm:flex-none">
                                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={locationValue}
                                            onChange={e => setLocationValue(e.target.value)}
                                            placeholder="Lokacija…"
                                            className="w-full sm:w-40 border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="shrink-0 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                                    >
                                        Pretraži
                                    </button>
                                    {locationValue && (
                                        <button
                                            type="button"
                                            onClick={() => { setLocationValue(''); router.get(window.location.pathname); }}
                                            className="shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Obriši
                                        </button>
                                    )}
                                </form>
                            </div>

                            {/* Pinned category ads */}
                            {pinnedCategoryAds.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                        </svg>
                                        <span className="text-sm font-semibold text-gray-700">Istaknuti oglasi</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {pinnedCategoryAds.map(ad => (
                                            <AdCard key={ad.id} ad={ad} favoritedIds={favoritedIds} />
                                        ))}
                                    </div>
                                    <div className="mt-8 border-t border-gray-200" />
                                </div>
                            )}

                            {adList.length === 0 && pinnedCategoryAds.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                                    <p className="text-gray-500">Nema oglasa u ovoj kategoriji.</p>
                                </div>
                            ) : adList.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {adList.map(ad => (
                                            <AdCard key={ad.id} ad={ad} favoritedIds={favoritedIds} />
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={loadMore}
                                                disabled={loading}
                                                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
