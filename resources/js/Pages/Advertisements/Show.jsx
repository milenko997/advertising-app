import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import ShareButton from '@/Components/ShareButton';

const VEHICLE_LABELS = {
    truck: 'Truck', van: 'Van', pickup: 'Pickup', trailer: 'Trailer',
    flatbed: 'Flatbed', refrigerator_truck: 'Refrigerator Truck', tanker: 'Tanker', other: 'Other',
};

function DetailItem({ label, children }) {
    return (
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            <div className="text-gray-800">{children}</div>
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
        if (!confirm('Are you sure?')) return;
        router.delete(`/advertisements/${ad.id}`);
    };

    const dateLabel = ad.created_at !== ad.updated_at ? 'Updated' : 'Posted';
    const dateValue = ad.created_at !== ad.updated_at ? ad.updated_at : ad.created_at;

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">{ad.title}</h2>
                    {isOwner && (
                        <div className="flex gap-2">
                            <Link
                                href={`/advertisements/edit/${ad.slug}`}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                        {ad.image && (
                            <img
                                src={`/storage/${ad.image}`}
                                alt={ad.title}
                                className="w-full max-h-80 object-cover"
                            />
                        )}

                        <div className="p-6">
                            {/* Price + availability */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl font-bold text-indigo-600">
                                    {ad.price || 'Price on request'}
                                </span>
                                <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                    ad.availability === 'available'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {ad.availability === 'available' ? 'Available' : 'On Request'}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 leading-relaxed mb-6">{ad.description}</p>

                            {/* Bookmark */}
                            {auth?.user && (
                                <div className="mb-4">
                                    <button
                                        onClick={toggleSave}
                                        disabled={bookmarkLoading}
                                        className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition disabled:opacity-50 ${
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
                                        {saved ? 'Saved' : 'Save ad'}
                                    </button>
                                </div>
                            )}

                            {/* Details grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                <DetailItem label="Vehicle Type">
                                    {VEHICLE_LABELS[ad.vehicle_type] || ad.vehicle_type || '—'}
                                </DetailItem>
                                <DetailItem label="Category">
                                    {ad.category?.name}
                                </DetailItem>
                                {ad.payload && (
                                    <DetailItem label="Payload Capacity">{ad.payload}</DetailItem>
                                )}
                                {ad.route && (
                                    <DetailItem label="Area / Route">{ad.route}</DetailItem>
                                )}
                                <DetailItem label="Location">{ad.location}</DetailItem>
                                <DetailItem label="Contact">
                                    <a href={`tel:${ad.phone}`} className="text-indigo-600 hover:underline font-medium">
                                        {ad.phone}
                                    </a>
                                </DetailItem>
                                <DetailItem label="Owner">
                                    <Link href={`/user/${ad.user?.slug}`} className="text-indigo-600 hover:underline font-medium">
                                        {ad.user?.name}
                                    </Link>
                                </DetailItem>
                                <DetailItem label={dateLabel}>{dateValue}</DetailItem>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <Link href="/" className="text-sm text-indigo-600 hover:underline">
                            ← Back to all ads
                        </Link>
                        <ShareButton url={currentUrl} title={ad.title} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
