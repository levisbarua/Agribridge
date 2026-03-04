import React, { useState, useEffect } from 'react';
import { UserRole, MarketPrice, Product, TransportRequest, TRANSLATIONS, Language, Order, Country, FleetVehicle } from '../types';
import { TrendingUp, Truck, Package, DollarSign, CloudSun, Warehouse, Thermometer, ShoppingBag, Clock, ArrowRight, AlertCircle, Plus, Loader2, Check, X, MapPin, User, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { fetchWeather } from '../services/weatherService';
import { getMarketInsights } from '../services/geminiService';

interface DashboardProps {
  role: UserRole;
  marketPrices: MarketPrice[];
  products: Product[];
  transportRequests: TransportRequest[];
  orders: Order[];
  onUpdateLogistics?: (req: TransportRequest) => void;
  lang: Language;
  country: Country;
  fleet?: FleetVehicle[];
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ role, marketPrices, products, transportRequests, orders, onUpdateLogistics, lang, country, fleet = [], onNavigate }) => {
  const t = TRANSLATIONS[lang];
  const [selectedCrop, setSelectedCrop] = useState('Tomatoes');
  const [showAllMarkets, setShowAllMarkets] = useState(false);

  // Weather State
  const [weather, setWeather] = useState<{ temp: number; condition: string } | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // AI Insights State
  const [aiInsights, setAiInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Logistics Local State (Dashboard Widget)
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);

  // Storage Local State (Dashboard Widget)
  const [processingStorageId, setProcessingStorageId] = useState<string | null>(null);
  const [acceptedStorageIds, setAcceptedStorageIds] = useState<string[]>([]);

  useEffect(() => {
    const getWeather = async () => {
      setLoadingWeather(true);
      const data = await fetchWeather(country.coordinates.lat, country.coordinates.lng);
      setWeather(data ? { temp: data.temperature, condition: data.condition } : null);
      setLoadingWeather(false);
    };

    getWeather();
    // Reset insights when country changes
    setAiInsights('');
  }, [country]);

  const handleAcceptJob = (id: string) => {
    setProcessingJobId(id);
    setTimeout(() => {
      const request = transportRequests.find(r => r.id === id);
      if (request && onUpdateLogistics) {
        onUpdateLogistics({
          ...request,
          status: 'ACCEPTED',
          assignedProviderId: 'me', // Assuming 'me' is current user
          assignedProviderName: 'Transporter'
        });
      }
      setProcessingJobId(null);
    }, 1500);
  };

  const handleAcceptStorage = (id: string) => {
    setProcessingStorageId(id);
    setTimeout(() => {
      setAcceptedStorageIds(prev => [...prev, id]);
      setProcessingStorageId(null);
    }, 1500);
  };

  const handleGetInsights = async () => {
    setIsGeneratingInsights(true);
    const insights = await getMarketInsights(marketPrices, country.name);
    setAiInsights(insights || 'No insights available.');
    setIsGeneratingInsights(false);
  };

  // Helper Components
  const StatCard = ({ icon: Icon, label, value, color, subtext, isLoading, onClick }: any) => (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.98]' : ''}`}
    >
      <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800">
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-slate-300" /> : value}
        </h3>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  const SectionHeader = ({ title, action }: { title: string, action?: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 mt-8">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {action}
    </div>
  );

  // --- 1. FARMER DASHBOARD ---
  if (role === 'FARMER') {
    // Props are already filtered in App.tsx for this user role
    const myProducts = products;
    const myLogistics = transportRequests;
    const pendingLogistics = myLogistics.filter(t => t.status === 'PENDING').length;
    const completedLogistics = myLogistics.filter(t => t.status === 'COMPLETED').length;
    const mySales = orders;
    const totalRevenue = mySales.reduce((sum, order) => sum + order.amount, 0);

    // Chart Data based on selection (Prices per KG)
    const chartDataMap: Record<string, { day: string, price: number }[]> = {
      'Tomatoes': [
        { day: 'Mon', price: 75 }, { day: 'Tue', price: 78 },
        { day: 'Wed', price: 74 }, { day: 'Thu', price: 80 },
        { day: 'Fri', price: 82 }, { day: 'Sat', price: 85 },
        { day: 'Sun', price: 84 },
      ],
      'Maize': [
        { day: 'Mon', price: 45 }, { day: 'Tue', price: 48 },
        { day: 'Wed', price: 50 }, { day: 'Thu', price: 49 },
        { day: 'Fri', price: 52 }, { day: 'Sat', price: 55 },
        { day: 'Sun', price: 54 },
      ],
      'Potatoes': [
        { day: 'Mon', price: 35 }, { day: 'Tue', price: 38 },
        { day: 'Wed', price: 40 }, { day: 'Thu', price: 42 },
        { day: 'Fri', price: 40 }, { day: 'Sat', price: 45 },
        { day: 'Sun', price: 44 },
      ],
      'Beans': [
        { day: 'Mon', price: 120 }, { day: 'Tue', price: 125 },
        { day: 'Wed', price: 122 }, { day: 'Thu', price: 128 },
        { day: 'Fri', price: 130 }, { day: 'Sat', price: 135 },
        { day: 'Sun', price: 132 },
      ],
      'Onions': [
        { day: 'Mon', price: 80 }, { day: 'Tue', price: 85 },
        { day: 'Wed', price: 82 }, { day: 'Thu', price: 88 },
        { day: 'Fri', price: 90 }, { day: 'Sat', price: 92 },
        { day: 'Sun', price: 95 },
      ],
      'Cabbages': [
        { day: 'Mon', price: 25 }, { day: 'Tue', price: 28 },
        { day: 'Wed', price: 30 }, { day: 'Thu', price: 28 },
        { day: 'Fri', price: 32 }, { day: 'Sat', price: 35 },
        { day: 'Sun', price: 34 },
      ],
      'Carrots': [
        { day: 'Mon', price: 50 }, { day: 'Tue', price: 52 },
        { day: 'Wed', price: 55 }, { day: 'Thu', price: 58 },
        { day: 'Fri', price: 60 }, { day: 'Sat', price: 62 },
        { day: 'Sun', price: 65 },
      ],
      'Kale': [
        { day: 'Mon', price: 20 }, { day: 'Tue', price: 22 },
        { day: 'Wed', price: 25 }, { day: 'Thu', price: 24 },
        { day: 'Fri', price: 28 }, { day: 'Sat', price: 30 },
        { day: 'Sun', price: 28 },
      ]
    };

    const chartData = chartDataMap[selectedCrop] || [
      { day: 'Mon', price: 75 }, { day: 'Tue', price: 78 },
      { day: 'Wed', price: 74 }, { day: 'Thu', price: 80 },
      { day: 'Fri', price: 82 }, { day: 'Sat', price: 85 },
      { day: 'Sun', price: 84 }
    ];

    const displayedMarketPrices = showAllMarkets ? marketPrices : marketPrices.slice(0, 3);
    const locationName = country.locations[0] || 'Local';

    return (
      <div className="space-y-6">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t.welcome}, Farmer</h1>
            <p className="text-slate-500">Manage your harvest, track prices, and book transport in {country.name}.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label="Active Listings"
            value={myProducts.length}
            color="bg-green-500"
            subtext="In Marketplace"
            onClick={() => onNavigate('profile')}
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`${totalRevenue.toLocaleString()} ${country.currency}`}
            color="bg-emerald-600"
            subtext={`From ${mySales.length} orders`}
          />

          <StatCard
            icon={Truck}
            label="Logistics Requests"
            value={myLogistics.length}
            color="bg-orange-500"
            subtext={`${pendingLogistics} Pending • ${completedLogistics} Completed`}
          />

          <StatCard
            icon={CloudSun}
            label={`Weather (${locationName})`}
            value={weather ? `${weather.temp}°C` : '--°C'}
            color="bg-sky-400"
            subtext={weather ? weather.condition : 'Loading...'}
            isLoading={loadingWeather}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-bold text-slate-800">Market Price Trends <span className="text-sm text-slate-500 font-normal">({country.currency}/kg)</span></h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleGetInsights}
                  disabled={isGeneratingInsights}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-100 transition-all active:scale-95 disabled:opacity-50"
                  title="Analyze market trends with AI"
                >
                  {isGeneratingInsights ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span className="hidden sm:inline">AI Analysis</span>
                </button>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="flex-1 sm:flex-none text-sm border border-slate-300 p-2 rounded-lg bg-white text-slate-700 font-medium focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                >
                  <option value="Tomatoes">Tomatoes</option>
                  <option value="Maize">Maize</option>
                  <option value="Potatoes">Potatoes</option>
                  <option value="Beans">Beans</option>
                  <option value="Onions">Onions</option>
                  <option value="Cabbages">Cabbages</option>
                  <option value="Carrots">Carrots</option>
                  <option value="Kale">Kale</option>
                </select>
              </div>
            </div>

            {aiInsights && (
              <div className="mb-6 bg-purple-50 p-4 rounded-lg border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="font-bold text-purple-900 text-sm mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI Market Intelligence
                </h4>
                <p className="text-sm text-purple-800 whitespace-pre-line leading-relaxed">
                  {aiInsights}
                </p>
              </div>
            )}

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value} ${country.currency}`, 'Price/kg']} />
                  <Area type="monotone" dataKey="price" stroke="#16a34a" fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Live Market Prices</h3>
            <div className="space-y-3">
              {displayedMarketPrices.map((mp, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-sm">{mp.crop}</div>
                    <div className="text-xs text-slate-500">{mp.market}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold">{mp.price} <span className="text-xs font-normal text-slate-400">/kg</span></div>
                    <div className={`text-xs ${mp.trend === 'UP' ? 'text-green-600' : mp.trend === 'DOWN' ? 'text-red-500' : 'text-slate-500'}`}>{mp.trend}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowAllMarkets(!showAllMarkets)}
              className="w-full mt-4 py-3 text-sm font-medium text-green-700 bg-green-50 border border-slate-900 rounded-xl hover:bg-green-100 transition-all active:scale-95 shadow-sm"
            >
              {showAllMarkets ? "View Less" : "View All Markets"}
            </button>
          </div>
        </div>

        <SectionHeader title="Your Active Listings" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProducts.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4">
              <img src={p.imageUrl} className="w-20 h-20 rounded-lg object-cover bg-slate-100" />
              <div>
                <h4 className="font-bold text-slate-800">{p.name}</h4>
                <p className="text-sm text-slate-500">{p.quantity} {p.unit} • {p.price} {country.currency}</p>
                <div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">Active</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- 2. BUYER DASHBOARD ---
  if (role === 'BUYER') {
    // Props are already filtered in App.tsx for this user role
    const myOrders = orders;
    const totalSpent = myOrders.reduce((sum, order) => sum + order.amount, 0);
    const recentProducts = products.slice(0, 3); // Just show first 3 as "New"

    return (
      <div className="space-y-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t.welcome}, Buyer</h1>
          <p className="text-slate-500">Source fresh produce directly from farmers in {country.name}.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Active Orders"
            value={myOrders.length}
            color="bg-blue-600"
            onClick={() => onNavigate('profile')}
          />
          <StatCard
            icon={DollarSign}
            label="Total Spent"
            value={`${totalSpent.toLocaleString()} ${country.currency}`}
            color="bg-slate-800"
            subtext="Lifetime"
            onClick={() => onNavigate('profile')}
          />
          <StatCard icon={TrendingUp} label="Market Index" value="+2.4%" color="bg-green-500" subtext="Prices stable" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionHeader title="Recent Orders" />
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
              {myOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No orders yet. Start shopping in the Marketplace!</div>
              ) : (
                <table className="w-full text-sm text-left min-w-[500px]">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-4 font-medium">Product</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Amount</th>
                      <th className="p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map(order => (
                      <tr key={order.id} className="border-t border-slate-100">
                        <td className="p-4 font-medium text-slate-900">{order.productName}</td>
                        <td className="p-4 text-slate-500">{order.date}</td>
                        <td className="p-4 font-mono">{order.amount.toLocaleString()} {country.currency}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold 
                            ${order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div>
            <SectionHeader title="Fresh on Market" />
            <div className="space-y-4">
              {recentProducts.map(p => (
                <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-200 flex gap-3 group hover:shadow-md transition-all active:scale-95 cursor-pointer">
                  <img src={p.imageUrl} className="w-16 h-16 rounded bg-slate-100 object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-green-600">{p.name}</h4>
                    <p className="text-xs text-slate-500">{p.location}</p>
                    <p className="text-sm font-medium mt-1">{p.price} {country.currency} / {p.unit}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => onNavigate('marketplace')}
                className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-lg text-sm hover:bg-green-100 transition-all active:scale-95"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. LOGISTICS DASHBOARD ---
  if (role === 'LOGISTICS') {
    // Filter requests
    // Available: status is PENDING
    const availableJobs = transportRequests.filter(r => r.status === 'PENDING');
    // Active/Trips: status is ACCEPTED and assigned to this provider (App.tsx already filters to only show our assigned ones + pending)
    const activeTrips = transportRequests.filter(r => r.status === 'ACCEPTED');

    // Combine for display: Active trips first, then available jobs
    const displayRequests = [...activeTrips, ...availableJobs];

    // Calculate fleet stats using passed fleet prop
    const maintenanceVehicles = fleet.filter(v => v.status === 'Maintenance').length;
    const okVehicles = fleet.filter(v => v.status === 'Available').length;

    return (
      <div className="space-y-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t.welcome}, Transporter</h1>
          <p className="text-slate-500">Find loads, manage your fleet, and track earnings in {country.name}.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Package} label="Available Jobs" value={availableJobs.length} color="bg-green-600" />
          <StatCard
            icon={Truck}
            label="Active Trips"
            value={activeTrips.length}
            color="bg-blue-600"
            subtext={activeTrips.length > 0 ? "In progress" : "Fleet idle"}
            onClick={() => onNavigate('profile')}
          />
          <StatCard icon={DollarSign} label="Wallet" value={`12,500 ${country.currency}`} color="bg-slate-800" />
          <StatCard
            icon={AlertCircle}
            label="Maintenance"
            value={maintenanceVehicles > 0 ? `${maintenanceVehicles} In Shop` : "All OK"}
            color={maintenanceVehicles > 0 ? "bg-orange-500" : "bg-emerald-500"}
            subtext={`${okVehicles} Vehicles Available`}
            onClick={() => onNavigate('profile')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionHeader title="Active Requests & Job Board" />
            <div className="space-y-3">
              {displayRequests.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500">
                  No active jobs at the moment in this region.
                </div>
              ) : (
                displayRequests.map(req => {
                  const isProcessing = processingJobId === req.id;
                  const isAccepted = req.status === 'ACCEPTED';

                  return (
                    <div key={req.id} className={`bg-white p-4 rounded-xl border transition-colors ${isAccepted ? 'border-green-200 bg-green-50/50' : 'border-slate-200 hover:border-blue-400'}`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex gap-4 items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isAccepted ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            {isAccepted ? <Check className="w-6 h-6" /> : <User className="w-6 h-6" />}
                          </div>
                          <div>
                            <h4 className={`font-bold ${isAccepted ? 'text-green-800' : 'text-slate-800'}`}>{req.goodsType} ({req.weightKg} kg)</h4>

                            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mt-1">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>{req.farmerName}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                              <span>{req.origin}</span>
                              <ArrowRight className="w-3 h-3" />
                              <span>{req.destination}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => !isAccepted && handleAcceptJob(req.id)}
                          disabled={isProcessing || isAccepted}
                          className={`w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 min-w-[130px] active:scale-95
                            ${isAccepted
                              ? 'bg-green-100 text-green-700 border border-green-200 cursor-default active:scale-100'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                            }
                            ${isProcessing ? 'cursor-wait opacity-80' : ''}
                          `}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Accepting...
                            </>
                          ) : isAccepted ? (
                            <>
                              <Check className="w-4 h-4" />
                              Accepted
                            </>
                          ) : (
                            'Accept Job'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div>
            <SectionHeader title="My Fleet Status" />
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              {fleet.map((v, i) => (
                <div key={v.id} className={`flex items-center gap-3 ${i < fleet.length - 1 ? 'mb-4 pb-4 border-b border-slate-100' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${v.status === 'Available' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <div>
                    <div className="font-bold text-sm">{v.name} ({v.plate})</div>
                    <div className="text-xs text-slate-500">{v.status} • {v.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. WAREHOUSE DASHBOARD ---
  if (role === 'WAREHOUSE') {
    const storageRequests = [
      { id: 'sr1', name: 'John Doe', initials: 'JD', details: 'Tomatoes • 500kg • 3 Days' },
      { id: 'sr2', name: 'Mary Amara', initials: 'MA', details: 'Potatoes • 2000kg • 1 Month' }
    ];

    const newRequestsCount = storageRequests.filter(r => !acceptedStorageIds.includes(r.id)).length;

    return (
      <div className="space-y-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t.welcome}, Storage Partner</h1>
          <p className="text-slate-500">Monitor capacity, temperature, and manage bookings.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Warehouse} label="Capacity Used" value={65} color="bg-blue-600" onClick={() => onNavigate('profile')} />
          <StatCard icon={Thermometer} label="Avg Temp" value="4.2°C" color="bg-sky-500" subtext="Optimal range" />
          <StatCard icon={Package} label="Stored Items" value="12,400 kg" color="bg-orange-500" />
          <StatCard icon={DollarSign} label="Revenue (Mo)" value={`125k ${country.currency}`} color="bg-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Facility Status</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Cold Room A (Veg)</span>
                  <span className="text-slate-500">4.0°C</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-right mt-1 text-slate-400">75% Full</div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Dry Store B (Grains)</span>
                  <span className="text-slate-500">22°C</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="text-xs text-right mt-1 text-slate-400">40% Full</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Recent Storage Requests</h3>
              {newRequestsCount > 0 ? (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">{newRequestsCount} New</span>
              ) : (
                <span className="bg-green-100 text-green-600 text-xs font-bold px-2 py-1 rounded">All Clear</span>
              )}
            </div>
            <div className="space-y-3">
              {storageRequests.map(req => {
                const isAccepted = acceptedStorageIds.includes(req.id);
                const isProcessing = processingStorageId === req.id;

                return (
                  <div key={req.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg transition-all ${isAccepted ? 'bg-green-50/50 border border-green-100' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold transition-colors ${isAccepted ? 'bg-green-100 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-600'}`}>
                        {isAccepted ? <Check className="w-5 h-5" /> : req.initials}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-bold ${isAccepted ? 'text-green-900' : 'text-slate-900'}`}>{req.name}</div>
                        <div className="text-xs text-slate-500">{req.details}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => !isAccepted && handleAcceptStorage(req.id)}
                        disabled={isProcessing || isAccepted}
                        className={`flex-1 sm:flex-none text-xs px-4 py-2 rounded hover:bg-green-700 transition-all flex items-center justify-center gap-1 min-w-[90px] active:scale-95
                            ${isAccepted
                            ? 'bg-transparent text-green-700 font-bold cursor-default hover:bg-transparent active:scale-100'
                            : 'bg-green-600 text-white shadow-sm hover:shadow-md'
                          }
                            ${isProcessing ? 'opacity-80 cursor-wait' : ''}
                          `}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Wait
                          </>
                        ) : isAccepted ? (
                          'Accepted'
                        ) : (
                          'Accept'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Unknown Role</div>;
};

export default Dashboard;