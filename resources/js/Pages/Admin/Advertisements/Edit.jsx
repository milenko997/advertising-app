import { useState, useRef } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ImageUpload from '@/Components/ImageUpload';
import CategoryPicker from '@/Components/CategoryPicker';
import LocationAutocomplete from '@/Components/LocationAutocomplete';

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

const PAYLOAD_CONFIG = {
    'kombi-panel-van':                        { label: 'Nosivost',              placeholder: 'npr. 800 kg, 1.2 t' },
    'pickup-vozila':                          { label: 'Nosivost',              placeholder: 'npr. 500 kg, 1 t' },
    'mali-dostavni-kamioni':                  { label: 'Nosivost',              placeholder: 'npr. 1.5 t, 3.5 t' },
    'hladnjace-mali-kombi':                   { label: 'Nosivost',              placeholder: 'npr. 800 kg, 1.5 t' },
    'kamioni-sanducari':                      { label: 'Nosivost',              placeholder: 'npr. 5 t, 10 t' },
    'kamioni-sa-ceradom-tenda':               { label: 'Nosivost',              placeholder: 'npr. 22 t, 24 t' },
    'kamioni-sa-hladnjacom-srednji':          { label: 'Nosivost',              placeholder: 'npr. 10 t, 15 t' },
    'kamioni-kiperi-srednji':                 { label: 'Nosivost',              placeholder: 'npr. 10 t, 15 t' },
    'kamioni-sa-dizalicom-kran':              { label: 'Nosivost dizalice',     placeholder: 'npr. 8 t, 15 t' },
    'sleperi-tegljac-poluprikolica':          { label: 'Nosivost',              placeholder: 'npr. 24 t, 26 t' },
    'kamioni-sa-prikolicom':                  { label: 'Nosivost',              placeholder: 'npr. 30 t, 40 t' },
    'cisterne-gorivo-gas-hemikalije':         { label: 'Zapremina cisterne',    placeholder: 'npr. 20.000 l, 30.000 l' },
    'auto-transporter-za-vozila':             { label: 'Kapacitet',             placeholder: 'npr. 6 vozila, 8 vozila' },
    'hladnjace-veliki-kamioni':               { label: 'Nosivost',              placeholder: 'npr. 18 t, 22 t' },
    'kiperi-teski-gradevinski':               { label: 'Nosivost',              placeholder: 'npr. 25 t, 40 t' },
    'silosi-za-rasute-materijale':            { label: 'Zapremina silosa',      placeholder: 'npr. 60 m³, 90 m³' },
    'hladnjace-temperaturni-rezim':           { label: 'Nosivost',              placeholder: 'npr. 18 t, 22 t' },
    'cisterne':                               { label: 'Zapremina cisterne',    placeholder: 'npr. 20.000 l, 30.000 l' },
    'kiperi':                                 { label: 'Nosivost',              placeholder: 'npr. 20 t, 30 t' },
    'vozila-za-prevoz-stoke':                 { label: 'Kapacitet',             placeholder: 'npr. 20 goveda, 100 svinja' },
    'vozila-za-prevoz-gradevinskog-materijala': { label: 'Nosivost',            placeholder: 'npr. 20 t, 30 t' },
    'vozila-za-opasan-teret-adr':             { label: 'Nosivost',              placeholder: 'npr. 20 t, 22 t' },
    'slep-sluzba-vucna-vozila':               { label: 'Maks. masa vozila',     placeholder: 'npr. do 3.5 t, do 7.5 t' },
    'platforme-pauk-vozila':                  { label: 'Nosivost platforme',    placeholder: 'npr. 10 t, 20 t' },
    'pokretne-radionice':                     { label: 'Nosivost',              placeholder: 'npr. 3.5 t' },
    'gradska-dostava-mali-kombi':             { label: 'Nosivost',              placeholder: 'npr. 800 kg, 1.2 t' },
    'ekspres-dostava':                        { label: 'Nosivost',              placeholder: 'npr. 500 kg, 1 t' },
    'kurirska-vozila':                        { label: 'Nosivost',              placeholder: 'npr. 200 kg, 500 kg' },
    'last-mile-delivery-vozila':              { label: 'Nosivost',              placeholder: 'npr. 200 kg, 500 kg' },
    'elektricna-dostavna-vozila':             { label: 'Nosivost',              placeholder: 'npr. 500 kg, 1 t' },
    'bageri':                                 { label: 'Zapremina kašike',      placeholder: 'npr. 0.5 m³, 1.2 m³' },
    'mini-bageri':                            { label: 'Zapremina kašike',      placeholder: 'npr. 0.1 m³, 0.2 m³' },
    'utovarivaci':                            { label: 'Zapremina kašike',      placeholder: 'npr. 1 m³, 2 m³' },
    'buldozeri':                              { label: 'Kapacitet sečiva',      placeholder: 'npr. 3.5 m³, 5 m³' },
    'valjci':                                 { label: 'Radna težina',          placeholder: 'npr. 8 t, 12 t' },
    'kamioni-kiperi-gradevinski':             { label: 'Nosivost',              placeholder: 'npr. 15 t, 25 t' },
    'mikseri-beton':                          { label: 'Zapremina miksera',     placeholder: 'npr. 6 m³, 8 m³' },
    'dizalice-kranovi':                       { label: 'Nosivost dizalice',     placeholder: 'npr. 25 t, 80 t' },
    'traktori-sa-prikolicom':                 { label: 'Nosivost prikolice',    placeholder: 'npr. 5 t, 10 t' },
    'prikolice-za-zitarice':                  { label: 'Zapremina',             placeholder: 'npr. 20 t ili 40 m³' },
    'cisterne-za-vodu-dubrivo':               { label: 'Zapremina cisterne',    placeholder: 'npr. 5.000 l, 10.000 l' },
    'specijalni-transport-za-poljoprivredu':  { label: 'Nosivost',              placeholder: 'npr. 10 t' },
    'teretni-vagoni':                         { label: 'Nosivost',              placeholder: 'npr. 60 t, 80 t' },
    'cisterne-zeleznicke':                    { label: 'Zapremina cisterne',    placeholder: 'npr. 60.000 l, 80.000 l' },
    'kontejnerski-vagoni':                    { label: 'Kapacitet',             placeholder: "npr. 2×20' ili 1×40'" },
    'teretni-brodovi':                        { label: 'Nosivost (DWT)',         placeholder: 'npr. 5.000 DWT, 50.000 DWT' },
    'tankeri':                                { label: 'Zapremina',             placeholder: 'npr. 50.000 DWT' },
    'kontejnerski-brodovi':                   { label: 'Kapacitet (TEU)',        placeholder: 'npr. 500 TEU, 2.000 TEU' },
    'barze':                                  { label: 'Nosivost',              placeholder: 'npr. 500 t, 2.000 t' },
    'cargo-avioni':                           { label: 'Nosivost',              placeholder: 'npr. 20 t, 60 t' },
    'kurirski-avioni':                        { label: 'Nosivost',              placeholder: 'npr. 1 t, 5 t' },
};

const DEFAULT_PAYLOAD = { label: 'Nosivost', placeholder: 'npr. 10 tona' };

function getPayloadConfig(categoryId, categories) {
    if (!categoryId) return DEFAULT_PAYLOAD;
    const id = parseInt(categoryId);
    const found = categories.find(c => c.id === id);
    return (found && PAYLOAD_CONFIG[found.slug]) ? PAYLOAD_CONFIG[found.slug] : DEFAULT_PAYLOAD;
}

function SectionTitle({ children }) {
    return (
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4 mt-6 first:mt-0">
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
        if (!confirm('Ukloniti ovu sliku?')) return;
        router.delete(`/slike-oglasa/${imageId}`, { preserveScroll: true });
    };

    const handlePhone = (e) => {
        setData('phone', e.target.value.replace(/[^\d+\s\-().]/g, ''));
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/oglasi/${advertisement.id}`, { forceFormData: true });
    };

    return (
        <AppLayout>
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-6">
                        <Link href="/admin/oglasi" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Oglasi
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Izmeni oglas</h1>
                        <p className="text-sm text-gray-500 mt-1 truncate">{advertisement.title}</p>
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

                            <div className="border-t border-gray-100 my-6" />
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

                            <div className="border-t border-gray-100 my-6" />
                            <SectionTitle>Cena i kontakt</SectionTitle>

                            <div className="mb-4">
                                <label className={labelClass}>Cena</label>
                                <input type="text" value={data.price} onChange={e => setData('price', e.target.value)} placeholder="npr. 0.5 EUR/km, 50 EUR/h" className={inputClass} />
                                <p className="mt-1 text-xs text-gray-400">Ostavite prazno za prikaz "Cena na upit"</p>
                                {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                            </div>

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
                            <SectionTitle>Fotografija</SectionTitle>

                            <p className="text-xs text-gray-500 mb-2">Naslovna fotografija (glavna slika)</p>
                            <ImageUpload
                                currentImage={advertisement.image}
                                onChange={file => { setData('image', file); setData('remove_image', '0'); }}
                                onRemove={() => { setData('image', null); setData('remove_image', '1'); }}
                            />

                            {/* Existing gallery images */}
                            {advertisement.images?.length > 0 && (
                                <div className="mt-5">
                                    <p className="text-xs text-gray-500 mb-2">Galerija fotografija</p>
                                    <div className="flex flex-wrap gap-2">
                                        {advertisement.images.map((img) => (
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
                                <p className="text-xs text-gray-500 mb-2">Dodaj još fotografija</p>
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
                                    Dodaj fotografije
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Čuvanje…' : 'Sačuvaj izmene'}
                                </button>
                                <Link href="/admin/oglasi" className="text-sm text-gray-500 hover:text-gray-700">
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
