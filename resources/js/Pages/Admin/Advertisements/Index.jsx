import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminAdvertisementsIndex({ ads }) {
    const destroy = (id) => {
        if (!confirm('Are you sure?')) return;
        router.delete(`/admin/advertisements/${id}`);
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">All Advertisements</h2>}>
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
