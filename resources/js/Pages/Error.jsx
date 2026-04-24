import { Head, Link } from '@inertiajs/react';
import Navigation from '@/Components/Navigation';
import Footer from '@/Components/Footer';

const errors = {
    403: {
        title: 'Pristup odbijen',
        description: 'Nemate dozvolu za pregled ove stranice.',
    },
    404: {
        title: 'Stranica nije pronađena',
        description: 'Stranica koju tražite ne postoji ili je premeštena.',
    },
    419: {
        title: 'Sesija je istekla',
        description: 'Vaša sesija je istekla. Molimo osvežite stranicu i pokušajte ponovo.',
    },
    429: {
        title: 'Previše zahteva',
        description: 'Poslali ste previše zahteva. Molimo sačekajte trenutak i pokušajte ponovo.',
    },
    500: {
        title: 'Greška servera',
        description: 'Nešto je pošlo po zlu na našoj strani. Molimo pokušajte ponovo kasnije.',
    },
    503: {
        title: 'Usluga nedostupna',
        description: 'Usluga je privremeno nedostupna. Molimo pokušajte ponovo kasnije.',
    },
};

export default function Error({ status }) {
    const { title, description } = errors[status] ?? {
        title: 'Došlo je do greške',
        description: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo.',
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={`${status} — ${title}`} />
            <Navigation />

            <main className="flex-1 flex items-center justify-center px-4 py-24">
                <div className="text-center">
                    <p className="text-8xl font-extrabold text-orange-600">{status}</p>
                    <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">{description}</p>
                    <Link
                        href="/"
                        className="mt-8 inline-block px-6 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition"
                    >
                        Nazad na početnu
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
