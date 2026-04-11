import { Link } from '@inertiajs/react';
import BookmarkButton from '@/Components/BookmarkButton';

const VEHICLE_LABELS = {
    truck: 'Truck', van: 'Van', pickup: 'Pickup', trailer: 'Trailer',
    flatbed: 'Flatbed', refrigerator_truck: 'Refrigerator Truck', tanker: 'Tanker', other: 'Other',
};

export default function AdCard({ ad, favoritedIds = [] }) {
    const isSaved = favoritedIds.includes(ad.id);

    return (
        <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex flex-col">

            {/* Image */}
            <div className="relative shrink-0">
                <Link href={`/advertisements/${ad.slug}`} className="block">
                    {ad.image ? (
                        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                            <img
                                src={`/storage/${ad.image}`}
                                alt={ad.title}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            />
                        </div>
                    ) : (
                        <div className="aspect-[16/9] bg-gray-50 flex flex-col items-center justify-center gap-2">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M8 17l4 4 4-4m-4-5v9M20.88 18.09A5 5 0 0018 9h-1.26A8 8 0 103 16.29" />
                            </svg>
                            <span className="text-xs text-gray-400">No image</span>
                        </div>
                    )}
                </Link>

                {/* Availability badge over image */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                        ad.availability === 'available'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500 text-white'
                    }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block" />
                        {ad.availability === 'available' ? 'Available' : 'On Request'}
                    </span>
                    {ad.is_pinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-400 text-white">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                            </svg>
                            Featured
                        </span>
                    )}
                </div>

                {/* Bookmark */}
                <div className="absolute top-2 right-2">
                    <BookmarkButton adId={ad.id} initialSaved={isSaved} />
                </div>
            </div>

            {/* Content */}
            <Link href={`/advertisements/${ad.slug}`} className="flex flex-col flex-1 p-4">
                {/* Category + Vehicle type */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {ad.vehicle_type && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded">
                            {VEHICLE_LABELS[ad.vehicle_type] || ad.vehicle_type}
                        </span>
                    )}
                    {ad.category?.name && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                            {ad.category.name}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {ad.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                    {ad.description}
                </p>

                {/* Meta info */}
                <div className="mt-auto space-y-1.5">
                    {ad.route && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="truncate">{ad.route}</span>
                        </div>
                    )}
                    {ad.payload && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>{ad.payload}</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{ad.location}</span>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 ml-2">{ad.created_at}</span>
                    </div>
                </div>

                {/* Price */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <span className={`font-bold text-base ${ad.price ? 'text-indigo-600' : 'text-gray-400 italic font-normal text-sm'}`}>
                        {ad.price || 'Price on request'}
                    </span>
                </div>
            </Link>
        </div>
    );
}
