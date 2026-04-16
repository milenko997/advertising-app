import { useState, useEffect, useRef } from 'react';
import { serbianCities } from '@/data/serbianCities';

// Strip diacritics so "Nis" matches "Niš", "Cacak" matches "Čačak", etc.
const normalize = (str) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function LocationAutocomplete({ value, onChange, className, placeholder }) {
    const [query, setQuery]             = useState(value ?? '');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen]               = useState(false);
    const containerRef                  = useRef(null);

    // Sync when parent clears the field externally
    useEffect(() => {
        if (!value) { setQuery(''); setSuggestions([]); setOpen(false); }
    }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);

        if (val.length >= 3) {
            const q = normalize(val);
            const matches = serbianCities.filter(city =>
                normalize(city.name).startsWith(q) ||
                normalize(city.name).includes(q)
            );
            // Prioritize startsWith results over includes
            const starts  = matches.filter(c => normalize(c.name).startsWith(q));
            const rest    = matches.filter(c => !normalize(c.name).startsWith(q));
            const sorted  = [...starts, ...rest].slice(0, 8);
            setSuggestions(sorted);
            setOpen(sorted.length > 0);
        } else {
            setSuggestions([]);
            setOpen(false);
        }
    };

    const select = (city) => {
        setQuery(city.name);
        onChange(city.name);
        setSuggestions([]);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                placeholder={placeholder ?? 'npr. Beograd'}
                className={className}
                autoComplete="off"
            />

            {open && suggestions.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((city) => (
                        <li
                            key={city.name + city.region}
                            onMouseDown={() => select(city)}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-orange-50 transition-colors"
                        >
                            <p className="font-medium text-gray-800">{city.name}</p>
                            <p className="text-xs text-gray-400">{city.region}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
