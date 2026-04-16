import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function BookmarkButton({ adId, initialSaved, className = '' }) {
    const { auth } = usePage().props;
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);

    if (!auth?.user) return null;

    const toggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        try {
            const { data } = await axios.post(`/sacuvani/${adId}`);
            setSaved(data.saved);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggle}
            disabled={loading}
            title={saved ? 'Remove from saved' : 'Save ad'}
            className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow hover:bg-white transition disabled:opacity-50 ${className}`}
        >
            {saved ? (
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            ) : (
                <svg className="w-4 h-4 text-gray-400 hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            )}
        </button>
    );
}
