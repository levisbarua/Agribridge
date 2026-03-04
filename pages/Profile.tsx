import React, { useState } from 'react';
import { UserRole, Country, Product, TransportRequest, FleetVehicle, StorageFacility, Order, Language, TRANSLATIONS } from '../types';
import { MapPin, Star, Calendar, Mail, Phone, Edit, Truck, Package, Warehouse, ShoppingBag, Grid, List, CheckCircle2, ShieldCheck, X, Camera, Save, Loader2, Sparkles } from 'lucide-react';
import { enhanceUserBio } from '../services/geminiService';

interface ProfileProps {
    role: UserRole;
    country: Country;
    products?: Product[];
    logistics?: TransportRequest[];
    orders?: Order[];
    fleet?: FleetVehicle[];
    storage?: StorageFacility[];
    lang: Language;
}

const Profile: React.FC<ProfileProps> = ({ role, country, products = [], logistics = [], orders = [], fleet = [], storage = [], lang }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEnhancingBio, setIsEnhancingBio] = useState(false);

    // Define default name based on role
    const defaultName = role === 'FARMER' ? 'John Doe' : role === 'LOGISTICS' ? 'Swift Haulage Ltd' : role === 'BUYER' ? 'Fresh Foods Supermarket' : 'Nairobi Cold Storage';

    // Mock User Data
    const [userProfile, setUserProfile] = useState({
        name: defaultName,
        location: country.locations[0],
        joinDate: 'May 2023',
        rating: 4.8,
        reviews: 124,
        verified: true,
        bio: role === 'FARMER'
            ? 'Passionate organic farmer specializing in high-quality vegetables and grains. Committed to sustainable farming practices.'
            : role === 'LOGISTICS'
                ? 'Reliable transport solutions across East Africa. We handle perishable and dry goods with care.'
                : 'Dedicated to sourcing the freshest produce directly from local farmers for our retail chain.',
        email: `contact@${defaultName.toLowerCase().replace(/\s/g, '')}.com`,
        phone: '+254 7XX XXX XXX',
        coverImage: '',
        profileImage: ''
    });

    const handleSaveProfile = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsEditModalOpen(false);
        }, 1000);
    };

    const handleCameraClick = () => {
        // Mock file upload trigger for Cover Image
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setUserProfile({ ...userProfile, coverImage: e.target?.result as string });
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleProfilePicClick = () => {
        // Mock file upload trigger for Profile Picture
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setUserProfile({ ...userProfile, profileImage: e.target?.result as string });
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const handleEnhanceBio = async () => {
        setIsEnhancingBio(true);
        const enhanced = await enhanceUserBio(userProfile.bio, role, userProfile.name);
        if (enhanced) setUserProfile(prev => ({ ...prev, bio: enhanced }));
        setIsEnhancingBio(false);
    };

    // 1. Determine mock current user ID based on role
    let currentUserId = 'f1';
    if (role === 'BUYER') currentUserId = 'me';
    if (role === 'LOGISTICS') currentUserId = 'lp1';
    if (role === 'WAREHOUSE') currentUserId = 'w1';

    // Content renderers based on role
    const renderFarmerContent = () => {
        // Note: products and orders are already filtered in App.tsx for this role, 
        // but just in case, we'll keep the filter or just take the passed arrays.
        const myProducts = products.filter(p => p.farmerId === currentUserId);
        const mySales = orders.filter(o => o.farmerId === currentUserId);

        return (
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">{TRANSLATIONS[lang].myActiveListings}</h3>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{myProducts.length} {TRANSLATIONS[lang].items}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myProducts.map(p => (
                            <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-3 flex gap-3 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]">
                                <img src={p.imageUrl} className="w-20 h-20 rounded bg-slate-100 object-cover" />
                                <div>
                                    <h4 className="font-bold text-slate-800">{p.name}</h4>
                                    <p className="text-sm text-slate-500">{p.quantity} {p.unit}</p>
                                    <div className="mt-1 font-bold text-green-600">{p.price} {country.currency}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-4">{TRANSLATIONS[lang].recentSalesHistory}</h3>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        {mySales.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">{TRANSLATIONS[lang].noSales}</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="p-4">{TRANSLATIONS[lang].item}</th>
                                        <th className="p-4">{TRANSLATIONS[lang].date}</th>
                                        <th className="p-4">{TRANSLATIONS[lang].status}</th>
                                        <th className="p-4 text-right">{TRANSLATIONS[lang].amount}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mySales.map(o => (
                                        <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900">{o.productName}</td>
                                            <td className="p-4 text-slate-500">{o.date}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-mono">{o.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderLogisticsContent = () => {
        // Similarly, rely on injected filtered logistics or filter by exact ID.
        const myTrips = logistics.filter(l => l.assignedProviderId === currentUserId);

        return (
            <div className="space-y-8">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-4">{TRANSLATIONS[lang].fleetStatus}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fleet.map(v => (
                            <div key={v.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <Truck className="w-8 h-8 text-slate-400" />
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${v.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{v.status}</span>
                                </div>
                                <h4 className="font-bold text-slate-800">{v.name}</h4>
                                <p className="text-sm text-slate-500">{v.plate}</p>
                                <div className="mt-3 text-xs bg-slate-50 p-2 rounded flex items-center gap-1 text-slate-600">
                                    <MapPin className="w-3 h-3" /> {v.location}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-slate-800 text-lg mb-4">{TRANSLATIONS[lang].tripHistory}</h3>
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        {myTrips.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">{TRANSLATIONS[lang].noTrips}</div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="p-4">{TRANSLATIONS[lang].route}</th>
                                        <th className="p-4">{TRANSLATIONS[lang].cargo}</th>
                                        <th className="p-4">{TRANSLATIONS[lang].status}</th>
                                        <th className="p-4 text-right">{TRANSLATIONS[lang].earnings}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myTrips.map(t => (
                                        <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900">
                                                {t.origin} <span className="text-slate-400">→</span> {t.destination}
                                            </td>
                                            <td className="p-4 text-slate-500">{t.goodsType} ({t.weightKg}kg)</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-mono">{t.priceOffer.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderBuyerContent = () => {
        // Filter orders for the current buyer
        const myOrders = orders.filter(o => o.buyerId === currentUserId);

        return (
            <div className="space-y-6">
                <h3 className="font-bold text-slate-800 text-lg mb-4">{TRANSLATIONS[lang].recentOrderHistory}</h3>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    {myOrders.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">{TRANSLATIONS[lang].noOrders}</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="p-4">{TRANSLATIONS[lang].item}</th>
                                    <th className="p-4">{TRANSLATIONS[lang].date}</th>
                                    <th className="p-4">{TRANSLATIONS[lang].status}</th>
                                    <th className="p-4 text-right">{TRANSLATIONS[lang].amount}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myOrders.map(o => (
                                    <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900">{o.productName}</td>
                                        <td className="p-4 text-slate-500">{o.date}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono">{o.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    };

    const renderWarehouseContent = () => {
        const myStorage = storage; // Mock filter
        return (
            <div className="space-y-6">
                <h3 className="font-bold text-slate-800 text-lg mb-4">{TRANSLATIONS[lang].managedFacilities}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myStorage.map(s => (
                        <div key={s.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                            <img src={s.imageUrl} className="h-32 w-full object-cover" />
                            <div className="p-4">
                                <h4 className="font-bold text-slate-800">{s.name}</h4>
                                <div className="flex justify-between mt-2 text-sm">
                                    <span className="text-slate-500">{TRANSLATIONS[lang].capacity}:</span>
                                    <span className="font-medium">{s.capacityKg} kg</span>
                                </div>
                                <div className="flex justify-between mt-1 text-sm">
                                    <span className="text-slate-500">{TRANSLATIONS[lang].available}:</span>
                                    <span className="font-bold text-green-600">{s.availableKg} kg</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div
                    className={`h-48 relative ${!userProfile.coverImage ? 'bg-gradient-to-r from-green-600 to-emerald-800' : ''}`}
                    style={userProfile.coverImage ? { backgroundImage: `url(${userProfile.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                >
                    <button
                        onClick={handleCameraClick}
                        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 active:bg-black/60 active:scale-95 text-white p-2.5 rounded-lg backdrop-blur transition-all flex items-center gap-2"
                        title="Change Cover Photo"
                    >
                        <Camera className="w-5 h-5" />
                        <span className="text-sm font-medium hidden sm:inline">Edit Cover</span>
                    </button>
                </div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-1 shadow-lg relative group cursor-pointer" onClick={handleProfilePicClick}>
                                <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden relative">
                                    <img
                                        src={userProfile.profileImage || `https://ui-avatars.com/api/?name=${userProfile.name.replace(' ', '+')}&background=random`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                            {userProfile.verified && (
                                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm z-10" title="Verified User">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 shadow-sm transition-all"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">{TRANSLATIONS[lang].editProfile}</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            {userProfile.name}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 mt-2 text-sm">
                            <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${role === 'FARMER' ? 'bg-green-500' : role === 'BUYER' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                                {role}
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {userProfile.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {TRANSLATIONS[lang].joined} {userProfile.joinDate}
                            </div>
                            <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                                <Star className="w-3 h-3 fill-orange-500" />
                                {userProfile.rating} <span className="text-slate-400 font-normal">({userProfile.reviews})</span>
                            </div>
                        </div>
                        <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
                            {userProfile.bio}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-t border-slate-100 px-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap active:bg-slate-50 ${activeTab === 'overview' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        {TRANSLATIONS[lang].overview}
                    </button>
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap active:bg-slate-50 ${activeTab === 'activity' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        {role === 'FARMER' ? TRANSLATIONS[lang].listings : role === 'LOGISTICS' ? TRANSLATIONS[lang].fleetTrips : role === 'WAREHOUSE' ? TRANSLATIONS[lang].facilities : TRANSLATIONS[lang].orders}
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap active:bg-slate-50 ${activeTab === 'reviews' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        {TRANSLATIONS[lang].reviews}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">{TRANSLATIONS[lang].contactInfo}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer active:scale-[0.99]">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-xs text-slate-500">{TRANSLATIONS[lang].email}</div>
                                            <div className="font-medium text-slate-900 break-all">{userProfile.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer active:scale-[0.99]">
                                        <Phone className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <div className="text-xs text-slate-500">{TRANSLATIONS[lang].phone}</div>
                                            <div className="font-medium text-slate-900">{userProfile.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">{TRANSLATIONS[lang].performanceStats}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                        <div className="text-2xl font-bold text-green-700">98%</div>
                                        <div className="text-xs text-green-600 font-medium">{TRANSLATIONS[lang].orderCompletion}</div>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                        <div className="text-2xl font-bold text-blue-700">2hr</div>
                                        <div className="text-xs text-blue-600 font-medium">{TRANSLATIONS[lang].avgResponse}</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                                        <div className="text-2xl font-bold text-orange-700">4.8</div>
                                        <div className="text-xs text-orange-600 font-medium">{TRANSLATIONS[lang].userRating}</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                        <div className="text-2xl font-bold text-purple-700">2y</div>
                                        <div className="text-xs text-purple-600 font-medium">{TRANSLATIONS[lang].onPlatform}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-6">
                                <h3 className="font-bold text-slate-800 mb-4">{TRANSLATIONS[lang].verification}</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-600">{TRANSLATIONS[lang].emailVerified}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-600">{TRANSLATIONS[lang].phoneVerified}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-slate-600">{TRANSLATIONS[lang].identityVerified}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                        </div>
                                        <span className="text-slate-400">{TRANSLATIONS[lang].premiumMember}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        {role === 'FARMER' && renderFarmerContent()}
                        {role === 'LOGISTICS' && renderLogisticsContent()}
                        {role === 'BUYER' && renderBuyerContent()}
                        {role === 'WAREHOUSE' && renderWarehouseContent()}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-800 text-lg">{TRANSLATIONS[lang].reviews} ({userProfile.reviews})</h3>
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-bold text-slate-900">{userProfile.rating}</span>
                                <div className="flex text-orange-400">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(userProfile.rating) ? 'fill-current' : ''}`} />)}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                U{i}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">User {i}</h4>
                                                <div className="flex text-orange-400 text-xs">
                                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-400">2 days ago</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-2">
                                        Great experience doing business. Very professional and timely delivery. Highly recommended!
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">{TRANSLATIONS[lang].editProfile}</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all rounded">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].displayName}</label>
                                <input
                                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    value={userProfile.name}
                                    onChange={e => setUserProfile({ ...userProfile, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].location}</label>
                                <input
                                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    value={userProfile.location}
                                    onChange={e => setUserProfile({ ...userProfile, location: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].email}</label>
                                    <input
                                        type="email"
                                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        value={userProfile.email}
                                        onChange={e => setUserProfile({ ...userProfile, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].phone}</label>
                                    <input
                                        type="tel"
                                        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        value={userProfile.phone}
                                        onChange={e => setUserProfile({ ...userProfile, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-700">{TRANSLATIONS[lang].bio}</label>
                                    <button
                                        onClick={handleEnhanceBio}
                                        disabled={isEnhancingBio}
                                        className="text-xs flex items-center gap-1 text-purple-600 font-medium hover:bg-purple-50 px-2 py-1 rounded transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {isEnhancingBio ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                        {TRANSLATIONS[lang].enhanceWithAI}
                                    </button>
                                </div>
                                <textarea
                                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none h-24"
                                    value={userProfile.bio}
                                    onChange={e => setUserProfile({ ...userProfile, bio: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-50 active:bg-slate-100 rounded-lg transition-all active:scale-95"
                            >
                                {TRANSLATIONS[lang].cancel}
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="flex-1 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 active:bg-green-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {TRANSLATIONS[lang].saveChanges}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;