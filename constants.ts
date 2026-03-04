import { Product, TransportRequest, MarketPrice, StorageFacility, Country, LogisticsProvider } from './types';

export const AFRICAN_COUNTRIES: Country[] = [
  {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    flag: '🇰🇪',
    locations: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
    coordinates: { lat: -1.2921, lng: 36.8219 } // Nairobi
  },
  {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    flag: '🇳🇬',
    locations: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt'],
    coordinates: { lat: 9.0765, lng: 7.3986 } // Abuja
  },
  {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    flag: '🇿🇦',
    locations: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Soweto'],
    coordinates: { lat: -25.7479, lng: 28.2293 } // Pretoria
  },
  {
    code: 'GH',
    name: 'Ghana',
    currency: 'GHS',
    flag: '🇬🇭',
    locations: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Ashaiman'],
    coordinates: { lat: 5.6037, lng: -0.1870 } // Accra
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    currency: 'TZS',
    flag: '🇹🇿',
    locations: ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya'],
    coordinates: { lat: -6.7924, lng: 39.2083 } // Dar es Salaam
  },
  {
    code: 'UG',
    name: 'Uganda',
    currency: 'UGX',
    flag: '🇺🇬',
    locations: ['Kampala', 'Entebbe', 'Jinja', 'Gulu', 'Mbarara'],
    coordinates: { lat: 0.3476, lng: 32.5825 } // Kampala
  },
  {
    code: 'RW',
    name: 'Rwanda',
    currency: 'RWF',
    flag: '🇷🇼',
    locations: ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi'],
    coordinates: { lat: -1.9441, lng: 30.0619 } // Kigali
  },
  {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    flag: '🇪🇬',
    locations: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said'],
    coordinates: { lat: 30.0444, lng: 31.2357 } // Cairo
  },
];

export const generateMockData = (country: Country) => {
  const locs = country.locations;
  const curr = country.currency;

  const products: Product[] = [
    {
      id: '1',
      farmerId: 'f1',
      farmerName: 'John Doe',
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      price: 1500,
      unit: 'crate',
      quantity: 50,
      harvestDate: '2024-05-20',
      description: 'Organically grown red tomatoes, ready for market.',
      imageUrl: 'https://loremflickr.com/400/300/tomatoes,vegetable',
      location: locs[0] + ' Outskirts',
    },
    {
      id: '2',
      farmerId: 'f2',
      farmerName: 'Mary Amara',
      name: 'Yellow Maize',
      category: 'Grains',
      price: 3000,
      unit: 'bag (90kg)',
      quantity: 100,
      harvestDate: '2024-05-18',
      description: 'Dried maize suitable for milling.',
      imageUrl: 'https://loremflickr.com/400/300/corn,maize',
      location: locs[3] || locs[0],
    },
    {
      id: '3',
      farmerId: 'f1',
      farmerName: 'John Doe',
      name: 'Avocados (Hass)',
      category: 'Fruits',
      price: 15,
      unit: 'piece',
      quantity: 2000,
      harvestDate: '2024-05-21',
      description: 'Export quality Hass avocados.',
      imageUrl: 'https://loremflickr.com/400/300/avocado,fruit',
      location: locs[1] || locs[0],
    }
  ];

  const logistics: TransportRequest[] = [
    {
      id: 't1',
      farmerId: 'f1',
      farmerName: 'John Doe',
      origin: locs[0] + ' Outskirts',
      destination: 'Central Market',
      originCoords: [country.coordinates.lat + 0.1, country.coordinates.lng - 0.1], // Slightly off center
      destinationCoords: [country.coordinates.lat - 0.05, country.coordinates.lng + 0.05],
      goodsType: 'Vegetables',
      weightKg: 500,
      status: 'PENDING',
      priceOffer: 2000,
    },
    {
      id: 't2',
      farmerId: 'f1',
      farmerName: 'John Doe',
      origin: locs[0],
      destination: locs[1] || 'City Center',
      originCoords: [country.coordinates.lat, country.coordinates.lng],
      destinationCoords: [country.coordinates.lat + 1.5, country.coordinates.lng + 1.2], // Arbitrary distance
      goodsType: 'Fruits',
      weightKg: 1200,
      status: 'COMPLETED',
      priceOffer: 5000,
    }
  ];

  const storage: StorageFacility[] = [
    {
      id: 's1',
      ownerId: 'w1',
      name: `${locs[0]} Cold Chain Hub`,
      type: 'COLD_ROOM',
      location: `${locs[0]} Industrial Area`,
      capacityKg: 10000,
      availableKg: 4500,
      pricePerKgDaily: 5,
      temperature: 4,
      imageUrl: 'https://loremflickr.com/400/300/warehouse,cold'
    },
    {
      id: 's2',
      ownerId: 'w2',
      name: `${locs[4] || locs[1]} Grain Silos`,
      type: 'SILO',
      location: locs[4] || locs[1],
      capacityKg: 50000,
      availableKg: 12000,
      pricePerKgDaily: 1,
      imageUrl: 'https://loremflickr.com/400/300/silo,grain'
    }
  ];

  const marketPrices: MarketPrice[] = [
    { crop: 'Tomatoes', market: locs[0], price: 84, trend: 'UP' },
    { crop: 'Maize', market: locs[4] || locs[1], price: 54, trend: 'DOWN' },
    { crop: 'Potatoes', market: locs[1], price: 44, trend: 'STABLE' },
    { crop: 'Onions', market: locs[0], price: 95, trend: 'UP' },
    { crop: 'Cabbages', market: locs[2] || locs[0], price: 34, trend: 'DOWN' },
    { crop: 'Beans', market: locs[3] || locs[1], price: 132, trend: 'STABLE' },
    { crop: 'Carrots', market: locs[3] || locs[0], price: 65, trend: 'UP' },
    { crop: 'Kale', market: locs[2] || locs[1], price: 28, trend: 'STABLE' },
  ];

  const providers: LogisticsProvider[] = [
    {
      id: 'lp1',
      name: 'Swift Haulage',
      vehicleType: 'Isuzu FRR (5 Ton)',
      plateNumber: 'KCA 123A',
      location: locs[0], // Capital
      rating: 4.8,
      completedTrips: 154,
      imageUrl: 'https://loremflickr.com/100/100/truck,driver',
      baseRatePerKm: 250
    },
    {
      id: 'lp2',
      name: 'Green Miles Logistics',
      vehicleType: 'Pickup Truck (1 Ton)',
      plateNumber: 'KDD 456B',
      location: locs[1], // Second city
      rating: 4.5,
      completedTrips: 89,
      imageUrl: 'https://loremflickr.com/100/100/man,driver',
      baseRatePerKm: 180
    },
    {
      id: 'lp3',
      name: 'AgriTrans Co.',
      vehicleType: 'Canter (3 Ton)',
      plateNumber: 'KBE 789C',
      location: locs[0],
      rating: 4.9,
      completedTrips: 312,
      imageUrl: 'https://loremflickr.com/100/100/logistics,worker',
      baseRatePerKm: 220
    },
    {
      id: 'lp4',
      name: 'Rural Connect',
      vehicleType: 'Tuk Tuk Cargo',
      plateNumber: 'TUK 101',
      location: locs[2] || locs[0],
      rating: 4.2,
      completedTrips: 45,
      imageUrl: 'https://loremflickr.com/100/100/delivery,driver',
      baseRatePerKm: 80
    }
  ];

  return { products, logistics, storage, marketPrices, providers };
};

// Default export for initial state if needed, defaulting to Kenya
export const DEFAULT_MOCK_DATA = generateMockData(AFRICAN_COUNTRIES[0]);
export const MOCK_PRODUCTS = DEFAULT_MOCK_DATA.products;
export const MOCK_LOGISTICS = DEFAULT_MOCK_DATA.logistics;
export const MOCK_STORAGE = DEFAULT_MOCK_DATA.storage;
export const MOCK_MARKET_PRICES = DEFAULT_MOCK_DATA.marketPrices;
export const MOCK_PROVIDERS = DEFAULT_MOCK_DATA.providers;