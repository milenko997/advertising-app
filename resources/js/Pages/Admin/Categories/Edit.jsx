import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function CategoriesEdit({ category, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        parent_id: category.parent_id ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/kategorije/${category.slug}`);
    };

    return (
        <AppLayout>
            <div id="page-admin-edit-category" className="py-8">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Naziv</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nadkategorija</label>
                                <select
                                    value={data.parent_id}
                                    onChange={e => setData('parent_id', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Nema (najviši nivo)</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.parent_id && <p className="mt-1 text-xs text-red-600">{errors.parent_id}</p>}
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                                >
                                    Sačuvaj izmene
                                </button>
                                <Link href="/admin/kategorije" className="text-sm text-gray-500 hover:text-gray-700">
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
