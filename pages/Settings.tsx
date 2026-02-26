import React from 'react';
import { User, Globe, LogOut, MapPin, ChevronRight, UserCog, Shield, Tractor, Truck, Warehouse, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { Language, Country, TRANSLATIONS, UserRole } from '../types';
import { AFRICAN_COUNTRIES } from '../constants';

interface SettingsProps {
  lang: Language;
  onSwitchLang: (lang: Language) => void;
  country: Country;
  onCountryChange: (country: Country) => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  lang, 
  onSwitchLang, 
  country, 
  onCountryChange, 
  onLogout,
  onNavigate,
  role,
  onRoleChange
}) => {
  const t = TRANSLATIONS[lang];

  const RoleCard = ({ value, label, icon: Icon, description }: { value: UserRole, label: string, icon: any, description: string }) => {
    const isActive = role === value;
    return (
        <button 
          onClick={() => onRoleChange(value)}
          className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-3 h-full active:scale-[0.98]
            ${isActive 
              ? 'border-green-600 bg-green-50 text-green-900 ring-1 ring-green-600 shadow-sm' 
              : 'border-slate-200 bg-white text-slate-600 hover:border-green-400 hover:bg-slate-50'}`}
        >
          {isActive && (
            <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              ACTIVE
            </div>
          )}
          <div className={`p-3 rounded-full ${isActive ? 'bg-green-200 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{label}</h3>
            <p className="text-xs mt-1 text-slate-500 leading-snug">{description}</p>
          </div>
        </button>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">

      {/* Switch Profile Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
         <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Switch Profile</h3>
         </div>
         <div className="p-4 bg-slate-50/30">
            <p className="text-sm text-slate-500 mb-4 px-1">Select a profile to switch your dashboard view and features.</p>
            <div className="grid grid-cols-2 gap-3">
                 <RoleCard 
                   value="FARMER" 
                   label="Farmer" 
                   icon={Tractor} 
                   description="List crops & access market data" 
                 />
                 <RoleCard 
                   value="LOGISTICS" 
                   label="Transporter" 
                   icon={Truck} 
                   description="Move goods & earn per trip" 
                 />
                 <RoleCard 
                   value="WAREHOUSE" 
                   label="Warehouse" 
                   icon={Warehouse} 
                   description="Offer storage space & services" 
                 />
                 <RoleCard 
                   value="BUYER" 
                   label="Buyer" 
                   icon={ShoppingBag} 
                   description="Source fresh produce directly" 
                 />
            </div>
         </div>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
         <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
            <UserCog className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account</h3>
         </div>
         
         <button 
           onClick={() => onNavigate('profile')}
           className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all active:bg-slate-100 border-b border-slate-100 last:border-0"
         >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
               </div>
               <div className="text-left">
                  <div className="font-medium text-slate-900">{t.profile}</div>
                  <div className="text-xs text-slate-500">Edit your personal details and bio</div>
               </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
         </button>
         
         <div className="p-4 flex items-center justify-between border-b border-slate-100 last:border-0">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
               </div>
               <div className="text-left">
                  <div className="font-medium text-slate-900">Current Role</div>
                  <div className="text-xs text-slate-500">You are logged in as <span className="font-bold capitalize text-slate-700">{role.toLowerCase()}</span></div>
               </div>
            </div>
         </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
         <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferences</h3>
         </div>

         <div className="p-4 border-b border-slate-100 last:border-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-600" />
                   </div>
                   <div>
                      <div className="font-medium text-slate-900">Region</div>
                      <div className="text-xs text-slate-500">Select your operating country</div>
                   </div>
                </div>
                <div className="relative min-w-[200px]">
                   <select 
                      value={country.code}
                      onChange={(e) => {
                        const c = AFRICAN_COUNTRIES.find(ac => ac.code === e.target.value);
                        if (c) onCountryChange(c);
                      }}
                      className="w-full appearance-none bg-white border border-slate-200 text-slate-900 py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                   >
                      {AFRICAN_COUNTRIES.map(c => (
                         <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                      ))}
                   </select>
                   <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90" />
                </div>
            </div>
         </div>

         <div className="p-4 border-b border-slate-100 last:border-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
                   </div>
                   <div>
                      <div className="font-medium text-slate-900">Language</div>
                      <div className="text-xs text-slate-500">Choose your preferred language</div>
                   </div>
                </div>
                 <div className="relative min-w-[200px]">
                   <select 
                      value={lang}
                      onChange={(e) => onSwitchLang(e.target.value as any)}
                      className="w-full appearance-none bg-white border border-slate-200 text-slate-900 py-2 pl-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                   >
                    <option value="en">English (Official)</option>
                    <option value="sw">Kiswahili (East Africa)</option>
                    <option value="fr">Français (West/Central)</option>
                    <option value="ar">العربية (North Africa)</option>
                    <option value="pt">Português (Southern/West)</option>
                    <option value="am">አማርኛ (Ethiopia)</option>
                   </select>
                   <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90" />
                </div>
            </div>
         </div>
      </div>

      {/* Session Section */}
       <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
         <button 
           onClick={onLogout}
           className="w-full flex items-center gap-4 p-4 text-red-600 hover:bg-red-50 transition-all active:bg-red-100"
         >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
               <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div className="font-medium">Logout</div>
         </button>
       </div>
    </div>
  );
};

export default Settings;