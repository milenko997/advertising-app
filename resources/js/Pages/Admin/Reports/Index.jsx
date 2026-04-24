import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

const TYPE_COLORS = {
    wrong_category: 'bg-blue-50 text-blue-700',
    duplicate_spam: 'bg-amber-50 text-amber-700',
    against_rules:  'bg-red-50 text-red-700',
    ignore_user:    'bg-purple-50 text-purple-700',
};

export default function AdminReportsIndex({ reports: initialReports }) {
    const [reportList, setReportList] = useState(initialReports.data);
    const [currentPage, setCurrentPage] = useState(initialReports.current_page);
    const [hasMore, setHasMore] = useState(initialReports.current_page < initialReports.last_page);
    const [loading, setLoading] = useState(false);

    const pending  = reportList.filter(r => !r.resolved);
    const resolved = reportList.filter(r => r.resolved);

    const toggleResolve = (id) => {
        router.patch(`/admin/prijave/${id}/resolve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setReportList(prev => prev.map(r => r.id === id ? { ...r, resolved: !r.resolved } : r));
            },
        });
    };

    const destroy = (id) => {
        if (!confirm('Obrisati ovu prijavu?')) return;
        router.delete(`/admin/prijave/${id}`, {
            preserveScroll: true,
            onSuccess: () => setReportList(prev => prev.filter(r => r.id !== id)),
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/admin/prijave?page=${nextPage}`);
            setReportList(prev => [...prev, ...data.reports]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    const ReportRow = ({ report }) => (
        <tr className={`hover:bg-gray-50 transition-colors ${report.resolved ? 'opacity-60' : ''}`}>
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={report.resolved}
                    onChange={() => toggleResolve(report.id)}
                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
            </td>
            <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${TYPE_COLORS[report.type] ?? 'bg-gray-100 text-gray-700'}`}>
                    {report.label}
                </span>
            </td>
            <td className="px-4 py-3">
                {report.advertisement ? (
                    <Link
                        href={`/oglas/${report.advertisement.slug}`}
                        className="text-sm font-medium text-orange-600 hover:underline line-clamp-1"
                        target="_blank"
                    >
                        {report.advertisement.title}
                    </Link>
                ) : (
                    <span className="text-sm text-gray-400 italic">Oglas obrisan</span>
                )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
                {report.reporter?.name ?? '—'}
            </td>
            <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">
                {report.created_at}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => toggleResolve(report.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
                            report.resolved
                                ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                        }`}
                    >
                        {report.resolved ? 'Ponovo otvori' : 'Reši'}
                    </button>
                    <button
                        onClick={() => destroy(report.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Obriši
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <AppLayout>
            <Head><title>Prijave — AdBoard Admin</title></Head>
            <div id="page-admin-reports" className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Prijave</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {pending.length} na čekanju · {resolved.length} rešenih
                            </p>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                            <h2 className="text-sm font-semibold text-gray-700">Na čekanju</h2>
                            {pending.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                                    {pending.length}
                                </span>
                            )}
                        </div>
                        {/* Desktop table */}
                        <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2.5 w-8" />
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tip</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Oglas</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prijavio</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                                    <th className="px-4 py-2.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pending.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                                            Nema prijava na čekanju.
                                        </td>
                                    </tr>
                                ) : pending.map(r => <ReportRow key={r.id} report={r} />)}
                            </tbody>
                        </table>
                        </div>
                        {/* Mobile cards */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {pending.length === 0 ? (
                                <p className="px-4 py-10 text-center text-sm text-gray-400">Nema prijava na čekanju.</p>
                            ) : pending.map(r => (
                                <div key={r.id} className={`p-4 ${r.resolved ? 'opacity-60' : ''}`}>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${TYPE_COLORS[r.type] ?? 'bg-gray-100 text-gray-700'}`}>
                                            {r.label}
                                        </span>
                                        <span className="text-xs text-gray-400">{r.created_at}</span>
                                    </div>
                                    <div className="mb-3">
                                        {r.advertisement ? (
                                            <Link href={`/oglas/${r.advertisement.slug}`} className="text-sm font-medium text-orange-600 hover:underline line-clamp-1" target="_blank">
                                                {r.advertisement.title}
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Oglas obrisan</span>
                                        )}
                                        <p className="text-xs text-gray-500 mt-0.5">Prijavio: {r.reporter?.name ?? '—'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => toggleResolve(r.id)}
                                            className="flex-1 text-center px-3 py-2 text-xs font-medium rounded-lg border transition border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                                        >
                                            Reši
                                        </button>
                                        <button
                                            onClick={() => destroy(r.id)}
                                            className="flex-1 px-3 py-2 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            Obriši
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resolved */}
                    {resolved.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                <h2 className="text-sm font-semibold text-gray-700">Rešene</h2>
                            </div>
                            {/* Desktop table */}
                            <div className="hidden md:block">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2.5 w-8" />
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tip</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Oglas</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prijavio</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                                        <th className="px-4 py-2.5" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {resolved.map(r => <ReportRow key={r.id} report={r} />)}
                                </tbody>
                            </table>
                            </div>
                            {/* Mobile cards */}
                            <div className="md:hidden divide-y divide-gray-100">
                                {resolved.map(r => (
                                    <div key={r.id} className="p-4 opacity-60">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${TYPE_COLORS[r.type] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {r.label}
                                            </span>
                                            <span className="text-xs text-gray-400">{r.created_at}</span>
                                        </div>
                                        <div className="mb-3">
                                            {r.advertisement ? (
                                                <Link href={`/oglas/${r.advertisement.slug}`} className="text-sm font-medium text-orange-600 hover:underline line-clamp-1" target="_blank">
                                                    {r.advertisement.title}
                                                </Link>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Oglas obrisan</span>
                                            )}
                                            <p className="text-xs text-gray-500 mt-0.5">Prijavio: {r.reporter?.name ?? '—'}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleResolve(r.id)}
                                                className="flex-1 text-center px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                                            >
                                                Ponovo otvori
                                            </button>
                                            <button
                                                onClick={() => destroy(r.id)}
                                                className="flex-1 px-3 py-2 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                            >
                                                Obriši
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasMore && (
                        <div className="text-center">
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
