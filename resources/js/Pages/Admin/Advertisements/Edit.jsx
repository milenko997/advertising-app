import { useState, useRef } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ImageUpload from '@/Components/ImageUpload';
import CategoryPicker from '@/Components/CategoryPicker';
import LocationAutocomplete from '@/Components/LocationAutocomplete';
import { getPayloadConfig } from '@/config/categoryFields';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 dark:placeholder-neutral-400';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1';

function SectionTitle({ children }) {
    return (
        <h3 className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-4 mt-6 first:mt-0">
            {children}
        </h3>
    );
}

export default function AdminAdvertisementsEdit({ advertisement, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: advertisement.title ?? '',
        description: advertisement.description ?? '',
        availability: advertisement.availability ?? 'available',
        payload: advertisement.payload ?? '',
        price: advertisement.price ?? '',
        phone: advertisement.phone ?? '',
        location: advertisement.location ?? '',
        category_id: advertisement.category_id ? String(advertisement.category_id) : '',
        image: null,
        remove_image: '0',
        images: [],
    });

    const [newPreviews, setNewPreviews] = useState([]);
    const [galleryError, setGalleryError] = useState(null);
    const galleryInputRef = useRef();

    const MAX_FILE_MB = 20;
    const MAX_TOTAL_MB = 45;
    const MAX_IMAGES = 10;

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const existingCount = advertisement.images?.length ?? 0;
        if (existingCount + data.images.length + files.length > MAX_IMAGES) {
            setGalleryError(`Možete dodati najviše ${MAX_IMAGES} dodatnih fotografija.`);
            e.target.value = '';
            return;
        }

        const tooBig = files.find(f => f.size > MAX_FILE_MB * 1024 * 1024);
        if (tooBig) {
            setGalleryError(`Slika "${tooBig.name}" je prevelika. Maksimalna veličina po slici je ${MAX_FILE_MB} MB.`);
            e.target.value = '';
            return;
        }

        const allFiles = [...data.images, ...files];
        const totalMB = allFiles.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;
        if (totalMB > MAX_TOTAL_MB) {
            setGalleryError(`Ukupna veličina svih slika ne sme biti veća od ${MAX_TOTAL_MB} MB.`);
            e.target.value = '';
            return;
        }

        setGalleryError(null);
        setData('images', allFiles);
        setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
    };

    const removeNewImage = (index) => {
        setData('images', data.images.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
        setGalleryError(null);
    };

    const deleteExistingImage = (imageId) => {
        if (!confirm('Ukloniti ovu sliku?')) return;
        router.delete(`/slike-oglasa/${imageId}`, { preserveScroll: true });
    };

    const handlePhone = (e) => {
        setData('phone', e.target.value.replace(/[^\d+\s\-().]/g, ''));
    };

    const submit = (e) => {
        e.preventDefault();

        const coverSize = data.image?.size ?? 0;
        const gallerySize = data.images.reduce((sum, f) => sum + f.size, 0);
        const totalMB = (coverSize + gallerySize) / 1024 / 1024;

        if (totalMB > MAX_TOTAL_MB) {
            setGalleryError(`Ukupna veličina svih slika (${totalMB.toFixed(1)} MB) prelazi limit od ${MAX_TOTAL_MB} MB. Uklonite neke slike.`);
            return;
        }

        post(`/admin/oglasi/${advertisement.id}`, { forceFormData: true });
    };

    return (
        <AppLayout>
            <Head title="Izmeni oglas — Admin" />
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-6">
                        <Link href="/admin/oglasi" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-orange-600 transition-colors mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Oglasi
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Izmeni oglas</h1>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 truncate">{advertisement.title}</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 shadow-sm p-6">

                        {Object.keys(errors).length > 0 && (
                            <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <ul className="text-sm text-red-600 space-y-1 list-disc list-inside">
                                    {Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}
                                </ul>
                            </div>
                        )}

                        <form onSubmit={submit} encType="multipart/form-data">

                            <SectionTitle>Osnovni podaci</SectionTitle>

                            <div className="mb-4">
                                <label className={labelClass}>Naslov <span className="text-red-500">*</span></label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} required maxLength={255} className={inputClass} />
                                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                            </div>

                            <div className="mb-4">
                                <label className={labelClass}>Opis <span className="text-red-500">*</span></label>
                                <textarea rows={8} value={data.description} onChange={e => setData('description', e.target.value)} required className={inputClass} />
                                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                            </div>

                            <div className="border-t border-gray-100 dark:border-neutral-700 my-6" />
                            <SectionTitle>Detalji vozila</SectionTitle>

                            <div className="mb-4">
                                <label className={labelClass}>Dostupnost <span className="text-red-500">*</span></label>
                                <select value={data.availability} onChange={e => setData('availability', e.target.value)} className={inputClass}>
                                    <option value="available">Dostupno</option>
                                    <option value="on_request">Na upit</option>
                                </select>
                                {errors.availability && <p className="mt-1 text-xs text-red-600">{errors.availability}</p>}
                            </div>

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

                            <div className="mb-4">
                                <label className={labelClass}>Kategorija <span className="text-red-500">*</span></label>
                                <CategoryPicker
                                    categories={categories}
                                    value={data.category_id}
                                    onChange={id => setData('category_id', id)}
                                />
                                {errors.category_id && <p className="mt-1 text-xs text-red-600">{errors.category_id}</p>}
                            </div>

                            <div className="border-t border-gray-100 dark:border-neutral-700 my-6" />
                            <SectionTitle>Cena i kontakt</SectionTitle>

                            <div className="mb-4">
                                <label className={labelClass}>Cena</label>
                                <input type="text" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="npr. 0.5 EUR/km, 50 EUR/h" className={inputClass} />
                                <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">Ostavite prazno za prikaz "Cena na upit"</p>
                                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className={labelClass}>Telefon <span className="text-red-500">*</span></label>
                                    <input type="tel" value={data.phone} onChange={handlePhone} maxLength={15} placeholder="+381 62 123 4567" className={inputClass} />
                                    <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">Samo cifre, razmaci, +, -, ( )</p>
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

                            <div className="border-t border-gray-100 dark:border-neutral-700 my-6" />
                            <SectionTitle>Fotografija</SectionTitle>

                            <p className="text-xs text-gray-500 mb-2">Naslovna fotografija (glavna slika)</p>
                            <ImageUpload
                                currentImage={advertisement.image}
                                onChange={file => { setData('image', file); setData('remove_image', '0'); }}
                                onRemove={() => { setData('image', null); setData('remove_image', '1'); }}
                            />

                            {/* Gallery images */}
                            <div className="mt-5">
                                <p className="text-xs text-gray-500 dark:text-neutral-400 mb-2">Galerija fotografija</p>
                                <input
                                    ref={galleryInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryChange}
                                    className="hidden"
                                />
                                {(advertisement.images?.length > 0 || newPreviews.length > 0) ? (
                                    <>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-2">
                                            {advertisement.images?.map((img) => (
                                                <div key={img.id} className="relative group aspect-square">
                                                    <img
                                                        src={`/storage/${img.path}`}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-neutral-700"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteExistingImage(img.id)}
                                                        aria-label="Ukloni fotografiju"
                                                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {newPreviews.map((src, i) => (
                                                <div key={`new-${i}`} className="relative group aspect-square">
                                                    <img
                                                        src={src}
                                                        alt=""
                                                        className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-neutral-700"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(i)}
                                                        aria-label="Ukloni fotografiju"
                                                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                            {(advertisement.images?.length ?? 0) + newPreviews.length < MAX_IMAGES && (
                                                <button
                                                    type="button"
                                                    onClick={() => galleryInputRef.current?.click()}
                                                    aria-label="Dodaj još fotografija"
                                                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-neutral-600 flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-neutral-500 hover:border-orange-500 hover:text-orange-500 dark:hover:border-orange-500 dark:hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    <span className="text-xs font-medium leading-none">Dodaj</span>
                                                </button>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-neutral-500 tabular-nums">
                                            {(advertisement.images?.length ?? 0) + newPreviews.length}<span className="text-gray-300 dark:text-neutral-600">/10</span>
                                        </span>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => galleryInputRef.current?.click()}
                                        className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg text-xs font-medium text-gray-600 dark:text-neutral-300 hover:border-orange-500 hover:text-orange-500 dark:hover:border-orange-500 dark:hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Dodaj fotografije
                                    </button>
                                )}
                                {galleryError && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{galleryError}</p>}
                                {errors.images && <p className="mt-2 text-xs text-red-600">{errors.images}</p>}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-neutral-700 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Čuvanje…' : 'Sačuvaj izmene'}
                                </button>
                                <Link href="/admin/oglasi" className="text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-gray-300">
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
