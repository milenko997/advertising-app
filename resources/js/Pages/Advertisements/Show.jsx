import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import ShareButton from '@/Components/ShareButton';

const VEHICLE_LABELS = {
    truck: 'Truck', van: 'Van', pickup: 'Pickup', trailer: 'Trailer',
    flatbed: 'Flatbed', refrigerator_truck: 'Refrigerator Truck', tanker: 'Tanker', other: 'Other',
};

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

export default function Show({ ad, isSaved }) {
    const { auth } = usePage().props;
    const isOwner = auth?.user?.id === ad.user_id;
    const [saved, setSaved] = useState(isSaved);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

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

    return (
        <AppLayout>
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

                            {/* Image */}
                            {ad.image ? (
                                <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    <img
                                        src={`/storage/${ad.image}`}
                                        alt={ad.title}
                                        className="w-full object-cover max-h-[480px]"
                                    />
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

                            {/* Title + badges */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {ad.vehicle_type && (
                                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md">
                                            {VEHICLE_LABELS[ad.vehicle_type] || ad.vehicle_type}
                                        </span>
                                    )}
                                    {ad.category?.name && (
                                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md">
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
                                <p className="text-sm text-gray-400 mt-1">{dateLabel} {dateValue}</p>
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
                                    icon={<svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 12h8M8 17h4" /></svg>}
                                    label="Vehicle Type"
                                    value={VEHICLE_LABELS[ad.vehicle_type] || ad.vehicle_type}
                                />
                                <SpecRow
                                    icon={<svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                                    label="Payload Capacity"
                                    value={ad.payload}
                                />
                                <SpecRow
                                    icon={<svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
                                    label="Area / Route"
                                    value={ad.route}
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
                                                <p className="text-xs text-gray-400">View profile</p>
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
