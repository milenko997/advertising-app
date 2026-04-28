import { useForm, Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function InfoCard({ icon, label, value, href }) {
    const content = (
        <div className="flex items-start gap-4">
            <span className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                {icon}
            </span>
            <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-neutral-200">{value}</p>
            </div>
        </div>
    );

    if (href) {
        return <a href={href} className="block hover:opacity-80 transition-opacity">{content}</a>;
    }
    return <div>{content}</div>;
}

export default function Contact() {
    const { url, props: { appUrl } } = usePage();
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/kontakt', { onSuccess: () => reset() });
    };

    return (
        <AppLayout>
            <Head>
                <title>Kontakt — Transporteri</title>
                <meta name="description" content="Stupite u kontakt sa Transporteri timom. Rado ćemo vam pomoći sa svim pitanjima o našem transportnom marketplaceu." />
                <meta property="og:type"        content="website" />
                <meta property="og:site_name"   content="Transporteri" />
                <meta property="og:title"       content="Kontakt — Transporteri" />
                <meta property="og:description" content="Stupite u kontakt sa Transporteri timom. Rado ćemo vam pomoći sa svim pitanjima o našem transportnom marketplaceu." />
                <meta property="og:image"       content={`${appUrl}/og-default.png`} />
                <meta property="og:url"         content={`${appUrl}${url}`} />
                <meta name="twitter:card"        content="summary_large_image" />
                <meta name="twitter:title"       content="Kontakt — Transporteri" />
                <meta name="twitter:description" content="Stupite u kontakt sa Transporteri timom. Rado ćemo vam pomoći sa svim pitanjima o našem transportnom marketplaceu." />
                <meta name="twitter:image"       content={`${appUrl}/og-default.png`} />
            </Head>

            {/* Hero */}
            <div id="page-contact" className="bg-black py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Kontaktirajte nas
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Kontakt</h1>
                    <p className="text-neutral-400 text-base leading-relaxed">
                        Imate pitanje, primetili ste problem ili želite da saznate više? Rado ćemo vas čuti.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="py-14">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* Left: Info */}
                        <div id="section-contact-info" className="lg:col-span-2 space-y-4">
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-slate-100 dark:border-neutral-700 shadow-sm p-6 space-y-6">
                                <InfoCard
                                    label="Email"
                                    value="info@transporteri.rs"
                                    href="mailto:info@transporteri.rs"
                                    icon={
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    }
                                />
                                <InfoCard
                                    label="Telefon"
                                    value="+381 69 583 3352"
                                    href="tel:+381695833352"
                                    icon={
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    }
                                />
                                <InfoCard
                                    label="Lokacija"
                                    value="Beograd, Srbija"
                                    icon={
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    }
                                />
                                <InfoCard
                                    label="Radno vreme"
                                    value="Pon – Pet, 09:00 – 17:00"
                                    icon={
                                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    }
                                />
                            </div>

                            <div className="bg-black rounded-2xl p-6">
                                <p className="text-sm font-semibold text-white mb-1.5">Vreme odgovora</p>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    Obično odgovaramo na sve upite u roku od <span className="text-orange-400 font-medium">1 radnog dana</span>.
                                </p>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div id="section-contact-form" className="lg:col-span-3">
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-slate-100 dark:border-neutral-700 shadow-sm p-8">

                                {wasSuccessful ? (
                                    <div className="text-center py-10">
                                        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-5">
                                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-neutral-100 mb-2">Poruka poslata!</h3>
                                        <p className="text-sm text-slate-500 dark:text-neutral-400">Hvala vam što ste nas kontaktirali. Odgovorićemo vam u roku od 1 radnog dana.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={submit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Name */}
                                            <div>
                                                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1.5">
                                                    Ime i prezime <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    id="contact-name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    placeholder="Vaše ime"
                                                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-neutral-700 dark:text-neutral-100 placeholder-slate-500 dark:placeholder-neutral-400 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition ${
                                                        errors.name ? 'border-red-300 focus:ring-red-400/30' : 'border-slate-200 dark:border-neutral-600 focus:border-orange-400'
                                                    }`}
                                                />
                                                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1.5">
                                                    Email adresa <span className="text-red-400">*</span>
                                                </label>
                                                <input
                                                    id="contact-email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    placeholder="vas@primer.com"
                                                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-neutral-700 dark:text-neutral-100 placeholder-slate-500 dark:placeholder-neutral-400 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition ${
                                                        errors.email ? 'border-red-300 focus:ring-red-400/30' : 'border-slate-200 dark:border-neutral-600 focus:border-orange-400'
                                                    }`}
                                                />
                                                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1.5">
                                                Predmet <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                id="contact-subject"
                                                type="text"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                placeholder="O čemu je vaša poruka?"
                                                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-neutral-700 dark:text-neutral-100 placeholder-slate-500 dark:placeholder-neutral-400 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition ${
                                                    errors.subject ? 'border-red-300 focus:ring-red-400/30' : 'border-slate-200 dark:border-neutral-600 focus:border-orange-400'
                                                }`}
                                            />
                                            {errors.subject && <p className="mt-1.5 text-xs text-red-500">{errors.subject}</p>}
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-600 dark:text-neutral-300 mb-1.5">
                                                Poruka <span className="text-red-400">*</span>
                                            </label>
                                            <textarea
                                                id="contact-message"
                                                rows={6}
                                                value={data.message}
                                                onChange={e => setData('message', e.target.value)}
                                                placeholder="Napišite vašu poruku ovde…"
                                                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-neutral-700 dark:text-neutral-100 placeholder-slate-500 dark:placeholder-neutral-400 focus:bg-white dark:focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400/30 resize-none transition ${
                                                    errors.message ? 'border-red-300 focus:ring-red-400/30' : 'border-slate-200 dark:border-neutral-600 focus:border-orange-400'
                                                }`}
                                            />
                                            <div className="flex items-center justify-between mt-1">
                                                {errors.message
                                                    ? <p className="text-xs text-red-500">{errors.message}</p>
                                                    : <span />
                                                }
                                                <span className={`text-xs ${data.message.length > 2800 ? 'text-red-400' : data.message.length > 2000 ? 'text-amber-400' : 'text-neutral-300'}`}>
                                                    {data.message.length}/3000
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Slanje…
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                    </svg>
                                                    Pošalji poruku
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
