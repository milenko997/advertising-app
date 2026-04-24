import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function FeedbackButton() {
    const { auth } = usePage().props;
    const isGuest = !auth?.user;

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null); // null | 'sending' | 'sent' | 'error'

    const submit = async (e) => {
        e.preventDefault();
        if (!message.trim() || status === 'sending') return;
        setStatus('sending');
        try {
            await axios.post('/feedback', {
                message,
                email: isGuest ? email : undefined,
                page: window.location.pathname,
            });
            setStatus('sent');
            setMessage('');
            setEmail('');
            setTimeout(() => {
                setOpen(false);
                setStatus(null);
            }, 2000);
        } catch {
            setStatus('error');
        }
    };

    const close = () => {
        setOpen(false);
        setStatus(null);
        setMessage('');
        setEmail('');
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(true)}
                title="Pošaljite povratnu informaciju"
                className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>

            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
                    onClick={close}
                />
            )}

            {/* Popup */}
            {open && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Pošaljite povratnu informaciju</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Pomozite nam da poboljšamo aplikaciju</p>
                        </div>
                        <button
                            onClick={close}
                            aria-label="Zatvori"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    {status === 'sent' ? (
                        <div className="px-5 py-8 text-center">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">Hvala!</p>
                            <p className="text-xs text-gray-500 mt-1">Vaša poruka je primljena.</p>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="px-5 py-4">
                            {isGuest && (
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Vaša email adresa (opciono)…"
                                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
                                />
                            )}
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Šta mislite o aplikaciji? Prijavite grešku ili predložite poboljšanje…"
                                rows={7}
                                maxLength={1000}
                                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
                            />
                            {status === 'error' && (
                                <p className="text-xs text-red-500 mt-1.5">Greška. Pokušajte ponovo.</p>
                            )}
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs text-gray-400">{message.length}/1000</span>
                                <button
                                    type="submit"
                                    disabled={!message.trim() || message.length > 1000 || status === 'sending'}
                                    className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {status === 'sending' ? 'Slanje…' : 'Pošalji'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                </div>
            )}
        </>
    );
}
