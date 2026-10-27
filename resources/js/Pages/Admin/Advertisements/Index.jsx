import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

const STATUS = {
    active:   { label: 'Aktivan',       className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', date: 'Ističe' },
    expiring: { label: 'Ističe uskoro', className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',         date: 'Ističe' },
    expired:  { label: 'Istekao',       className: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',               date: 'Isteklo' },
};

function StatusBadge({ ad }) {
    const status = STATUS[ad.status] ?? STATUS.active;
    return (
        <div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold whitespace-nowrap ${status.className}`}>
                {status.label}
            </span>
            {ad.expires_at && (
                <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-0.5 whitespace-nowrap">{status.date} {ad.expires_at}</p>
            )}
        </div>
    );
}

const FILTERS = [
    { value: '',         label: 'Svi' },
    { value: 'active',   label: 'Aktivni' },
    { value: 'expiring', label: 'Ističu uskoro' },
    { value: 'expired',  label: 'Istekli' },
];

// Opens in a new tab so the filtered admin list stays where it was
function AdTitleLink({ ad }) {
    return (
        <a
            href={`/oglas/${ad.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Otvori oglas u novom tabu"
            className="hover:text-orange-600 hover:underline"
        >
            {ad.title}
        </a>
    );
}

function UserFilterLink({ ad, onFilter }) {
    if (!ad.user) return '—';
    return (
        <button
            type="button"
            onClick={() => onFilter(ad.user.id)}
            title="Prikaži samo oglase ovog korisnika"
            className="text-left hover:text-orange-600 hover:underline"
        >
            {ad.user.name}
        </button>
    );
}

export default function AdminAdvertisementsIndex({ ads: initialAds, search: initialSearch = '', status = '', counts = {}, category = null, categories = [], user = null, users = [] }) {
    const [adList, setAdList] = useState(initialAds.data);
    const [currentPage, setCurrentPage] = useState(initialAds.current_page);
    const [hasMore, setHasMore] = useState(initialAds.current_page < initialAds.last_page);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(new Set());
    const [search, setSearch] = useState(initialSearch);
    const debounceRef = useRef(null);
    const [pinning, setPinning] = useState(new Set());

    useEffect(() => {
        setAdList(initialAds.data);
        setCurrentPage(initialAds.current_page);
        setHasMore(initialAds.current_page < initialAds.last_page);
        setSelected(new Set());
    }, [initialAds]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilters({ search: value }, { preserveScroll: false });
        }, 400);
    };

    const applyFilters = (changes, options = {}) => {
        const params = { search, status, category, user, ...changes };
        // Leave empty filters out of the URL
        const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));
        router.get('/admin/oglasi', query, {
            preserveState: true, preserveScroll: true, replace: true, ...options,
        });
    };

    const allSelected = adList.length > 0 && selected.size === adList.length;
    const someSelected = selected.size > 0;

    const toggleAll = () => {
        if (allSelected) {
            setSelected(new Set());
        } else {
            setSelected(new Set(adList.map(a => a.id)));
        }
    };

    const toggleOne = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const destroy = (id) => {
        if (!confirm('Da li ste sigurni?')) return;
        router.delete(`/admin/oglasi/${id}`, {
            onSuccess: () => {
                setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
                setAdList(prev => prev.filter(a => a.id !== id));
            },
        });
    };

    // Full reload of props so the status badge and filter counts follow the new expiry date
    const renew = (id) => {
        if (pinning.has(`renew-${id}`)) return;
        setPinning(prev => new Set(prev).add(`renew-${id}`));
        router.patch(`/admin/oglasi/${id}/obnovi`, {}, {
            preserveScroll: true,
            onFinish: () => setPinning(prev => { const n = new Set(prev); n.delete(`renew-${id}`); return n; }),
        });
    };

    const togglePin = (id) => {
        if (pinning.has(`pin-${id}`)) return;
        setPinning(prev => new Set(prev).add(`pin-${id}`));
        router.patch(`/admin/oglasi/${id}/pin`, {}, {
            preserveScroll: true,
            only: ['flash'],
            onSuccess: () => {
                const d = new Date(); const today = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
                setAdList(prev => prev.map(a => a.id === id ? { ...a, is_pinned: !a.is_pinned, pinned_at: !a.is_pinned ? today : null } : a));
            },
            onFinish: () => setPinning(prev => { const n = new Set(prev); n.delete(`pin-${id}`); return n; }),
        });
    };

    const togglePinCategory = (id) => {
        if (pinning.has(`cat-${id}`)) return;
        setPinning(prev => new Set(prev).add(`cat-${id}`));
        router.patch(`/admin/oglasi/${id}/pin-category`, {}, {
            preserveScroll: true,
            only: ['flash'],
            onSuccess: () => {
                const d = new Date(); const today = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
                setAdList(prev => prev.map(a => a.id === id ? { ...a, is_pinned_category: !a.is_pinned_category, pinned_category_at: !a.is_pinned_category ? today : null } : a));
            },
            onFinish: () => setPinning(prev => { const n = new Set(prev); n.delete(`cat-${id}`); return n; }),
        });
    };

    const bulkAction = (action) => {
        const ids = [...selected];
        if (action === 'delete' && !confirm(`Obrisati ${ids.length} izabrani oglas(e)?`)) return;
        router.post('/admin/oglasi/bulk-action', { action, ids }, {
            preserveScroll: true,
            onSuccess: () => {
                if (action === 'delete') {
                    setAdList(prev => prev.filter(a => !ids.includes(a.id)));
                } else {
                    setAdList(prev => prev.map(a => ids.includes(a.id) ? { ...a, is_pinned: action === 'pin' } : a));
                }
                setSelected(new Set());
            },
        });
    };

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = currentPage + 1;
        try {
            const { data } = await axios.get(`/admin/oglasi?page=${nextPage}&search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&category=${encodeURIComponent(category ?? '')}&user=${encodeURIComponent(user ?? '')}`);
            setAdList(prev => [...prev, ...data.ads]);
            setHasMore(data.hasMore);
            setCurrentPage(nextPage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Oglasi — Admin" />
            <div id="page-admin-ads" className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Oglasi</h1>
                            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">Svi oglasi</p>
                        </div>
                    </div>

                    <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
                        <input
                            type="search"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Pretraži po naslovu, korisniku, kategoriji, lokaciji…"
                            className="w-full sm:w-96 px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400"
                        />
                        <select
                            value={category ?? ''}
                            onChange={e => applyFilters({ category: e.target.value })}
                            aria-label="Filter po kategoriji"
                            className="w-full sm:w-56 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100"
                        >
                            <option value="">Sve kategorije</option>
                            {categories.map(parent => (
                                <optgroup key={parent.id} label={parent.name}>
                                    <option value={parent.id}>{parent.name} (sve)</option>
                                    {parent.children.map(child => (
                                        <option key={child.id} value={child.id}>{child.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <select
                            value={user ?? ''}
                            onChange={e => applyFilters({ user: e.target.value })}
                            aria-label="Filter po korisniku"
                            className="w-full sm:w-56 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100"
                        >
                            <option value="">Svi korisnici</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {/* Email only disambiguates users who share a name */}
                                    {users.some(o => o.id !== u.id && o.name === u.name) ? `${u.name} (${u.email})` : u.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter po statusu">
                            {FILTERS.map(f => {
                                const activeFilter = status === f.value;
                                return (
                                    <button
                                        key={f.value || 'all'}
                                        type="button"
                                        onClick={() => applyFilters({ status: f.value })}
                                        aria-pressed={activeFilter}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition inline-flex items-center gap-1.5 ${
                                            activeFilter
                                                ? 'bg-orange-600 border-orange-600 text-white'
                                                : 'border-gray-300 dark:border-neutral-600 text-gray-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        {f.label}
                                        <span className={`text-[11px] ${activeFilter ? 'text-orange-100' : 'text-gray-400 dark:text-neutral-500'}`}>
                                            {counts[f.value || 'all'] ?? 0}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bulk toolbar */}
                    {someSelected && (
                        <div className="mb-4 flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-3">
                            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                                {selected.size} izabrano
                            </span>
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={() => bulkAction('pin')}
                                    className="px-3 py-1.5 text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-200 transition inline-flex items-center gap-1"
                                >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                    </svg>
                                    Prikači izabrane
                                </button>
                                <button
                                    onClick={() => bulkAction('unpin')}
                                    className="px-3 py-1.5 text-xs font-semibold border border-gray-300 dark:border-neutral-600 text-gray-600 dark:text-neutral-400 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                                >
                                    Otkači izabrane
                                </button>
                                <button
                                    onClick={() => bulkAction('delete')}
                                    className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Obriši izabrane
                                </button>
                                <button
                                    onClick={() => setSelected(new Set())}
                                    className="ml-1 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-gray-400 transition"
                                    aria-label="Poništi selekciju"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm overflow-hidden">
                        {/* Desktop table */}
                        <div className="hidden md:block">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-4 py-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={toggleAll}
                                            aria-label={allSelected ? 'Poništi selekciju' : 'Izaberi sve'}
                                            className="w-4 h-4 rounded border-gray-300 dark:border-neutral-600 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider w-48">Naslov</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Kategorija</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Korisnik</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Cena</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Datum</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                                {adList.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-16 text-center text-gray-500 dark:text-neutral-400">
                                            {search || status || category || user ? 'Nema oglasa koji odgovaraju filteru.' : 'Nema oglasa.'}
                                        </td>
                                    </tr>
                                ) : adList.map(ad => (
                                    <tr
                                        key={ad.id}
                                        className={`hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors ${selected.has(ad.id) ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}
                                    >
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(ad.id)}
                                                onChange={() => toggleOne(ad.id)}
                                                aria-label={`Izaberi: ${ad.title}`}
                                                className="w-4 h-4 rounded border-gray-300 dark:border-neutral-600 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-4 w-48">
                                            <p className="font-medium text-gray-900 dark:text-neutral-100 text-sm truncate max-w-[11rem]"><AdTitleLink ad={ad} /></p>
                                            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5 truncate max-w-[11rem]">{ad.description}</p>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-neutral-400">{ad.category?.name}</td>
                                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-neutral-400"><UserFilterLink ad={ad} onFilter={id => applyFilters({ user: id })} /></td>
                                        <td className="px-4 py-4 text-sm font-semibold text-orange-600 whitespace-nowrap">{ad.price || '—'}</td>
                                        <td className="px-4 py-4 text-sm text-gray-400 dark:text-neutral-500 whitespace-nowrap">{ad.created_at}</td>
                                        <td className="px-4 py-4"><StatusBadge ad={ad} /></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Global pin */}
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <button
                                                        onClick={() => togglePin(ad.id)}
                                                        disabled={pinning.has(`pin-${ad.id}`)}
                                                        title={ad.is_pinned ? `Prikačeno: ${ad.pinned_at} — klikni za uklanjanje` : 'Prikači globalno'}
                                                        className={`px-2 py-1.5 text-xs font-medium rounded-lg transition inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                            ad.is_pinned
                                                                ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
                                                                : 'border border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700'
                                                        }`}
                                                    >
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                                        </svg>
                                                        Global
                                                    </button>
                                                    {ad.is_pinned && (
                                                        <span className="text-[10px] text-amber-600">{ad.pinned_at ?? '—'}</span>
                                                    )}
                                                </div>
                                                {/* Category pin */}
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <button
                                                        onClick={() => togglePinCategory(ad.id)}
                                                        disabled={pinning.has(`cat-${ad.id}`)}
                                                        title={ad.is_pinned_category ? `Prikačeno: ${ad.pinned_category_at} — klikni za uklanjanje` : 'Prikači u kategoriji'}
                                                        className={`px-2 py-1.5 text-xs font-medium rounded-lg transition inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                            ad.is_pinned_category
                                                                ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
                                                                : 'border border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700'
                                                        }`}
                                                    >
                                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
                                                        </svg>
                                                        Kategorija
                                                    </button>
                                                    {ad.is_pinned_category && (
                                                        <span className="text-[10px] text-blue-600">{ad.pinned_category_at ?? '—'}</span>
                                                    )}
                                                </div>
                                                {ad.status === 'expired' && (
                                                    <button
                                                        onClick={() => renew(ad.id)}
                                                        disabled={pinning.has(`renew-${ad.id}`)}
                                                        title="Obnovi oglas na još 60 dana"
                                                        className="px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Obnovi
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/oglasi/${ad.id}/edit`}
                                                    className="px-3 py-1.5 text-sm font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                                                >
                                                    Izmeni
                                                </Link>
                                                <button
                                                    onClick={() => destroy(ad.id)}
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
                        <div className="md:hidden">
                            {adList.length > 0 && (
                                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-neutral-700 flex items-center gap-2 bg-gray-50 dark:bg-neutral-800">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        aria-label={allSelected ? 'Poništi selekciju' : 'Izaberi sve'}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-neutral-600 text-orange-600 focus:ring-orange-500 cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-neutral-400">Izaberi sve</span>
                                </div>
                            )}
                            <div className="divide-y divide-gray-100 dark:divide-neutral-700">
                                {adList.length === 0 ? (
                                    <p className="px-4 py-10 text-center text-sm text-gray-400 dark:text-neutral-500">
                                        {search || status || category || user ? 'Nema oglasa koji odgovaraju filteru.' : 'Nema oglasa.'}
                                    </p>
                                ) : adList.map(ad => (
                                    <div key={ad.id} className={`p-4 ${selected.has(ad.id) ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
                                        <div className="flex items-start gap-3 mb-3">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(ad.id)}
                                                onChange={() => toggleOne(ad.id)}
                                                aria-label={`Izaberi: ${ad.title}`}
                                                className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-neutral-600 text-orange-600 focus:ring-orange-500 cursor-pointer shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-neutral-100 text-sm truncate"><AdTitleLink ad={ad} /></p>
                                                <p className="text-xs text-gray-400 dark:text-neutral-500 truncate mt-0.5">{ad.description}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-3 ml-7">
                                            <div>
                                                <p className="text-gray-400 dark:text-neutral-500">Kategorija</p>
                                                <p className="text-gray-700 dark:text-neutral-300 font-medium">{ad.category?.name ?? '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 dark:text-neutral-500">Korisnik</p>
                                                <p className="text-gray-700 dark:text-neutral-300 font-medium"><UserFilterLink ad={ad} onFilter={id => applyFilters({ user: id })} /></p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 dark:text-neutral-500">Cena</p>
                                                <p className="font-semibold text-orange-600">{ad.price || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 dark:text-neutral-500">Datum</p>
                                                <p className="text-gray-500 dark:text-neutral-400">{ad.created_at}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-400 dark:text-neutral-500 mb-0.5">Status</p>
                                                <StatusBadge ad={ad} />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 ml-7">
                                            <button
                                                onClick={() => togglePin(ad.id)}
                                                disabled={pinning.has(`pin-${ad.id}`)}
                                                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition inline-flex items-center gap-1 disabled:opacity-50 ${
                                                    ad.is_pinned ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'border border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-neutral-400'
                                                }`}
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                                                Global{ad.is_pinned && ad.pinned_at ? ` · ${ad.pinned_at}` : ''}
                                            </button>
                                            <button
                                                onClick={() => togglePinCategory(ad.id)}
                                                disabled={pinning.has(`cat-${ad.id}`)}
                                                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition inline-flex items-center gap-1 disabled:opacity-50 ${
                                                    ad.is_pinned_category ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'border border-gray-300 dark:border-neutral-600 text-gray-500 dark:text-neutral-400'
                                                }`}
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                                                Kategorija{ad.is_pinned_category && ad.pinned_category_at ? ` · ${ad.pinned_category_at}` : ''}
                                            </button>
                                            {ad.status === 'expired' && (
                                                <button
                                                    onClick={() => renew(ad.id)}
                                                    disabled={pinning.has(`renew-${ad.id}`)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                                                >
                                                    Obnovi
                                                </button>
                                            )}
                                            <Link
                                                href={`/admin/oglasi/${ad.id}/edit`}
                                                className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition"
                                            >
                                                Izmeni
                                            </Link>
                                            <button
                                                onClick={() => destroy(ad.id)}
                                                className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                            >
                                                Obriši
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
