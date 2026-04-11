import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const faqs = [
    {
        category: 'Getting Started',
        items: [
            {
                q: 'What is AdBoard?',
                a: 'AdBoard is a marketplace for transport and freight professionals in Serbia. You can post and browse advertisements for trucks, vans, trailers, and other commercial vehicles, as well as find logistics partners and freight opportunities.',
            },
            {
                q: 'Do I need an account to browse ads?',
                a: 'No. Anyone can browse all active advertisements without registering. An account is only required to post ads, save favorites, or contact advertisers.',
            },
            {
                q: 'How do I create an account?',
                a: 'Click "Register" in the top-right corner and fill in your name, email, and password. Registration is free and takes less than a minute.',
            },
        ],
    },
    {
        category: 'Posting Ads',
        items: [
            {
                q: 'How do I post an advertisement?',
                a: 'Once logged in, click the orange "Post Ad" button in the navigation bar. Fill in the details about your vehicle or service — title, description, category, location, price, and contact phone — then submit.',
            },
            {
                q: 'How many ads can I post?',
                a: 'To prevent spam, new users can post up to 5 ads per hour. If you need to post more, please contact us and we can adjust your limit.',
            },
            {
                q: 'How many images can I upload per ad?',
                a: 'You can upload up to 10 images per advertisement. Supported formats are JPEG, PNG, GIF, and JPG. Maximum file size is 10 MB per image.',
            },
            {
                q: 'How long does an ad stay active?',
                a: 'Ads are active for 60 days from the date of posting. After expiration, the ad is hidden from public listings. You can renew any expired ad from your "My Ads" page to make it active for another 60 days.',
            },
            {
                q: 'Can I edit my ad after posting?',
                a: 'Yes. Go to "My Ads", find the ad you want to update, and click "Edit". You can change all fields including images at any time while the ad is active.',
            },
            {
                q: 'How do I delete an ad?',
                a: 'From "My Ads", click the delete button on the ad you want to remove. Deleted ads are moved to the Trash and can be restored within 30 days, after which they are permanently deleted.',
            },
        ],
    },
    {
        category: 'Searching & Browsing',
        items: [
            {
                q: 'How do I search for a specific vehicle or service?',
                a: 'Use the search bar at the top of the homepage to search by keyword. You can also filter by location or browse by category using the category bar.',
            },
            {
                q: 'What does "On Request" mean on an ad?',
                a: '"On Request" means the vehicle or service is not immediately available, but the owner will confirm availability if you contact them. "Available" means it is ready right now.',
            },
            {
                q: 'What are Featured ads?',
                a: 'Featured (pinned) ads are highlighted at the top of the homepage by our admin team. They are typically verified, high-quality listings.',
            },
            {
                q: 'Can I save ads to view later?',
                a: 'Yes. Click the bookmark icon on any ad card to save it. All saved ads can be found under "Saved" in the navigation menu.',
            },
        ],
    },
    {
        category: 'Reporting & Safety',
        items: [
            {
                q: 'What should I do if I find a suspicious or fake ad?',
                a: 'Click the "Report" button on the ad detail page and select the reason: wrong category, duplicate/spam, against rules, or to block ads from that user. Our team will review the report promptly.',
            },
            {
                q: 'What kinds of ads are not allowed?',
                a: 'Ads that are misleading, duplicate listings, content unrelated to transport and freight, ads with false pricing, or anything violating Serbian law are not permitted and will be removed.',
            },
            {
                q: 'Is my personal information safe?',
                a: 'We only display the information you choose to include in your ad (such as a contact phone number). Your email address is never shown publicly. Read our Privacy Policy for full details.',
            },
        ],
    },
    {
        category: 'Account & Profile',
        items: [
            {
                q: 'How do I change my password?',
                a: 'Go to your profile page (click your name in the top-right corner → My Profile) and scroll to the "Change Password" section.',
            },
            {
                q: 'Can I change my email address?',
                a: 'Yes. On your profile page you can update your name, email, phone number, and profile photo.',
            },
            {
                q: 'How do I delete my account?',
                a: 'Please contact us at info@adboard.rs to request account deletion. We will remove all your data within 30 days.',
            },
        ],
    },
];

function FaqItem({ q, a }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`border-b border-slate-100 last:border-0 transition-colors ${open ? 'bg-orange-50/40' : ''}`}>
            <button
                className="w-full flex items-center justify-between gap-4 py-5 px-6 text-left group"
                onClick={() => setOpen(!open)}
            >
                <span className={`text-sm font-semibold leading-snug transition-colors ${open ? 'text-orange-600' : 'text-slate-800 group-hover:text-orange-600'}`}>
                    {q}
                </span>
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    open ? 'bg-orange-500 rotate-45' : 'bg-slate-100 group-hover:bg-orange-100'
                }`}>
                    <svg className={`w-3.5 h-3.5 transition-colors ${open ? 'text-white' : 'text-slate-500 group-hover:text-orange-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                </span>
            </button>
            {open && (
                <div className="px-6 pb-5">
                    <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
                </div>
            )}
        </div>
    );
}

export default function Faq() {
    return (
        <AppLayout>
            <Head>
                <title>FAQ — AdBoard</title>
                <meta name="description" content="Frequently asked questions about AdBoard — how to post ads, search for vehicles, renew listings, and more." />
            </Head>

            {/* Hero */}
            <div className="bg-slate-900 py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Help Center
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-400 text-base leading-relaxed">
                        Everything you need to know about using AdBoard. Can't find what you're looking for?{' '}
                        <a href="mailto:info@adboard.rs" className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors">
                            Contact us
                        </a>.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    {faqs.map((section) => (
                        <div key={section.category}>
                            {/* Category heading */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                    {section.category}
                                </h2>
                            </div>

                            {/* Accordion */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                {section.items.map((item) => (
                                    <FaqItem key={item.q} q={item.q} a={item.a} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* CTA */}
                    <div className="bg-slate-900 rounded-2xl p-8 text-center">
                        <h3 className="text-lg font-bold text-white mb-2">Still have questions?</h3>
                        <p className="text-slate-400 text-sm mb-5">Our team is happy to help you with anything not covered above.</p>
                        <a
                            href="mailto:info@adboard.rs"
                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send us an email
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
