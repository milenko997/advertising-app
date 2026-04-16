import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function StatCard({ label, value, sub, color = 'indigo', icon }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        orange: 'bg-orange-50 text-orange-600',
        green:  'bg-green-50  text-green-600',
        red:    'bg-red-50    text-red-600',
        amber:  'bg-amber-50  text-amber-600',
        slate:  'bg-slate-100 text-slate-600',
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 truncate">{label}</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function InboxCard({ label, count, href, color }) {
    const colors = {
        red:    'text-red-600 bg-red-50',
        orange: 'text-orange-600 bg-orange-50',
        indigo: 'text-indigo-600 bg-indigo-50',
    };

    return (
        <Link
            href={href}
            className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 hover:border-gray-300 transition-colors group"
        >
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
            <span className={`inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full text-xs font-bold ${count > 0 ? colors[color] : 'text-gray-400 bg-gray-100'}`}>
                {count}
            </span>
        </Link>
    );
}

function Sparkline({ data }) {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data.map(d => d.count), 1);
    const H = 56;
    const W = 100;
    const pts = data.map((d, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - (d.count / max) * H;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14" preserveAspectRatio="none">
            <polyline
                points={pts}
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

function MiniBar({ data }) {
    if (!data || data.length === 0) return null;
    const max = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="flex items-end gap-px h-12 w-full">
            {data.map((d, i) => (
                <div
                    key={i}
                    title={`${d.date}: ${d.count}`}
                    className="flex-1 bg-indigo-400 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
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
            <div id="page-admin-dashboard" className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Statistika</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Statistike i aktivnost platforme</p>
                        </div>
                        {totalInbox > 0 && (
                            <span className="inline-flex items-center gap-1.5 text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                                {totalInbox} nepročitano
                            </span>
                        )}
                    </div>

                    {/* Main stat cards */}
                    <div id="section-dashboard-stats" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Aktivni oglasi"
                            value={stats.ads.active.toLocaleString()}
                            sub={`${stats.ads.today} danas · ${stats.ads.thisWeek} ovaj nedelju`}
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
                            sub={`+${stats.users.newWeek} ovaj nedelju · +${stats.users.newMonth} ovaj mesec`}
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

                    {/* Chart + Inbox */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Chart */}
                        <div id="section-dashboard-chart" className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-800">Novi oglasi — poslednjih 30 dana</h2>
                                <span className="text-xs text-gray-400">{chartData.reduce((s, d) => s + d.count, 0)} ukupno</span>
                            </div>
                            <MiniBar data={chartData} />
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-400">{chartData[0]?.date}</span>
                                <span className="text-xs text-gray-400">{chartData[chartData.length - 1]?.date}</span>
                            </div>
                        </div>

                        {/* Inbox */}
                        <div id="section-dashboard-inbox" className="space-y-3">
                            <h2 className="text-sm font-semibold text-gray-800">Primljene poruke</h2>
                            <InboxCard label="Prijave" count={stats.inbox.reports} href="/admin/prijave" color="red" />
                            <InboxCard label="Kontakt poruke" count={stats.inbox.messages} href="/admin/poruke" color="orange" />
                            <InboxCard label="Povratne informacije" count={stats.inbox.feedbacks} href="/admin/utisci" color="indigo" />
                        </div>
                    </div>

                    {/* Bottom: Top categories + Recent ads + Recent users */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Top categories */}
                        <div id="section-dashboard-categories" className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h2 className="text-sm font-semibold text-gray-800 mb-1">Kategorije</h2>
                            <p className="text-xs text-gray-400 mb-4">Aktivni oglasi i pregledi po kategoriji</p>
                            {topCategories.length === 0 ? (
                                <p className="text-sm text-gray-400">Nema podataka.</p>
                            ) : (
                                <div className="space-y-3">
                                    {(() => {
                                        const maxCount = Math.max(...topCategories.map(c => c.count), 1);
                                        return topCategories.map((cat, i) => (
                                            <div key={i}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-medium text-gray-700 truncate max-w-[55%]">{cat.name}</span>
                                                    <div className="flex items-center gap-2.5 shrink-0">
                                                        <span className="text-xs text-gray-400" title="Pregledi">
                                                            <svg className="w-3 h-3 inline mr-0.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            {cat.views.toLocaleString()}
                                                        </span>
                                                        <span className="text-xs font-semibold text-gray-600" title="Oglasi">{cat.count}</span>
                                                    </div>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-400 rounded-full"
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
                        <div id="section-dashboard-recent-ads" className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-800">Najnoviji oglasi</h2>
                                <Link href="/admin/oglasi" className="text-xs text-indigo-600 hover:text-indigo-700">Svi →</Link>
                            </div>
                            {recentAds.length === 0 ? (
                                <p className="text-sm text-gray-400">Nema oglasa.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentAds.map(ad => (
                                        <div key={ad.id} className="flex items-start gap-3">
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/oglas/${ad.slug}`}
                                                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1"
                                                >
                                                    {ad.is_pinned && (
                                                        <span className="inline-block mr-1 text-orange-500 text-xs">📌</span>
                                                    )}
                                                    {ad.title}
                                                </Link>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    {ad.user_name && (
                                                        <Link href={`/korisnik/${ad.user_slug}`} className="text-xs text-gray-400 hover:text-indigo-500 transition-colors">
                                                            {ad.user_name}
                                                        </Link>
                                                    )}
                                                    <span className="text-gray-200">·</span>
                                                    <span className="text-xs text-gray-400">{ad.created_at}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent users */}
                        <div id="section-dashboard-recent-users" className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-gray-800">Novi korisnici</h2>
                                <Link href="/admin/korisnici" className="text-xs text-indigo-600 hover:text-indigo-700">Svi →</Link>
                            </div>
                            {recentUsers.length === 0 ? (
                                <p className="text-sm text-gray-400">Nema korisnika.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentUsers.map(u => (
                                        <div key={u.id} className="flex items-center gap-3">
                                            {u.avatar ? (
                                                <img
                                                    src={`/storage/${u.avatar}`}
                                                    alt={u.name}
                                                    className="w-8 h-8 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/korisnik/${u.slug}`}
                                                    className="text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors truncate block"
                                                >
                                                    {u.name}
                                                </Link>
                                                <p className="text-xs text-gray-400 truncate">{u.created_at}</p>
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
