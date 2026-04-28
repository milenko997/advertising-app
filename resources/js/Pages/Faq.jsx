import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const faqs = [
    {
        category: 'Početak',
        items: [
            {
                q: 'Šta je AdBoard?',
                a: 'AdBoard je marketplace za profesionalce iz oblasti transporta i teretnih usluga u Srbiji. Možete postavljati i pregledati oglase za kamione, kombije, prikolice i druga komercijalna vozila, kao i pronalaziti logističke partnere i prilike za prevoz tereta.',
            },
            {
                q: 'Da li mi je potreban nalog da bih pregledao oglase?',
                a: 'Ne. Svako može pregledati sve aktivne oglase bez registracije. Nalog je potreban samo za postavljanje oglasa, čuvanje omiljenih ili kontaktiranje oglašivača.',
            },
            {
                q: 'Kako da kreiram nalog?',
                a: 'Kliknite na "Registracija" u gornjem desnom uglu i unesite svoje ime, email i lozinku. Registracija je besplatna i traje manje od minut.',
            },
        ],
    },
    {
        category: 'Postavljanje oglasa',
        items: [
            {
                q: 'Kako da postavim oglas?',
                a: 'Nakon prijave, kliknite na narandžasto dugme "Postavi oglas" u navigacionoj traci. Popunite detalje o vašem vozilu ili usluzi — naslov, opis, kategoriju, lokaciju, cenu i kontakt telefon — a zatim potvrdite.',
            },
            {
                q: 'Koliko oglasa mogu da postavim?',
                a: 'Kako bismo sprečili spam, novi korisnici mogu postaviti do 5 oglasa po satu. Ukoliko vam je potrebno više, kontaktirajte nas i možemo prilagoditi vaš limit.',
            },
            {
                q: 'Koliko slika mogu da otpremim po oglasu?',
                a: 'Možete otpremiti do 10 slika po oglasu. Podržani formati su JPEG, PNG, GIF i JPG. Maksimalna veličina fajla je 10 MB po slici.',
            },
            {
                q: 'Koliko dugo oglas ostaje aktivan?',
                a: 'Oglasi su aktivni 60 dana od datuma postavljanja. Nakon isteka, oglas se skriva iz javnih listinga. Možete obnoviti bilo koji istekli oglas sa stranice "Moji oglasi" kako bi bio aktivan još 60 dana.',
            },
            {
                q: 'Mogu li da izmenim oglas nakon postavljanja?',
                a: 'Da. Idite na "Moji oglasi", pronađite oglas koji želite da ažurirate i kliknite "Izmeni". Možete menjati sva polja uključujući slike u bilo kom trenutku dok je oglas aktivan.',
            },
            {
                q: 'Kako da obrišem oglas?',
                a: 'U "Moji oglasi", kliknite dugme za brisanje na oglasu koji želite da uklonite. Obrisani oglasi se premeštaju u Otpad i mogu se vratiti u roku od 30 dana, nakon čega se trajno brišu.',
            },
        ],
    },
    {
        category: 'Pretraga i pregledanje',
        items: [
            {
                q: 'Kako da pretražim određeno vozilo ili uslugu?',
                a: 'Koristite traku za pretragu na vrhu početne stranice za pretragu po ključnoj reči. Možete i filtrirati po lokaciji ili pregledati po kategoriji koristeći traku sa kategorijama.',
            },
            {
                q: 'Šta znači "Na upit" na oglasu?',
                a: '"Na upit" znači da vozilo ili usluga nisu odmah dostupni, ali će vlasnik potvrditi dostupnost ukoliko ga kontaktirate. "Dostupno" znači da je odmah raspoloživo.',
            },
            {
                q: 'Šta su istaknuti oglasi?',
                a: 'Istaknuti (prikačeni) oglasi su naglašeni na vrhu početne stranice od strane naše admin ekipe. Obično su to verifikovani, kvalitetni oglasi.',
            },
            {
                q: 'Mogu li da sačuvam oglase za kasniji pregled?',
                a: 'Da. Kliknite na ikonu označivača na bilo kojoj kartici oglasa da biste je sačuvali. Svi sačuvani oglasi se nalaze pod "Sačuvani" u navigacionom meniju.',
            },
        ],
    },
    {
        category: 'Prijave i bezbednost',
        items: [
            {
                q: 'Šta da uradim ako pronađem sumnjiv ili lažan oglas?',
                a: 'Kliknite na dugme "Prijavi" na stranici sa detaljima oglasa i izaberite razlog: pogrešna kategorija, duplikat/spam, protiv pravila ili blokiranje oglasa od tog korisnika. Naš tim će pregledati prijavu odmah.',
            },
            {
                q: 'Koje vrste oglasa nisu dozvoljene?',
                a: 'Oglasi koji su obmanjujući, duplikat listinzi, sadržaj koji nije u vezi sa transportom i teretom, oglasi sa lažnim cenama ili bilo šta što krši srpsko zakonodavstvo nisu dozvoljeni i biće uklonjeni.',
            },
            {
                q: 'Da li su moji lični podaci bezbedni?',
                a: 'Prikazujemo samo informacije koje odaberete da uključite u vaš oglas (kao što je kontakt telefon). Vaša email adresa nikada nije javno vidljiva. Pročitajte našu Politiku privatnosti za sve detalje.',
            },
        ],
    },
    {
        category: 'Nalog i profil',
        items: [
            {
                q: 'Kako da promenim lozinku?',
                a: 'Idite na stranicu vašeg profila (kliknite na vaše ime u gornjem desnom uglu → Moj profil) i skrolujte do odeljka "Promena lozinke".',
            },
            {
                q: 'Mogu li da promenim email adresu?',
                a: 'Da. Na stranici profila možete ažurirati ime, email, broj telefona i profilnu fotografiju.',
            },
            {
                q: 'Kako da obrišem nalog?',
                a: 'Kontaktirajte nas na info@adboard.rs da biste zatražili brisanje naloga. Uklonićemo sve vaše podatke u roku od 30 dana.',
            },
        ],
    },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`border-b border-slate-100 dark:border-neutral-700 last:border-0 transition-colors ${open ? 'bg-orange-50/40 dark:bg-orange-900/20' : ''}`}>
            <button
                className="w-full flex items-center justify-between gap-4 py-5 px-6 text-left group"
                onClick={() => setOpen(!open)}
            >
                <span className={`text-sm font-semibold leading-snug transition-colors ${open ? 'text-orange-600' : 'text-slate-800 dark:text-neutral-200 group-hover:text-orange-600'}`}>
                    {q}
                </span>
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    open ? 'bg-orange-500 rotate-45' : 'bg-slate-100 dark:bg-neutral-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30'
                }`}>
                    <svg className={`w-3.5 h-3.5 transition-colors ${open ? 'text-white' : 'text-slate-500 dark:text-neutral-400 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                </span>
            </button>
            {open && (
                <div className="px-6 pb-5">
                    <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed">{a}</p>
                </div>
            )}
        </div>
    );
}

export default function Faq() {
    const { url, props: { appUrl } } = usePage();
    return (
        <AppLayout>
            <Head>
                <title>Česta pitanja — AdBoard</title>
                <meta name="description" content="Često postavljana pitanja o AdBoard-u — kako da postavljate oglase, pretražujete vozila, obnavljate listinge i više." />
                <meta property="og:type"        content="website" />
                <meta property="og:site_name"   content="AdBoard" />
                <meta property="og:title"       content="Česta pitanja — AdBoard" />
                <meta property="og:description" content="Često postavljana pitanja o AdBoard-u — kako da postavljate oglase, pretražujete vozila, obnavljate listinge i više." />
                <meta property="og:image"       content={`${appUrl}/og-default.png`} />
                <meta property="og:url"         content={`${appUrl}${url}`} />
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content="Česta pitanja — AdBoard" />
                <meta name="twitter:description" content="Često postavljana pitanja o AdBoard-u — kako da postavljate oglase, pretražujete vozila, obnavljate listinge i više." />
                <meta name="twitter:image"       content={`${appUrl}/og-default.png`} />
            </Head>

            {/* Hero */}
            <div className="bg-black py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Centar za pomoć
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Često postavljana pitanja
                    </h1>
                    <p className="text-neutral-400 text-base leading-relaxed">
                        Sve što treba da znate o korišćenju AdBoard-a. Ne možete pronaći ono što tražite?{' '}
                        <a href="mailto:info@adboard.rs" className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors">
                            Kontaktirajte nas
                        </a>.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    {faqs.map((section) => (
                        <div key={section.category}>
                            {/* Category heading */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                                <h2 className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-widest">
                                    {section.category}
                                </h2>
                            </div>

                            {/* Accordion */}
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-slate-100 dark:border-neutral-700 shadow-sm overflow-hidden">
                                {section.items.map((item) => (
                                    <FaqItem key={item.q} q={item.q} a={item.a} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* CTA */}
                    <div className="bg-black rounded-2xl p-8 text-center">
                        <h3 className="text-lg font-bold text-white mb-2">Imate još pitanja?</h3>
                        <p className="text-neutral-400 text-sm mb-5">Naš tim je tu da vam pomogne sa svim što nije pokriveno gore.</p>
                        <a
                            href="mailto:info@adboard.rs"
                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Pošaljite nam email
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
