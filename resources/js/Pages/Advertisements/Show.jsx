import { useState } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import ShareButton from '@/Components/ShareButton';
import ReportButton from '@/Components/ReportButton';
import ImageCarousel from '@/Components/ImageCarousel';


function SpecRow({ icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
            </div>
        </div>
    );
}

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
                    className={`w-5 h-5 transition-colors ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
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
        router.delete(`/reviews/${review.id}`);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!rating) { setError('Please select a star rating.'); return; }
        setError('');
        setSubmitting(true);
        router.put(`/reviews/${review.id}`, { rating, comment }, {
            onSuccess: () => setEditing(false),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <div className="flex flex-col gap-3 py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        {review.reviewer.avatar ? (
                            <img
                                src={`/storage/${review.reviewer.avatar}`}
                                alt={review.reviewer.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-indigo-600 font-bold text-xs">
                                {review.reviewer.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <Link
                            href={`/user/${review.reviewer.slug}`}
                            className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors"
                        >
                            {review.reviewer.name}
                        </Link>
                        <p className="text-xs text-gray-400">{review.created_at}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {!editing && <StarRating value={review.rating} readOnly />}
                    {isOwn && !editing && (
                        <>
                            <button
                                onClick={() => setEditing(true)}
                                className="text-gray-300 hover:text-indigo-500 transition-colors"
                                title="Edit review"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="Delete review"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {editing ? (
                <form onSubmit={handleUpdate} className="space-y-2">
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
                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
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
        router.post(`/user/${userSlug}/reviews`, { rating, comment }, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <form onSubmit={submit} className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Leave a Review</h4>
            <div className="mb-3">
                <StarRating value={rating} onChange={setRating} />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>
            <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={1000}
                placeholder="Share your experience… (optional)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-3"
            />
            <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
        </form>
    );
}

export default function Show({ ad, isSaved, reviews, avgRating, myReview }) {
    const { auth, flash } = usePage().props;
    const isOwner = auth?.user?.id === ad.user_id;
    const canReview = auth?.user && !isOwner && !myReview;
    const [saved, setSaved] = useState(isSaved);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [carouselOpen, setCarouselOpen] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Combine primary image and gallery images into one array for carousel
    const allImages = [
        ...(ad.image ? [{ path: ad.image }] : []),
        ...(ad.images ?? []),
    ];

    const openCarousel = (index) => {
        setCarouselIndex(index);
        setCarouselOpen(true);
    };

    const toggleSave = async () => {
        if (bookmarkLoading) return;
        setBookmarkLoading(true);
        try {
            const { data } = await axios.post(`/favorites/${ad.id}`);
            setSaved(data.saved);
        } finally {
            setBookmarkLoading(false);
        }
    };

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleDelete = () => {
        if (!confirm('Move this ad to trash?')) return;
        router.delete(`/advertisements/${ad.id}`);
    };

    const dateLabel = ad.created_at !== ad.updated_at ? 'Updated' : 'Posted';
    const dateValue = ad.created_at !== ad.updated_at ? ad.updated_at : ad.created_at;

    const pageTitle   = `${ad.title} — AdBoard`;
    const description = ad.description
        ? ad.description.replace(/\s+/g, ' ').trim().slice(0, 160)
        : `${ad.title} — available on AdBoard, the marketplace for transport and freight professionals in Serbia.`;
    const imageUrl    = ad.image
        ? `${window.location.origin}/storage/${ad.image}`
        : `${window.location.origin}/og-default.png`;
    const pageUrl     = window.location.href;

    return (
        <AppLayout>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={description} />

                {/* Open Graph */}
                <meta property="og:type"        content="product" />
                <meta property="og:site_name"   content="AdBoard" />
                <meta property="og:title"       content={pageTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image"       content={imageUrl} />
                <meta property="og:url"         content={pageUrl} />

                {/* Twitter / WhatsApp */}
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content={pageTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image"       content={imageUrl} />
            </Head>

            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Back link */}
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to listings
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ── Left column ── */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Image gallery */}
                            {allImages.length > 0 ? (
                                <div>
                                    {/* Main image */}
                                    <div
                                        className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-zoom-in relative group"
                                        onClick={() => openCarousel(0)}
                                    >
                                        <img
                                            src={`/storage/${allImages[0].path}`}
                                            alt={ad.title}
                                            className="w-full object-cover max-h-[480px]"
                                        />
                                        {allImages.length > 1 && (
                                            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                                                1 / {allImages.length}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-black/30 rounded-full p-3">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Thumbnail strip */}
                                    {allImages.length > 1 && (
                                        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                                            {allImages.map((img, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => openCarousel(i)}
                                                    className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                                                        i === 0 ? 'border-indigo-500' : 'border-transparent hover:border-indigo-300'
                                                    }`}
                                                >
                                                    <img
                                                        src={`/storage/${img.path}`}
                                                        alt={`Image ${i + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-3 py-20">
                                    <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-400">No image provided</p>
                                </div>
                            )}

                            {/* Carousel modal */}
                            {carouselOpen && allImages.length > 0 && (
                                <ImageCarousel
                                    images={allImages}
                                    initialIndex={carouselIndex}
                                    onClose={() => setCarouselOpen(false)}
                                />
                            )}

                            {/* Title + badges */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {ad.category?.name && (
                                        <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 text-xs font-semibold rounded-md">
                                            {ad.category.name}
                                        </span>
                                    )}
                                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md ${
                                        ad.availability === 'available'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        {ad.availability === 'available' ? 'Available' : 'On Request'}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 leading-snug">{ad.title}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-sm text-gray-400">{dateLabel} {dateValue}</p>
                                    <span className="text-gray-300">·</span>
                                    <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {ad.views} {ad.views === 1 ? 'view' : 'views'}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Description</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{ad.description}</p>
                            </div>

                            {/* Specs */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Details</h2>
                                <SpecRow
                                    icon={<svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                                    label="Payload Capacity"
                                    value={ad.payload}
                                />
                                <SpecRow
                                    icon={<svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                    label="Location"
                                    value={ad.location}
                                />
                                <SpecRow
                                    icon={<svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                                    label="Category"
                                    value={ad.category?.name}
                                />
                            </div>

                            {/* ── Reviews section ── */}
                            {ad.user && !isOwner && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6" id="reviews">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                            Seller Reviews
                                        </h2>
                                        <Link
                                            href={`/user/${ad.user.slug}#reviews`}
                                            className="text-xs text-indigo-600 hover:underline"
                                        >
                                            View profile
                                        </Link>
                                    </div>

                                    {/* Average rating */}
                                    {avgRating !== null && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <StarRating value={Math.round(avgRating)} readOnly />
                                            <span className="text-sm font-bold text-gray-700">{avgRating}</span>
                                            <span className="text-sm text-gray-400">
                                                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                                            </span>
                                        </div>
                                    )}

                                    {/* Flash messages */}
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

                                    {/* Own review summary */}
                                    {myReview && (
                                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4">
                                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide mb-1.5">Your Review</p>
                                            <StarRating value={myReview.rating} readOnly />
                                            {myReview.comment && (
                                                <p className="text-sm text-indigo-700 mt-1.5">{myReview.comment}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Reviews list */}
                                    {reviews.length === 0 && !canReview && !auth?.user ? (
                                        <p className="text-sm text-gray-400">No reviews yet.</p>
                                    ) : reviews.length > 0 ? (
                                        <div>
                                            {reviews.map(review => (
                                                <ReviewCard
                                                    key={review.id}
                                                    review={review}
                                                    authUserId={auth?.user?.id}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400">No reviews yet. Be the first!</p>
                                    )}

                                    {/* Review form for eligible logged-in users */}
                                    {canReview && <ReviewForm userSlug={ad.user.slug} />}

                                    {/* Guest CTA */}
                                    {!auth?.user && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                                            <p className="text-sm text-gray-500">Log in to leave a review for this seller.</p>
                                            <Link
                                                href={`/user/${ad.user.slug}/review-login`}
                                                className="shrink-0 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                                            >
                                                Log in to Review
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Right column (sticky sidebar) ── */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 space-y-4">

                                {/* Price card */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">Price</p>
                                        {ad.price ? (
                                            <p className="text-3xl font-bold text-indigo-600">{ad.price}</p>
                                        ) : (
                                            <p className="text-lg text-gray-400 italic font-normal">Price on request</p>
                                        )}
                                    </div>

                                    {/* Phone CTA */}
                                    {ad.phone && (
                                        <a
                                            href={`tel:${ad.phone}`}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {ad.phone}
                                        </a>
                                    )}

                                    {/* Save / Share */}
                                    <div className="flex gap-2 mt-3">
                                        {auth?.user && (
                                            <button
                                                onClick={toggleSave}
                                                disabled={bookmarkLoading}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                                                    saved
                                                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                {saved ? (
                                                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                )}
                                                {saved ? 'Saved' : 'Save'}
                                            </button>
                                        )}
                                        <div className={auth?.user ? 'flex-1' : 'w-full'}>
                                            <ShareButton url={currentUrl} title={ad.title} fullWidth />
                                        </div>
                                    </div>
                                    {!isOwner && (
                                        <div className="flex justify-end mt-1">
                                            <ReportButton advertisementId={ad.id} />
                                        </div>
                                    )}
                                </div>

                                {/* Owner card */}
                                {ad.user && (
                                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Posted by</p>
                                        <Link href={`/user/${ad.user.slug}`} className="flex items-center gap-3 group">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                                {ad.user.avatar ? (
                                                    <img src={`/storage/${ad.user.avatar}`} alt={ad.user.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <span className="text-indigo-600 font-bold text-sm">
                                                        {ad.user.name?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                    {ad.user.name}
                                                </p>
                                                {avgRating !== null && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <StarRating value={Math.round(avgRating)} readOnly />
                                                        <span className="text-xs text-gray-400">({reviews.length})</span>
                                                    </div>
                                                )}
                                                {avgRating === null && (
                                                    <p className="text-xs text-gray-400">View profile</p>
                                                )}
                                            </div>
                                            <svg className="w-4 h-4 text-gray-300 ml-auto group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                )}

                                {/* Owner actions */}
                                {isOwner && (
                                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-3">Manage</p>
                                        <Link
                                            href={`/advertisements/edit/${ad.slug}`}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Ad
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete Ad
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
