import { useState, useEffect, useRef, useCallback } from 'react';

export default function LocationAutocomplete({ value, onChange, className, placeholder }) {
    const [query, setQuery]           = useState(value ?? '');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen]             = useState(false);
    const [loading, setLoading]       = useState(false);
    const debounceRef                 = useRef(null);
    const containerRef                = useRef(null);

    // Keep input in sync when value is set externally (edit form pre-fill)
    useEffect(() => { setQuery(value ?? ''); }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchSuggestions = useCallback(async (q) => {
        if (q.length < 3) { setSuggestions([]); setOpen(false); return; }
        setLoading(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&addressdetails=1`;
            const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } });
            const data = await res.json();
            setSuggestions(data);
            setOpen(data.length > 0);
        } catch {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 400);
    };

    const select = (place) => {
        const a    = place.address ?? {};
        const city = a.city || a.town || a.village || a.municipality || a.county || place.display_name.split(',')[0].trim();
        const country = a.country ?? '';
        const label   = country ? `${city}, ${country}` : city;
        setQuery(label);
        onChange(label);
        setSuggestions([]);
        setOpen(false);
    };

    const getSubtitle = (place) => {
        const a      = place.address ?? {};
        const region = a.state || a.county || '';
        const country = a.country || '';
        return [region, country].filter(Boolean).join(', ');
    };

    const getTitle = (place) => {
        const a = place.address ?? {};
        return a.city || a.town || a.village || a.municipality || a.county || place.display_name.split(',')[0].trim();
    };

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                placeholder={placeholder ?? 'e.g. Belgrade'}
                className={className}
                autoComplete="off"
            />

            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                </div>
            )}

            {open && suggestions.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((place) => (
                        <li
                            key={place.place_id}
                            onMouseDown={() => select(place)}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 transition-colors"
                        >
                            <p className="font-medium text-gray-800">{getTitle(place)}</p>
                            <p className="text-xs text-gray-400">{getSubtitle(place)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
