import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors } = useForm({ password: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/confirm-password');
    };

    return (
        <GuestLayout>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-2">Potvrdi lozinku</h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
                Ovo je zaštićena oblast. Molimo potvrdite lozinku pre nego što nastavite.
            </p>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Lozinka</label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        required autoFocus autoComplete="current-password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        Potvrdi
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
