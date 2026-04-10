import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function UserIndex({ ads }) {
    const handleDelete = (id) => {
        if (!confirm('Are you sure?')) return;
        router.delete(`/advertisements/${id}`);
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">My Advertisements</h2>
                    <Link
                        href="/advertisements/create"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                        + Post Ad
                    </Link>
                </div>
            }
        >
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {ads.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 mb-4">You have no advertisements yet.</p>
                            <Link
                                href="/advertisements/create"
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                            >
                                + Post your first ad
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ads.map(ad => (
                                <div key={ad.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                                    {ad.image ? (
                                        <img
                                            src={`/storage/${ad.image}`}
                                            alt={ad.title}
                                            className="w-24 h-20 object-cover rounded-lg shrink-0"
                                        />
                                    ) : (
                                        <div className="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <Link
                                                    href={`/advertisements/${ad.slug}`}
                                                    className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                                                >
                                                    {ad.title}
                                                </Link>
                                                <p className="text-sm text-gray-500 mt-0.5 truncate">{ad.description}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                                    {ad.price && <span className="font-semibold text-indigo-600">{ad.price}</span>}
                                                    <span>{ad.category?.name}</span>
                                                    <span>{ad.created_at}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link
                                                    href={`/advertisements/edit/${ad.slug}`}
                                                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(ad.id)}
                                                    className="px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
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
