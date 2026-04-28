import { useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <GuestLayout>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-6">Prijavite se na nalog</h1>

            {status && (
                <div className="mb-4 text-sm text-green-700 bg-green-50 dark:bg-emerald-900/20 border border-green-200 dark:border-emerald-800 rounded-lg px-4 py-3">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Email adresa</label>
                    <input
                        id="login-email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required autoFocus
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Lozinka</label>
                    <input
                        id="login-password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        required autoComplete="current-password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div className="flex items-center">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={data.remember}
                        onChange={e => setData('remember', e.target.checked)}
                        className="rounded border-gray-300 dark:border-neutral-600 text-orange-600 focus:ring-orange-500 dark:bg-neutral-700"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-neutral-400">Zapamti me</label>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <Link href="/forgot-password" className="text-sm text-gray-500 dark:text-neutral-400 hover:text-orange-600">
                        Zaboravili ste lozinku?
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        Prijavi se
                    </button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
                Nemate nalog?{' '}
                <Link href="/register" className="text-orange-600 hover:underline font-medium">
                    Registrujte se
                </Link>
            </p>
        </GuestLayout>
    );
}
