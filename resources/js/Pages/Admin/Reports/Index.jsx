import { Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const TYPE_COLORS = {
    wrong_category: 'bg-blue-50 text-blue-700',
    duplicate_spam: 'bg-amber-50 text-amber-700',
    against_rules:  'bg-red-50 text-red-700',
    ignore_user:    'bg-purple-50 text-purple-700',
};

export default function AdminReportsIndex({ reports }) {
    const pending  = reports.filter(r => !r.resolved);
    const resolved = reports.filter(r => r.resolved);

    const toggleResolve = (id) => {
        router.patch(`/admin/reports/${id}/resolve`, {}, { preserveScroll: true });
    };

    const destroy = (id) => {
        if (!confirm('Delete this report?')) return;
        router.delete(`/admin/reports/${id}`, { preserveScroll: true });
    };

    const ReportRow = ({ report }) => (
        <tr className={`hover:bg-gray-50 transition-colors ${report.resolved ? 'opacity-60' : ''}`}>
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={report.resolved}
                    onChange={() => toggleResolve(report.id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
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
                        href={`/advertisements/${report.advertisement.slug}`}
                        className="text-sm font-medium text-indigo-600 hover:underline line-clamp-1"
                        target="_blank"
                    >
                        {report.advertisement.title}
                    </Link>
                ) : (
                    <span className="text-sm text-gray-400 italic">Ad deleted</span>
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
                        {report.resolved ? 'Re-open' : 'Resolve'}
                    </button>
                    <button
                        onClick={() => destroy(report.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <AppLayout>
            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {pending.length} pending · {resolved.length} resolved
                            </p>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                            <h2 className="text-sm font-semibold text-gray-700">Pending</h2>
                            {pending.length > 0 && (
                                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                                    {pending.length}
                                </span>
                            )}
                        </div>
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2.5 w-8" />
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ad</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reported by</th>
                                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-2.5" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pending.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                                            No pending reports.
                                        </td>
                                    </tr>
                                ) : pending.map(r => <ReportRow key={r.id} report={r} />)}
                            </tbody>
                        </table>
                    </div>

                    {/* Resolved */}
                    {resolved.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                                <h2 className="text-sm font-semibold text-gray-700">Resolved</h2>
                            </div>
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2.5 w-8" />
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ad</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reported by</th>
                                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-4 py-2.5" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {resolved.map(r => <ReportRow key={r.id} report={r} />)}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>
        </AppLayout>
    );
}
