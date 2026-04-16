import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { auth, categories } = usePage().props;
    const year = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">

                    {/* Brand */}
                    <div className="lg:col-span-2 sm:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <span className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
                                <svg className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width:'18px',height:'18px'}}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </span>
                            <span className="text-base font-bold text-white tracking-tight">AdBoard</span>
                        </Link>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            Oglasnik za transport i logistiku u Srbiji. Pronađite vozila, rute i logističke partnere.
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-3 mt-5">
                            <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                    <circle cx="12" cy="12" r="4"/>
                                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
                                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                                    <circle cx="4" cy="4" r="2"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Platform links */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Platforma</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Pretraži oglase
                                </Link>
                            </li>
                            {auth?.user && !auth.user.isAdmin && (
                                <>
                                    <li>
                                        <Link href="/postavi-oglas" className="text-sm text-slate-400 hover:text-white transition-colors">
                                            Postavi oglas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/moji-oglasi" className="text-sm text-slate-400 hover:text-white transition-colors">
                                            Moji oglasi
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/sacuvani" className="text-sm text-slate-400 hover:text-white transition-colors">
                                            Sačuvani oglasi
                                        </Link>
                                    </li>
                                </>
                            )}
                            {!auth?.user && (
                                <>
                                    <li>
                                        <Link href="/register" className="text-sm text-slate-400 hover:text-white transition-colors">
                                            Napravi nalog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                                            Prijavi se
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Categories */}
                    {categories?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Kategorije</h3>
                            <ul className="space-y-3">
                                {categories.slice(0, 6).map(cat => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/kategorija/${cat.slug}`}
                                            className="text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Help & Legal */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Pomoć i pravila</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/o-nama" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    O nama
                                </Link>
                            </li>
                            <li>
                                <Link href="/kontakt" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Kontakt
                                </Link>
                            </li>
                            <li>
                                <Link href="/cesta-pitanja" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Česta pitanja
                                </Link>
                            </li>
                            <li>
                                <Link href="/uslovi-koriscenja" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Uslovi korišćenja
                                </Link>
                            </li>
                            <li>
                                <Link href="/politika-privatnosti" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Politika privatnosti
                                </Link>
                            </li>
                            <li>
                                <a href="/sitemap.xml" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Mapa sajta
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Kontakt</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="mailto:info@adboard.rs" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                                    <span className="w-7 h-7 rounded-md bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center shrink-0 transition-colors">
                                        <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    info@adboard.rs
                                </a>
                            </li>
                            <li>
                                <a href="tel:+381000000000" className="flex items-center gap-2.5 text-sm text-slate-400 hover:text-white transition-colors group">
                                    <span className="w-7 h-7 rounded-md bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center shrink-0 transition-colors">
                                        <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </span>
                                    +381 00 000 0000
                                </a>
                            </li>
                            <li>
                                <span className="flex items-center gap-2.5 text-sm text-slate-400">
                                    <span className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                                        <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </span>
                                    Beograd, Srbija
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        © {year} AdBoard. Sva prava zadržana.
                    </p>
                </div>

            </div>
        </footer>
    );
}
