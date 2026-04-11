import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function Section({ title, children }) {
    return (
        <section className="mb-10">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-orange-500 inline-block shrink-0" />
                {title}
            </h2>
            <div className="text-sm text-slate-500 leading-relaxed space-y-3">{children}</div>
        </section>
    );
}

export default function Terms() {
    return (
        <AppLayout>
            {/* Hero */}
            <div className="bg-slate-900 py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Legal
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Terms of Use</h1>
                    <p className="text-slate-400 text-sm">Last updated: April 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-10">

                        <p className="text-sm text-slate-500 leading-relaxed mb-10">
                            Welcome to <strong className="text-slate-700">AdBoard</strong>. By accessing or using our platform, you agree to be bound by these Terms of Use. Please read them carefully before using the service. If you do not agree to these terms, please do not use AdBoard.
                        </p>

                        <Section title="1. Acceptance of Terms">
                            <p>
                                By registering an account, posting an advertisement, or simply browsing AdBoard, you acknowledge that you have read, understood, and agree to comply with these Terms of Use, as well as all applicable laws and regulations of the Republic of Serbia.
                            </p>
                            <p>
                                We reserve the right to modify these terms at any time. Continued use of the platform after changes are published constitutes acceptance of the revised terms.
                            </p>
                        </Section>

                        <Section title="2. Eligibility">
                            <p>
                                You must be at least 18 years of age to create an account or post advertisements on AdBoard. By using the platform, you represent and warrant that you meet this requirement.
                            </p>
                            <p>
                                If you are using AdBoard on behalf of a business or legal entity, you represent that you have the authority to bind that entity to these terms.
                            </p>
                        </Section>

                        <Section title="3. User Accounts">
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a> if you suspect unauthorized use.
                            </p>
                            <p>
                                You may not share your account with others, create multiple accounts, or use another person's account without permission. We reserve the right to suspend or terminate accounts that violate these terms.
                            </p>
                        </Section>

                        <Section title="4. Posting Advertisements">
                            <p>
                                You may post advertisements for transport-related vehicles and services. By submitting an ad, you confirm that:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>The information is accurate, truthful, and not misleading.</li>
                                <li>You own or have the legal right to advertise the listed vehicle or service.</li>
                                <li>The content does not violate any applicable laws or third-party rights.</li>
                                <li>Images uploaded are your own or you have the right to use them.</li>
                            </ul>
                            <p>
                                Advertisements are active for <strong className="text-slate-700">60 days</strong> from the date of posting. Expired ads can be renewed from your "My Ads" page.
                            </p>
                        </Section>

                        <Section title="5. Prohibited Content">
                            <p>The following types of content are strictly prohibited on AdBoard:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>False, misleading, or fraudulent advertisements.</li>
                                <li>Duplicate or spam listings.</li>
                                <li>Content unrelated to transport, freight, or logistics.</li>
                                <li>Illegal goods, services, or activities.</li>
                                <li>Offensive, discriminatory, or harassing content.</li>
                                <li>Any content that violates intellectual property rights.</li>
                            </ul>
                            <p>
                                We reserve the right to remove any content that violates these rules without prior notice and to suspend or ban the responsible account.
                            </p>
                        </Section>

                        <Section title="6. Intellectual Property">
                            <p>
                                All content on AdBoard that is not user-generated — including the logo, design, code, and text — is owned by AdBoard and protected by copyright law. You may not reproduce, distribute, or create derivative works without our written consent.
                            </p>
                            <p>
                                By posting content on AdBoard, you grant us a non-exclusive, royalty-free license to display, distribute, and promote that content within the platform.
                            </p>
                        </Section>

                        <Section title="7. Limitation of Liability">
                            <p>
                                AdBoard acts as a neutral platform connecting buyers and sellers. We do not verify the accuracy of advertisements, guarantee the quality of vehicles or services listed, or mediate transactions between users.
                            </p>
                            <p>
                                To the fullest extent permitted by law, AdBoard shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our platform, or from transactions made between users.
                            </p>
                        </Section>

                        <Section title="8. Rate Limiting & Fair Use">
                            <p>
                                To maintain platform quality, users are limited to posting <strong className="text-slate-700">5 advertisements per hour</strong>. Automated posting, scraping, or any use of bots is strictly prohibited.
                            </p>
                        </Section>

                        <Section title="9. Termination">
                            <p>
                                We reserve the right to suspend or permanently terminate your account at our discretion if we believe you have violated these terms, engaged in fraudulent activity, or harmed other users of the platform.
                            </p>
                            <p>
                                You may delete your account at any time by contacting us at <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a>.
                            </p>
                        </Section>

                        <Section title="10. Governing Law">
                            <p>
                                These terms are governed by and construed in accordance with the laws of the Republic of Serbia. Any disputes shall be resolved in the courts of Belgrade, Serbia.
                            </p>
                        </Section>

                        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
                            <span>Questions? <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a></span>
                            <div className="flex items-center gap-4">
                                <Link href="/privacy-policy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
                                <Link href="/faq" className="hover:text-slate-600 transition-colors">FAQ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
