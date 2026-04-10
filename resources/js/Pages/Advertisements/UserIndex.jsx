import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const AVAILABILITY_LABEL = { available: 'Available', on_request: 'On Request' };

export default function UserIndex({ ads }) {
    const handleDelete = (id) => {
        if (!confirm('Move this ad to trash?')) return;
        router.delete(`/advertisements/${id}`);
    };

    return (
        <AppLayout>
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Ads</h1>
                            <p className="text-sm text-gray-500 mt-0.5">{ads.length} advertisement{ads.length !== 1 ? 's' : ''}</p>
                        </div>
                        <Link
                            href="/advertisements/create"
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Post Ad
                        </Link>
                    </div>

                    {ads.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                            <svg className="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 mb-4">You have no advertisements yet.</p>
                            <Link
                                href="/advertisements/create"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                            >
                                Post your first ad
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {ads.map(ad => (
                                <div key={ad.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-200 hover:shadow-sm transition-all">
                                    {/* Thumbnail */}
                                    {ad.image ? (
                                        <img
                                            src={`/storage/${ad.image}`}
                                            alt={ad.title}
                                            className="w-24 h-20 object-cover rounded-lg shrink-0"
                                        />
                                    ) : (
                                        <div className="w-24 h-20 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/advertisements/${ad.slug}`}
                                                    className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                                                >
                                                    {ad.title}
                                                </Link>
                                                <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{ad.description}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    {ad.availability && (
                                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                                                            ad.availability === 'available'
                                                                ? 'bg-emerald-50 text-emerald-700'
                                                                : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                            {AVAILABILITY_LABEL[ad.availability] || ad.availability}
                                                        </span>
                                                    )}
                                                    {ad.price && <span className="text-xs font-semibold text-indigo-600">{ad.price}</span>}
                                                    {ad.category?.name && <span className="text-xs text-gray-400">{ad.category.name}</span>}
                                                    <span className="text-xs text-gray-400">{ad.created_at}</span>
                                                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        {ad.views ?? 0}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link
                                                    href={`/advertisements/edit/${ad.slug}`}
                                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ad.id)}
                                                    className="px-3 py-1.5 border border-red-200 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
