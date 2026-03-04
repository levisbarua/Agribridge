import React, { useState } from 'react';
import { Menu, Truck, ShoppingBag, BarChart3, Settings as SettingsIcon, Warehouse, Mic, Sparkles, Info, Sun, Moon } from 'lucide-react';
import { UserRole, Language, TRANSLATIONS } from '../types';
import AiAssistant from '../pages/AiAssistant';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  currentLang: Language;
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemCount?: number;
  onOpenCart?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  userRole,
  currentLang,
  currentPage,
  onNavigate,
  cartItemCount = 0,
  onOpenCart,
  darkMode = false,
  onToggleDarkMode
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
          ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-600 text-white shadow-md'
          : darkMode ? 'text-slate-400 hover:bg-slate-700/50' : 'text-green-900/70 hover:bg-green-200/50 hover:text-green-900'}`}
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
    <div className={`min-h-screen flex flex-col md:flex-row relative transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Mobile Header */}
      <div className={`md:hidden border-b p-4 flex justify-between items-center sticky top-0 z-20 transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <Logo lightTheme={darkMode} />
        <div className="flex items-center gap-2">
          {userRole === 'BUYER' && onOpenCart && (
            <button
              onClick={onOpenCart}
              className={`p-2 rounded-lg active:scale-90 transition-all relative ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
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
            className={`p-2 rounded-lg active:scale-90 transition-all ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 border-r transform transition-all duration-200 ease-in-out md:translate-x-0 md:static md:h-screen
        ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-green-100 border-green-200'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="hidden md:flex items-center justify-between mb-8">
            <Logo lightTheme={darkMode} />
          </div>

          <div className="flex-1">
            <div className={`text-xs font-semibold uppercase tracking-wider mb-4 px-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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

            <div className={`my-2 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}></div>

            <NavItem page="about" icon={Info} label={t.about} />
          </div>

          <div className="mt-auto">
            <div className={`my-2 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}></div>
            <NavItem page="settings" icon={SettingsIcon} label={t.settings} />

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-all rounded-lg mb-1 active:scale-95 cursor-pointer
                 ${darkMode ? 'text-yellow-400 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {darkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className={`text-xs px-4 mt-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
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
        <div className={`hidden md:flex justify-end items-center px-8 py-4 backdrop-blur-sm border-b sticky top-0 z-20 transition-colors ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
          {userRole === 'BUYER' && onOpenCart && (
            <button
              onClick={onOpenCart}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all relative group font-medium ${darkMode ? 'text-slate-300 hover:text-green-400 hover:bg-green-900/20' : 'text-slate-600 hover:text-green-700 hover:bg-green-50'}`}
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
          <div className={`w-full sm:w-[450px] h-[85vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden relative pointer-events-auto animate-in slide-in-from-bottom-10 duration-300 flex flex-col ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
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