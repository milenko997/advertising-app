import { useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/zaboravljena-lozinka');
    };

    return (
        <GuestLayout>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-2">Zaboravili ste lozinku?</h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
                Unesite email i poslaćemo vam link za resetovanje lozinke.
            </p>

            {status && (
                <div className="mb-4 text-sm text-green-700 bg-green-50 dark:bg-emerald-900/20 border border-green-200 dark:border-emerald-800 rounded-lg px-4 py-3">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Email adresa</label>
                    <input
                        id="forgot-email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required autoFocus
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div className="flex items-center justify-between pt-1">
                    <Link href="/prijava" className="text-sm text-gray-500 dark:text-neutral-400 hover:text-orange-600">
                        Nazad na prijavu
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        Pošalji link
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
