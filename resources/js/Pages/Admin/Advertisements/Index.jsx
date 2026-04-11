import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminAdvertisementsIndex({ ads }) {
    const destroy = (id) => {
        if (!confirm('Are you sure?')) return;
        router.delete(`/admin/advertisements/${id}`);
    };

    const togglePin = (id) => {
        router.patch(`/admin/advertisements/${id}/pin`);
    };

    return (
        <AppLayout>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {ads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                                            No advertisements found.
                                        </td>
                                    </tr>
                                ) : ads.map(ad => (
                                    <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 text-sm">{ad.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{ad.description}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{ad.category?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{ad.user?.name}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-indigo-600">{ad.price || '—'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{ad.created_at}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => togglePin(ad.id)}
                                                    title={ad.is_pinned ? 'Unpin' : 'Pin to top'}
                                                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition inline-flex items-center gap-1 ${
                                                        ad.is_pinned
                                                            ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
                                                            : 'border border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                                    </svg>
                                                    {ad.is_pinned ? 'Pinned' : 'Pin'}
                                                </button>
                                                <Link
                                                    href={`/admin/advertisements/${ad.id}/edit`}
                                                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => destroy(ad.id)}
                                                    className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
