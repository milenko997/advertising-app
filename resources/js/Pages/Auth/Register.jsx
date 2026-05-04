import { useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import PasswordInput from '@/Components/PasswordInput';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        account_type: 'personal',
        name: '',
        email: '',
        company_name: '',
        pib: '',
        maticni_broj: '',
        address: '',
        city: '',
        website: '',
        password: '',
        password_confirmation: '',
    });

    const isCompany = data.account_type === 'company';

    const handleName = (e) => {
        const cleaned = e.target.value
            .replace(/[^a-zA-ZđĐšŠčČćĆžŽ \-']/g, '')
            .slice(0, 50);
        setData('name', cleaned);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/registracija');
    };

    return (
        <GuestLayout>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-6">Kreirajte nalog</h1>

            <form onSubmit={submit} className="space-y-4">
                {/* Account type switcher */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Tip naloga</label>
                    <div className="flex rounded-lg border border-gray-300 dark:border-neutral-600 overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setData('account_type', 'personal')}
                            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                                !isCompany
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white dark:bg-neutral-700 text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-600'
                            }`}
                        >
                            Privatno lice
                        </button>
                        <button
                            type="button"
                            onClick={() => setData('account_type', 'company')}
                            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                                isCompany
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-white dark:bg-neutral-700 text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-600'
                            }`}
                        >
                            Firma
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                        {isCompany ? 'Ime kontakt osobe' : 'Ime i prezime'}
                    </label>
                    <input
                        id="register-name"
                        type="text"
                        value={data.name}
                        onChange={handleName}
                        required autoFocus
                        minLength={2}
                        maxLength={50}
                        className={inputClass}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Email adresa</label>
                    <input
                        id="register-email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required
                        className={inputClass}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Company fields */}
                {isCompany && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Naziv firme</label>
                            <input
                                type="text"
                                value={data.company_name}
                                onChange={e => setData('company_name', e.target.value)}
                                required
                                maxLength={255}
                                placeholder="Naziv firme d.o.o."
                                className={inputClass}
                            />
                            {errors.company_name && <p className="mt-1 text-xs text-red-600">{errors.company_name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">PIB</label>
                                <input
                                    type="text"
                                    value={data.pib}
                                    onChange={e => setData('pib', e.target.value)}
                                    required
                                    maxLength={20}
                                    placeholder="123456789"
                                    className={inputClass}
                                />
                                {errors.pib && <p className="mt-1 text-xs text-red-600">{errors.pib}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Matični broj</label>
                                <input
                                    type="text"
                                    value={data.maticni_broj}
                                    onChange={e => setData('maticni_broj', e.target.value)}
                                    required
                                    maxLength={20}
                                    placeholder="12345678"
                                    className={inputClass}
                                />
                                {errors.maticni_broj && <p className="mt-1 text-xs text-red-600">{errors.maticni_broj}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Adresa</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    required
                                    maxLength={255}
                                    placeholder="Ulica i broj"
                                    className={inputClass}
                                />
                                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Grad</label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={e => setData('city', e.target.value)}
                                    required
                                    maxLength={100}
                                    placeholder="Beograd"
                                    className={inputClass}
                                />
                                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                                Website <span className="font-normal text-gray-400 dark:text-neutral-500">(opciono)</span>
                            </label>
                            <input
                                type="url"
                                value={data.website}
                                onChange={e => setData('website', e.target.value)}
                                maxLength={255}
                                placeholder="https://www.firma.rs"
                                className={inputClass}
                            />
                            {errors.website && <p className="mt-1 text-xs text-red-600">{errors.website}</p>}
                        </div>
                    </>
                )}

                <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Lozinka</label>
                    <PasswordInput
                        id="register-password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div>
                    <label htmlFor="register-password-confirmation" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Potvrda lozinke</label>
                    <PasswordInput
                        id="register-password-confirmation"
                        value={data.password_confirmation}
                        onChange={e => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <Link href="/prijava" className="text-sm text-gray-500 dark:text-neutral-400 hover:text-orange-600">
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
