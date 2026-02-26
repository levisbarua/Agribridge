import React, { useState } from 'react';
import { UserRole } from '../types';
import { Tractor, Truck, Warehouse, ShoppingBag, MapPin, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (role: UserRole) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Info, 2: Role
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('FARMER');
  const [location, setLocation] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Both Login and Signup flows now go to step 2 to select role for demo purposes
    if (step === 1) {
      setStep(2);
    } else {
      onLogin(role);
    }
  };

  const RoleCard = ({ value, label, icon: Icon, description }: any) => (
    <button
      type="button"
      onClick={() => setRole(value)}
      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-3 active:scale-95
        ${role === value 
          ? 'border-green-600 bg-green-50 text-green-800 ring-1 ring-green-600' 
          : 'border-slate-200 bg-white text-slate-600 hover:border-green-200 hover:bg-slate-50'}`}
    >
      <div className={`p-3 rounded-full ${role === value ? 'bg-green-200' : 'bg-slate-100'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-sm">{label}</h3>
        <p className="text-xs mt-1 opacity-80">{description}</p>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Visuals */}
        <div className="md:w-1/2 bg-green-600 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur mb-6">
              <span className="font-bold text-xl">A</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {isLogin ? 'Welcome Back!' : 'Join AgriBridge'}
            </h1>
            <p className="text-green-50 font-medium text-shadow-sm">
              {isLogin 
                ? 'Access your dashboard to manage listings, track prices, and handle logistics.' 
                : 'Connect directly with buyers, access storage, and minimize post-harvest loss.'}
            </p>
          </div>
          
          <div className="relative z-10 text-xs text-green-100 mt-12 md:mt-0 font-medium">
            © 2024 AgriBridge Africa. Empowering Farmers.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          {/* Toggle Login/Signup */}
          <div className="flex justify-end mb-8">
            <button 
              onClick={() => { setIsLogin(true); setStep(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-all active:scale-95 ${isLogin ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setStep(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-all active:scale-95 ${!isLogin ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth}>
            {step === 2 ? (
              // Step 2: Role Selection (For both Login and Signup)
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Select your Role</h2>
                  <p className="text-slate-500 text-sm">
                    {isLogin ? 'Which dashboard would you like to access?' : 'How will you use AgriBridge?'}
                  </p>
                </div>
                
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
                    label="Warehouse / Cold Room" 
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

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="w-full py-3 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 active:scale-95"
                  >
                    {isLogin ? 'Enter Dashboard' : 'Create Account'}
                  </button>
                </div>
              </div>
            ) : (
              // Step 1: Info (Login or Signup)
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                 <div>
                  <h2 className="text-xl font-bold text-slate-900">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                  <p className="text-slate-500 text-sm">{isLogin ? 'Enter your credentials to continue.' : 'Start your journey with us.'}</p>
                </div>

                {!isLogin && (
                  <div className="space-y-4">
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Location (e.g., Nairobi)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email"
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password"
                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isLogin ? 'Next Step' : 'Next Step'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;