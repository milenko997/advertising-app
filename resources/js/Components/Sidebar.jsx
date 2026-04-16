import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar({ currentParent, currentChild }) {
    const { categories } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    // Auto-expand the active parent on first render
    const initialOpen = new Set();
    categories.forEach(cat => {
        if (cat.slug === currentParent || cat.children?.some(ch => ch.slug === currentChild)) {
            initialOpen.add(cat.id);
        }
    });
    const [openIds, setOpenIds] = useState(initialOpen);

    const toggle = (id) => {
        setOpenIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const content = (
        <nav className="py-2">
            <Link
                href="/"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    !currentParent
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
            >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Sve kategorije
            </Link>

            <div className="mt-1">
                {categories.map(cat => (
                    <div key={cat.id}>
                        {cat.children.length > 0 ? (
                            <>
                                <button
                                    onClick={() => toggle(cat.id)}
                                    className={`w-full text-left flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                                        currentParent === cat.slug
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{cat.name}</span>
                                    <svg
                                        className={`w-3.5 h-3.5 shrink-0 transition-transform text-gray-400 ${openIds.has(cat.id) ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {openIds.has(cat.id) && (
                                    <div className="mb-1">
                                        <Link
                                            href={`/kategorija/${cat.slug}`}
                                            className={`flex items-center gap-1.5 pl-8 pr-4 py-1.5 text-sm transition-colors ${
                                                currentParent === cat.slug && !currentChild
                                                    ? 'text-indigo-600 font-semibold'
                                                    : 'text-gray-500 hover:text-indigo-600'
                                            }`}
                                        >
                                            {cat.name}
                                        </Link>
                                        {cat.children.map(child => (
                                            <Link
                                                key={child.id}
                                                href={`/kategorija/${cat.slug}/${child.slug}`}
                                                className={`flex items-center gap-1.5 pl-8 pr-4 py-1.5 text-sm transition-colors ${
                                                    currentChild === child.slug
                                                        ? 'text-indigo-600 font-semibold'
                                                        : 'text-gray-500 hover:text-indigo-600'
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
                                href={`/kategorija/${cat.slug}`}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    currentParent === cat.slug
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            >
                                {cat.name}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );

    return (
        <>
            {/* Mobile toggle button */}
            <button
                id="sidebar-mobile-toggle"
                onClick={() => setMobileOpen(prev => !prev)}
                className="lg:hidden w-full text-left flex items-center gap-2 mb-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Kategorije
                <svg className={`w-3.5 h-3.5 ml-auto transition-transform ${mobileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div id="sidebar-mobile-panel" className="lg:hidden mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {content}
                </div>
            )}

            {/* Desktop sidebar — sticky on the flex child itself + self-start is the key */}
            <aside id="sidebar" className="hidden lg:block w-52 shrink-0 sticky top-6 self-start">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kategorije</h2>
                    </div>
                    {content}
                </div>
            </aside>
        </>
    );
}
