import { useState } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import AdCard from '@/Components/AdCard';

function StarRating({ value, onChange, readOnly = false }) {
    const [hovered, setHovered] = useState(0);
    const display = hovered || value;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => !readOnly && onChange?.(star)}
                    onMouseEnter={() => !readOnly && setHovered(star)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    className={`w-6 h-6 transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    <svg
                        viewBox="0 0 24 24"
                        className={`w-full h-full transition-colors ${star <= display ? 'text-amber-400' : 'text-gray-200'}`}
                        fill="currentColor"
                    >
                        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </button>
            ))}
        </div>
    );
}

function ReviewCard({ review, authUserId }) {
    const isOwn = authUserId === review.reviewer.id;
    const [editing, setEditing] = useState(false);
    const [rating, setRating] = useState(review.rating);
    const [comment, setComment] = useState(review.comment ?? '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = () => {
        if (!confirm('Delete your review?')) return;
        router.delete(`/recenzije/${review.id}`);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!rating) { setError('Please select a star rating.'); return; }
        setError('');
        setSubmitting(true);
        router.put(`/recenzije/${review.id}`, { rating, comment }, {
            onSuccess: () => setEditing(false),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        {review.reviewer.avatar ? (
                            <img
                                src={`/storage/${review.reviewer.avatar}`}
                                alt={review.reviewer.name}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-indigo-600 font-bold text-sm">
                                {review.reviewer.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <Link
                            href={`/korisnik/${review.reviewer.slug}`}
                            className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                        >
                            {review.reviewer.name}
                        </Link>
                        <p className="text-xs text-gray-400">{review.created_at}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!editing && <StarRating value={review.rating} readOnly />}
                    {isOwn && !editing && (
                        <>
                            <button
                                onClick={() => setEditing(true)}
                                className="text-gray-300 hover:text-indigo-500 transition-colors"
                                title="Izmeni recenziju"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="Obriši recenziju"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {editing ? (
                <form onSubmit={handleUpdate} className="mt-3 space-y-3">
                    <div>
                        <StarRating value={rating} onChange={setRating} />
                        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                    </div>
                    <textarea
                        rows={3}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        maxLength={1000}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {submitting ? 'Saving…' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setEditing(false); setRating(review.rating); setComment(review.comment ?? ''); setError(''); }}
                            className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                review.comment && (
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                )
            )}
        </div>
    );
}

function ReviewForm({ userSlug }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const submit = (e) => {
        e.preventDefault();
        if (!rating) { setError('Please select a star rating.'); return; }
        setError('');
        setSubmitting(true);
        router.post(`/korisnik/${userSlug}/recenzije`, { rating, comment }, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <form onSubmit={submit} className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Leave a Review</h4>

            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-2">Your Rating</label>
                <StarRating value={rating} onChange={setRating} />
                {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Comment <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    maxLength={1000}
                    placeholder="Share your experience working with this person…"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/1000</p>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
        </form>
    );
}

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
                                <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-2xl shrink-0">
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

                    {/* ── Reviews section ── */}
                    {!isOwnProfile && (
                        <div id="recenzije" className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
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
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-2">Tvoje recenzije</p>
                                            <StarRating value={myReview.rating} readOnly />
                                            {myReview.comment && (
                                                <p className="text-sm text-indigo-700 mt-2">{myReview.comment}</p>
                                            )}
                                        </div>
                                    )}

                                    {canReview && <ReviewForm userSlug={user.slug} />}

                                    {!auth?.user && (
                                        <div className="rounded-xl border border-gray-200 p-5 text-center">
                                            <p className="text-sm text-gray-500 mb-3">Prijavite se da biste ostavili recenziju</p>
                                            <Link
                                                href={`/korisnik/${user.slug}/recenzija-prijava`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
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
                                        className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-indigo-300 transition disabled:opacity-50"
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
