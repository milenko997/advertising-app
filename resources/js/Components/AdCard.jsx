import { Link } from '@inertiajs/react';
import BookmarkButton from '@/Components/BookmarkButton';

const VEHICLE_LABELS = {
    truck: 'Truck', van: 'Van', pickup: 'Pickup', trailer: 'Trailer',
    flatbed: 'Flatbed', refrigerator_truck: 'Refrigerator Truck', tanker: 'Tanker', other: 'Other',
};

export default function AdCard({ ad, favoritedIds = [] }) {
    const isSaved = favoritedIds.includes(ad.id);

    return (
        <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all flex flex-col relative">

            <Link href={`/advertisements/${ad.slug}`} className="flex flex-col flex-1">
                {ad.image ? (
                    <div className="aspect-video overflow-hidden bg-gray-100 shrink-0">
                        <img
                            src={`/storage/${ad.image}`}
                            alt={ad.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ) : (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center shrink-0">
                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                            {ad.title}
                        </h3>
                        <span className="text-indigo-600 font-bold shrink-0 text-sm">
                            {ad.price || 'On request'}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{ad.description}</p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-auto">
                        <span className="inline-flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {ad.category?.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {ad.location}
                        </span>
                        <span className="ml-auto">{ad.created_at}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        {ad.vehicle_type && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700">
                                {VEHICLE_LABELS[ad.vehicle_type] || ad.vehicle_type}
                            </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                            ad.availability === 'available'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                        }`}>
                            {ad.availability === 'available' ? 'Available' : 'On Request'}
                        </span>
                    </div>
                </div>
            </Link>

            {/* Bookmark — after the link so it paints on top */}
            <div className="absolute top-2 right-2 z-10">
                <BookmarkButton adId={ad.id} initialSaved={isSaved} />
            </div>
        </div>
    );
}
