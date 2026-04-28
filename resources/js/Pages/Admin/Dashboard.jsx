import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function StatCard({ label, value, sub, color = 'indigo', icon }) {
    const colors = {
        indigo: 'bg-orange-50 text-orange-600',
        orange: 'bg-orange-50 text-orange-600',
        green:  'bg-green-50  text-green-600',
        red:    'bg-red-50    text-red-600',
        amber:  'bg-amber-50  text-amber-600',
        slate:  'bg-slate-100 text-slate-600',
    };

    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 truncate">{label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-100 leading-tight mt-0.5">{value}</p>
                {sub && <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5 leading-snug">{sub}</p>}
            </div>
        </div>
    );
}

function InboxCard({ label, count, href, color }) {
    const colors = {
        red:    'text-red-600 bg-red-50',
        orange: 'text-orange-600 bg-orange-50',
        indigo: 'text-orange-600 bg-orange-50',
    };

    return (
        <Link
            href={href}
            className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm px-4 py-3.5 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
        >
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">{label}</span>
            <span className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-xs font-bold ${count > 0 ? colors[color] : 'text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-700'}`}>
                {count}
            </span>
        </Link>
    );
}

function MiniBar({ data }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map(d => d.count), 1);
    const summary = data.map(d => `${d.date}: ${d.count}`).join(', ');

    return (
        <div
            role="img"
            aria-label={`Grafikon aktivnosti: ${summary}`}
            className="flex items-end gap-px h-14 w-full"
        >
            {data.map((d, i) => (
                <div
                    key={i}
                    title={`${d.date}: ${d.count}`}
                    aria-hidden="true"
                    className="flex-1 bg-orange-400 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                    style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 4 : 0)}%` }}
                />
            ))}
        </div>
    );
}

export default function AdminDashboard({ stats, chartData, topCategories, recentAds, recentUsers }) {
    const totalInbox = stats.inbox.reports + stats.inbox.messages + stats.inbox.feedbacks;

    return (
        <AppLayout>
            <Head title="Statistika — Admin" />
            <div id="page-admin-dashboard" className="py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Statistika</h1>
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Statistike i aktivnost platforme</p>
                        </div>
                        {totalInbox > 0 && (
                            <span className="inline-flex items-center gap-1.5 text-sm text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800">
                                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                                {totalInbox} nepročitano
                            </span>
                        )}
                    </div>

                    {/* Stat cards — 1 col mobile, 2 sm, 3 md, 5 xl */}
                    <div id="section-dashboard-stats" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                        <StatCard
                            label="Aktivni oglasi"
                            value={stats.ads.active.toLocaleString()}
                            sub={`${stats.ads.today} danas · ${stats.ads.thisWeek} ove nedelje`}
                            color="indigo"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                        />
                        <StatCard
                            label="Ukupno oglasa"
                            value={stats.ads.total.toLocaleString()}
                            sub={`${stats.ads.expired} isteklo · ${stats.ads.pinned} istaknuto`}
                            color="slate"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
                        />
                        <StatCard
                            label="Korisnici"
                            value={stats.users.total.toLocaleString()}
                            sub={`+${stats.users.newWeek} nedelja · +${stats.users.newMonth} mesec`}
                            color="green"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        />
                        <StatCard
                            label="Ukupno pregleda"
                            value={stats.ads.views.toLocaleString()}
                            sub="svih oglasa"
                            color="amber"
                            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                        />
                        <StatCard
                            label="Recenzije"
                            value={stats.reviews.total.toLocaleString()}
                            sub={stats.reviews.avg > 0 ? `Prosek: ${stats.reviews.avg} ★` : 'Još nema recenzija'}
                            color="orange"
                            icon={<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
                        />
                    </div>

                    {/* Chart + Inbox — stacked on mobile, side-by-side from md */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

                        {/* Chart */}
                        <div id="section-dashboard-chart" className="md:col-span-2 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">Novi oglasi — poslednjih 30 dana</h2>
                                <span className="text-xs text-gray-400 dark:text-neutral-500 shrink-0 ml-2">{chartData.reduce((s, d) => s + d.count, 0)} ukupno</span>
                            </div>
                            <MiniBar data={chartData} />
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-400 dark:text-neutral-500">{chartData[0]?.date}</span>
                                <span className="text-xs text-gray-400 dark:text-neutral-500">{chartData[chartData.length - 1]?.date}</span>
                            </div>
                        </div>

                        {/* Inbox */}
                        <div id="section-dashboard-inbox" className="flex flex-col gap-3">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">Primljene poruke</h2>
                            <InboxCard label="Prijave" count={stats.inbox.reports} href="/admin/prijave" color="red" />
                            <InboxCard label="Kontakt poruke" count={stats.inbox.messages} href="/admin/poruke" color="orange" />
                            <InboxCard label="Povratne informacije" count={stats.inbox.feedbacks} href="/admin/utisci" color="indigo" />
                        </div>
                    </div>

                    {/* Bottom — stacked on mobile, 2 cols on md, 3 cols on lg */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                        {/* Top categories */}
                        <div id="section-dashboard-categories" className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-4 sm:p-5">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 mb-0.5">Kategorije</h2>
                            <p className="text-xs text-gray-400 dark:text-neutral-500 mb-4">Aktivni oglasi i pregledi po kategoriji</p>
                            {topCategories.length === 0 ? (
                                <p className="text-sm text-gray-400 dark:text-neutral-500">Nema podataka.</p>
                            ) : (
                                <div className="space-y-3">
                                    {(() => {
                                        const maxCount = Math.max(...topCategories.map(c => c.count), 1);
                                        return topCategories.map((cat, i) => (
                                            <div key={i}>
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="text-xs font-medium text-gray-700 dark:text-neutral-300 truncate">{cat.name}</span>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="text-xs text-gray-400 dark:text-neutral-500 tabular-nums" title="Pregledi">
                                                            <svg className="w-3 h-3 inline mr-0.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            {cat.views.toLocaleString()}
                                                        </span>
                                                        <span className="text-xs font-semibold text-gray-600 dark:text-neutral-400 tabular-nums" title="Oglasi">{cat.count}</span>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-orange-400 rounded-full"
                                                        style={{ width: `${(cat.count / maxCount) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            )}
                        </div>

                        {/* Recent ads */}
                        <div id="section-dashboard-recent-ads" className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">Najnoviji oglasi</h2>
                                <Link href="/admin/oglasi" className="text-xs text-orange-600 hover:text-orange-700">Svi →</Link>
                            </div>
                            {recentAds.length === 0 ? (
                                <p className="text-sm text-gray-400 dark:text-neutral-500">Nema oglasa.</p>
                            ) : (
                                <div className="divide-y divide-gray-50 dark:divide-neutral-700">
                                    {recentAds.map(ad => (
                                        <div key={ad.id} className="py-2.5 first:pt-0 last:pb-0">
                                            <Link
                                                href={`/oglas/${ad.slug}`}
                                                className="text-sm font-medium text-gray-800 dark:text-neutral-200 hover:text-orange-600 transition-colors line-clamp-1"
                                            >
                                                {ad.is_pinned && (
                                                    <svg className="inline-block mr-1 w-3 h-3 text-orange-500 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                                    </svg>
                                                )}
                                                {ad.title}
                                            </Link>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {ad.user_name && (
                                                    <Link href={`/korisnik/${ad.user_slug}`} className="text-xs text-gray-400 dark:text-neutral-500 hover:text-orange-500 transition-colors truncate">
                                                        {ad.user_name}
                                                    </Link>
                                                )}
                                                <span className="text-gray-300 dark:text-neutral-600 shrink-0">·</span>
                                                <span className="text-xs text-gray-400 dark:text-neutral-500 shrink-0">{ad.created_at}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent users — spans full width on md (2-col), normal on lg (3-col) */}
                        <div id="section-dashboard-recent-users" className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-4 sm:p-5 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-neutral-200">Novi korisnici</h2>
                                <Link href="/admin/korisnici" className="text-xs text-orange-600 hover:text-orange-700">Svi →</Link>
                            </div>
                            {recentUsers.length === 0 ? (
                                <p className="text-sm text-gray-400 dark:text-neutral-500">Nema korisnika.</p>
                            ) : (
                                <div className="divide-y divide-gray-50 dark:divide-neutral-700">
                                    {recentUsers.map(u => (
                                        <div key={u.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                                            {u.avatar ? (
                                                <img
                                                    src={`/storage/${u.avatar}`}
                                                    alt={u.name}
                                                    className="w-8 h-8 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/korisnik/${u.slug}`}
                                                    className="text-sm font-medium text-gray-800 dark:text-neutral-200 hover:text-orange-600 transition-colors truncate block"
                                                >
                                                    {u.name}
                                                </Link>
                                                <p className="text-xs text-gray-400 dark:text-neutral-500">{u.created_at}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
