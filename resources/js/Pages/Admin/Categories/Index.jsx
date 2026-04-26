import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

export default function CategoriesIndex({ categories: initialCategories, search: initialSearch = '' }) {
    const [categoryList, setCategoryList] = useState(initialCategories.data);
    const [currentPage, setCurrentPage] = useState(initialCategories.current_page);
    const [hasMore, setHasMore] = useState(initialCategories.current_page < initialCategories.last_page);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const debounceRef = useRef(null);

    useEffect(() => {
        setCategoryList(initialCategories.data);
        setCurrentPage(initialCategories.current_page);
        setHasMore(initialCategories.current_page < initialCategories.last_page);
    }, [initialCategories]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get('/admin/kategorije', { search: value }, { preserveState: true, replace: true });
        }, 400);
    };

    const destroy = (slug) => {
        if (!confirm('Da li ste sigurni?')) return;
        router.delete(`/admin/kategorije/${slug}`, {
            onSuccess: () => setCategoryList(prev => prev.filter(c => c.slug !== slug)),
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/admin/kategorije?page=${nextPage}&search=${encodeURIComponent(search)}`);
            setCategoryList(prev => [...prev, ...data.categories]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Kategorije — Admin" />
            <div id="page-admin-categories" className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Kategorije</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Sve kategorije oglasa</p>
                        </div>
                        <Link
                            href="/admin/kategorije/create"
                            className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition"
                        >
                            + Dodaj kategoriju
                        </Link>
                    </div>

                    <div className="mb-4">
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Pretraži kategorije..."
                            className="w-full sm:w-80 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Desktop table */}
                        <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Naziv</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nadkategorija</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categoryList.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                                            {search ? 'Nema kategorija koje odgovaraju pretrazi.' : 'Nema kategorija.'}
                                        </td>
                                    </tr>
                                ) : categoryList.map(cat => (
                                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 text-sm">{cat.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{cat.slug}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{cat.parent_name ?? '—'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/kategorije/${cat.slug}/edit`}
                                                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    Izmeni
                                                </Link>
                                                <button
                                                    onClick={() => destroy(cat.slug)}
                                                    className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Obriši
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {categoryList.length === 0 ? (
                                <p className="px-4 py-10 text-center text-sm text-gray-400">
                                    {search ? 'Nema kategorija koje odgovaraju pretrazi.' : 'Nema kategorija.'}
                                </p>
                            ) : categoryList.map(cat => (
                                <div key={cat.id} className="p-4">
                                    <p className="font-medium text-gray-900 text-sm">{cat.name}</p>
                                    <p className="text-xs text-gray-400 font-mono mt-0.5">{cat.slug}</p>
                                    {cat.parent_name && (
                                        <p className="text-xs text-gray-500 mt-1">Nadkategorija: <span className="font-medium">{cat.parent_name}</span></p>
                                    )}
                                    <div className="flex gap-2 mt-3">
                                        <Link
                                            href={`/admin/kategorije/${cat.slug}/edit`}
                                            className="flex-1 text-center px-3 py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Izmeni
                                        </Link>
                                        <button
                                            onClick={() => destroy(cat.slug)}
                                            className="flex-1 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            Obriši
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {hasMore && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition disabled:opacity-50"
                            >
                                {loading && (
                                    <svg className="w-4 h-4 animate-spin text-orange-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                                {loading ? 'Učitavanje…' : 'Učitaj još'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
