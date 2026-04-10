import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Trash({ ads }) {
    const restore = (id) => {
        router.patch(`/advertisements/${id}/restore`);
    };

    const forceDelete = (id) => {
        if (!confirm('This cannot be undone. Are you sure?')) return;
        router.delete(`/advertisements/force-delete/${id}`);
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Trash</h2>}>
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {ads.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-14 h-14 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <p className="text-gray-500">Your trash is empty.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {ads.map(ad => (
                                <div key={ad.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 opacity-75">
                                    {ad.image ? (
                                        <img
                                            src={`/storage/${ad.image}`}
                                            alt={ad.title}
                                            className="w-24 h-20 object-cover rounded-lg shrink-0 grayscale"
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
                                                <p className="font-semibold text-gray-700">{ad.title}</p>
                                                <p className="text-sm text-gray-400 mt-0.5 truncate">{ad.description}</p>
                                                <p className="text-xs text-red-500 mt-2">Deleted: {ad.deleted_at}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => restore(ad.id)}
                                                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => forceDelete(ad.id)}
                                                    className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Delete Forever
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
