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
import { UserRole, Product, TransportRequest, Language, Country, FleetVehicle, StorageFacility, CartItem, Order } from './types';
import { AFRICAN_COUNTRIES, generateMockData } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState<UserRole>('FARMER');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedCountry, setSelectedCountry] = useState<Country>(AFRICAN_COUNTRIES[0]);

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

  // Initialize data when country changes
  useEffect(() => {
    const data = generateMockData(selectedCountry);
    setProducts(data.products);

    // Add an assigned trip for demonstration
    const mockLogistics = [
      ...data.logistics,
      {
        id: 't3',
        farmerId: 'f1',
        farmerName: 'John Doe',
        origin: selectedCountry.locations[0],
        destination: selectedCountry.locations[1] || 'City Center',
        goodsType: 'Grains',
        weightKg: 2000,
        status: 'ACCEPTED' as const,
        priceOffer: 8500,
        assignedProviderId: 'lp1', // Current user
        assignedProviderName: 'Swift Haulage'
      }
    ];
    setLogistics(mockLogistics);

    setStorageFacilities(data.storage);
    setMarketPrices(data.marketPrices);

    // Initialize Fleet based on country locations (mock data)
    setFleet([
      { id: '1', name: 'Isuzu FRR', plate: 'KBZ 123A', capacity: '5 Tons', location: selectedCountry.locations[0], status: 'Available' },
      { id: '2', name: 'Mitsubishi Canter', plate: 'KCA 456B', capacity: '3 Tons', location: selectedCountry.locations[1] || selectedCountry.locations[0], status: 'Maintenance' },
      { id: '3', name: 'Toyota Hilux', plate: 'KDD 789C', capacity: '1 Ton', location: selectedCountry.locations[3] || selectedCountry.locations[0], status: 'Available' }
    ]);

    // Initialize mock orders
    setOrders([
      { id: 'o1', buyerId: 'me', farmerId: 'f1', productName: 'Fresh Tomatoes (50kg)', amount: 1500, status: 'SHIPPED', date: '2024-05-20' },
      { id: 'o2', buyerId: 'me', farmerId: 'f2', productName: 'Yellow Maize (20 bags)', amount: 60000, status: 'PROCESSING', date: '2024-05-21' },
      { id: 'o3', buyerId: 'b2', farmerId: 'me', productName: 'Potatoes (100kg)', amount: 3500, status: 'DELIVERED', date: '2024-05-18' },
    ]);
  }, [selectedCountry]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('FARMER');
    setCart([]);
  };

  const handleSwitchRole = (newRole: UserRole) => {
    setUserRole(newRole);
    setCurrentPage('home'); // Redirect to dashboard to see role-specific view
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
  };

  const handleRequestTransport = (req: TransportRequest) => {
    setLogistics([req, ...logistics]);
  };

  const handleUpdateLogistics = (updatedRequest: TransportRequest) => {
    setLogistics(prev => prev.map(req => req.id === updatedRequest.id ? updatedRequest : req));
  };

  const handleAddVehicle = (vehicle: FleetVehicle) => {
    setFleet([...fleet, vehicle]);
  };

  const handleUpdateVehicle = (updatedVehicle: FleetVehicle) => {
    setFleet(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
  };

  const handleAddFacility = (facility: StorageFacility) => {
    setStorageFacilities([...storageFacilities, facility]);
  };

  const handleUpdateFacility = (updatedFacility: StorageFacility) => {
    setStorageFacilities(prev => prev.map(f => f.id === updatedFacility.id ? updatedFacility : f));
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

  const handlePaymentComplete = () => {
    // Create orders from cart items
    const newOrders: Order[] = cart.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      buyerId: 'me', // Assuming current user is buyer
      farmerId: item.farmerId,
      productName: `${item.name} (${item.cartQuantity} ${item.unit})`,
      amount: item.price * item.cartQuantity,
      status: 'PROCESSING',
      date: new Date().toISOString().split('T')[0]
    }));

    setOrders(prev => [...newOrders, ...prev]);
    setCart([]);
    setCurrentPage('home');
  };

  if (!isAuthenticated) {
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