import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminMessagesIndex({ messages: initialMessages }) {
    const [messageList, setMessageList] = useState(initialMessages.data);
    const [expanded, setExpanded] = useState(null);

    const toggleExpand = (id) => {
        setExpanded(prev => prev === id ? null : id);

        const msg = messageList.find(m => m.id === id);
        if (msg && !msg.read) {
            router.patch(`/admin/poruke/${id}/read`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setMessageList(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
                },
            });
        }
    };

    const destroy = (id) => {
        if (!confirm('Da li ste sigurni da želite da obrišete ovu poruku?')) return;
        router.delete(`/admin/poruke/${id}`, {
            preserveScroll: true,
            onSuccess: () => setMessageList(prev => prev.filter(m => m.id !== id)),
        });
    };

    return (
        <AppLayout>
            <div id="page-admin-messages" className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-bold text-gray-900">Kontakt poruke</h1>
                        <span className="text-sm text-gray-500">
                            {messageList.filter(m => !m.read).length} nepročitanih
                        </span>
                    </div>

                    {messageList.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">Nema poruka.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {messageList.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${
                                        msg.read ? 'border-gray-200' : 'border-orange-200'
                                    }`}
                                >
                                    {/* Header row */}
                                    <button
                                        onClick={() => toggleExpand(msg.id)}
                                        className="w-full text-left flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Unread dot */}
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? 'bg-transparent' : 'bg-orange-500'}`} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className={`text-sm ${msg.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                                                    {msg.name}
                                                </span>
                                                <span className="text-xs text-gray-400">{msg.email}</span>
                                            </div>
                                            <p className={`text-sm truncate mt-0.5 ${msg.read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                                                {msg.subject}
                                            </p>
                                        </div>

                                        <span className="text-xs text-gray-400 shrink-0">{msg.created_at}</span>

                                        <svg
                                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Expanded body */}
                                    {expanded === msg.id && (
                                        <div className="px-5 pb-5 border-t border-gray-100">
                                            <div className="pt-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                {msg.message}
                                            </div>
                                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                                <a
                                                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    Odgovori emailom
                                                </a>
                                                <button
                                                    onClick={() => destroy(msg.id)}
                                                    className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    Obriši
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {(initialMessages.prev_page_url || initialMessages.next_page_url) && (
                        <div className="mt-6 flex items-center justify-between">
                            <button
                                onClick={() => router.get(initialMessages.prev_page_url)}
                                disabled={!initialMessages.prev_page_url}
                                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                ← Prethodna
                            </button>
                            <span className="text-sm text-gray-500">
                                Strana {initialMessages.current_page} od {initialMessages.last_page}
                            </span>
                            <button
                                onClick={() => router.get(initialMessages.next_page_url)}
                                disabled={!initialMessages.next_page_url}
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
