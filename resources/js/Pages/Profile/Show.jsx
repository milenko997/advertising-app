import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import ImageUpload from '@/Components/ImageUpload';

export default function ProfileShow({ user }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        _method: 'PUT',
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        avatar: null,
        remove_avatar: '0',
    });

    const [previewUrl, setPreviewUrl] = useState(
        user.avatar ? `/storage/${user.avatar}` : null
    );

    const { data: pwData, setData: setPwData, post: postPw, processing: pwProcessing, errors: pwErrors, recentlySuccessful: pwSuccess } = useForm({
        _method: 'PUT',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleAvatarChange = (file) => {
        setData('avatar', file);
        setData('remove_avatar', '0');
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeAvatar = () => {
        setData(d => ({ ...d, avatar: null, remove_avatar: '1' }));
        setPreviewUrl(null);
    };

    const submitProfile = (e) => {
        e.preventDefault();
        post('/profile');
    };

    const submitPassword = (e) => {
        e.preventDefault();
        postPw('/profile/password');
    };

    return (
        <AppLayout>
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage your account information and security settings.</p>
                    </div>

                    {/* Profile Information */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-5">Profile Information</h3>

                        {recentlySuccessful && (
                            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                                Profile updated successfully.
                            </div>
                        )}

                        <form onSubmit={submitProfile}>
                            {/* Avatar */}
                            <div className="flex items-center gap-5 mb-6">
                                <div className="shrink-0">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={user.name}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-gray-200">
                                            <span className="text-3xl font-bold text-indigo-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition w-fit">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Upload photo
                                        <AvatarInput onFile={handleAvatarChange} />
                                    </label>
                                    {(user.avatar || previewUrl) && (
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 w-fit"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove photo
                                        </button>
                                    )}
                                    <p className="text-xs text-gray-400">JPEG, PNG, GIF — max 4 MB</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="+1 234 567 890"
                                    maxLength={20}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                            >
                                Save changes
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-5">Change Password</h3>

                        {pwSuccess && (
                            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                                Password changed successfully.
                            </div>
                        )}

                        <form onSubmit={submitPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                                <input
                                    type="password"
                                    value={pwData.current_password}
                                    onChange={e => setPwData('current_password', e.target.value)}
                                    required autoComplete="current-password"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {pwErrors.current_password && <p className="mt-1 text-xs text-red-600">{pwErrors.current_password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                                <input
                                    type="password"
                                    value={pwData.password}
                                    onChange={e => setPwData('password', e.target.value)}
                                    required autoComplete="new-password" minLength={8}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                {pwErrors.password && <p className="mt-1 text-xs text-red-600">{pwErrors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                                <input
                                    type="password"
                                    value={pwData.password_confirmation}
                                    onChange={e => setPwData('password_confirmation', e.target.value)}
                                    required autoComplete="new-password"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={pwProcessing}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                            >
                                Change password
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}

function AvatarInput({ onFile }) {
    const compress = (file) =>
        new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let w = img.width, h = img.height;
                    if (w > 1920) { h = Math.round(h * 1920 / w); w = 1920; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    const MAX = 1.8 * 1024 * 1024;
                    let q = 0.85;
                    (function attempt() {
                        canvas.toBlob((blob) => {
                            if (blob.size > MAX && q > 0.2) { q = Math.round((q - 0.1) * 10) / 10; attempt(); }
                            else resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
                        }, 'image/jpeg', q);
                    })();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });

    const handle = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const ready = file.size > 1.8 * 1024 * 1024 ? await compress(file) : file;
        onFile(ready);
        e.target.value = '';
    };

    return (
        <input type="file" accept="image/*" className="hidden" onChange={handle} />
    );
}
