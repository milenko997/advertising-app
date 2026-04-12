import { useState, useRef } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ImageUpload from '@/Components/ImageUpload';
import LocationAutocomplete from '@/Components/LocationAutocomplete';
import CategoryPicker from '@/Components/CategoryPicker';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

function SectionTitle({ children }) {
    return (
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 mt-6 first:mt-0">
            {children}
        </h3>
    );
}

export default function Edit({ ad, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: ad.title ?? '',
        description: ad.description ?? '',
        availability: ad.availability ?? 'available',
        payload: ad.payload ?? '',

        price: ad.price ?? '',
        phone: ad.phone ?? '',
        location: ad.location ?? '',
        category_id: ad.category_id ? String(ad.category_id) : '',
        image: null,
        remove_image: '',
        images: [],
    });

    const [newPreviews, setNewPreviews] = useState([]);
    const galleryInputRef = useRef();

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setData('images', [...data.images, ...files]);
        setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
    };

    const removeNewImage = (index) => {
        setData('images', data.images.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingImage = (imageId) => {
        if (!confirm('Remove this image?')) return;
        router.delete(`/advertisement-images/${imageId}`, { preserveScroll: true });
    };

    const handlePhone = (e) => {
        setData('phone', e.target.value.replace(/[^\d+\s\-().]/g, ''));
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/advertisements/${ad.slug}/update`, { forceFormData: true });
    };

    return (
        <AppLayout>
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page header */}
                    <div className="mb-6">
                        <Link href={`/advertisements/${ad.slug}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Ad
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Advertisement</h1>
                        <p className="text-sm text-gray-500 mt-1 truncate">{ad.title}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

                        {Object.keys(errors).length > 0 && (
                            <div className="mb-5 bg-red-50 border border-red-200 rounded-lg p-4">
                                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                                    {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
                                </ul>
                            </div>
                        )}

                        <form onSubmit={submit} encType="multipart/form-data">

                            <SectionTitle>Basic Info</SectionTitle>

                            {/* Title */}
                            <div className="mb-4">
                                <label className={labelClass}>Title <span className="text-red-500">*</span></label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} minLength={5} maxLength={255} className={inputClass} />
                                <p className="mt-1 text-xs text-gray-400">{data.title.length}/255</p>
                                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className={labelClass}>Description <span className="text-red-500">*</span></label>
                                <textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} minLength={10} maxLength={5000} className={inputClass} />
                                <p className="mt-1 text-xs text-gray-400">{data.description.length}/5000</p>
                                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                            </div>

                            <div className="border-t border-gray-100 my-6" />
                            <SectionTitle>Vehicle Details</SectionTitle>

                            {/* Availability */}
                            <div className="mb-4">
                                <label className={labelClass}>Availability <span className="text-red-500">*</span></label>
                                <select value={data.availability} onChange={e => setData('availability', e.target.value)} className={inputClass}>
                                    <option value="available">Available</option>
                                    <option value="on_request">On Request</option>
                                </select>
                                {errors.availability && <p className="mt-1 text-xs text-red-600">{errors.availability}</p>}
                            </div>

                            {/* Payload */}
                            <div className="mb-4">
                                <label className={labelClass}>Payload Capacity</label>
                                <input type="text" value={data.payload} onChange={e => setData('payload', e.target.value)} placeholder="e.g. 10 tons" className={inputClass} />
                                {errors.payload && <p className="mt-1 text-xs text-red-600">{errors.payload}</p>}
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label className={labelClass}>Category <span className="text-red-500">*</span></label>
                                <CategoryPicker
                                    categories={categories}
                                    value={data.category_id}
                                    onChange={id => setData('category_id', id)}
                                />
                                {errors.category_id && <p className="mt-1 text-xs text-red-600">{errors.category_id}</p>}
                            </div>

                            <div className="border-t border-gray-100 my-6" />
                            <SectionTitle>Pricing & Contact</SectionTitle>

                            {/* Price */}
                            <div className="mb-4">
                                <label className={labelClass}>Price</label>
                                <input type="text" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="e.g. 0.5 EUR/km, 50 EUR/h" className={inputClass} />
                                <p className="mt-1 text-xs text-gray-400">Leave empty to show "Price on request"</p>
                                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                            </div>

                            {/* Phone + Location */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
                                    <input type="tel" value={data.phone} onChange={handlePhone} maxLength={15} placeholder="+381 62 123 4567" className={inputClass} />
                                    <p className="mt-1 text-xs text-gray-400">Digits, spaces, +, -, ( ) only</p>
                                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Location <span className="text-red-500">*</span></label>
                                    <LocationAutocomplete
                                        value={data.location}
                                        onChange={val => setData('location', val)}
                                        className={inputClass}
                                        placeholder="npr. Beograd"
                                    />
                                    {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-6" />
                            <SectionTitle>Photos</SectionTitle>

                            {/* Cover image */}
                            <p className="text-xs text-gray-500 mb-2">Cover photo (main image)</p>
                            <ImageUpload
                                value={data.image}
                                currentImage={ad.image}
                                onChange={file => setData('image', file)}
                                onRemove={() => setData('remove_image', '1')}
                            />

                            {/* Existing gallery images */}
                            {ad.images?.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-xs text-gray-500 mb-2">Gallery photos</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ad.images.map((img) => (
                                            <div key={img.id} className="relative group">
                                                <img
                                                    src={`/storage/${img.path}`}
                                                    alt=""
                                                    className="w-24 h-20 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteExistingImage(img.id)}
                                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add more gallery images */}
                            <div className="mt-5">
                                <p className="text-xs text-gray-500 mb-2">Add more photos</p>
                                {newPreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {newPreviews.map((src, i) => (
                                            <div key={i} className="relative group">
                                                <img src={src} alt="" className="w-24 h-20 object-cover rounded-lg border border-gray-200" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(i)}
                                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input
                                    ref={galleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryChange}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => galleryInputRef.current?.click()}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add photos
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Saving…' : 'Save Changes'}
                                </button>
                                <Link href={`/advertisements/${ad.slug}`} className="text-sm text-gray-500 hover:text-gray-700">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
