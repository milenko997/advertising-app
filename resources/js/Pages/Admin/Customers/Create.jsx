import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent';

export default function CustomersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name:                  '',
        email:                 '',
        password:              '',
        password_confirmation: '',
        role:                  'customer',
        phone:                 '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/korisnici');
    };

    return (
        <AppLayout header={
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Novi korisnik</h2>
                <Link href="/admin/korisnici" className="text-sm text-gray-500 hover:text-gray-700">
                    ← Nazad
                </Link>
            </div>
        }>
            <Head><title>Novi korisnik — AdBoard Admin</title></Head>
            <div id="page-admin-create-customer" className="py-8">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <form onSubmit={submit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    autoFocus required
                                    className={inputClass}
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email adresa</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                    className={inputClass}
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lozinka</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    required
                                    className={inputClass}
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Potvrda lozinke</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="+381 60 123 4567"
                                    className={inputClass}
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Uloga</label>
                                <select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="customer">Korisnik</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                                >
                                    Kreiraj korisnika
                                </button>
                                <Link href="/admin/korisnici" className="text-sm text-gray-500 hover:text-gray-700">
                                    Otkaži
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
