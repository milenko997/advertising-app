import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';
import CategoryBar from '@/Components/CategoryBar';
import axios from 'axios';

export default function ByCategory({ category, ads, location, favoritedIds }) {
    const [adList, setAdList] = useState(ads.data);
    const [currentPage, setCurrentPage] = useState(ads.current_page);
    const [hasMore, setHasMore] = useState(ads.current_page < ads.last_page);
    const [loading, setLoading] = useState(false);
    const [locationValue, setLocationValue] = useState(location ?? '');

    const handleBarChange = (value, field) => {
        if (value === 'clear') { setLocationValue(''); router.get(window.location.pathname); return; }
        if (field === 'location') setLocationValue(value);
    };

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

    return (
        <AppLayout>
            <Head>
                <title>{`${category.name} Ads — AdBoard`}</title>
                <meta name="description" content={`Browse ${category.name} advertisements on AdBoard — Serbia's marketplace for transport and freight professionals.`} />
                <meta property="og:title"       content={`${category.name} Ads — AdBoard`} />
                <meta property="og:description" content={`Browse ${category.name} advertisements on AdBoard — Serbia's marketplace for transport and freight professionals.`} />
                <meta property="og:type"        content="website" />
                <meta property="og:site_name"   content="AdBoard" />
            </Head>
            <CategoryBar
                currentParent={category.slug}
                location={locationValue}
                onSearch={(value, field) => {
                    if (!field) router.get(window.location.pathname, { location: locationValue }, { preserveState: false });
                    else handleBarChange(value, field);
                }}
            />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {adList.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-500">No advertisements found in this category.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {adList.map(ad => (
                                    <AdCard key={ad.id} ad={ad} favoritedIds={favoritedIds} />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-8 text-center">
                                    <button
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
                                        {loading ? 'Loading…' : 'Load More'}
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
