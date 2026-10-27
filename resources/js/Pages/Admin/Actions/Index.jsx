import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function AdminActionsIndex({ actions, action = '', labels = {} }) {
    const filter = (value) => {
        router.get('/admin/dnevnik', value ? { action: value } : {}, { preserveScroll: true, replace: true });
    };

    return (
        <AppLayout>
            <Head title="Dnevnik admin akcija — Admin" />
            <div id="page-admin-actions" className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Dnevnik admin akcija</h1>
                        <select
                            value={action}
                            onChange={e => filter(e.target.value)}
                            aria-label="Filter po akciji"
                            className="rounded-lg border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 text-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                            <option value="">Sve akcije</option>
                            {Object.entries(labels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                        {actions.data.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm text-gray-400 dark:text-neutral-500">Nema zabeleženih akcija.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100 dark:divide-neutral-700">
                                {actions.data.map(a => (
                                    <li key={a.id} className="px-4 py-3 sm:flex sm:items-start sm:gap-4">
                                        <span className="block sm:w-32 shrink-0 text-xs text-gray-400 dark:text-neutral-500 whitespace-nowrap">{a.created_at}</span>
                                        <span className="block sm:w-36 shrink-0 text-sm font-medium text-gray-700 dark:text-neutral-300">{a.admin}</span>
                                        <span className="block sm:w-44 shrink-0 text-sm font-semibold text-orange-600">{a.label}</span>
                                        <span className="block text-sm text-gray-600 dark:text-neutral-400 break-words min-w-0">{a.description}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {(actions.prev_page_url || actions.next_page_url) && (
                        <div className="flex justify-between mt-6 text-sm">
                            {actions.prev_page_url
                                ? <Link href={actions.prev_page_url} preserveScroll className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700">← Novije</Link>
                                : <span />}
                            {actions.next_page_url && (
                                <Link href={actions.next_page_url} preserveScroll className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700">Starije →</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
