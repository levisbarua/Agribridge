import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/Logo';

interface PrivacyPolicyProps {
    onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo />
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-600 hover:text-green-600 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-green-100 p-3 rounded-2xl">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
                        <p className="text-slate-500 text-sm mt-1">Last updated: March 1, 2026</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 space-y-8 shadow-sm">
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
                        <p className="text-slate-600 leading-relaxed">
                            AgriBridge Africa ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, including our website and mobile applications (collectively, the "Service").
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
                        <p className="text-slate-600 leading-relaxed">We collect the following types of information:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong className="text-slate-800">Personal Information:</strong> Name, email address, phone number, physical address, and identification documents when you create an account.</li>
                            <li><strong className="text-slate-800">Financial Information:</strong> Payment details, mobile money numbers, and bank account information for transactions.</li>
                            <li><strong className="text-slate-800">Usage Data:</strong> Information about how you interact with our platform, including pages visited, features used, and time spent.</li>
                            <li><strong className="text-slate-800">Location Data:</strong> With your consent, we collect location data to facilitate logistics and connect you with nearby services.</li>
                            <li><strong className="text-slate-800">Device Information:</strong> Device type, operating system, browser type, and IP address.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">3. How We Use Your Information</h2>
                        <p className="text-slate-600 leading-relaxed">We use the collected information to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Provide, operate, and maintain our Service.</li>
                            <li>Process transactions and send related information, including confirmations and invoices.</li>
                            <li>Connect farmers with buyers, logistics providers, and warehouse operators.</li>
                            <li>Send administrative information, such as updates, security alerts, and support messages.</li>
                            <li>Analyze usage patterns to improve our platform and develop new features.</li>
                            <li>Comply with legal obligations and resolve disputes.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">4. Data Sharing and Disclosure</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We do not sell your personal information. We may share your information with:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong className="text-slate-800">Other Users:</strong> To facilitate transactions between farmers, buyers, logistics providers, and warehouses.</li>
                            <li><strong className="text-slate-800">Service Providers:</strong> Third-party companies that help us operate our platform (e.g., payment processors, hosting providers).</li>
                            <li><strong className="text-slate-800">Legal Authorities:</strong> When required by law or to protect our rights and safety.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">5. Data Security</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We implement industry-standard security measures including encryption, secure servers, and access controls to protect your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">6. Your Rights</h2>
                        <p className="text-slate-600 leading-relaxed">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Access, correct, or delete your personal data.</li>
                            <li>Withdraw consent for data processing at any time.</li>
                            <li>Request a copy of your data in a portable format.</li>
                            <li>Object to the processing of your personal data.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">7. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:privacy@agribridgeafrica.com" className="text-green-600 font-medium hover:underline">privacy@agribridgeafrica.com</a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
