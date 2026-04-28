import { useForm, Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const resend = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    const justSent = status === 'verification-link-sent';

    return (
        <GuestLayout>
            <Head>
                <title>Verifikacija emaila — Transporteri</title>
            </Head>

            {/* Icon */}
            <div className="flex justify-center mb-6">
                <span className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 dark:text-neutral-100 text-center mb-2">Proverite inbox</h1>
            <p className="text-sm text-slate-500 dark:text-neutral-400 text-center leading-relaxed mb-6">
                Poslali smo link za verifikaciju na vašu email adresu. Kliknite na link da aktivirate nalog.
            </p>

            {justSent && (
                <div className="mb-5 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-lg px-4 py-3 text-sm">
                    <svg className="w-4 h-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Novi link za verifikaciju je poslat.
                </div>
            )}

            <form onSubmit={resend}>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                    {processing ? 'Slanje…' : 'Pošalji ponovo'}
                </button>
            </form>

            <p className="text-xs text-slate-400 dark:text-neutral-500 text-center mt-4">
                Pogrešan nalog?{' '}
                <button
                    type="button"
                    onClick={() => router.post('/logout')}
                    className="text-orange-500 hover:underline"
                >
                    Odjavite se
                </button>
                {' '}i registrujte se sa ispravnim emailom.
            </p>
        </GuestLayout>
    );
}
