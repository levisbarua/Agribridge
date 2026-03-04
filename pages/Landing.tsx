import React, { useState, useEffect } from 'react';
import { ArrowRight, Facebook, Twitter, Instagram, Linkedin, Target, Users, ShieldCheck, Globe, ChevronDown, Mail, Phone, MapPin, Sun, Moon } from 'lucide-react';
import { Logo } from '../components/Logo';



interface LandingProps {
    onGetStarted: () => void;
    onNavigateLegal?: (page: 'privacy' | 'terms') => void;
}

const BACKGROUND_IMAGES = [
    "/assets/backgrounds/farm-1.jpg",
    "/assets/backgrounds/farm-2.jpg",
    "/assets/backgrounds/farm-3.jpg",
    "/assets/backgrounds/farm-4.jpg",
    "/assets/backgrounds/farm-5.jpg",
    "/assets/backgrounds/farm-6.jpg"
];

const FAQS = [
    {
        question: "How does AgriBridge Africa work?",
        answer: "AgriBridge connects farmers directly with bulk buyers. Farmers list their produce, and buyers can browse, negotiate, and purchase directly through our secure platform. We handle the logistics and payment security."
    },
    {
        question: "Is it secure to trade on this platform?",
        answer: "Yes, 100% secure. We hold payments in escrow until both parties are satisfied with the transaction. This guarantees that farmers get paid for their produce and buyers get exactly what they ordered."
    },
    {
        question: "Who handles the logistics and transportation?",
        answer: "We have an integrated network of verified logistics partners. Once a deal is struck, you can choose from our network to transport the goods reliably from the farm or warehouse to the buyer's destination."
    },
    {
        question: "How do I get started as a farmer or buyer?",
        answer: "Simply click the 'Get Started' button at the top of the page, fill out your profile details, and our compliance team will verify your account within 24 hours. Once verified, you can start trading immediately."
    }
];

const Landing: React.FC<LandingProps> = ({ onGetStarted, onNavigateLegal }) => {
    const [bgIndex, setBgIndex] = useState(0);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        const timer = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
        }, 5000); // Crossfade every 5 seconds
        return () => clearInterval(timer);
    }, []);

    const rotatingPhrases = [
        { subject: 'Farmers', destination: 'Possibilities.' },
        { subject: 'Buyers', destination: 'Markets.' },
        { subject: 'Warehouses', destination: 'Growth.' },
        { subject: 'Logistics', destination: 'Opportunities.' },
    ];
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const wordInterval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
                setIsAnimating(false);
            }, 500);
        }, 3000);
        return () => clearInterval(wordInterval);
    }, []);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {/* HERO SECTION */}
            <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-slate-900">
                {/* Dynamic Background Carousel */}
                {BACKGROUND_IMAGES.map((img, index) => (
                    <div
                        key={img}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out
                            ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url('${img}')` }}
                    />
                ))}

                {/* Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-black/60 z-0" />

                {/* TOP NAVIGATION BAR */}
                <nav className="relative z-10 w-full px-6 py-4 md:px-12 md:py-6 flex items-center justify-between border-b border-white/20">
                    {/* Logo */}
                    <Logo lightTheme={true} />

                    {/* Centered Sub-heading */}
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-full text-center pointer-events-none">
                        <span className="animate-blink-colors font-extrabold tracking-widest uppercase text-base md:text-lg hidden lg:inline-block border-2 border-green-500/40 px-7 py-2.5 rounded-full bg-green-900/20 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.20)] pointer-events-auto">
                            Revolutionizing African Agriculture With Power of AI.
                        </span>
                    </div>

                    {/* Nav Links + Get Started */}
                    <div className="flex items-center gap-10">
                        <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:inline text-white/80 hover:text-white transition-colors font-medium text-lg cursor-pointer">About Us</button>
                        <button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:inline text-white/80 hover:text-white transition-colors font-medium text-lg cursor-pointer">FAQ</button>
                        <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:inline text-white/80 hover:text-white transition-colors font-medium text-lg cursor-pointer">Contact Us</button>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                            aria-label="Toggle theme"
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </nav>

                {/* MAIN CONTENT (Hero Text & Graphic) */}
                <main className="relative z-10 flex-grow flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-16 w-full max-w-[1600px] mx-auto gap-8 lg:gap-16 text-left mt-8 md:mt-12">
                    {/* LEFT CONTENT */}
                    <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
                            Connecting{' '}
                            <span
                                className="text-green-500 inline-block transition-all duration-500 ease-in-out"
                                style={{
                                    opacity: isAnimating ? 0 : 1,
                                    transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
                                }}
                            >
                                {rotatingPhrases[phraseIndex].subject}
                            </span>
                            {' '}to Infinite{' '}
                            <span
                                className="text-green-500 inline-block transition-all duration-500 ease-in-out"
                                style={{
                                    opacity: isAnimating ? 0 : 1,
                                    transform: isAnimating ? 'translateY(-20px)' : 'translateY(0)',
                                }}
                            >
                                {rotatingPhrases[phraseIndex].destination}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-200 max-w-xl leading-relaxed drop-shadow">
                            AgriBridge Africa is a comprehensive ecosystem seamlessly bridging the gap between local farmers, bulk buyers, secure warehouses, and vital logistics networks.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-start gap-4">
                            <button
                                onClick={onGetStarted}
                                className="bg-green-600 hover:bg-green-500 text-white px-8 py-3.5 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(22,163,74,0.6)] hover:-translate-y-1 w-full sm:w-auto"
                            >
                                Join the Network
                            </button>
                            <a href="#about" className="px-8 py-3.5 rounded-full font-semibold text-white border-2 border-white/20 hover:bg-white/10 transition-all text-lg w-full sm:w-auto text-center">
                                Learn More
                            </a>
                        </div>
                    </div>

                    {/* RIGHT CONTENT (Layered Image Collage) */}
                    <div className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end relative h-[500px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                        {/* Abstract Decor Ring */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border-2 border-green-500/20 animate-[spin_60s_linear_infinite]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-orange-500/20 animate-[spin_40s_linear_infinite_reverse]"></div>

                        <div className="relative w-full h-full max-w-md mt-10">
                            {/* Main Image */}
                            <div className="absolute top-0 right-0 w-64 h-80 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
                                <img
                                    src="/assets/backgrounds/farm-2.jpg"
                                    alt="Farmers working"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <h4 className="font-bold text-lg leading-tight mb-1">Empowering Locals</h4>
                                    <p className="text-xs text-white/80">Direct market access</p>
                                </div>
                            </div>

                            {/* Secondary Image - Floating Left */}
                            <div className="absolute top-32 -left-8 w-48 h-48 rounded-3xl overflow-hidden border-4 border-white/10 shadow-xl transform -rotate-6 hover:rotate-0 hover:z-30 transition-all duration-500 z-10 animate-[float_6s_ease-in-out_infinite]">
                                <img
                                    src="/assets/backgrounds/farm-6.jpg"
                                    alt="Fresh harvest"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Third Image - Floating Bottom Right */}
                            <div className="absolute bottom-0 right-12 w-40 h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-lg transform rotate-12 hover:scale-105 transition-all duration-500 z-30 animate-[float_5s_ease-in-out_infinite_reverse]">
                                <img
                                    src="/assets/backgrounds/farm-5.jpg"
                                    alt="Logistics"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </main>

                {/* Scroll indicator */}
                <div className="relative z-10 w-full pb-8 flex justify-center animate-bounce">
                    <a href="#about" className="text-white/60 hover:text-white transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* ABOUT THE COMPANY SECTION */}
            <section id="about" className={`py-24 relative transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content - Text */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2">About The Company</h2>
                                <h3 className={`text-4xl md:text-5xl font-extrabold leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    Empowering local agriculture through technology.
                                </h3>
                            </div>

                            <p className={`text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                At AgriBridge Africa, we are on a mission to transform the agricultural landscape across the continent. By leveraging cutting-edge technology, we connect rural farmers directly with massive local and international markets—eliminating predatory middlemen and ensuring fair compensation.
                            </p>

                            <p className={`text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Our platform isn't just a marketplace; it's a complete ecosystem. From facilitating bulk purchases to providing secure warehousing and reliable logistics, we are building the infrastructure needed for African agriculture to thrive on a global scale.
                            </p>

                            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg mt-1 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Our Mission</h4>
                                        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>To build transparent and efficient agricultural supply chains.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg mt-1 ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Our Vision</h4>
                                        <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>A continent where every farmer has access to global markets.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Visuals / Stats grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-8">
                                <div className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-100'}`}>
                                    <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white mb-4">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <h4 className={`text-3xl font-extrabold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>10k+</h4>
                                    <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Farmers Connected</p>
                                </div>
                                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mr-6 -mt-6 bg-green-500/20 w-24 h-24 rounded-full blur-2xl"></div>
                                    <div className="relative z-10">
                                        <h4 className="text-3xl font-extrabold mb-2">Fair Trade</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">Ensuring maximum profit margins go directly back to local producers.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="w-full h-48 rounded-2xl bg-cover bg-center shadow-md border border-slate-100" style={{ backgroundImage: `url('/assets/backgrounds/farm-2.jpg')` }}></div>
                                <div className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow ${darkMode ? 'bg-green-900/20 border border-green-800/30' : 'bg-green-50 border border-green-100'}`}>
                                    <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center text-white mb-4">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <h4 className={`text-3xl font-extrabold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>100%</h4>
                                    <p className={`font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Secure Transactions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className={`py-24 border-t transition-colors duration-300 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2">Got Questions?</h2>
                        <h3 className={`text-3xl md:text-5xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Frequently Asked Questions
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                >
                                    <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-green-600" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                        } overflow-hidden`}
                                >
                                    <p className={`p-6 pt-0 leading-relaxed border-t ${darkMode ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-100'}`}>
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT & GET IN TOUCH SECTION */}
            <section id="contact" className={`py-24 relative transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16">
                        <h2 className="text-green-600 font-bold tracking-wider uppercase text-sm mb-2">Contact Us</h2>
                        <h3 className={`text-3xl md:text-5xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Let's Get In Touch
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Contact Info Cards */}
                        <div className="space-y-6">
                            <h4 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>We'd love to hear from you.</h4>
                            <p className={`mb-8 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Whether you have a question about our platform, need help getting started, or want to explore partnership opportunities, our team is ready to answer all your questions.
                            </p>

                            <div className={`p-6 rounded-2xl flex items-start gap-4 ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-100'}`}>
                                <div className={`p-3 rounded-xl shrink-0 ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Email Us</h5>
                                    <p className={`mt-1 mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Our friendly team is here to help.</p>
                                    <div className="flex flex-col gap-1">
                                        <a href="mailto:support@agribridge.africa" className="text-green-600 font-medium hover:underline">support@agribridge.africa</a>
                                        <a href="mailto:partners@agribridge.africa" className="text-green-600 font-medium hover:underline">partners@agribridge.africa</a>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-6 rounded-2xl flex items-start gap-4 ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-100'}`}>
                                <div className={`p-3 rounded-xl shrink-0 ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Visit Us</h5>
                                    <p className={`mt-1 mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Come say hello at our headquarters.</p>
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>AgriBridge Tech Hub, 4th Floor<br />Ngong Road, Nairobi, Kenya</p>
                                </div>
                            </div>

                            <div className={`p-6 rounded-2xl flex items-start gap-4 ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-100'}`}>
                                <div className={`p-3 rounded-xl shrink-0 ${darkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>Call Us</h5>
                                    <p className={`mt-1 mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Mon-Fri, 8am - 6pm EAT</p>
                                    <a href="tel:+254700123456" className="text-orange-600 font-medium hover:underline">+254 700 123 456</a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className={`p-8 rounded-3xl relative overflow-hidden ${darkMode ? 'bg-slate-800 border border-slate-700 shadow-lg' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100'}`}>
                            {/* Decorative blob */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 bg-green-500/10 w-48 h-48 rounded-full blur-3xl"></div>

                            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>First Name</label>
                                        <input type="text" id="firstName" className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Last Name</label>
                                        <input type="text" id="lastName" className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
                                    <input type="email" id="email" className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="jane@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Message</label>
                                    <textarea id="message" rows={4} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`} placeholder="How can we help you?"></textarea>
                                </div>

                                <button type="button" className={`w-full font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] ${darkMode ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                                    Send Message
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            {/* CALL TO ACTION SECTION */}
            <section className="py-20 bg-green-600 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-white/10 rotate-12 transform-gpu blur-3xl rounded-full"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-green-800/30 -rotate-12 transform-gpu blur-3xl rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        Ready to join the agricultural revolution?
                    </h2>
                    <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
                        Whether you're a farmer looking to sell, or a business looking to source high-quality produce, AgriBridge has you covered.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="bg-white text-green-700 hover:bg-slate-50 px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 transition-all shadow-xl hover:-translate-y-1 mx-auto active:scale-95"
                    >
                        Get Started Today
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            {/* BOTTOM FOOTER */}
            <footer className="w-full bg-slate-900 px-6 py-16 md:px-12 text-slate-400">
                <div className="max-w-7xl mx-auto">
                    {/* Top Section: Multi-column layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                        {/* Column 1: Brand + Description + Social */}
                        <div className="space-y-5">
                            <Logo lightTheme={true} />
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Bridging the gap between local farmers, bulk buyers, secure warehouses, and vital logistics networks. We connect you with the best opportunities across the continent.
                            </p>
                            {/* Social Icons */}
                            <div className="flex items-center gap-3 pt-2">
                                <a href="https://x.com/agribridgeafrica" target="_blank" rel="noopener noreferrer" className="bg-sky-500 hover:bg-sky-400 text-white p-2 rounded-full transition-all hover:-translate-y-1" aria-label="Twitter">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="https://www.facebook.com/agribridgeafrica" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full transition-all hover:-translate-y-1" aria-label="Facebook">
                                    <Facebook className="w-5 h-5" />
                                </a>
                                <a href="https://www.instagram.com/agribridgeafrica" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-400 hover:via-red-400 hover:to-yellow-400 text-white p-2 rounded-full transition-all hover:-translate-y-1" aria-label="Instagram">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="https://www.linkedin.com/company/agribridgeafrica" target="_blank" rel="noopener noreferrer" className="bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-full transition-all hover:-translate-y-1" aria-label="LinkedIn">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Discover */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Discover</h4>
                            <ul className="space-y-3">
                                <li><button onClick={onGetStarted} className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">Marketplace</button></li>
                                <li><button onClick={onGetStarted} className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">Logistics</button></li>
                                <li><button onClick={onGetStarted} className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">Warehousing</button></li>
                            </ul>
                        </div>

                        {/* Column 3: Company */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Company</h4>
                            <ul className="space-y-3">
                                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">About Us</button></li>
                                <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">Contact</button></li>
                                <li><button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">FAQ</button></li>
                                <li><button onClick={onGetStarted} className="text-slate-400 hover:text-green-400 transition-colors text-sm cursor-pointer">Get Started</button></li>
                            </ul>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} AgriBridge Africa. All Rights Reserved. Built by <span className="font-semibold text-green-400">BaruTech Solutions</span>.
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <button
                                onClick={() => onNavigateLegal?.('privacy')}
                                className="text-slate-400 hover:text-green-400 transition-colors cursor-pointer font-medium"
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => onNavigateLegal?.('terms')}
                                className="text-slate-400 hover:text-green-400 transition-colors cursor-pointer font-medium"
                            >
                                Terms of Service
                            </button>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
