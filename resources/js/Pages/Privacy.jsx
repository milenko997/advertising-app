import { Link, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function Section({ title, children }) {
    return (
        <section className="mb-10">
            <h2 className="text-base font-bold text-slate-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-orange-500 inline-block shrink-0" />
                {title}
            </h2>
            <div className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed space-y-3">{children}</div>
        </section>
    );
}

export default function Privacy() {
    const { url, props: { appUrl } } = usePage();
    return (
        <AppLayout>
            <Head>
                <title>Politika privatnosti — Transporteri</title>
                <meta name="description" content="Saznajte kako Transporteri prikuplja, koristi i štiti vaše lične podatke u skladu sa srpskim zakonom o zaštiti podataka." />
                <meta property="og:type"        content="website" />
                <meta property="og:site_name"   content="Transporteri" />
                <meta property="og:title"       content="Politika privatnosti — Transporteri" />
                <meta property="og:description" content="Saznajte kako Transporteri prikuplja, koristi i štiti vaše lične podatke u skladu sa srpskim zakonom o zaštiti podataka." />
                <meta property="og:image"       content={`${appUrl}/og-default.png`} />
                <meta property="og:url"         content={`${appUrl}${url}`} />
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content="Politika privatnosti — Transporteri" />
                <meta name="twitter:description" content="Saznajte kako Transporteri prikuplja, koristi i štiti vaše lične podatke u skladu sa srpskim zakonom o zaštiti podataka." />
                <meta name="twitter:image"       content={`${appUrl}/og-default.png`} />
            </Head>

            {/* Hero */}
            <div className="bg-black py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pravno
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Politika privatnosti</h1>
                    <p className="text-neutral-400 text-sm">Poslednje ažuriranje: Maj 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-slate-100 dark:border-neutral-700 shadow-sm px-8 py-10">

                        <p className="text-sm text-slate-500 dark:text-neutral-400 leading-relaxed mb-10">
                            U <strong className="text-slate-700 dark:text-neutral-200">Transporteri</strong>-u, vaša privatnost nam je važna. Ova Politika privatnosti objašnjava koje lične podatke prikupljamo, kako ih koristimo i koja prava imate u pogledu vaših podataka. Korišćenjem Transportera, pristajete na prakse opisane u ovoj politici.
                        </p>

                        <Section title="1. Ko smo mi">
                            <p>
                                Transporteri je online marketplace za profesionalce iz oblasti transporta i teretnih usluga sa sedištem u Beogradu, Srbija. Za sva pitanja u vezi sa privatnošću, možete nas kontaktirati na <a href="mailto:info@transporteri.rs" className="text-orange-500 hover:underline">info@transporteri.rs</a>.
                            </p>
                        </Section>

                        <Section title="2. Podaci koje prikupljamo">
                            <p>Prikupljamo sledeće kategorije ličnih podataka:</p>

                            {/* Mobile: stacked cards */}
                            <div className="sm:hidden space-y-3">
                                {[
                                    { tip: 'Podaci o nalogu',     primeri: 'Ime, email, lozinka (hešovana)',                          svrha: 'Autentifikacija, upravljanje nalogom' },
                                    { tip: 'Podaci profila',      primeri: 'Broj telefona, profilna fotografija',                     svrha: 'Prikazuje se na vašem javnom profilu' },
                                    { tip: 'Sadržaj oglasa',      primeri: 'Naslov, opis, lokacija, slike, kontakt telefon',          svrha: 'Objavljivanje vaših oglasa' },
                                    { tip: 'Podaci o korišćenju', primeri: 'Posećene stranice, broj pregleda oglasa, IP adresa',      svrha: 'Analitika, sprečavanje prevara' },
                                    { tip: 'Tehnički podaci',     primeri: 'Tip pretraživača, uređaj, kolačići sesije',               svrha: 'Funkcionalnost platforme, bezbednost' },
                                ].map(({ tip, primeri, svrha }) => (
                                    <div key={tip} className="rounded-xl border border-slate-100 dark:border-neutral-700 divide-y divide-slate-100 dark:divide-neutral-700 overflow-hidden">
                                        <div className="bg-slate-50 dark:bg-neutral-800/50 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-neutral-300">{tip}</div>
                                        <div className="px-4 py-2.5 text-xs">
                                            <span className="font-semibold text-slate-600 dark:text-neutral-400">Primeri: </span>
                                            <span className="text-slate-500 dark:text-neutral-400">{primeri}</span>
                                        </div>
                                        <div className="px-4 py-2.5 text-xs">
                                            <span className="font-semibold text-slate-600 dark:text-neutral-400">Svrha: </span>
                                            <span className="text-slate-500 dark:text-neutral-400">{svrha}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* sm+: table */}
                            <div className="hidden sm:block rounded-xl border border-slate-100 dark:border-neutral-700 overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-50 dark:bg-neutral-800/50">
                                        <tr>
                                            <th scope="col" className="text-left px-4 py-2.5 font-semibold text-slate-600 dark:text-neutral-400">Tip podataka</th>
                                            <th scope="col" className="text-left px-4 py-2.5 font-semibold text-slate-600 dark:text-neutral-400">Primeri</th>
                                            <th scope="col" className="text-left px-4 py-2.5 font-semibold text-slate-600 dark:text-neutral-400">Svrha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-neutral-700">
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-neutral-300">Podaci o nalogu</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Ime, email, lozinka (hešovana)</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Autentifikacija, upravljanje nalogom</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-neutral-300">Podaci profila</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Broj telefona, profilna fotografija</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Prikazuje se na vašem javnom profilu</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-neutral-300">Sadržaj oglasa</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Naslov, opis, lokacija, slike, kontakt telefon</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Objavljivanje vaših oglasa</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-neutral-300">Podaci o korišćenju</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Posećene stranice, broj pregleda oglasa, IP adresa</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Analitika, sprečavanje prevara</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-neutral-300">Tehnički podaci</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Tip pretraživača, uređaj, kolačići sesije</td>
                                            <td className="px-4 py-2.5 text-slate-500 dark:text-neutral-400">Funkcionalnost platforme, bezbednost</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="3. Kako koristimo vaše podatke">
                            <p>Koristimo prikupljene podatke da bismo:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Upravljali i održavali Transporteri platformu.</li>
                                <li>Kreirali i upravljali vašim nalogom.</li>
                                <li>Objavljivali i prikazivali vaše oglase drugim korisnicima.</li>
                                <li>Obrađivali prijave i moderirali sadržaj.</li>
                                <li>Slali transakcione emailove (potvrda naloga, resetovanje lozinke).</li>
                                <li>Otkrivali i sprečavali prevare, spam i zloupotrebu.</li>
                                <li>Unapređivali platformu kroz agregiranu analitiku.</li>
                            </ul>
                            <p>
                                Mi <strong className="text-slate-700 dark:text-neutral-200">ne</strong> prodajemo vaše lične podatke trećim stranama. Ne koristimo vaše podatke za ciljano oglašavanje.
                            </p>
                        </Section>

                        <Section title="4. Šta je javno vidljivo">
                            <p>Sledeće informacije su javno vidljive svim posetiocima Transportera:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Vaše prikazno ime i avatar (ako je postavljeno).</li>
                                <li>Vaši objavljeni oglasi (naslov, opis, slike, lokacija, cena, kontakt telefon).</li>
                                <li>Vaša javna stranica profila uključujući primljene recenzije.</li>
                            </ul>
                            <p>
                                Vaša <strong className="text-slate-700 dark:text-neutral-200">email adresa</strong> nikada nije javno prikazana. Koristi se isključivo za autentifikaciju naloga i sistemska obaveštenja.
                            </p>
                        </Section>

                        <Section title="5. Kolačići">
                            <p>
                                Transporteri koristi kolačiće da vas drži prijavljenim (kolačić sesije) i da zaštiti forme od falsifikovanja međustraničnih zahteva (CSRF kolačić). Ovo su neophodni kolačići potrebni za funkcionisanje platforme — ne koriste se kolačići za praćenje niti za oglašavanje.
                            </p>
                            <p>
                                Možete onemogućiti kolačiće u podešavanjima pretraživača, ali to će vas sprečiti da se prijavite ili koristite većinu funkcija Transportera.
                            </p>
                        </Section>

                        <Section title="6. Čuvanje podataka">
                            <p>
                                Čuvamo vaše lične podatke sve dok je vaš nalog aktivan. Ukoliko obrišete nalog, vaši lični podaci (ime, email, telefon), svi oglasi i slike biće <strong className="text-slate-700 dark:text-neutral-200">odmah trajno uklonjeni</strong>.
                            </p>
                            <p>
                                Anonimizovani podaci o korišćenju (broj pregleda, agregatne statistike) mogu se čuvati neograničeno jer se ne mogu povezati sa pojedincem.
                            </p>
                        </Section>

                        <Section title="7. Bezbednost podataka">
                            <p>
                                Primenjujemo razumne tehničke i organizacione mere za zaštitu vaših podataka, uključujući:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Lozinke čuvane bcrypt hešovanjem — nikada u čistom tekstu.</li>
                                <li>HTTPS enkripcija za sve podatke u prenosu.</li>
                                <li>CSRF zaštita na svim formama.</li>
                                <li>Ograničenje brzine za sprečavanje brute-force napada.</li>
                            </ul>
                            <p>
                                Nijedan sistem nije potpuno bezbedan. Ukoliko smatrate da je vaš nalog kompromitovan, kontaktirajte nas odmah.
                            </p>
                        </Section>

                        <Section title="8. Vaša prava">
                            <p>
                                Prema primenjivom zakonu o zaštiti podataka, imate sledeća prava u pogledu vaših ličnih podataka:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li><strong className="text-slate-700 dark:text-neutral-200">Pristup</strong> — zatražite kopiju podataka koje čuvamo o vama.</li>
                                <li><strong className="text-slate-700 dark:text-neutral-200">Ispravka</strong> — ažurirajte netačne podatke putem stranice profila.</li>
                                <li><strong className="text-slate-700 dark:text-neutral-200">Brisanje</strong> — zatražite da obrišemo vaš nalog i lične podatke.</li>
                                <li><strong className="text-slate-700 dark:text-neutral-200">Prenosivost</strong> — zatražite vaše podatke u strukturiranom, mašinski čitljivom formatu.</li>
                                <li><strong className="text-slate-700 dark:text-neutral-200">Prigovor</strong> — uložite prigovor na određene aktivnosti obrade.</li>
                            </ul>
                            <p>
                                Da biste ostvarili bilo koje od ovih prava, pišite nam na <a href="mailto:info@transporteri.rs" className="text-orange-500 hover:underline">info@transporteri.rs</a>. Odgovorićemo u roku od 30 dana.
                            </p>
                        </Section>

                        <Section title="9. Usluge trećih strana">
                            <p>
                                Transporteri ne deli vaše podatke sa analitičkim, reklamnim ili uslugama praćenja trećih strana. Platforma je samostalno hostovana i ne učitava eksterne skripte od Google-a, Facebook-a ili sličnih provajdera.
                            </p>
                        </Section>

                        <Section title="10. Izmene ove politike">
                            <p>
                                Možemo periodično ažurirati ovu Politiku privatnosti. Kada to učinimo, revidiraćemo datum "Poslednjeg ažuriranja" na vrhu ove stranice. Preporučujemo vam da redovno pregledavate ovu politiku.
                            </p>
                        </Section>

                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-neutral-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400 dark:text-neutral-500">
                            <span>Pitanja? <a href="mailto:info@transporteri.rs" className="text-orange-500 hover:underline">info@transporteri.rs</a></span>
                            <div className="flex items-center gap-4">
                                <Link href="/uslovi-koriscenja" className="hover:text-slate-600 transition-colors">Uslovi korišćenja</Link>
                                <Link href="/cesta-pitanja" className="hover:text-slate-600 transition-colors">Česta pitanja</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
