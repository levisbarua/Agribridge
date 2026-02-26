import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Heart, ShieldCheck, Globe, ChevronDown, ChevronUp } from 'lucide-react';

const AboutContact: React.FC = () => {
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How does AgriBridge ensure fair prices?", a: "We use AI-driven market analysis to provide real-time pricing data from local and regional markets, empowering farmers to negotiate better." },
    { q: "Is transport insurance included?", a: "Basic goods-in-transit insurance is included for all verified logistics providers on our platform." },
    { q: "How do I verify my account?", a: "Go to your Profile settings and upload a government-issued ID. Our team usually verifies accounts within 24 hours." },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* About Section */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">About AgriBridge Africa</h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            AgriBridge is a comprehensive digital marketplace and logistics platform designed to bridge the gap between smallholder farmers, buyers, and transport services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
               <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                 <Heart className="w-5 h-5 text-green-600" />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">Our Mission</h3>
               <p className="text-sm text-slate-600">To minimize post-harvest loss and increase farmer income through technology.</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                 <ShieldCheck className="w-5 h-5 text-blue-600" />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">Trust & Safety</h3>
               <p className="text-sm text-slate-600">Verified users, secure payments, and transparent logistics tracking.</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
               <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                 <Globe className="w-5 h-5 text-orange-600" />
               </div>
               <h3 className="font-bold text-slate-800 mb-2">Pan-African</h3>
               <p className="text-sm text-slate-600">Connecting markets across borders to foster regional trade.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
             <MessageSquare className="w-5 h-5 text-green-600" />
             <h2 className="text-xl font-bold text-slate-900">Get in Touch</h2>
          </div>
          
          {submitted ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-green-50 rounded-xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-green-800 mb-2">Message Sent!</h3>
              <p className="text-green-700">Thank you for contacting us. We will get back to you shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2 bg-white text-green-700 font-bold rounded-lg border border-green-200 hover:bg-green-50 transition-all active:scale-95"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="">Select a topic...</option>
                  <option value="Support">Technical Support</option>
                  <option value="Partnership">Partnership Inquiry</option>
                  <option value="Billing">Billing Question</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all h-32 resize-none"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-70 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </section>

        <div className="space-y-8">
           {/* Contact Info */}
           <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h2>
              <div className="space-y-4">
                 <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                    <MapPin className="w-6 h-6 text-slate-400 mt-1" />
                    <div>
                       <h3 className="font-bold text-slate-800">Headquarters</h3>
                       <p className="text-slate-600 text-sm mt-1">
                         AgriBridge Tech Hub, 4th Floor<br />
                         Ngong Road, Nairobi, Kenya
                       </p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                    <Mail className="w-6 h-6 text-slate-400 mt-1" />
                    <div>
                       <h3 className="font-bold text-slate-800">Email Us</h3>
                       <p className="text-slate-600 text-sm mt-1">
                         support@agribridge.africa<br />
                         partners@agribridge.africa
                       </p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
                    <Phone className="w-6 h-6 text-slate-400 mt-1" />
                    <div>
                       <h3 className="font-bold text-slate-800">Call Center</h3>
                       <p className="text-slate-600 text-sm mt-1">
                         +254 700 123 456<br />
                         Mon-Fri, 8am - 6pm EAT
                       </p>
                    </div>
                 </div>
              </div>
           </section>

           {/* FAQ Snippet */}
           <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked</h2>
              <div className="space-y-3">
                 {faqs.map((faq, i) => (
                    <div key={i} className="border border-slate-100 rounded-lg overflow-hidden">
                       <button 
                         onClick={() => setOpenFaq(openFaq === i ? null : i)}
                         className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-all active:bg-slate-200 text-left"
                       >
                          <span className="font-medium text-slate-700 text-sm pr-4">{faq.q}</span>
                          {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                       </button>
                       {openFaq === i && (
                         <div className="p-4 bg-white text-sm text-slate-600 border-t border-slate-100">
                           {faq.a}
                         </div>
                       )}
                    </div>
                 ))}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default AboutContact;