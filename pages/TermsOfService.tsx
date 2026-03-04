import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Logo } from '../components/Logo';

interface TermsOfServiceProps {
    onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
                    <div className="bg-blue-100 p-3 rounded-2xl">
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Terms of Service</h1>
                        <p className="text-slate-500 text-sm mt-1">Last updated: March 1, 2026</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 space-y-8 shadow-sm">
                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            By accessing or using the AgriBridge Africa platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms apply to all visitors, users, farmers, buyers, logistics providers, and warehouse operators.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">2. Description of Service</h2>
                        <p className="text-slate-600 leading-relaxed">
                            AgriBridge Africa is an agricultural technology platform that connects farmers, bulk buyers, logistics providers, and warehouse operators across the African continent. Our services include marketplace listings, secure payment processing, logistics coordination, and warehouse management.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">3. User Accounts</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>You must provide accurate, complete, and current information when creating an account.</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                            <li>You must be at least 18 years old to create an account and use the Service.</li>
                            <li>You are responsible for all activities that occur under your account.</li>
                            <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">4. Transactions and Payments</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>All transactions conducted through the platform are subject to our payment processing policies.</li>
                            <li>Payments are held in escrow until both parties confirm satisfactory completion of the transaction.</li>
                            <li>AgriBridge Africa charges a service fee on completed transactions. Fee structures are disclosed before any transaction is finalized.</li>
                            <li>Refunds and disputes are handled through our resolution process. Both parties agree to cooperate in good faith.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">5. User Conduct</h2>
                        <p className="text-slate-600 leading-relaxed">You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>Post false, misleading, or fraudulent listings or information.</li>
                            <li>Engage in any activity that disrupts the Service or interferes with other users.</li>
                            <li>Use the platform for any illegal or unauthorized purpose.</li>
                            <li>Attempt to gain unauthorized access to any part of the Service or its systems.</li>
                            <li>Harass, threaten, or abuse other users of the platform.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">6. Intellectual Property</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The Service and its original content, features, and functionality are owned by AgriBridge Africa and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our prior written consent.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">7. Limitation of Liability</h2>
                        <p className="text-slate-600 leading-relaxed">
                            AgriBridge Africa acts as a facilitator between parties and is not directly responsible for the quality, safety, or legality of goods listed. To the fullest extent permitted by law, AgriBridge Africa shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">8. Governing Law</h2>
                        <p className="text-slate-600 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of the Republic of Kenya, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Nairobi, Kenya.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">9. Changes to Terms</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on our platform. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900">10. Contact Us</h2>
                        <p className="text-slate-600 leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us at{' '}
                            <a href="mailto:legal@agribridgeafrica.com" className="text-green-600 font-medium hover:underline">legal@agribridgeafrica.com</a>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default TermsOfService;
