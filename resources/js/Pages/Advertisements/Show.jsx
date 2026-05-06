import { useState, useEffect } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import ShareButton from '@/Components/ShareButton';
import ReportButton from '@/Components/ReportButton';
import ImageCarousel from '@/Components/ImageCarousel';
import { StarRating, ReviewCard, ReviewForm } from '@/Components/ReviewWidgets';


function SpecRow({ icon, label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-neutral-700 last:border-0">
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-400 dark:text-neutral-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-sm text-gray-800 dark:text-neutral-200 font-medium mt-0.5">{value}</p>
            </div>
        </div>
    );
}

export default function Show({ ad, isSaved, reviews: initialReviews, hasMoreReviews: initialHasMoreReviews, reviewsTotal, avgRating, myReview }) {
    const { url, props: { auth, flash, appUrl } } = usePage();
    const isOwner = auth?.user?.id === ad.user_id;
    const [saved, setSaved] = useState(isSaved);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [carouselOpen, setCarouselOpen] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);
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

    const canReview = auth?.user && !isOwner && !ownReview;

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

    const loadMoreReviews = async () => {
        if (reviewsLoading || !hasMoreReviews) return;
        setReviewsLoading(true);
        const nextPage = reviewsPage + 1;
        try {
            const { data } = await axios.get(`/oglas/${ad.slug}?reviews=1&page=${nextPage}`);
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
            const { data } = await axios.post(`/sacuvani/${ad.id}`);
            setSaved(data.saved);
        } finally {
            setBookmarkLoading(false);
        }
    };

    const handleDelete = () => {
        if (!confirm('Premesti oglas u otpad?')) return;
        router.delete(`/oglasi/${ad.id}`);
    };

    const dateLabel = ad.created_at !== ad.updated_at ? 'Ažurirano' : 'Objavljeno';
    const dateValue = ad.created_at !== ad.updated_at ? ad.updated_at : ad.created_at;

    const pageTitle   = `${ad.title} — Transporteri`;
    const description = ad.description
        ? ad.description.replace(/\s+/g, ' ').trim().slice(0, 160)
        : `${ad.title} — oglas objavljen na Transporterima, portalu za transport i logistiku u Srbiji.`;
    const imageUrl    = ad.image
        ? `${appUrl}/storage/${ad.image}`
        : `${appUrl}/og-default.png`;
    const pageUrl     = `${appUrl}${url}`;

    return (
        <AppLayout>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={description} />

                {/* Open Graph */}
                <meta property="og:type"        content="product" />
                <meta property="og:site_name"   content="Transporteri" />
                <meta property="og:title"       content={pageTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:image"       content={imageUrl} />
                <meta property="og:url"         content={pageUrl} />

                {/* Twitter / WhatsApp */}
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content={pageTitle} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image"       content={imageUrl} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": ad.title,
                    "description": description,
                    "image": imageUrl,
                    "url": pageUrl,
                    ...(ad.user?.name ? {
                        "brand": {
                            "@type": "Person",
                            "name": ad.user.name,
                            ...(ad.user?.slug ? { "url": `${appUrl}/korisnik/${ad.user.slug}` } : {})
                        }
                    } : {})
                }) }} />
            </Head>

            <div id="page-ad-detail" className="py-4 sm:py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Back link */}
                    <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-orange-600 transition-colors mb-6">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Nazad na oglase
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ── Left column ── */}
                        <div id="ad-left-col" className="lg:col-span-2 space-y-6">

                            {/* Image gallery */}
                            {allImages.length > 0 ? (
                                <div>
                                    {/* Main image */}
                                    <div
                                        className="aspect-[16/10] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 cursor-zoom-in relative group"
                                        onClick={() => openCarousel(0)}
                                    >
                                        <img
                                            src={`/storage/${allImages[0].path}`}
                                            alt={ad.title}
                                            className="w-full h-full object-cover"
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
                                    {/* Thumbnail grid */}
                                    {allImages.length > 1 && (
                                        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-2">
                                            {allImages.map((img, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => openCarousel(i)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                                                        i === 0 ? 'border-orange-500' : 'border-transparent hover:border-orange-300'
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
                                <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 flex flex-col items-center justify-center gap-3 py-20">
                                    <svg className="w-14 h-14 text-gray-300 dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm text-gray-400 dark:text-neutral-500">Nema fotografije</p>
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
                                        <span className="px-2.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-xs font-semibold rounded-md">
                                            {ad.category.name}
                                        </span>
                                    )}
                                    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md ${
                                        ad.availability === 'available'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        {ad.availability === 'available' ? 'Dostupno' : 'Na upit'}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 leading-snug">{ad.title}</h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <p className="text-sm text-gray-400 dark:text-neutral-500">{dateLabel} {dateValue}</p>
                                    <span className="text-gray-300 dark:text-neutral-600">·</span>
                                    <span className="inline-flex items-center gap-1 text-sm text-gray-400 dark:text-neutral-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {ad.views} {ad.views === 1 ? 'pregled' : 'pregleda'}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div id="section-ad-description" className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-sm font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-3">Opis</h2>
                                <p className="text-gray-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">{ad.description}</p>
                            </div>

                            {/* Specs */}
                            <div id="section-ad-specs" className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                <h2 className="text-sm font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-2">Detalji</h2>
                                <SpecRow
                                    icon={<svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                                    label="Nosivost"
                                    value={ad.payload}
                                />
                                <SpecRow
                                    icon={<svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                    label="Lokacija"
                                    value={ad.location}
                                />
                                <SpecRow
                                    icon={<svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
                                    label="Kategorija"
                                    value={ad.category?.name}
                                />
                            </div>
                        </div>

                        {/* ── Right column (sticky sidebar) ── */}
                        <div id="ad-right-col" className="lg:col-span-1">
                            <div className="sticky top-20 space-y-4">

                                {/* Price card */}
                                <div id="section-ad-contact" className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-wide font-medium mb-1">Cena</p>
                                        {ad.price ? (
                                            <p className="text-3xl font-bold text-orange-600">{ad.price}</p>
                                        ) : (
                                            <p className="text-lg text-gray-400 dark:text-neutral-500 italic font-normal">Cena na upit</p>
                                        )}
                                    </div>

                                    {ad.phone && (
                                        <a
                                            href={`tel:${ad.phone}`}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {ad.phone}
                                        </a>
                                    )}

                                    <div className="flex gap-2 mt-3">
                                        {auth?.user && (
                                            <button
                                                onClick={toggleSave}
                                                disabled={bookmarkLoading}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                                                    saved
                                                        ? 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100'
                                                        : 'border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-600'
                                                }`}
                                            >
                                                {saved ? (
                                                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                )}
                                                {saved ? 'Sačuvano' : 'Sačuvaj'}
                                            </button>
                                        )}
                                        <div className={auth?.user ? 'flex-1' : 'w-full'}>
                                            <ShareButton url={pageUrl} title={ad.title} fullWidth />
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
                                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-5">
                                        <p className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-wide font-medium mb-3">
                                            {ad.user.account_type === 'company' ? 'Kompanija' : 'Objavio'}
                                        </p>
                                        <Link href={`/korisnik/${ad.user.slug}`} className="flex items-center gap-3 group">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                                {ad.user.avatar ? (
                                                    <img src={`/storage/${ad.user.avatar}`} alt={ad.user.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : ad.user.account_type === 'company' ? (
                                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-orange-600 font-bold text-sm">
                                                        {ad.user.name?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 dark:text-neutral-200 group-hover:text-orange-600 transition-colors truncate">
                                                    {ad.user.account_type === 'company' && ad.user.company_name
                                                        ? ad.user.company_name
                                                        : ad.user.name}
                                                </p>
                                                {avgRating !== null && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <StarRating value={Math.round(avgRating)} readOnly />
                                                        <span className="text-xs text-gray-400 dark:text-neutral-500">({reviewsTotal})</span>
                                                    </div>
                                                )}
                                                {avgRating === null && (
                                                    <p className="text-xs text-gray-400 dark:text-neutral-500">Pogledaj profil</p>
                                                )}
                                            </div>
                                            <svg className="w-4 h-4 text-gray-300 ml-auto shrink-0 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                )}

                                {/* Owner actions */}
                                {isOwner && (
                                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-5 space-y-2">
                                        <p className="text-xs text-gray-400 dark:text-neutral-500 uppercase tracking-wide font-medium mb-3">Upravljanje</p>
                                        <Link
                                            href={`/oglasi/uredi/${ad.slug}`}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 border border-gray-300 dark:border-neutral-600 rounded-lg text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Izmeni oglas
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Obriši oglas
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Reviews ── */}
                        {ad.user && !isOwner && (
                            <div className="lg:col-span-2" id="recenzije">
                                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6">
                                    <div className="flex items-center justify-between mb-1">
                                        <h2 className="text-sm font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
                                            {ad.user?.account_type === 'company' ? 'Recenzije kompanije' : 'Recenzije prodavca'}
                                        </h2>
                                        <Link
                                            href={`/korisnik/${ad.user.slug}`}
                                            className="text-xs text-orange-600 hover:underline"
                                        >
                                            Pogledaj profil
                                        </Link>
                                    </div>

                                    {avgRating !== null && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <StarRating value={Math.round(avgRating)} readOnly />
                                            <span className="text-sm font-bold text-gray-700 dark:text-neutral-300">{avgRating}</span>
                                            <span className="text-sm text-gray-400 dark:text-neutral-500">
                                                ({reviewsTotal} {reviewsTotal === 1 ? 'recenzija' : 'recenzija'})
</span>
                                        </div>
                                    )}

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

                                    {ownReview && (
                                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
                                            <div className="flex items-center justify-between mb-1.5">
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
                                                        <p className="text-sm text-orange-700 mt-1.5">{ownReview.comment}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {reviewsList.length === 0 && !canReview && !auth?.user ? (
                                        <p className="text-sm text-gray-400 dark:text-neutral-500">Još nema recenzija.</p>
                                    ) : reviewsList.length > 0 ? (
                                        <div>
                                            {reviewsList.map(review => (
                                                <ReviewCard
                                                    key={review.id}
                                                    review={review}
                                                    variant="list"
                                                />
                                            ))}
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
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 dark:text-neutral-500">Još nema recenzija. Budite prvi!</p>
                                    )}

                                    {canReview && <ReviewForm userSlug={ad.user.slug} variant="minimal" />}

                                    {!auth?.user && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-700 flex items-center justify-between gap-4">
                                            <p className="text-sm text-gray-500 dark:text-neutral-400">Prijavite se da biste ostavili recenziju ovog prodavca.</p>
                                            <Link
                                                href={`/korisnik/${ad.user.slug}/recenzija-prijava`}
                                                className="shrink-0 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition"
                                            >
                                                Prijavi se
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
