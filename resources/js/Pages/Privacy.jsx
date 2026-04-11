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

export default function Privacy() {
    return (
        <AppLayout>
            {/* Hero */}
            <div className="bg-slate-900 py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 text-orange-400 text-xs font-semibold mb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Legal
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-slate-400 text-sm">Last updated: April 2026</p>
                </div>
            </div>

            {/* Content */}
            <div className="py-14">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-10">

                        <p className="text-sm text-slate-500 leading-relaxed mb-10">
                            At <strong className="text-slate-700">AdBoard</strong>, your privacy matters to us. This Privacy Policy explains what personal data we collect, how we use it, and what rights you have regarding your data. By using AdBoard, you consent to the practices described in this policy.
                        </p>

                        <Section title="1. Who We Are">
                            <p>
                                AdBoard is an online marketplace for transport and freight professionals based in Belgrade, Serbia. For any privacy-related questions, you can reach us at <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a>.
                            </p>
                        </Section>

                        <Section title="2. Data We Collect">
                            <p>We collect the following categories of personal data:</p>

                            <div className="rounded-xl border border-slate-100 overflow-hidden">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Data type</th>
                                            <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Examples</th>
                                            <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Purpose</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700">Account info</td>
                                            <td className="px-4 py-2.5 text-slate-500">Name, email, password (hashed)</td>
                                            <td className="px-4 py-2.5 text-slate-500">Authentication, account management</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700">Profile data</td>
                                            <td className="px-4 py-2.5 text-slate-500">Phone number, avatar photo</td>
                                            <td className="px-4 py-2.5 text-slate-500">Displayed on your public profile</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700">Ad content</td>
                                            <td className="px-4 py-2.5 text-slate-500">Title, description, location, images, contact phone</td>
                                            <td className="px-4 py-2.5 text-slate-500">Publishing your advertisements</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700">Usage data</td>
                                            <td className="px-4 py-2.5 text-slate-500">Pages visited, ad view counts, IP address</td>
                                            <td className="px-4 py-2.5 text-slate-500">Analytics, fraud prevention</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2.5 font-medium text-slate-700">Technical data</td>
                                            <td className="px-4 py-2.5 text-slate-500">Browser type, device, session cookies</td>
                                            <td className="px-4 py-2.5 text-slate-500">Platform functionality, security</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="3. How We Use Your Data">
                            <p>We use the data we collect to:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Operate and maintain the AdBoard platform.</li>
                                <li>Create and manage your account.</li>
                                <li>Publish and display your advertisements to other users.</li>
                                <li>Process reports and moderate content.</li>
                                <li>Send transactional emails (account confirmation, password reset).</li>
                                <li>Detect and prevent fraud, spam, and abuse.</li>
                                <li>Improve the platform through aggregated analytics.</li>
                            </ul>
                            <p>
                                We do <strong className="text-slate-700">not</strong> sell your personal data to third parties. We do not use your data for targeted advertising.
                            </p>
                        </Section>

                        <Section title="4. What Is Publicly Visible">
                            <p>The following information is publicly visible to all visitors of AdBoard:</p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Your display name and avatar (if set).</li>
                                <li>Your published advertisements (title, description, images, location, price, contact phone).</li>
                                <li>Your public profile page including reviews received.</li>
                            </ul>
                            <p>
                                Your <strong className="text-slate-700">email address</strong> is never shown publicly. It is used only for account authentication and system notifications.
                            </p>
                        </Section>

                        <Section title="5. Cookies">
                            <p>
                                AdBoard uses cookies to keep you logged in (session cookie) and to protect forms against cross-site request forgery (CSRF cookie). These are essential cookies required for the platform to function — no tracking or advertising cookies are used.
                            </p>
                            <p>
                                You can disable cookies in your browser settings, but doing so will prevent you from logging in or using most features of AdBoard.
                            </p>
                        </Section>

                        <Section title="6. Data Retention">
                            <p>
                                We retain your personal data for as long as your account is active. If you delete your account, your personal data (name, email, phone) will be erased within <strong className="text-slate-700">30 days</strong>. Your published advertisements will also be removed.
                            </p>
                            <p>
                                Anonymized usage data (view counts, aggregate statistics) may be retained indefinitely as it cannot be linked back to any individual.
                            </p>
                        </Section>

                        <Section title="7. Data Security">
                            <p>
                                We implement reasonable technical and organizational measures to protect your data, including:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li>Passwords stored using bcrypt hashing — never in plain text.</li>
                                <li>HTTPS encryption for all data in transit.</li>
                                <li>CSRF protection on all forms.</li>
                                <li>Rate limiting to prevent brute-force attacks.</li>
                            </ul>
                            <p>
                                No system is completely secure. If you believe your account has been compromised, please contact us immediately.
                            </p>
                        </Section>

                        <Section title="8. Your Rights">
                            <p>
                                Under applicable data protection law, you have the following rights regarding your personal data:
                            </p>
                            <ul className="list-disc list-inside space-y-1.5 pl-2">
                                <li><strong className="text-slate-700">Access</strong> — request a copy of the data we hold about you.</li>
                                <li><strong className="text-slate-700">Correction</strong> — update inaccurate data via your profile page.</li>
                                <li><strong className="text-slate-700">Deletion</strong> — request that we delete your account and personal data.</li>
                                <li><strong className="text-slate-700">Portability</strong> — request your data in a structured, machine-readable format.</li>
                                <li><strong className="text-slate-700">Objection</strong> — object to certain processing activities.</li>
                            </ul>
                            <p>
                                To exercise any of these rights, email us at <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a>. We will respond within 30 days.
                            </p>
                        </Section>

                        <Section title="9. Third-Party Services">
                            <p>
                                AdBoard does not share your data with third-party analytics, advertising, or tracking services. The platform is self-hosted and does not load external scripts from Google, Facebook, or similar providers.
                            </p>
                        </Section>

                        <Section title="10. Changes to This Policy">
                            <p>
                                We may update this Privacy Policy periodically. When we do, we will revise the "Last updated" date at the top of this page. We encourage you to review this policy regularly.
                            </p>
                        </Section>

                        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
                            <span>Questions? <a href="mailto:info@adboard.rs" className="text-orange-500 hover:underline">info@adboard.rs</a></span>
                            <div className="flex items-center gap-4">
                                <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Use</Link>
                                <Link href="/faq" className="hover:text-slate-600 transition-colors">FAQ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
