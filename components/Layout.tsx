import React, { useState } from 'react';
import { Menu, Truck, ShoppingBag, BarChart3, Settings as SettingsIcon, Warehouse, Mic, Sparkles, Info } from 'lucide-react';
import { UserRole, Language, TRANSLATIONS } from '../types';
import AiAssistant from '../pages/AiAssistant';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  currentLang: Language;
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemCount?: number;
  onOpenCart?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  userRole, 
  currentLang, 
  currentPage,
  onNavigate,
  cartItemCount = 0,
  onOpenCart
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [aiState, setAiState] = useState<{ isOpen: boolean; mode: 'chat' | 'voice' }>({ 
    isOpen: false, 
    mode: 'chat' 
  });
  
  const t = TRANSLATIONS[currentLang];

  const NavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        onNavigate(page);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all rounded-lg mb-1 active:scale-95
        ${currentPage === page 
          ? 'bg-green-100 text-green-800' 
          : 'text-slate-600 hover:bg-slate-50'}`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  const openAi = (mode: 'chat' | 'voice') => {
    setAiState({ isOpen: true, mode });
  };

  const closeAi = () => {
    setAiState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
           <span className="font-bold text-lg text-slate-800">AgriBridge</span>
        </div>
        <div className="flex items-center gap-2">
          {userRole === 'BUYER' && onOpenCart && (
            <button 
              onClick={onOpenCart}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-90 transition-all relative"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg active:scale-90 transition-all"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="hidden md:flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
              <span className="font-bold text-xl text-slate-800">AgriBridge</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4">
              {t.dashboard}
            </div>
            
            <NavItem page="home" icon={BarChart3} label={t.dashboard} />
            
            {userRole !== 'LOGISTICS' && userRole !== 'WAREHOUSE' && (
              <NavItem page="marketplace" icon={ShoppingBag} label={t.marketplace} />
            )}
            
            {/* Logistics/Transport Access (Available for all roles) */}
            <NavItem page="logistics" icon={Truck} label={t.logistics} />

            {/* Storage access (Hidden for Logistics) */}
            {userRole !== 'LOGISTICS' && (
              <NavItem page="storage" icon={Warehouse} label={t.storage} />
            )}

            <div className="my-2 border-t border-slate-100"></div>

            <NavItem page="about" icon={Info} label={t.about} />
          </div>

          <div className="mt-auto">
             <div className="my-2 border-t border-slate-100"></div>
             <NavItem page="settings" icon={SettingsIcon} label={t.settings} />
             <div className="text-xs text-slate-400 px-4 mt-4">
                v1.0.5 • AgriBridge Africa
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        {/* Desktop Top Bar */}
        <div className="hidden md:flex justify-end items-center px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
           {userRole === 'BUYER' && onOpenCart && (
             <button 
               onClick={onOpenCart}
               className="flex items-center gap-2 text-slate-600 hover:text-green-700 hover:bg-green-50 px-4 py-2 rounded-full transition-all relative group font-medium"
             >
               <div className="relative">
                 <ShoppingBag className="w-5 h-5" />
                 {cartItemCount > 0 && (
                   <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                     {cartItemCount}
                   </span>
                 )}
               </div>
               <span>Cart</span>
             </button>
           )}
        </div>

        <div className="max-w-5xl mx-auto p-4 md:p-8 pb-32">
          {children}
        </div>

        {/* Floating AI Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-4 z-40">
          <button 
            onClick={() => openAi('voice')}
            className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg shadow-red-200 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
            title="Start Voice Assistant"
          >
            <Mic className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => openAi('chat')}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 shadow-lg shadow-green-200 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            <span>Ask AI</span>
          </button>
        </div>
      </main>

      {/* AI Overlay Modal */}
      {aiState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 pointer-events-none">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
            onClick={closeAi}
          />
          
          {/* Modal Content */}
          <div className="w-full sm:w-[450px] h-[85vh] sm:h-[600px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden relative pointer-events-auto animate-in slide-in-from-bottom-10 duration-300">
             <AiAssistant 
               initialMode={aiState.mode} 
               onClose={closeAi} 
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;