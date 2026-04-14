import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

export default function CustomersIndex({ customers: initialCustomers }) {
    const [customerList, setCustomerList] = useState(initialCustomers.data);
    const [currentPage, setCurrentPage] = useState(initialCustomers.current_page);
    const [hasMore, setHasMore] = useState(initialCustomers.current_page < initialCustomers.last_page);
    const [loading, setLoading] = useState(false);

    const destroy = (slug) => {
        if (!confirm('Da li ste sigurni?')) return;
        router.delete(`/admin/customers/${slug}`, {
            onSuccess: () => setCustomerList(prev => prev.filter(c => c.slug !== slug)),
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/admin/customers?page=${nextPage}`);
            setCustomerList(prev => [...prev, ...data.customers]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Korisnici</h2>}>
            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ime</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uloga</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registrovan</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customerList.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                                            Nema korisnika.
                                        </td>
                                    </tr>
                                ) : customerList.map(customer => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold shrink-0">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900 text-sm">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                                customer.role === 'admin'
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{customer.created_at}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/customers/${customer.slug}/edit`}
                                                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                                >
                                                    Izmeni
                                                </Link>
                                                <button
                                                    onClick={() => destroy(customer.slug)}
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
                                {loading ? 'Učitavanje…' : 'Učitaj još'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
