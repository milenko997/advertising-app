import { useState, useRef } from 'react';

async function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                const MAX = 1600;
                if (width > MAX || height > MAX) {
                    if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
                    else { width = Math.round((width * MAX) / height); height = MAX; }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                canvas.toBlob(
                    (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
                    'image/jpeg', 0.82
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

export default function ImageUpload({ value, onChange, currentImage, onRemove }) {
    const [preview, setPreview] = useState(null);
    const [removing, setRemoving] = useState(false);
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        const ready = file.size > 1.8 * 1024 * 1024 ? await compressImage(file) : file;
        onChange(ready);
        setPreview(URL.createObjectURL(ready));
        setRemoving(false);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
        setRemoving(true);
        if (inputRef.current) inputRef.current.value = '';
        onRemove?.();
    };

    const displayImage = preview || (!removing && currentImage ? `/storage/${currentImage}` : null);

    return (
        <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>

            {displayImage ? (
                <div className="relative inline-block">
                    <img src={displayImage} alt="Preview" className="w-40 h-32 object-cover rounded-lg border border-gray-200" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                    >
                        ×
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    className="w-40 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition"
                >
                    <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-500">Click to upload</span>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
            />

        </div>
    );
}
