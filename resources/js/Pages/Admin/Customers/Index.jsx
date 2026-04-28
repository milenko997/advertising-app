import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

export default function CustomersIndex({ customers: initialCustomers, search: initialSearch = '' }) {
    const [customerList, setCustomerList] = useState(initialCustomers.data);
    const [currentPage, setCurrentPage] = useState(initialCustomers.current_page);
    const [hasMore, setHasMore] = useState(initialCustomers.current_page < initialCustomers.last_page);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const debounceRef = useRef(null);

    // When Inertia delivers fresh props after a search, reset the list.
    useEffect(() => {
        setCustomerList(initialCustomers.data);
        setCurrentPage(initialCustomers.current_page);
        setHasMore(initialCustomers.current_page < initialCustomers.last_page);
    }, [initialCustomers]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            router.get('/admin/korisnici', { search: value }, { preserveState: true, replace: true });
        }, 400);
    };

    const destroy = (slug) => {
        if (!confirm('Da li ste sigurni?')) return;
        router.delete(`/admin/korisnici/${slug}`, {
            onSuccess: () => setCustomerList(prev => prev.filter(c => c.slug !== slug)),
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(
                `/admin/korisnici?page=${nextPage}&search=${encodeURIComponent(search)}`
            );
            setCustomerList(prev => [...prev, ...data.customers]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    const emptyMessage = search
        ? 'Nema korisnika koji odgovaraju pretrazi.'
        : 'Nema korisnika.';

    return (
        <AppLayout>
            <Head title="Korisnici — Admin" />
            <div id="page-admin-customers" className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Korisnici</h1>
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Svi registrovani korisnici</p>
                        </div>
                        <Link
                            href="/admin/korisnici/create"
                            className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition"
                        >
                            + Dodaj korisnika
                        </Link>
                    </div>

                    <div className="mb-4">
                        <input
                            type="search"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Pretraži po imenu ili email-u…"
                            className="w-full sm:w-80 px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400"
                        />
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                        {/* Desktop table */}
                        <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Ime</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Uloga</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Registrovan</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                                {customerList.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center text-gray-500 dark:text-neutral-400">
                                            {emptyMessage}
                                        </td>
                                    </tr>
                                ) : customerList.map(customer => (
                                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {customer.avatar ? (
                                                    <img
                                                        src={`/storage/${customer.avatar}`}
                                                        alt={customer.name}
                                                        className="w-8 h-8 rounded-full object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-semibold shrink-0">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-900 dark:text-neutral-100 text-sm">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-neutral-400">{customer.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                                customer.role === 'admin'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400'
                                            }`}>
                                                {customer.role === 'admin' ? 'Admin' : 'Korisnik'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 dark:text-neutral-500">{customer.created_at}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/korisnici/${customer.slug}/edit`}
                                                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
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

                        {/* Mobile cards */}
                        <div className="md:hidden divide-y divide-gray-100 dark:divide-neutral-700">
                            {customerList.length === 0 ? (
                                <p className="px-4 py-10 text-center text-sm text-gray-400 dark:text-neutral-500">{emptyMessage}</p>
                            ) : customerList.map(customer => (
                                <div key={customer.id} className="p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        {customer.avatar ? (
                                            <img src={`/storage/${customer.avatar}`} alt={customer.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-sm font-semibold shrink-0">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-neutral-100 text-sm">{customer.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">{customer.email}</p>
                                        </div>
                                        <span className={`shrink-0 inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                            customer.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400'
                                        }`}>
                                            {customer.role === 'admin' ? 'Admin' : 'Korisnik'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-neutral-500 mb-3">Registrovan: {customer.created_at}</p>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/korisnici/${customer.slug}/edit`}
                                            className="flex-1 text-center px-3 py-2 text-sm font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                                        >
                                            Izmeni
                                        </Link>
                                        <button
                                            onClick={() => destroy(customer.slug)}
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
                                className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700 hover:border-orange-300 transition disabled:opacity-50"
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
