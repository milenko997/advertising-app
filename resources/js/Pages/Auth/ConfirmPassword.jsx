import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors } = useForm({ password: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/confirm-password');
    };

    return (
        <GuestLayout>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Confirm Password</h1>
            <p className="text-sm text-gray-500 mb-6">
                This is a secure area. Please confirm your password before continuing.
            </p>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        required autoFocus autoComplete="current-password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
                    >
                        Confirm
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
