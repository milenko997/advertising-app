import { Link } from '@inertiajs/react';
import Navigation from '@/Components/Navigation';
import Footer from '@/Components/Footer';

const errors = {
    403: {
        title: 'Access Denied',
        description: "You don't have permission to view this page.",
    },
    404: {
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist or has been moved.",
    },
    419: {
        title: 'Session Expired',
        description: 'Your session has expired. Please refresh and try again.',
    },
    429: {
        title: 'Too Many Requests',
        description: "You've made too many requests. Please wait a moment and try again.",
    },
    500: {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
    },
    503: {
        title: 'Service Unavailable',
        description: 'The service is temporarily unavailable. Please try again later.',
    },
};

export default function Error({ status }) {
    const { title, description } = errors[status] ?? {
        title: 'An Error Occurred',
        description: 'An unexpected error occurred. Please try again.',
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navigation />

            <main className="flex-1 flex items-center justify-center px-4 py-24">
                <div className="text-center">
                    <p className="text-8xl font-extrabold text-indigo-600">{status}</p>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">{description}</p>
                    <Link
                        href="/"
                        className="mt-8 inline-block px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
