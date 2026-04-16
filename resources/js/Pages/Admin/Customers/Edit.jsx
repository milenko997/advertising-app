import { useForm, Link } from '@inertiajs/react';
import { useState, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function CustomersEdit({ customer }) {
    const { data, setData, post, processing, errors } = useForm({
        _method:       'PUT',
        name:          customer.name,
        email:         customer.email,
        role:          customer.role,
        phone:         customer.phone ?? '',
        avatar:        null,
        remove_avatar: false,
    });

    const [preview, setPreview] = useState(
        customer.avatar ? `/storage/${customer.avatar}` : null
    );
    const fileRef = useRef(null);

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/korisnici/${customer.slug}`, { forceFormData: true });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData(d => ({ ...d, avatar: file, remove_avatar: false }));
        setPreview(URL.createObjectURL(file));
    };

    const handleRemoveAvatar = () => {
        setData(d => ({ ...d, avatar: null, remove_avatar: true }));
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <AppLayout>
            <div id="page-admin-edit-customer" className="py-8">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <form onSubmit={submit} className="space-y-5">

                            {/* Avatar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Profilna slika</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                        {preview ? (
                                            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
                                        >
                                            Odaberi sliku
                                        </button>
                                        {preview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveAvatar}
                                                className="text-sm px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition"
                                            >
                                                Ukloni sliku
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/gif"
                                    ref={fileRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {errors.avatar && <p className="mt-1 text-xs text-red-600">{errors.avatar}</p>}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email adresa</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="+381 60 123 4567"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Uloga</label>
                                <select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                    Sačuvaj izmene
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
