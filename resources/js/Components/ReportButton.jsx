import { useState, useRef, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';

const REPORT_TYPES = [
    { value: 'wrong_category', label: 'Pogrešna kategorija' },
    { value: 'duplicate_spam', label: 'Duplikat oglasa / spam' },
    { value: 'against_rules',  label: 'Krši pravila' },
    { value: 'ignore_user',    label: 'Ignoriši sve oglase ovog korisnika' },
];

export default function ReportButton({ advertisementId }) {
    const { auth } = usePage().props;
    const [open, setOpen]         = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const containerRef            = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (!auth?.user) return null;

    const submit = (type) => {
        router.post(`/oglasi/${advertisementId}/prijavi`, { type }, {
            preserveScroll: true,
            onSuccess: () => { setSubmitted(true); setOpen(false); },
        });
    };

    if (submitted) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 py-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Prijava podneta
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
            >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Prijavi oglas
            </button>

            {open && (
                <div role="menu" className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-30">
                    <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                        Odaberi razlog
                    </p>
                    {REPORT_TYPES.map(({ value, label }) => (
                        <button
                            key={value}
                            role="menuitem"
                            onClick={() => submit(value)}
                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
