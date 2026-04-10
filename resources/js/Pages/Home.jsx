import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';
import CategoryBar from '@/Components/CategoryBar';
import axios from 'axios';

export default function Home({ ads, search, location, favoritedIds }) {
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

    const handleBarChange = (value, field) => {
        if (value === 'clear') { setSearchValue(''); setLocationValue(''); router.get('/'); return; }
        if (field === 'search') setSearchValue(value);
        if (field === 'location') setLocationValue(value);
    };

    return (
        <AppLayout>
            <CategoryBar
                search={searchValue}
                location={locationValue}
                onSearch={(value, field) => {
                    if (!field) router.get('/', { search: searchValue, location: locationValue }, { preserveState: false });
                    else handleBarChange(value, field);
                }}
            />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {search && (
                        <p className="text-sm text-gray-500 mb-5">
                            <span className="font-semibold text-gray-700">{ads.total}</span> result(s) for "
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
                                {search ? `No results for "${search}".` : 'No advertisements yet.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
