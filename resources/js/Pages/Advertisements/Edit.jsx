import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ImageUpload from '@/Components/ImageUpload';

const VEHICLE_TYPES = [
    ['truck', 'Truck'], ['van', 'Van'], ['pickup', 'Pickup'], ['trailer', 'Trailer'],
    ['flatbed', 'Flatbed'], ['refrigerator_truck', 'Refrigerator Truck'],
    ['tanker', 'Tanker'], ['other', 'Other'],
];

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

export default function Edit({ ad, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        title: ad.title ?? '',
        description: ad.description ?? '',
        vehicle_type: ad.vehicle_type ?? '',
        availability: ad.availability ?? 'available',
        payload: ad.payload ?? '',
        route: ad.route ?? '',
        price: ad.price ?? '',
        phone: ad.phone ?? '',
        location: ad.location ?? '',
        category_id: ad.category_id ?? '',
        image: null,
        remove_image: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/advertisements/${ad.slug}/update`, { forceFormData: true });
    };

    return (
        <AppLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Advertisement</h2>}>
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                        {Object.keys(errors).length > 0 && (
                            <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-4">
                                <ul className="text-sm text-red-600 space-y-1">
                                    {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
                                </ul>
                            </div>
                        )}

                        <form onSubmit={submit} encType="multipart/form-data">

                            {/* Title */}
                            <div className="mb-5">
                                <label className={labelClass}>Title</label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inputClass} />
                                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div className="mb-5">
                                <label className={labelClass}>Description</label>
                                <textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} className={inputClass} />
                                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                            </div>

                            {/* Vehicle Type + Availability */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className={labelClass}>Vehicle Type <span className="text-red-500">*</span></label>
                                    <select value={data.vehicle_type} onChange={e => setData('vehicle_type', e.target.value)} className={inputClass}>
                                        <option value="" disabled>Select vehicle type</option>
                                        {VEHICLE_TYPES.map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.vehicle_type && <p className="mt-1 text-xs text-red-600">{errors.vehicle_type}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Availability <span className="text-red-500">*</span></label>
                                    <select value={data.availability} onChange={e => setData('availability', e.target.value)} className={inputClass}>
                                        <option value="available">Available</option>
                                        <option value="on_request">On Request</option>
                                    </select>
                                    {errors.availability && <p className="mt-1 text-xs text-red-600">{errors.availability}</p>}
                                </div>
                            </div>

                            {/* Payload + Route */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className={labelClass}>Payload Capacity</label>
                                    <input type="text" value={data.payload} onChange={e => setData('payload', e.target.value)} placeholder="e.g. 10 tons" className={inputClass} />
                                    {errors.payload && <p className="mt-1 text-xs text-red-600">{errors.payload}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Area / Route</label>
                                    <input type="text" value={data.route} onChange={e => setData('route', e.target.value)} placeholder="e.g. National, Belgrade–Novi Sad" className={inputClass} />
                                    {errors.route && <p className="mt-1 text-xs text-red-600">{errors.route}</p>}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-5">
                                <label className={labelClass}>Price</label>
                                <input type="text" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="e.g. 0.5 EUR/km, 50 EUR/h" className={inputClass} />
                                <p className="mt-1 text-xs text-gray-400">Leave empty to show "Price on request"</p>
                                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                            </div>

                            {/* Phone + Location */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} maxLength={15} className={inputClass} />
                                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Location <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.location} onChange={e => setData('location', e.target.value)} className={inputClass} />
                                    {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                                </div>
                            </div>

                            {/* Category */}
                            <div className="mb-5">
                                <label className={labelClass}>Category <span className="text-red-500">*</span></label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className={inputClass}>
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="mt-1 text-xs text-red-600">{errors.category_id}</p>}
                            </div>

                            {/* Image */}
                            <ImageUpload
                                value={data.image}
                                currentImage={ad.image}
                                onChange={file => setData('image', file)}
                                onRemove={() => setData('remove_image', '1')}
                            />

                            <div className="mt-6 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Saving…' : 'Save Changes'}
                                </button>
                                <a href={`/advertisements/${ad.slug}`} className="text-sm text-gray-500 hover:text-gray-700">Cancel</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
