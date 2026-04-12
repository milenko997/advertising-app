import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

export default function CategoriesIndex({ categories: initialCategories }) {
    const [categoryList, setCategoryList] = useState(initialCategories.data);
    const [currentPage, setCurrentPage] = useState(initialCategories.current_page);
    const [hasMore, setHasMore] = useState(initialCategories.current_page < initialCategories.last_page);
    const [loading, setLoading] = useState(false);

    const destroy = (slug) => {
        if (!confirm('Are you sure?')) return;
        router.delete(`/admin/categories/${slug}`, {
            onSuccess: () => setCategoryList(prev => prev.filter(c => c.slug !== slug)),
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/admin/categories?page=${nextPage}`);
            setCategoryList(prev => [...prev, ...data.categories]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout header={
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Categories</h2>
                <Link
                    href="/admin/categories/create"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                    + Add Category
                </Link>
            </div>
        }>
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categoryList.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                                            No categories found.
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
                                                    href={`/admin/categories/${cat.slug}/edit`}
                                                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => destroy(cat.slug)}
                                                    className="px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {hasMore && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-indigo-300 transition disabled:opacity-50"
                            >
                                {loading && (
                                    <svg className="w-4 h-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                )}
                                {loading ? 'Loading…' : 'Load More'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
