import { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ImageUpload from '@/Components/ImageUpload';
import LocationAutocomplete from '@/Components/LocationAutocomplete';
import CategoryPicker from '@/Components/CategoryPicker';
import { getPayloadConfig } from '@/config/categoryFields';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

function SectionTitle({ children }) {
    return (
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 mt-6 first:mt-0">
            {children}
        </h3>
    );
}

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        availability: 'available',
        payload: '',

        price: '',
        phone: '',
        location: '',
        category_id: '',
        image: null,
        images: [],
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const galleryInputRef = useRef();

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setData('images', [...data.images, ...files]);
        const newPreviews = files.map(f => URL.createObjectURL(f));
        setImagePreviews(prev => [...prev, ...newPreviews]);
        e.target.value = '';
    };

    const removeGalleryImage = (index) => {
        setData('images', data.images.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handlePhone = (e) => {
        setData('phone', e.target.value.replace(/[^\d+\s\-().]/g, ''));
    };

    const submit = (e) => {
        e.preventDefault();
        post('/oglasi', { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head><title>Postavi oglas — AdBoard</title></Head>
            <div className="py-4 sm:py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Page header */}
                    <div className="mb-6">
                        <Link href="/moji-oglasi" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Moji oglasi
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Postavi oglas</h1>
                        <p className="text-sm text-gray-500 mt-1">Popunite podatke ispod da biste oglasili vozilo ili transportnu uslugu.</p>
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

                            <SectionTitle>Osnovni podaci</SectionTitle>

                            {/* Title */}
                            <div className="mb-4">
                                <label className={labelClass}>Naslov <span className="text-red-500">*</span></label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} minLength={5} maxLength={255} className={inputClass} placeholder="npr. Mercedes Actros dostupan za dugopruge" />
                                <p className="mt-1 text-xs text-gray-400">{data.title.length}/255</p>
                                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div className="mb-4">
                                <label className={labelClass}>Opis <span className="text-red-500">*</span></label>
                                <textarea rows={8} value={data.description} onChange={e => setData('description', e.target.value)} minLength={10} maxLength={5000} className={inputClass} placeholder="Opišite vozilo, usluge, dostupnost, itd." />
                                <p className="mt-1 text-xs text-gray-400">{data.description.length}/5000</p>
                                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                            </div>

                            <div className="border-t border-gray-100 my-6" />
                            <SectionTitle>Detalji vozila</SectionTitle>

                            {/* Availability */}
                            <div className="mb-4">
                                <label className={labelClass}>Dostupnost <span className="text-red-500">*</span></label>
                                <select value={data.availability} onChange={e => setData('availability', e.target.value)} className={inputClass}>
                                    <option value="available">Dostupno</option>
                                    <option value="on_request">Na upit</option>
                                </select>
                                {errors.availability && <p className="mt-1 text-xs text-red-600">{errors.availability}</p>}
                            </div>

                            {/* Payload */}
                            {(() => {
                                const pc = getPayloadConfig(data.category_id, categories);
                                return (
                                    <div className="mb-4">
                                        <label className={labelClass}>{pc.label}</label>
                                        <input type="text" value={data.payload} onChange={e => setData('payload', e.target.value)} placeholder={pc.placeholder} className={inputClass} />
                                        {errors.payload && <p className="mt-1 text-xs text-red-600">{errors.payload}</p>}
                                    </div>
                                );
                            })()}

                            {/* Category */}
                            <div className="mb-4">
                                <label className={labelClass}>Kategorija <span className="text-red-500">*</span></label>
                                <CategoryPicker
                                    categories={categories}
                                    value={data.category_id}
                                    onChange={id => setData('category_id', id)}
                                />
                                {errors.category_id && <p className="mt-1 text-xs text-red-600">{errors.category_id}</p>}
                            </div>

                            <div className="border-t border-gray-100 my-6" />
                            <SectionTitle>Cena i kontakt</SectionTitle>

                            {/* Price */}
                            <div className="mb-4">
                                <label className={labelClass}>Cena</label>
                                <input type="text" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="npr. 0.5 EUR/km, 50 EUR/h" className={inputClass} />
                                <p className="mt-1 text-xs text-gray-400">Ostavite prazno za prikaz "Cena na upit"</p>
                                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                            </div>

                            {/* Phone + Location */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>Telefon <span className="text-red-500">*</span></label>
                                    <input type="tel" value={data.phone} onChange={handlePhone} maxLength={15} placeholder="+381 62 123 4567" className={inputClass} />
                                    <p className="mt-1 text-xs text-gray-400">Samo cifre, razmaci, +, -, ( )</p>
                                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Lokacija <span className="text-red-500">*</span></label>
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
                            <SectionTitle>Fotografije</SectionTitle>

                            {/* Cover image */}
                            <p className="text-xs text-gray-500 mb-2">Naslovna fotografija (glavna slika)</p>
                            <ImageUpload
                                value={data.image}
                                onChange={file => setData('image', file)}
                            />

                            {/* Gallery images */}
                            <div className="mt-5">
                                <p className="text-xs text-gray-500 mb-2">Dodatne fotografije</p>
                                {imagePreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative group">
                                                <img src={src} alt="" className="w-24 h-20 object-cover rounded-lg border border-gray-200" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(i)}
                                                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
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
                                    Dodaj fotografije
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Postavljanje…' : 'Postavi oglas'}
                                </button>
                                <Link href="/moji-oglasi" className="w-full sm:w-auto text-center py-3 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg sm:border-0 sm:py-0">
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
