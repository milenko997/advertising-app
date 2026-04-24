import { useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout>
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Kreirajte nalog</h1>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">Ime i prezime</label>
                    <input
                        id="register-name"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        required autoFocus
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email adresa</label>
                    <input
                        id="register-email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
                    <input
                        id="register-password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        required autoComplete="new-password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div>
                    <label htmlFor="register-password-confirmation" className="block text-sm font-medium text-gray-700 mb-1">Potvrda lozinke</label>
                    <input
                        id="register-password-confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        required autoComplete="new-password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <Link href="/login" className="text-sm text-gray-500 hover:text-orange-600">
                        Već imate nalog?
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        Registruj se
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
