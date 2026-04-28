import { useState, useEffect } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';
import { StarRating, ReviewCard, ReviewForm } from '@/Components/ReviewWidgets';

export default function UserShow({ user, ads, favoritedIds: initialFavoritedIds, reviews: initialReviews, hasMoreReviews: initialHasMoreReviews, reviewsTotal, avgRating, myReview }) {
    const { url, props: { auth, flash, appUrl } } = usePage();
    const [adList, setAdList] = useState(ads.data);
    const [favoritedIds] = useState(initialFavoritedIds);
    const [currentPage, setCurrentPage] = useState(ads.current_page);
    const [hasMore, setHasMore] = useState(ads.current_page < ads.last_page);
    const [loading, setLoading] = useState(false);
    const [reviewsList, setReviewsList] = useState(initialReviews);
    const [hasMoreReviews, setHasMoreReviews] = useState(initialHasMoreReviews);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    const [ownReview, setOwnReview] = useState(myReview);
    const [editingOwn, setEditingOwn] = useState(false);
    const [ownRating, setOwnRating] = useState(myReview?.rating ?? 0);
    const [ownComment, setOwnComment] = useState(myReview?.comment ?? '');
    const [ownSubmitting, setOwnSubmitting] = useState(false);
    const [ownError, setOwnError] = useState('');

    useEffect(() => {
        setOwnReview(myReview);
        setOwnRating(myReview?.rating ?? 0);
        setOwnComment(myReview?.comment ?? '');
        setEditingOwn(false);
    }, [myReview?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const reviewsKey = initialReviews.map(r => r.id).join('-');
    useEffect(() => {
        setReviewsList(initialReviews);
        setHasMoreReviews(initialHasMoreReviews);
        setReviewsPage(1);
    }, [reviewsKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const isOwnProfile = auth?.user?.id === user.id;
    const canReview = auth?.user && !isOwnProfile && !ownReview;

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

    const loadMoreReviews = async () => {
        if (reviewsLoading || !hasMoreReviews) return;
        setReviewsLoading(true);
        const nextPage = reviewsPage + 1;
        try {
            const { data } = await axios.get(`/korisnik/${user.slug}?reviews=1&page=${nextPage}`);
            setReviewsList(prev => [...prev, ...data.reviews]);
            setHasMoreReviews(data.hasMore);
            setReviewsPage(nextPage);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleDeleteOwn = () => {
        if (!confirm('Obrisati recenziju?')) return;
        router.delete(`/recenzije/${ownReview.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setReviewsList(prev => prev.filter(r => r.id !== ownReview.id));
                setOwnReview(null);
            },
        });
    };

    const handleUpdateOwn = (e) => {
        e.preventDefault();
        if (!ownRating) { setOwnError('Molimo odaberite ocenu zvezdicama.'); return; }
        setOwnError('');
        setOwnSubmitting(true);
        router.put(`/recenzije/${ownReview.id}`, { rating: ownRating, comment: ownComment }, {
            preserveScroll: true,
            onSuccess: () => {
                setOwnReview(prev => ({ ...prev, rating: ownRating, comment: ownComment }));
                setReviewsList(prev => prev.map(r =>
                    r.id === ownReview.id ? { ...r, rating: ownRating, comment: ownComment } : r
                ));
                setEditingOwn(false);
            },
            onFinish: () => setOwnSubmitting(false),
        });
    };

    const pageTitle  = `${user.name} — AdBoard`;
    const pageDesc   = `Pogledajte profil korisnika ${user.name} na AdBoard-u — oglasi, recenzije i kontakt informacije.`;
    const avatarUrl  = user.avatar
        ? `${appUrl}/storage/${user.avatar}`
        : `${appUrl}/og-default.png`;

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
                <meta property="og:url"         content={`${appUrl}${url}`} />
                <meta name="twitter:card"        content="summary" />
                <meta name="twitter:title"       content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
                <meta name="twitter:image"       content={avatarUrl} />
            </Head>
            <div id="page-user-profile" className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* User card */}
                    <div id="section-user-header" className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6 mb-8">
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
                                <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">{user.name}</h1>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                                        {ads.total} {ads.total === 1 ? 'oglas objavljen' : 'oglasa objavljeno'} 
                                    </p>
                                    {avgRating !== null && (
                                        <>
                                            <span className="text-gray-300">·</span>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <StarRating value={Math.round(avgRating)} readOnly />
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300">{avgRating}</span>
                                                </div>
                                                <span className="text-sm text-gray-400 dark:text-neutral-500">
                                                    ({reviewsTotal} {reviewsTotal === 2 ? 'recenzije' : 'recenzija'})
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
                        <div className="text-center py-16 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                            <p className="text-gray-500 dark:text-neutral-400">Ovaj korisnik nema aktivnih oglasa.</p>
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
                                        className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-orange-300 transition disabled:opacity-50"
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
                    <div id="recenzije" className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6 mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-900 dark:text-neutral-100">
                                    Recenzije
                                    {reviewsTotal > 0 && (
                                        <span className="ml-2 text-sm font-normal text-gray-400 dark:text-neutral-500">({reviewsTotal})</span>
                                    )}
                                </h2>
                                {avgRating !== null && (
                                    <div className="flex items-center gap-2">
                                        <StarRating value={Math.round(avgRating)} readOnly />
                                        <span className="text-sm font-bold text-gray-700 dark:text-neutral-300">{avgRating}</span>
                                    </div>
                                )}
                            </div>

                            {flash?.success && (
                                <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg px-4 py-3 text-sm">
                                    {flash.success}
                                </div>
                            )}
                            {flash?.error && (
                                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg px-4 py-3 text-sm">
                                    {flash.error}
                                </div>
                            )}

                            <div className={`grid grid-cols-1 gap-6 ${!isOwnProfile ? 'lg:grid-cols-3' : ''}`}>

                                {/* Left: form / CTA / own review — hidden on own profile */}
                                {!isOwnProfile && (
                                    <div className="space-y-4">
                                        {ownReview && (
                                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Vaša recenzija</p>
                                                    {!editingOwn && (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => setEditingOwn(true)}
                                                                className="p-1 text-orange-300 hover:text-orange-600 transition-colors rounded"
                                                                title="Izmeni recenziju"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={handleDeleteOwn}
                                                                className="p-1 text-orange-300 hover:text-red-500 transition-colors rounded"
                                                                title="Obriši recenziju"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                {editingOwn ? (
                                                    <form onSubmit={handleUpdateOwn} className="space-y-2">
                                                        <div>
                                                            <StarRating value={ownRating} onChange={setOwnRating} />
                                                            {ownError && <p className="mt-1 text-xs text-red-600">{ownError}</p>}
                                                        </div>
                                                        <textarea
                                                            rows={3}
                                                            value={ownComment}
                                                            onChange={e => setOwnComment(e.target.value)}
                                                            maxLength={1000}
                                                            className="w-full border border-orange-200 dark:border-orange-800 bg-white dark:bg-neutral-700 dark:text-neutral-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="submit"
                                                                disabled={ownSubmitting}
                                                                className="px-4 py-1.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                                                            >
                                                                {ownSubmitting ? 'Čuvanje…' : 'Sačuvaj'}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => { setEditingOwn(false); setOwnRating(ownReview.rating); setOwnComment(ownReview.comment ?? ''); setOwnError(''); }}
                                                                className="px-4 py-1.5 text-sm text-orange-600 hover:text-orange-800 transition"
                                                            >
                                                                Otkaži
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <StarRating value={ownReview.rating} readOnly />
                                                        {ownReview.comment && (
                                                            <p className="text-sm text-orange-700 mt-2">{ownReview.comment}</p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {!ownReview && canReview && <ReviewForm userSlug={user.slug} />}

                                        {!auth?.user && (
                                            <div className="rounded-xl border border-gray-200 dark:border-neutral-700 p-5 text-center">
                                                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-3">Prijavite se da biste ostavili recenziju</p>
                                                <Link
                                                    href={`/korisnik/${user.slug}/recenzija-prijava`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition"
                                                >
                                                    Prijavite se
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Right: reviews list */}
                                <div className={!isOwnProfile ? 'lg:col-span-2' : ''}>
                                    {reviewsList.length === 0 ? (
                                        <p className="text-sm text-gray-400 dark:text-neutral-500 py-2">{isOwnProfile ? 'Još nema recenzija.' : 'Još nema recenzija. Budite prvi!'}</p>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {reviewsList.map(review => (
                                                    <ReviewCard
                                                        key={review.id}
                                                        review={review}
                                                    />
                                                ))}
                                            </div>
                                            {hasMoreReviews && (
                                                <div className="mt-4 text-center">
                                                    <button
                                                        onClick={loadMoreReviews}
                                                        disabled={reviewsLoading}
                                                        className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-orange-300 transition disabled:opacity-50"
                                                    >
                                                        {reviewsLoading && (
                                                            <svg className="w-4 h-4 animate-spin text-orange-600" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                        )}
                                                        {reviewsLoading ? 'Učitavanje…' : 'Prikaži više recenzija'}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </AppLayout>
    );
}
