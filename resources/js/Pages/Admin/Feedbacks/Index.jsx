import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminFeedbacksIndex({ feedbacks: initialFeedbacks }) {
    const [list, setList] = useState(initialFeedbacks.data);

    const markRead = (id) => {
        router.patch(`/admin/utisci/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => setList(prev => prev.map(f => f.id === id ? { ...f, read: true } : f)),
        });
    };

    const destroy = (id) => {
        if (!confirm('Obrisati ovu povratnu informaciju?')) return;
        router.delete(`/admin/utisci/${id}`, {
            preserveScroll: true,
            onSuccess: () => setList(prev => prev.filter(f => f.id !== id)),
        });
    };

    const unreadCount = list.filter(f => !f.read).length;

    return (
        <AppLayout>
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-bold text-gray-900">Povratne informacije</h1>
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 text-sm text-indigo-600 font-medium">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                                {unreadCount} nepročitanih
                            </span>
                        )}
                    </div>

                    {list.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <p className="text-gray-500">Nema povratnih informacija.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {list.map(fb => (
                                <div
                                    key={fb.id}
                                    className={`bg-white rounded-xl border shadow-sm p-5 transition-colors ${
                                        fb.read ? 'border-gray-200' : 'border-indigo-200'
                                    }`}
                                >
                                    {/* Meta row */}
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-2.5">
                                            {!fb.read && (
                                                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-0.5" />
                                            )}
                                            <div>
                                                {fb.user ? (
                                                    <span className="text-sm font-semibold text-gray-900">{fb.user.name}</span>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Anonimni korisnik</span>
                                                )}
                                                {fb.email && (
                                                    <p className="text-xs text-indigo-500 mt-0.5">{fb.email}</p>
                                                )}
                                                {fb.page && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{fb.page}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 shrink-0">{fb.created_at}</span>
                                    </div>

                                    {/* Message */}
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{fb.message}</p>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
                                        {!fb.read && (
                                            <button
                                                onClick={() => markRead(fb.id)}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                            >
                                                Označi kao pročitano
                                            </button>
                                        )}
                                        <button
                                            onClick={() => destroy(fb.id)}
                                            className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            Obriši
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {(initialFeedbacks.prev_page_url || initialFeedbacks.next_page_url) && (
                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={() => router.get(initialFeedbacks.prev_page_url)}
                                disabled={!initialFeedbacks.prev_page_url}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                ← Prethodna
                            </button>
                            <span className="text-sm text-gray-500">
                                Strana {initialFeedbacks.current_page} od {initialFeedbacks.last_page}
                            </span>
                            <button
                                onClick={() => router.get(initialFeedbacks.next_page_url)}
                                disabled={!initialFeedbacks.next_page_url}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                Sledeća →
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
