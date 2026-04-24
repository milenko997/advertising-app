import { useState } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';
import { StarRating, ReviewCard, ReviewForm } from '@/Components/ReviewWidgets';

export default function UserShow({ user, ads, favoritedIds: initialFavoritedIds, reviews, avgRating, myReview }) {
    const { auth, flash } = usePage().props;
    const [adList, setAdList] = useState(ads.data);
    const [favoritedIds] = useState(initialFavoritedIds);
    const [currentPage, setCurrentPage] = useState(ads.current_page);
    const [hasMore, setHasMore] = useState(ads.current_page < ads.last_page);
    const [loading, setLoading] = useState(false);

    const isOwnProfile = auth?.user?.id === user.id;
    const canReview = auth?.user && !isOwnProfile && !myReview;

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/korisnik/${user.slug}?page=${nextPage}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    const pageTitle  = `${user.name} — AdBoard`;
    const pageDesc   = `Pogledajte profil korisnika ${user.name} na AdBoard-u — oglasi, recenzije i kontakt informacije.`;
    const avatarUrl  = user.avatar
        ? `${window.location.origin}/storage/${user.avatar}`
        : `${window.location.origin}/og-default.png`;

    return (
        <AppLayout>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                <meta property="og:type"        content="profile" />
                <meta property="og:site_name"   content="AdBoard" />
                <meta property="og:title"       content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta property="og:image"       content={avatarUrl} />
                <meta property="og:url"         content={window.location.href} />
                <meta name="twitter:card"        content="summary" />
                <meta name="twitter:title"       content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
                <meta name="twitter:image"       content={avatarUrl} />
            </Head>
            <div id="page-user-profile" className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* User card */}
                    <div id="section-user-header" className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                        <div className="flex items-center gap-5">
                            {user.avatar ? (
                                <img
                                    src={`/storage/${user.avatar}`}
                                    alt={user.name}
                                    className="w-20 h-20 rounded-full object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-2xl shrink-0">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    <p className="text-sm text-gray-500">
                                        {ads.total} {ads.total === 1 ? 'oglas objavljen' : 'oglasa objavljeno'} 
                                    </p>
                                    {avgRating !== null && (
                                        <>
                                            <span className="text-gray-300">·</span>
                                            <div className="flex items-center gap-1.5">
                                                <StarRating value={Math.round(avgRating)} readOnly />
                                                <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
                                                <span className="text-sm text-gray-400">
                                                    ({reviews.length} {reviews.length === 1 ? 'recenzija' : 'recenzije'})
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Ads grid ── */}
                    <div id="section-user-ads"></div>
                    {adList.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-500">Ovaj korisnik nema aktivnih oglasa.</p>
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
                                        className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition disabled:opacity-50"
                                    >
                                        {loading && (
                                            <svg className="w-4 h-4 animate-spin text-orange-600" fill="none" viewBox="0 0 24 24">
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

                    {/* ── Reviews section ── */}
                    {!isOwnProfile && (
                        <div id="recenzije" className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-900">
                                    Recenzije
                                    {reviews.length > 0 && (
                                        <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length})</span>
                                    )}
                                </h2>
                                {avgRating !== null && (
                                    <div className="flex items-center gap-2">
                                        <StarRating value={Math.round(avgRating)} readOnly />
                                        <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                                    </div>
                                )}
                            </div>

                            {flash?.success && (
                                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-3 text-sm">
                                    {flash.success}
                                </div>
                            )}
                            {flash?.error && (
                                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
                                    {flash.error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                                {/* Left: form / CTA / own review */}
                                <div className="space-y-4">
                                    {myReview && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-2">Tvoje recenzije</p>
                                            <StarRating value={myReview.rating} readOnly />
                                            {myReview.comment && (
                                                <p className="text-sm text-orange-700 mt-2">{myReview.comment}</p>
                                            )}
                                        </div>
                                    )}

                                    {canReview && <ReviewForm userSlug={user.slug} />}

                                    {!auth?.user && (
                                        <div className="rounded-xl border border-gray-200 p-5 text-center">
                                            <p className="text-sm text-gray-500 mb-3">Prijavite se da biste ostavili recenziju</p>
                                            <Link
                                                href={`/korisnik/${user.slug}/recenzija-prijava`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition"
                                            >
                                                Prijavite se
                                            </Link>
                                        </div>
                                    )}

                                    {!canReview && !myReview && auth?.user && (
                                        <p className="text-sm text-gray-400">Ovom korisniku ste već dali recenziju.</p>
                                    )}
                                </div>

                                {/* Right: reviews list */}
                                <div className="lg:col-span-2">
                                    {reviews.length === 0 ? (
                                        <p className="text-sm text-gray-400 py-2">Još nema recenzija. Budite prvi!</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {reviews.map(review => (
                                                <ReviewCard
                                                    key={review.id}
                                                    review={review}
                                                    authUserId={auth?.user?.id}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
