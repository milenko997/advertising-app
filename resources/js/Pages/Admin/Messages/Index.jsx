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
                onSuccess: () => setMessageList(prev => prev.map(m => m.id === id ? { ...m, read: true } : m)),
            });
        }
    };

    const markRead = (id) => {
        router.patch(`/admin/poruke/${id}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => setMessageList(prev => prev.map(m => m.id === id ? { ...m, read: true } : m)),
        });
    };

    const destroy = (id) => {
        if (!confirm('Da li ste sigurni da želite da obrišete ovu poruku?')) return;
        router.delete(`/admin/poruke/${id}`, {
            preserveScroll: true,
            onSuccess: () => setMessageList(prev => prev.filter(m => m.id !== id)),
        });
    };

    const unreadCount = messageList.filter(m => !m.read).length;

    return (
        <AppLayout>
            <div id="page-admin-messages" className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-bold text-gray-900">Kontakt poruke</h1>
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center gap-1.5 text-sm text-orange-600 font-medium">
                                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                                {unreadCount} nepročitanih
                            </span>
                        )}
                    </div>

                    {messageList.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">Nema poruka.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messageList.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${
                                        msg.read ? 'border-gray-200' : 'border-orange-200'
                                    }`}
                                >
                                    {/* Clickable header */}
                                    <button
                                        onClick={() => toggleExpand(msg.id)}
                                        className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-2.5">
                                                {!msg.read && (
                                                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-0.5" />
                                                )}
                                                <div>
                                                    <span className={`text-sm ${msg.read ? 'font-medium text-gray-700' : 'font-semibold text-gray-900'}`}>
                                                        {msg.name}
                                                    </span>
                                                    <p className="text-xs text-orange-500 mt-0.5">{msg.email}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{msg.subject}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400">{msg.date}</p>
                                                    <p className="text-xs text-gray-400">{msg.time}</p>
                                                </div>
                                                <svg
                                                    className={`w-4 h-4 text-gray-400 transition-transform ${expanded === msg.id ? 'rotate-180' : ''}`}
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded body + actions */}
                                    {expanded === msg.id && (
                                        <div className="px-5 pb-5 border-t border-gray-100">
                                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap pt-4">{msg.message}</p>
                                            <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
                                                <a
                                                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    Odgovori emailom
                                                </a>
                                                <div className="flex items-center gap-3">
                                                    {!msg.read && (
                                                        <button
                                                            onClick={() => markRead(msg.id)}
                                                            className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                                                        >
                                                            Označi kao pročitano
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => destroy(msg.id)}
                                                        className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        Obriši
                                                    </button>
                                                </div>
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
