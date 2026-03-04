import React, { useState, useEffect, useRef } from 'react';
import { TransportRequest, UserRole, Country, LogisticsProvider, FleetVehicle, Language, TRANSLATIONS } from '../types';
import { generateMockData } from '../constants';
import { Truck, MapPin, Package, CheckCircle2, Plus, X, ArrowRight, Settings, Search, Star, User, Loader2, CalendarClock, PenLine, Check, Map as MapIcon, List, Navigation } from 'lucide-react';
import L from 'leaflet';
import { RouteMap } from '../components/RouteMap';

interface LogisticsProps {
  requests: TransportRequest[];
  role: UserRole;
  onRequestTransport: (req: TransportRequest) => void;
  onUpdateLogistics?: (req: TransportRequest) => void;
  country: Country;
  fleet?: FleetVehicle[];
  onAddVehicle?: (vehicle: FleetVehicle) => void;
  onUpdateVehicle?: (vehicle: FleetVehicle) => void;
  lang: Language;
}

const Logistics: React.FC<LogisticsProps> = ({ requests, role, onRequestTransport, onUpdateLogistics, country, fleet = [], onAddVehicle, onUpdateVehicle, lang }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'fleet'>('requests');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Map Refs
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Request Transport Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Accept Job State
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);

  // Add/Edit Vehicle Modal State
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    plate: '',
    capacity: '',
    location: ''
  });

  // Schedule/Status Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedVehicleForSchedule, setSelectedVehicleForSchedule] = useState<FleetVehicle | null>(null);

  // Request Form State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [goodsType, setGoodsType] = useState('General Crop');

  // Search State
  const [searchStep, setSearchStep] = useState<'input' | 'results'>('input');
  const [isSearching, setIsSearching] = useState(false);
  const [foundProviders, setFoundProviders] = useState<(LogisticsProvider & { distance: string })[]>([]);

  const allProviders = generateMockData(country).providers;

  // Initialize Map
  useEffect(() => {
    // Only initialize if in map mode and container exists
    if (activeTab === 'requests' && viewMode === 'map' && mapContainerRef.current && !mapRef.current) {

      const map = L.map(mapContainerRef.current).setView([country.coordinates.lat, country.coordinates.lng], 6);
      mapRef.current = map;

      // Use CartoDB Voyager tiles for faster loading and cleaner UI
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Force a resize check slightly after mount to ensure tiles load correctly (fixes grey map issue)
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    // Cleanup when component unmounts or mode changes
    return () => {
      if (activeTab !== 'requests' || viewMode !== 'map') {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      }
    };
  }, [activeTab, viewMode, country]);

  // Update Markers when requests change or map is ready
  useEffect(() => {
    if (mapRef.current && activeTab === 'requests' && viewMode === 'map') {
      const map = mapRef.current;

      // Clear existing markers (simple approach)
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      const createIcon = (color: string) => L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
      });

      requests.forEach((req) => {
        // Generate deterministic random position around country center based on ID
        const seed = req.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const latOffset = ((seed % 100) / 100 - 0.5) * 3;
        const lngOffset = (((seed * 13) % 100) / 100 - 0.5) * 3;

        const lat = country.coordinates.lat + latOffset;
        const lng = country.coordinates.lng + lngOffset;

        const isAccepted = req.status === 'ACCEPTED';
        const color = isAccepted ? '#16a34a' : '#2563eb';

        const marker = L.marker([lat, lng], { icon: createIcon(color) }).addTo(map);

        const popupContent = `
          <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 160px;">
            <div style="font-weight: 700; color: #1e293b; font-size: 14px; margin-bottom: 4px;">${req.goodsType}</div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${req.weightKg} kg • <span style="color: ${color}; font-weight: 600;">${req.status}</span></div>
            <div style="font-size: 11px; font-weight: 500; color: #334155; display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
              <span style="width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; display: inline-block;"></span> 
              From: ${req.origin}
            </div>
            <div style="font-size: 11px; font-weight: 500; color: #334155; display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; background: #94a3b8; border-radius: 50%; display: inline-block;"></span>
              To: ${req.destination}
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
      });
    }
  }, [requests, activeTab, viewMode, country]);

  const handleSearchProviders = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !weight) return;

    setIsSearching(true);

    // Simulate network delay
    setTimeout(() => {
      // Mock "Nearest" Logic
      const results = allProviders.map(p => {
        const isLocal = origin.toLowerCase().includes(p.location.toLowerCase());
        const baseDistance = isLocal ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 50) + 10;

        return {
          ...p,
          distance: `${baseDistance} km`
        };
      }).sort((a, b) => parseInt(a.distance) - parseInt(b.distance));

      setFoundProviders(results);
      setIsSearching(false);
      setSearchStep('results');
    }, 1500);
  };

  const handleBookProvider = (provider: LogisticsProvider) => {
    let currentUserId = 'f1';
    let currentUserName = 'My Farm';

    if (role === 'BUYER') {
      currentUserId = 'me';
      currentUserName = 'My Order';
    } else if (role === 'LOGISTICS') {
      currentUserId = 'lp1';
      currentUserName = 'My Logistics';
    } else if (role === 'WAREHOUSE') {
      currentUserId = 'w1';
      currentUserName = 'My Warehouse';
    }

    onRequestTransport({
      id: Math.random().toString(36).substr(2, 9),
      farmerId: currentUserId,
      farmerName: currentUserName,
      origin,
      destination,
      goodsType,
      weightKg: Number(weight),
      status: 'PENDING',
      priceOffer: provider.baseRatePerKm * 10,
      assignedProviderId: provider.id,
      assignedProviderName: provider.name
    });

    resetForm();
  };

  const handleAcceptJob = (id: string) => {
    setProcessingJobId(id);
    setTimeout(() => {
      const req = requests.find(r => r.id === id);
      if (req && onUpdateLogistics) {
        onUpdateLogistics({
          ...req,
          status: 'ACCEPTED',
          assignedProviderName: 'Transporter'
        });
      }
      setProcessingJobId(null);
    }, 1500); // Simulate processing delay
  };

  const openAddModal = () => {
    setNewVehicle({ name: '', plate: '', capacity: '', location: '' });
    setEditingVehicleId(null);
    setIsAddVehicleModalOpen(true);
  };

  const openEditModal = (vehicle: FleetVehicle) => {
    setNewVehicle({
      name: vehicle.name,
      plate: vehicle.plate,
      capacity: vehicle.capacity.replace(' Tons', ''),
      location: vehicle.location
    });
    setEditingVehicleId(vehicle.id);
    setIsAddVehicleModalOpen(true);
  };

  const handleAddOrEditVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.name || !newVehicle.plate) return;

    setIsAddingVehicle(true);

    // Simulate API call
    setTimeout(() => {
      const vehicleData = {
        id: editingVehicleId || Math.random().toString(36).substr(2, 9),
        name: newVehicle.name,
        plate: newVehicle.plate.toUpperCase(),
        capacity: newVehicle.capacity ? `${newVehicle.capacity} Tons` : 'Unknown',
        location: newVehicle.location || country.locations[0],
        status: editingVehicleId
          ? (fleet.find(v => v.id === editingVehicleId)?.status || 'Available')
          : 'Available'
      } as FleetVehicle;

      if (editingVehicleId && onUpdateVehicle) {
        onUpdateVehicle(vehicleData);
      } else if (onAddVehicle) {
        onAddVehicle(vehicleData);
      }

      setIsAddingVehicle(false);
      setIsAddVehicleModalOpen(false);
      setNewVehicle({ name: '', plate: '', capacity: '', location: '' });
      setEditingVehicleId(null);
    }, 1000);
  };

  const openScheduleModal = (vehicle: FleetVehicle) => {
    setSelectedVehicleForSchedule(vehicle);
    setIsScheduleModalOpen(true);
  };

  const handleUpdateStatus = (status: 'Available' | 'Maintenance' | 'On Trip') => {
    if (selectedVehicleForSchedule && onUpdateVehicle) {
      onUpdateVehicle({ ...selectedVehicleForSchedule, status });
      setIsScheduleModalOpen(false);
      setSelectedVehicleForSchedule(null);
    }
  };

  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setWeight('');
    setGoodsType('General Crop');
    setSearchStep('input');
    setFoundProviders([]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900">{TRANSLATIONS[lang].logisticsHub}</h1>

        {role !== 'LOGISTICS' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {TRANSLATIONS[lang].requestTransport}
          </button>
        )}

        {role === 'LOGISTICS' && activeTab === 'fleet' && (
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {TRANSLATIONS[lang].addVehicle}
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-6 border-b border-slate-200">
        <div className="flex gap-4 overflow-x-auto pb-1 w-full hide-scrollbar">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'requests' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500'}`}
          >
            {TRANSLATIONS[lang].activeRequests}
          </button>
          {role === 'LOGISTICS' && (
            <button
              onClick={() => setActiveTab('fleet')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'fleet' ? 'border-green-600 text-green-600' : 'border-transparent text-slate-500'}`}
            >
              {TRANSLATIONS[lang].myFleet}
            </button>
          )}
        </div>

        {activeTab === 'requests' && (
          <div className="flex bg-slate-100 p-1 rounded-lg mb-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all active:scale-95 ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              title={TRANSLATIONS[lang].listView}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md transition-all active:scale-95 ${viewMode === 'map' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              title={TRANSLATIONS[lang].mapView}
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {activeTab === 'requests' && viewMode === 'map' ? (
        /* MAP VIEW */
        <div className="bg-white rounded-xl h-[500px] relative overflow-hidden border border-slate-300 shadow-sm z-0">
          <div ref={mapContainerRef} className="absolute inset-0 z-0 bg-slate-100"></div>

          {/* Legend/Info Overlay */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur p-2 rounded-lg text-xs text-slate-600 shadow-md border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-600 border border-white shadow-sm"></span>
                <span>Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-sm"></span>
                <span>Pending</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg text-xs text-slate-500 shadow-md border border-slate-200 z-[400]">
            {TRANSLATIONS[lang].activeOrders}: <strong>{requests.length}</strong>
          </div>
        </div>
      ) : activeTab === 'requests' ? (
        /* LIST VIEW */
        <div className="grid grid-cols-1 gap-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">{TRANSLATIONS[lang].noRequests}</p>
            </div>
          ) : (
            requests.map(req => {
              const isProcessing = processingJobId === req.id;
              const isAccepted = req.status === 'ACCEPTED';
              const showMap = activeMapId === req.id;

              return (
                <div key={req.id} className={`p-5 rounded-xl border transition-colors shadow-sm flex flex-col gap-4 ${isAccepted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${isAccepted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {req.goodsType}
                        </span>
                        <span className="text-xs text-slate-400">ID: {req.id}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-slate-800 font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{TRANSLATIONS[lang].from}: {req.origin}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>{TRANSLATIONS[lang].to}: {req.destination}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Package className="w-4 h-4" />
                          {req.weightKg}kg {TRANSLATIONS[lang].cargo}
                        </div>
                        {req.farmerName && (
                          <div className="flex items-center gap-2 text-sm text-slate-500 border-l border-slate-200 pl-4">
                            <User className="w-4 h-4" />
                            {req.farmerName}
                          </div>
                        )}
                      </div>
                      {req.assignedProviderName && (
                        <div className="flex items-center gap-1 mt-2 text-blue-600 font-medium text-sm">
                          <Truck className="w-4 h-4" />
                          {TRANSLATIONS[lang].assignedTo}: {req.assignedProviderName}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      {/* Map Toggle Button */}
                      <button
                        onClick={() => setActiveMapId(showMap ? null : req.id)}
                        className={`w-full sm:w-auto px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border active:scale-95
                             ${showMap
                            ? 'bg-slate-100 text-slate-700 border-slate-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        <Navigation className="w-4 h-4" />
                        {showMap ? TRANSLATIONS[lang].hideMap : TRANSLATIONS[lang].viewRoute}
                      </button>

                      {role === 'LOGISTICS' ? (
                        <button
                          onClick={() => !isAccepted && handleAcceptJob(req.id)}
                          disabled={isProcessing || isAccepted}
                          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 min-w-[150px] active:scale-95
                              ${isAccepted
                              ? 'bg-green-100 text-green-700 border border-green-200 cursor-default active:scale-100'
                              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'}
                              ${isProcessing ? 'opacity-80 cursor-wait' : ''}
                            `}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {TRANSLATIONS[lang].processing}...
                            </>
                          ) : isAccepted ? (
                            <>
                              <Check className="w-4 h-4" />
                              {TRANSLATIONS[lang].accepted}
                            </>
                          ) : (
                            TRANSLATIONS[lang].acceptJob
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 text-sm bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                          <CheckCircle2 className="w-4 h-4" />
                          {TRANSLATIONS[lang].status}: {req.status}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Route Map Preview */}
                  {showMap && (
                    <div className="mt-2 border-t border-slate-100 pt-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <MapPin className="w-3 h-3" /> {TRANSLATIONS[lang].pickupLocationPreview}
                        </h4>
                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Live Tracking
                        </span>
                      </div>

                      <div className="bg-slate-100 rounded-lg overflow-hidden h-[350px] border border-slate-200 relative">
                        {req.originCoords && req.destinationCoords ? (
                          <RouteMap
                            originCoords={req.originCoords as [number, number]}
                            destCoords={req.destinationCoords as [number, number]}
                            originName={req.origin}
                            destName={req.destination}
                            driverName={req.assignedProviderName}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                            No coordinates available for this route.
                          </div>
                        )}

                        <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur px-3 py-2 rounded-lg text-xs shadow-md font-medium text-slate-700 pointer-events-none border border-slate-200">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> From: {req.origin}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div> To: {req.destination}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Fleet Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleet.map(vehicle => (
            <div key={vehicle.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${vehicle.status === 'Available' ? 'bg-green-100 text-green-700' :
                    vehicle.status === 'Maintenance' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-1">{vehicle.name}</h3>
              <p className="text-sm text-slate-500 mb-4 font-mono">{vehicle.plate}</p>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>{TRANSLATIONS[lang].capacity}</span>
                  <span className="font-medium text-slate-900">{vehicle.capacity}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{TRANSLATIONS[lang].currentLocation}</span>
                  <span className="font-medium text-slate-900">{vehicle.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => openEditModal(vehicle)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-2 rounded-lg transition-all border border-transparent hover:border-slate-200 active:scale-95"
                >
                  <PenLine className="w-4 h-4" />
                  {TRANSLATIONS[lang].edit}
                </button>
                <button
                  onClick={() => openScheduleModal(vehicle)}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 py-2 rounded-lg transition-all border border-transparent hover:border-slate-200 active:scale-95"
                >
                  <CalendarClock className="w-4 h-4" />
                  {TRANSLATIONS[lang].schedule}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                {searchStep === 'input' ? TRANSLATIONS[lang].requestTransportTitle : TRANSLATIONS[lang].nearestProviders}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              {searchStep === 'input' ? (
                <form onSubmit={handleSearchProviders} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].originPickup}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full pl-9 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={`e.g. ${country.locations[0] || 'Farm Location'}`}
                        value={origin}
                        onChange={e => setOrigin(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].destination}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full pl-9 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g. Central Market"
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].estWeight}</label>
                      <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="number"
                          className="w-full pl-9 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="500"
                          value={weight}
                          onChange={e => setWeight(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].goodsType}</label>
                      <select
                        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        value={goodsType}
                        onChange={e => setGoodsType(e.target.value)}
                      >
                        <option>General Crop</option>
                        <option>Vegetables</option>
                        <option>Fruits</option>
                        <option>Grains</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      disabled={isSearching}
                      className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
                    >
                      {isSearching ? TRANSLATIONS[lang].findingDrivers : TRANSLATIONS[lang].findTransporters}
                      {!isSearching && <Search className="w-4 h-4" />}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-800 text-sm p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {TRANSLATIONS[lang].foundProviders} {foundProviders.length} {TRANSLATIONS[lang].near} {origin}
                  </div>

                  <div className="space-y-3">
                    {foundProviders.map(provider => (
                      <div key={provider.id} className="border border-slate-200 rounded-lg p-3 hover:border-green-400 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-3">
                            <img src={provider.imageUrl} alt={provider.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{provider.name}</h4>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                                {provider.rating} ({provider.completedTrips} trips)
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block mb-1">
                              {provider.distance} away
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded">
                          <span className="font-semibold">{TRANSLATIONS[lang].vehicle}:</span> {provider.vehicleType} <br />
                          <span className="font-semibold">{TRANSLATIONS[lang].rate}:</span> ~{provider.baseRatePerKm} {country.currency}/km
                        </div>

                        <button
                          onClick={() => handleBookProvider(provider)}
                          className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-all active:scale-95"
                        >
                          {TRANSLATIONS[lang].selectRequest}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSearchStep('input')}
                    className="w-full py-2 text-slate-500 text-sm hover:text-slate-800 active:scale-95 transition-all"
                  >
                    {TRANSLATIONS[lang].backToSearch}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Vehicle Modal */}
      {isAddVehicleModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                {editingVehicleId ? TRANSLATIONS[lang].editVehicle : TRANSLATIONS[lang].addNewVehicle}
              </h2>
              <button onClick={() => setIsAddVehicleModalOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOrEditVehicle} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].vehicleModel}</label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. Isuzu NPR"
                  value={newVehicle.name}
                  onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].licensePlate}</label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                  placeholder="e.g. KDA 123B"
                  value={newVehicle.plate}
                  onChange={e => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].capacity} (Tons)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g. 5"
                    value={newVehicle.capacity}
                    onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].baseLocation}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      className="w-full pl-9 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={country.locations[0]}
                      value={newVehicle.location}
                      onChange={e => setNewVehicle({ ...newVehicle, location: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAddingVehicle}
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
                >
                  {isAddingVehicle ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {TRANSLATIONS[lang].saving}
                    </>
                  ) : (editingVehicleId ? TRANSLATIONS[lang].updateVehicle : TRANSLATIONS[lang].addVehicleToFleet)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule / Status Modal */}
      {isScheduleModalOpen && selectedVehicleForSchedule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">{TRANSLATIONS[lang].updateStatus}</h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                {TRANSLATIONS[lang].changeStatusFor} <strong>{selectedVehicleForSchedule.name}</strong> ({selectedVehicleForSchedule.plate}).
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleUpdateStatus('Available')}
                  className={`w-full p-3 rounded-lg text-sm font-medium border flex items-center justify-between active:scale-95 transition-all
                      ${selectedVehicleForSchedule.status === 'Available' ? 'bg-green-50 border-green-500 text-green-700' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <span>{TRANSLATIONS[lang].available}</span>
                  {selectedVehicleForSchedule.status === 'Available' && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleUpdateStatus('On Trip')}
                  className={`w-full p-3 rounded-lg text-sm font-medium border flex items-center justify-between active:scale-95 transition-all
                      ${selectedVehicleForSchedule.status === 'On Trip' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <span>{TRANSLATIONS[lang].onTrip}</span>
                  {selectedVehicleForSchedule.status === 'On Trip' && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleUpdateStatus('Maintenance')}
                  className={`w-full p-3 rounded-lg text-sm font-medium border flex items-center justify-between active:scale-95 transition-all
                      ${selectedVehicleForSchedule.status === 'Maintenance' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  <span>{TRANSLATIONS[lang].maintenance}</span>
                  {selectedVehicleForSchedule.status === 'Maintenance' && <CheckCircle2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;