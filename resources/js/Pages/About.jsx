import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function About() {
    const { url, props: { appUrl, auth } } = usePage();
    return (
        <AppLayout>
            <Head>
                <title>O nama — AdBoard</title>
                <meta name="description" content="Saznajte više o AdBoard platformi — srpskom marketplaceu za transport i logistiku." />
                <meta property="og:title"       content="O nama — AdBoard" />
                <meta property="og:description" content="Saznajte više o AdBoard platformi — srpskom marketplaceu za transport i logistiku." />
                <meta property="og:type"        content="website" />
                <meta property="og:site_name"   content="AdBoard" />
                <meta property="og:image"       content={`${appUrl}/og-default.png`} />
                <meta property="og:url"         content={`${appUrl}${url}`} />
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content="O nama — AdBoard" />
                <meta name="twitter:description" content="Saznajte više o AdBoard platformi — srpskom marketplaceu za transport i logistiku." />
                <meta name="twitter:image"       content={`${appUrl}/og-default.png`} />
            </Head>

            {/* Hero */}
            <div id="section-about-hero" className="bg-black py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-semibold tracking-wide uppercase mb-6">
                        O nama
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
                        Spajamo transport<br className="hidden sm:block" /> i logistiku Srbije
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                        AdBoard je specijalizovana platforma koja povezuje transportere, logističke kompanije i pošiljaoce tereta na jednom mestu — brzo, jednostavno i pouzdano.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

                {/* Mission */}
                <section id="section-about-mission" className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-4">Naša misija</h2>
                        <p className="text-gray-600 dark:text-neutral-400 leading-relaxed mb-4">
                            Transportna industrija u Srbiji dugo je bila rascepkana — vozači, firme i vlasnici tereta oslanjali su se na posrednike, lične kontakte ili zastarele kanale oglašavanja.
                        </p>
                        <p className="text-gray-600 dark:text-neutral-400 leading-relaxed">
                            AdBoard je nastao s ciljem da to promeni. Pružamo centralnu tačku gde profesionalci iz transporta mogu da se predstave, a korisnici lako pronađu pravo vozilo ili uslugu — bez posrednika i bez komplikacija.
                        </p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-8 flex items-center justify-center">
                        <svg className="w-24 h-24 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                </section>

                {/* Stats */}
                <section id="section-about-stats" className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-8 text-center">AdBoard u brojevima</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {[
                            { value: '60+',    label: 'Kategorija vozila' },
                            { value: '100%',   label: 'Besplatno postavljanje' },
                            { value: '60',     label: 'Dana aktivnosti oglasa' },
                            { value: '24/7',   label: 'Dostupnost platforme' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl font-bold text-orange-600 mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-500 dark:text-neutral-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Values */}
                <section id="section-about-values">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-8 text-center">Naše vrednosti</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                ),
                                title: 'Pouzdanost',
                                desc: 'Svaki oglas prolazi kroz osnovnu proveru. Gradimo platformu na kojoj se korisnici mogu osloniti.',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                ),
                                title: 'Efikasnost',
                                desc: 'Minimalan broj klikova od pretrage do kontakta. Vreme je novac — posebno u transportu.',
                            },
                            {
                                icon: (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                ),
                                title: 'Zajednica',
                                desc: 'Izgrađujemo zajednicu profesionalaca koji međusobno sarađuju i grade bolje poslove.',
                            },
                        ].map(item => (
                            <div key={item.title} className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-6 shadow-sm">
                                <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {item.icon}
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-neutral-100 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section id="section-about-how-it-works">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-8 text-center">Kako funkcioniše</h2>
                    <div className="space-y-4">
                        {[
                            { step: '01', title: 'Registrujte se besplatno', desc: 'Kreirajte nalog za manje od minut — potrebni su samo ime, email i lozinka.' },
                            { step: '02', title: 'Postavite oglas', desc: 'Opišite vozilo ili uslugu, dodajte fotografije, lokaciju i kontakt. Oglas je aktivan 60 dana.' },
                            { step: '03', title: 'Pronađite partnere', desc: 'Korisnici pretražuju oglase po kategoriji i lokaciji i direktno vas kontaktiraju telefonom.' },
                            { step: '04', title: 'Obnovite po potrebi', desc: 'Kada oglas istekne, jednim klikom ga obnavljate na još 60 dana.' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-5 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-5">
                                <span className="text-2xl font-bold text-orange-200 shrink-0 w-10 text-right">{item.step}</span>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-neutral-100 mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                {!auth?.user && <section id="section-about-cta" className="bg-orange-600 rounded-2xl p-10 text-center">
                    <h2 className="text-2xl font-bold text-white mb-3">Pridružite se AdBoard zajednici</h2>
                    <p className="text-orange-200 mb-7 max-w-xl mx-auto">
                        Registracija je besplatna. Postavite oglas danas i dosegnite klijente širom Srbije.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <Link
                            href="/registracija"
                            className="px-6 py-2.5 bg-white text-orange-600 font-semibold text-sm rounded-lg hover:bg-orange-50 transition-colors"
                        >
                            Napravi nalog
                        </Link>
                        <Link
                            href="/kontakt"
                            className="px-6 py-2.5 border border-orange-400 text-white font-semibold text-sm rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Kontaktirajte nas
                        </Link>
                    </div>
                </section>}

            </div>
        </AppLayout>
    );
}
