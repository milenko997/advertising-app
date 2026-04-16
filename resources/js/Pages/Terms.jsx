import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function Section({ title, children }) {
    return (
        <section className="mb-10">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-orange-500 inline-block shrink-0" />
                {title}
            </h2>
            <div className="text-sm text-slate-500 leading-relaxed space-y-3">{children}</div>
        </section>
    );
}

export default function Terms() {
    return (
        <AppLayout>
            <Head>
                <title>Uslovi korišćenja — AdBoard</title>
                <meta name="description" content="Pročitajte AdBoard uslove korišćenja koji pokrivaju registraciju naloga, pravila postavljanja oglasa, zabranjeni sadržaj i vaša prava kao korisnika." />
            </Head>

            {/* Hero */}
            <div className="bg-slate-900 py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Pravno
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Uslovi korišćenja</h1>
                    <p className="text-slate-400 text-sm">Poslednje ažuriranje: April 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-10">

                        <p className="text-sm text-slate-500 leading-relaxed mb-10">
                            Dobrodošli na <strong className="text-slate-700">AdBoard</strong>. Pristupanjem ili korišćenjem naše platforme, slažete se da budete vezani ovim Uslovima korišćenja. Molimo vas da ih pažljivo pročitate pre korišćenja usluge. Ukoliko se ne slažete sa ovim uslovima, molimo vas da ne koristite AdBoard.
                        </p>

                        <Section title="1. Prihvatanje uslova">
                            <p>
                                Registracijom naloga, postavljanjem oglasa ili jednostavnim pregledanjem AdBoard-a, potvrđujete da ste pročitali, razumeli i slažete se da poštujete ove Uslove korišćenja, kao i sve primenjive zakone i propise Republike Srbije.
                            </p>
                            <p>
                                Zadržavamo pravo da u bilo kom trenutku izmenimo ove uslove. Nastavak korišćenja platforme nakon objave izmena smatra se prihvatanjem izmenjenih uslova.
                            </p>
                        </Section>

                        <Section title="2. Prihvatljivost">
                            <p>
                                Morate imati najmanje 18 godina da biste kreirali nalog ili postavljali oglase na AdBoard-u. Korišćenjem platforme, izjavljujete i garantujete da ispunjavate ovaj uslov.
                            </p>
                            <p>
                                Ukoliko koristite AdBoard u ime preduzeća ili pravnog lica, izjavljujete da imate ovlašćenje da obavežete to lice ovim uslovima.
                            </p>
                        </Section>

                        <Section title="3. Korisnički nalozi">
                            <p>
                                Odgovorni ste za čuvanje poverljivosti podataka za pristup nalogu i za sve aktivnosti koje se odvijaju na vašem nalogu. Odmah nas obavestite na <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a> ukoliko posumnjate u neovlašćeno korišćenje.
                            </p>
                            <p>
                                Ne smete deliti nalog sa drugima, kreirati više naloga niti koristiti tuđi nalog bez dozvole. Zadržavamo pravo da suspendujemo ili ukinemo naloge koji krše ove uslove.
                            </p>
                        </Section>

                        <Section title="4. Postavljanje oglasa">
                            <p>
                                Možete postavljati oglase za vozila i usluge iz oblasti transporta. Podnošenjem oglasa potvrđujete da:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Informacije su tačne, istinite i ne obmanjujuće.</li>
                                <li>Posedujete ili imate zakonsko pravo da oglašavate navedeno vozilo ili uslugu.</li>
                                <li>Sadržaj ne krši primenjive zakone niti prava trećih lica.</li>
                                <li>Otpremljene slike su vaše ili imate pravo da ih koristite.</li>
                            </ul>
                            <p>
                                Oglasi su aktivni <strong className="text-slate-700">60 dana</strong> od datuma postavljanja. Istekli oglasi mogu se obnoviti sa stranice "Moji oglasi".
                            </p>
                        </Section>

                        <Section title="5. Zabranjeni sadržaj">
                            <p>Sledeće vrste sadržaja su strogo zabranjene na AdBoard-u:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Lažni, obmanjujući ili prevarni oglasi.</li>
                                <li>Duplikat ili spam listinzi.</li>
                                <li>Sadržaj koji nije u vezi sa transportom, teretom ili logistikom.</li>
                                <li>Nezakonita roba, usluge ili aktivnosti.</li>
                                <li>Uvredljiv, diskriminatorski ili uznemiravajući sadržaj.</li>
                                <li>Bilo koji sadržaj koji krši prava intelektualne svojine.</li>
                            </ul>
                            <p>
                                Zadržavamo pravo da bez prethodne najave uklonimo bilo koji sadržaj koji krši ova pravila i suspendujemo ili zabranimo odgovorni nalog.
                            </p>
                        </Section>

                        <Section title="6. Intelektualna svojina">
                            <p>
                                Sav sadržaj na AdBoard-u koji nije generisan od strane korisnika — uključujući logo, dizajn, kod i tekst — vlasništvo je AdBoard-a i zaštićen je autorskim pravom. Ne smete ga reprodukovati, distribuirati niti kreirati izvedena dela bez našeg pisanog pristanka.
                            </p>
                            <p>
                                Postavljanjem sadržaja na AdBoard, dajete nam neekskluzivnu, besplatnu licencu za prikazivanje, distribuciju i promociju tog sadržaja unutar platforme.
                            </p>
                        </Section>

                        <Section title="7. Ograničenje odgovornosti">
                            <p>
                                AdBoard deluje kao neutralna platforma koja povezuje kupce i prodavce. Ne proveravamo tačnost oglasa, ne garantujemo kvalitet navedenih vozila ili usluga niti posredujemo u transakcijama između korisnika.
                            </p>
                            <p>
                                U najvećoj meri dozvoljenoj zakonom, AdBoard neće biti odgovoran za bilo kakvu direktnu, indirektnu, slučajnu ili posledičnu štetu nastalu usled korišćenja ili nemogućnosti korišćenja naše platforme, ili iz transakcija između korisnika.
                            </p>
                        </Section>

                        <Section title="8. Ograničenje brzine i pravično korišćenje">
                            <p>
                                Radi održavanja kvaliteta platforme, korisnici su ograničeni na postavljanje <strong className="text-slate-700">5 oglasa po satu</strong>. Automatizovano postavljanje, scraping ili bilo kakvo korišćenje botova je strogo zabranjeno.
                            </p>
                        </Section>

                        <Section title="9. Prestanak">
                            <p>
                                Zadržavamo pravo da po sopstvenom nahođenju suspendujemo ili trajno ukinemo vaš nalog ukoliko smatramo da ste prekršili ove uslove, bavili se prevarnim aktivnostima ili naškodili drugim korisnicima platforme.
                            </p>
                            <p>
                                Možete obrisati nalog u bilo kom trenutku kontaktiranjem na <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a>.
                            </p>
                        </Section>

                        <Section title="10. Merodavno pravo">
                            <p>
                                Ovi uslovi su regulisani i tumače se u skladu sa zakonima Republike Srbije. Svi sporovi će biti rešavani pred sudovima u Beogradu, Srbija.
                            </p>
                        </Section>

                        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
                            <span>Pitanja? <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a></span>
                            <div className="flex items-center gap-4">
                                <Link href="/politika-privatnosti" className="hover:text-slate-600 transition-colors">Politika privatnosti</Link>
                                <Link href="/cesta-pitanja" className="hover:text-slate-600 transition-colors">Česta pitanja</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
