import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Logistics from './pages/Logistics';
import Storage from './pages/Storage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AboutContact from './pages/AboutContact';
import Payment from './pages/Payment';
import CartDrawer from './components/CartDrawer';
import Landing from './pages/Landing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { UserRole, Product, TransportRequest, Language, Country, FleetVehicle, StorageFacility, CartItem, Order } from './types';
import { AFRICAN_COUNTRIES, generateMockData } from './constants';
import * as api from './services/api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('isAuthenticated') === 'true';
    return false;
  });
  const [showLanding, setShowLanding] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('showLanding');
      return stored !== null ? stored === 'true' : true;
    }
    return true;
  });
  const [legalPage, setLegalPage] = useState<'privacy' | 'terms' | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('currentPage') || 'home';
    return 'home';
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('userRole') as UserRole) || 'FARMER';
    return 'FARMER';
  });
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('language') as Language) || 'en';
    return 'en';
  });
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedCountry');
      if (stored) return JSON.parse(stored);
    }
    return AFRICAN_COUNTRIES[0];
  });

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [logistics, setLogistics] = useState<TransportRequest[]>([]);
  const [storageFacilities, setStorageFacilities] = useState<StorageFacility[]>([]);
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist State logic
  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
    localStorage.setItem('showLanding', String(showLanding));
    localStorage.setItem('currentPage', currentPage);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('language', language);
    localStorage.setItem('selectedCountry', JSON.stringify(selectedCountry));
  }, [isAuthenticated, showLanding, currentPage, userRole, language, selectedCountry]);

  // Sync state TO hash (when state changes programmatically)
  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    let desiredHash = '';
    
    if (legalPage) desiredHash = legalPage;
    else if (showLanding) desiredHash = 'landing';
    else if (!isAuthenticated) desiredHash = 'auth';
    else desiredHash = currentPage;
    
    if (currentHash !== desiredHash) {
      window.location.hash = desiredHash;
    }
  }, [showLanding, isAuthenticated, currentPage, legalPage]);

  // Sync hash TO state (when user clicks back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === 'landing') {
        setShowLanding(true);
        setIsAuthenticated(false);
        setLegalPage(null);
      } else if (hash === 'auth') {
        setShowLanding(false);
        setIsAuthenticated(false);
        setLegalPage(null);
      } else if (hash === 'privacy') {
        setLegalPage('privacy');
      } else if (hash === 'terms') {
        setLegalPage('terms');
      } else if (!hash) {
        // If the hash is empty (e.g., visiting the root domain directly)
        // Only show landing if they aren't authenticated natively
        if (!isAuthenticated) {
          setShowLanding(true);
          setLegalPage(null);
        }
      } else if (isAuthenticated && hash) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Also run once on mount to catch the INITIAL hash correctly, 
    // avoiding the race condition where React doesn't know about a shared `#landing` link
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  // Initialize static/mock data (prices and fleet) when country changes
  useEffect(() => {
    const data = generateMockData(selectedCountry);
    setMarketPrices(data.marketPrices);

    // Initialize Fleet based on country locations (mock data)
    setFleet([
      { id: '1', name: 'Isuzu FRR', plate: 'KBZ 123A', capacity: '5 Tons', location: selectedCountry.locations[0], status: 'Available' },
      { id: '2', name: 'Mitsubishi Canter', plate: 'KCA 456B', capacity: '3 Tons', location: selectedCountry.locations[1] || selectedCountry.locations[0], status: 'Maintenance' },
      { id: '3', name: 'Toyota Hilux', plate: 'KDD 789C', capacity: '1 Ton', location: selectedCountry.locations[3] || selectedCountry.locations[0], status: 'Available' }
    ]);
  }, [selectedCountry]);

  // Fetch real data from MongoDB API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, logisticsData, storageData, ordersData] = await Promise.all([
          api.fetchProducts(),
          api.fetchTransportRequests(),
          api.fetchStorageFacilities(),
          api.fetchOrders()
        ]);
        setProducts(productsData.reverse());
        setLogistics(logisticsData.reverse());
        setStorageFacilities(storageData.reverse());
        setOrders(ordersData.reverse());
      } catch (error) {
        console.error('Failed to load data from API:', error);
      }
    };
    loadData();
  }, []);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setShowLanding(false);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    // Clear persisted session data
    ['isAuthenticated', 'showLanding', 'currentPage', 'userRole'].forEach(key =>
      localStorage.removeItem(key)
    );
    setIsAuthenticated(false);
    setShowLanding(true);
    setUserRole('FARMER');
    setCurrentPage('home');
    setCart([]);
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setUserRole(newRole);
    setCurrentPage('home'); // Redirect to dashboard to see role-specific view
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const created = await api.createProduct(newProduct);
      setProducts([created, ...products]);
    } catch (err) { console.error(err); }
  };

  const handleRequestTransport = async (req: TransportRequest) => {
    try {
      const created = await api.createTransportRequest(req);
      setLogistics([created, ...logistics]);
    } catch (err) { console.error(err); }
  };

  const handleUpdateLogistics = async (updatedRequest: TransportRequest) => {
    try {
      const updated = await api.updateTransportRequestStatus(updatedRequest.id, {
        status: updatedRequest.status,
        assignedProviderId: updatedRequest.assignedProviderId,
        assignedProviderName: updatedRequest.assignedProviderName
      });
      setLogistics(prev => prev.map(req => req.id === updated.id ? updated : req));
    } catch (err) { console.error(err); }
  };

  const handleAddVehicle = (vehicle: FleetVehicle) => {
    setFleet([...fleet, vehicle]);
  };

  const handleUpdateVehicle = (updatedVehicle: FleetVehicle) => {
    setFleet(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };

  const handleAddFacility = async (facility: StorageFacility) => {
    try {
      const created = await api.createStorageFacility(facility);
      setStorageFacilities([...storageFacilities, created]);
    } catch (err) { console.error(err); }
  };

  const handleUpdateFacility = async (updatedFacility: StorageFacility) => {
    try {
      const updated = await api.updateStorageFacilityCapacity(updatedFacility.id, updatedFacility.availableKg);
      setStorageFacilities(prev => prev.map(f => f.id === updated.id ? updated : f));
    } catch (err) { console.error(err); }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, cartQuantity: quantity } : item
    ));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('payment');
  };

  const handlePaymentComplete = async () => {
    // Create orders from cart items via API
    try {
      const newOrdersPromises = cart.map(item => api.createOrder({
        buyerId: 'me', // Assuming current user is buyer
        farmerId: item.farmerId,
        productName: `${item.name} (${item.cartQuantity} ${item.unit})`,
        amount: item.price * item.cartQuantity,
        status: 'PROCESSING'
      }));

      const createdOrders = await Promise.all(newOrdersPromises);

      setOrders(prev => [...createdOrders, ...prev]);
      setCart([]);
      setCurrentPage('home');
    } catch (error) {
      console.error('Failed to create orders:', error);
      alert('Order placed locally, failed to save to server.');
      setCart([]);
      setCurrentPage('home');
    }
  };

  if (!isAuthenticated) {
    if (legalPage === 'privacy') {
      return <PrivacyPolicy onBack={() => setLegalPage(null)} />;
    }
    if (legalPage === 'terms') {
      return <TermsOfService onBack={() => setLegalPage(null)} />;
    }
    if (showLanding) {
      return <Landing onGetStarted={() => setShowLanding(false)} onNavigateLegal={setLegalPage} />;
    }
    return <Auth onLogin={handleLogin} />;
  }

  const renderPage = () => {
    // 1. Determine mock current user ID based on role
    let currentUserId = 'f1'; // Default farmer
    if (userRole === 'BUYER') currentUserId = 'me';
    if (userRole === 'LOGISTICS') currentUserId = 'lp1';
    if (userRole === 'WAREHOUSE') currentUserId = 'w1';

    // 2. Filter data based on role
    // Products: Farmers only see their own. Everyone else sees all (or filtered by marketplace logic later).
    const filteredProducts = userRole === 'FARMER'
      ? products.filter(p => p.farmerId === currentUserId)
      : products;

    // Logistics: 
    // Farmers/Buyers/Warehouse see requests they created.
    // Logistics see 'PENDING' requests (marketplace) + requests assigned to them.
    const filteredLogistics = logistics.filter(req => {
      if (userRole === 'FARMER' || userRole === 'BUYER' || userRole === 'WAREHOUSE') {
        return req.farmerId === currentUserId; // (Using farmerId as the generic requester ID in this mock)
      }
      if (userRole === 'LOGISTICS') {
        return req.status === 'PENDING' || req.assignedProviderId === currentUserId;
      }
      return true;
    });

    // Orders:
    // Farmers see orders they are selling.
    // Buyers see orders they are buying.
    // Logistics see orders they are fulfilling (not explicitly modeled in mock, but can show all for now or empty if none assigned)
    const filteredOrders = orders.filter(order => {
      if (userRole === 'FARMER') return order.farmerId === currentUserId;
      if (userRole === 'BUYER') return order.buyerId === currentUserId;
      if (userRole === 'LOGISTICS') return false; // Logistics don't typically "own" crop orders unless they are the shipper, which we'd link differently.
      return true;
    });

    // Storage Facilities:
    // Warehouses see their own. Others see all (for booking).
    const filteredStorage = userRole === 'WAREHOUSE'
      ? storageFacilities.filter(s => s.ownerId === currentUserId)
      : storageFacilities;


    switch (currentPage) {
      case 'home':
        return (
          <Dashboard
            role={userRole}
            marketPrices={marketPrices}
            products={filteredProducts}
            transportRequests={filteredLogistics}
            orders={filteredOrders}
            onUpdateLogistics={handleUpdateLogistics}
            lang={language}
            country={selectedCountry}
            fleet={fleet}
            onNavigate={setCurrentPage}
          />
        );
      case 'marketplace':
        return (
          <Marketplace
            products={products}
            role={userRole}
            onAddProduct={handleAddProduct}
            lang={language}
            country={selectedCountry}
            onAddToCart={handleAddToCart}
          />
        );
      case 'logistics':
        return (
          <Logistics
            requests={filteredLogistics}
            role={userRole}
            onRequestTransport={handleRequestTransport}
            onUpdateLogistics={handleUpdateLogistics}
            country={selectedCountry}
            fleet={fleet}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            lang={language}
          />
        );
      case 'storage':
        return (
          <Storage
            facilities={filteredStorage}
            role={userRole}
            country={selectedCountry}
            onAddFacility={handleAddFacility}
            onUpdateFacility={handleUpdateFacility}
            lang={language}
          />
        );
      case 'profile':
        return (
          <Profile
            role={userRole}
            country={selectedCountry}
            products={filteredProducts}
            logistics={filteredLogistics}
            orders={filteredOrders}
            fleet={fleet}
            storage={filteredStorage}
            lang={language}
          />
        );
      case 'settings':
        return (
          <Settings
            lang={language}
            onSwitchLang={setLanguage}
            country={selectedCountry}
            onCountryChange={setSelectedCountry}
            onLogout={handleLogout}
            onNavigate={setCurrentPage}
            role={userRole}
            onRoleChange={handleSwitchRole}
          />
        );
      case 'about':
        return <AboutContact lang={language} />;
      case 'privacy':
        return <PrivacyPolicy onBack={() => setCurrentPage('home')} />;
      case 'terms':
        return <TermsOfService onBack={() => setCurrentPage('home')} />;
      case 'payment':
        return (
          <Payment
            cartItems={cart}
            totalAmount={cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0)}
            country={selectedCountry}
            onBack={() => setCurrentPage('marketplace')}
            onComplete={handlePaymentComplete}
            lang={language}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <Layout
      userRole={userRole}
      currentLang={language}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      cartItemCount={cart.reduce((acc, item) => acc + item.cartQuantity, 0)}
      onOpenCart={() => setIsCartOpen(true)}
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
    >
      {renderPage()}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        country={selectedCountry}
        lang={language}
      />
    </Layout>
  );
};

export default App;