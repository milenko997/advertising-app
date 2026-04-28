import { Link } from '@inertiajs/react';
import BookmarkButton from '@/Components/BookmarkButton';

export default function AdCard({ ad, favoritedIds = [], showCategoryPin = false }) {
    const isSaved = favoritedIds.includes(ad.id);

    return (
        <div data-ad-id={ad.id} className="group bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 dark:border-neutral-700">

            {/* Image */}
            <div className="relative shrink-0">
                <Link href={`/oglas/${ad.slug}`} className="block">
                    {ad.image ? (
                        <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-neutral-700">
                            <img
                                src={`/storage/${ad.image}`}
                                alt={ad.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    ) : (
                        <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-600 flex flex-col items-center justify-center gap-2">
                            <svg fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10 text-slate-300 dark:text-neutral-500">
                                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                            </svg>
                            <span className="text-xs text-slate-400 dark:text-neutral-500 font-medium">Bez slike</span>
                        </div>
                    )}
                </Link>

                {/* Top-left badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                        ad.availability === 'available'
                            ? 'bg-emerald-500/90 text-white'
                            : 'bg-orange-500/90 text-white'
                    }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block" />
                        {ad.availability === 'available' ? 'Dostupno' : 'Na upit'}
                    </span>
                    {ad.is_pinned && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/95 text-white backdrop-blur-sm">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                            </svg>
                            Istaknuto
                        </span>
                    )}
                    {showCategoryPin && ad.is_pinned_category && !ad.is_pinned && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/90 text-white backdrop-blur-sm">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                            </svg>
                            Istaknuto u kategoriji
                        </span>
                    )}
                </div>

                {/* Bookmark */}
                <div className="absolute top-3 right-3">
                    <BookmarkButton adId={ad.id} initialSaved={isSaved} />
                </div>
            </div>

            {/* Content */}
            <Link href={`/oglas/${ad.slug}`} className="flex flex-col flex-1 p-4">

                {/* Tags row */}
                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                    {ad.category?.name && (
                        <span className="px-2.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 text-xs font-semibold rounded-full border border-orange-100 dark:border-orange-800">
                            {ad.category.name}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 dark:text-neutral-100 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                    {ad.title}
                </h3>

                {/* Price — moved up for faster scanning */}
                <div className="mb-2">
                    <span className={`font-bold text-base ${ad.price ? 'text-slate-900 dark:text-neutral-100' : 'text-slate-300 dark:text-neutral-500 font-normal text-sm italic'}`}>
                        {ad.price || 'Cena na upit'}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 dark:text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                    {ad.description}
                </p>

                {/* Meta */}
                <div className="mt-auto space-y-2">
                    {ad.payload && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-neutral-400">
                            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>{ad.payload}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-neutral-500">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate max-w-[120px]">{ad.location}</span>
                        </div>
                        <span className="text-xs text-slate-300 dark:text-neutral-600 shrink-0">{ad.created_at}</span>
                    </div>
                </div>

                {/* Footer row */}
                <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-neutral-700 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-500 group-hover:gap-2 transition-all duration-200">
                        Pogledaj
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </Link>
        </div>
    );
}
