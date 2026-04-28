import { useState, useEffect, useRef, useId } from 'react';
import { serbianCities } from '@/data/serbianCities';

// Strip diacritics so "Nis" matches "Niš", "Cacak" matches "Čačak", etc.
const normalize = (str) =>
    str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function LocationAutocomplete({ value, onChange, className, placeholder }) {
    const [query, setQuery]           = useState(value ?? '');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen]             = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef                = useRef(null);
    const listRef                     = useRef(null);
    const listboxId                   = useId();

    // Sync when parent clears the field externally
    useEffect(() => {
        if (!value) { setQuery(''); setSuggestions([]); setOpen(false); setActiveIndex(-1); }
    }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex < 0 || !listRef.current) return;
        const item = listRef.current.children[activeIndex];
        item?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);
        setActiveIndex(-1);

        if (val.length >= 3) {
            const q = normalize(val);
            const matches = serbianCities.filter(city =>
                normalize(city.name).startsWith(q) ||
                normalize(city.name).includes(q)
            );
            // Prioritize startsWith results over includes
            const starts = matches.filter(c => normalize(c.name).startsWith(q));
            const rest   = matches.filter(c => !normalize(c.name).startsWith(q));
            const sorted = [...starts, ...rest].slice(0, 8);
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
        setActiveIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!open || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            select(suggestions[activeIndex]);
        } else if (e.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
        }
    };

    const activeId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listboxId}
                aria-activedescendant={activeId}
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                placeholder={placeholder ?? 'npr. Beograd'}
                className={className}
                autoComplete="off"
            />

            {open && suggestions.length > 0 && (
                <ul
                    ref={listRef}
                    id={listboxId}
                    role="listbox"
                    aria-label="Predlozi lokacija"
                    className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                    {suggestions.map((city, i) => (
                        <li
                            key={city.name + city.region}
                            id={`${listboxId}-option-${i}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            onMouseDown={() => select(city)}
                            onPointerDown={() => select(city)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                                i === activeIndex ? 'bg-orange-50 dark:bg-orange-900/20' : 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
                            }`}
                        >
                            <p className="font-medium text-gray-800 dark:text-neutral-200">{city.name}</p>
                            <p className="text-xs text-gray-400 dark:text-neutral-500">{city.region}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
