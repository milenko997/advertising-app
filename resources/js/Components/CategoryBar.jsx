import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function CategoryBar({ currentParent, currentChild, search, location, onSearch }) {
    const { categories } = usePage().props;
    const [openId, setOpenId] = useState(null);
    const barRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (barRef.current && !barRef.current.contains(e.target)) setOpenId(null);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm" ref={barRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">

                {/* Category pills — wraps naturally into 2 rows */}
                <nav className="flex flex-wrap items-center gap-1.5">
                    <Link
                        href="/"
                        className={`px-3.5 py-1.5 text-sm rounded-full font-medium transition-colors ${
                            !currentParent
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                    >
                        Sve kategorije
                    </Link>

                    {categories.map(cat => (
                        <div key={cat.id} className="relative">
                            {cat.children.length > 0 ? (
                                <>
                                    <button
                                        onClick={() => setOpenId(openId === cat.id ? null : cat.id)}
                                        className={`flex items-center gap-1 px-3.5 py-1.5 text-sm rounded-full font-medium transition-colors ${
                                            currentParent === cat.slug
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                    >
                                        {cat.name}
                                        <svg className={`w-3 h-3 transition-transform ${openId === cat.id ? 'rotate-180' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {openId === cat.id && (
                                        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-max">
                                            <Link
                                                href={`/category/${cat.slug}`}
                                                onClick={() => setOpenId(null)}
                                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 font-medium"
                                            >
                                                {cat.name} — sve
                                            </Link>
                                            <div className="border-t border-gray-100 my-1" />
                                            {cat.children.map(child => (
                                                <Link
                                                    key={child.id}
                                                    href={`/category/${cat.slug}/${child.slug}`}
                                                    onClick={() => setOpenId(null)}
                                                    className={`block px-4 py-2 text-sm hover:bg-indigo-50 ${
                                                        currentChild === child.slug
                                                            ? 'text-indigo-600 font-semibold'
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={`/category/${cat.slug}`}
                                    className={`block px-3.5 py-1.5 text-sm rounded-full font-medium transition-colors ${
                                        currentParent === cat.slug
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                                >
                                    {cat.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Search row */}
                <form
                    onSubmit={e => { e.preventDefault(); onSearch?.(); }}
                    className="flex items-center gap-2"
                >
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search ?? ''}
                            onChange={e => onSearch && onSearch(e.target.value, 'search')}
                            placeholder="Pretraži oglase…"
                            className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                            type="text"
                            value={location ?? ''}
                            onChange={e => onSearch && onSearch(e.target.value, 'location')}
                            placeholder="Lokacija…"
                            className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="shrink-0 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Pretraži
                    </button>

                    {(search || location) && (
                        <button
                            type="button"
                            onClick={() => onSearch?.('clear')}
                            className="shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Obriši
                        </button>
                    )}
                </form>

            </div>
        </div>
    );
}
