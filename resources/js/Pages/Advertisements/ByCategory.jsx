import { useState } from 'react';
import { router, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';
import Sidebar from '@/Components/Sidebar';
import axios from 'axios';

export default function ByCategory({ category, ads, pinnedCategoryAds = [], location, favoritedIds }) {
    const { url, props: { appUrl } } = usePage();
    const [adList, setAdList] = useState(ads.data);
    const [currentPage, setCurrentPage] = useState(ads.current_page);
    const [hasMore, setHasMore] = useState(ads.current_page < ads.last_page);
    const [loading, setLoading] = useState(false);
    const [locationValue, setLocationValue] = useState(location ?? '');

    const pathname = url.split('?')[0];

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const params = new URLSearchParams();
            if (locationValue) params.set('location', locationValue);
            params.set('page', nextPage);
            const { data } = await axios.get(`${pathname}?${params}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(pathname, { location: locationValue }, { preserveState: false });
    };

    return (
        <AppLayout>
            <Head title={category.name}>
                <meta name="description" content={`Pregledajte oglase u kategoriji ${category.name} na AdBoard-u — srpskom marketplaceu za transport i teretne usluge.`} />
                <meta property="og:title"       content={`${category.name} — AdBoard`} />
                <meta property="og:description" content={`Pregledajte oglase u kategoriji ${category.name} na AdBoard-u — srpskom marketplaceu za transport i teretne usluge.`} />
                <meta property="og:type"        content="website" />
                <meta property="og:site_name"   content="AdBoard" />
                <meta property="og:image"       content={`${appUrl}/og-default.png`} />
                <meta property="og:url"         content={`${appUrl}${url}`} />
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content={`${category.name} — AdBoard`} />
                <meta name="twitter:description" content={`Pregledajte oglase u kategoriji ${category.name} na AdBoard-u — srpskom marketplaceu za transport i teretne usluge.`} />
                <meta name="twitter:image"       content={`${appUrl}/og-default.png`} />
            </Head>

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start">

                        {/* Sidebar */}
                        <Sidebar currentParent={category.slug} />

                        {/* Main content */}
                        <div id="page-by-category" className="flex-1 min-w-0">

                            <div className="mb-6 space-y-3">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">{category.name}</h1>

                                {/* Location filter */}
                                <form onSubmit={handleSearch} className="flex items-center gap-2">
                                    <div className="relative flex-1 sm:flex-none">
                                        <label htmlFor="bycategory-location" className="sr-only">Lokacija</label>
                                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <input
                                            id="bycategory-location"
                                            type="text"
                                            value={locationValue}
                                            onChange={e => setLocationValue(e.target.value)}
                                            placeholder="Lokacija…"
                                            className="w-full sm:w-40 border border-gray-200 dark:border-neutral-600 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
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
                                            onClick={() => { setLocationValue(''); router.get(pathname); }}
                                            className="shrink-0 flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                                        <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300">Istaknuti oglasi</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {pinnedCategoryAds.map(ad => (
                                            <AdCard key={ad.id} ad={ad} favoritedIds={favoritedIds} showCategoryPin />
                                        ))}
                                    </div>
                                    <div className="mt-8 border-t border-gray-200 dark:border-neutral-700" />
                                </div>
                            )}

                            {adList.length === 0 && pinnedCategoryAds.length === 0 ? (
                                <div className="text-center py-16 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                                    <p className="text-gray-500 dark:text-neutral-400">Nema oglasa u ovoj kategoriji.</p>
                                </div>
                            ) : adList.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {adList.map(ad => (
                                            <AdCard key={ad.id} ad={ad} favoritedIds={favoritedIds} showCategoryPin />
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={loadMore}
                                                disabled={loading}
                                                className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-orange-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
