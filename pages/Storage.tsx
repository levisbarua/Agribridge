import React, { useState, useEffect } from 'react';
import { StorageFacility, UserRole, Country, Language, TRANSLATIONS } from '../types';
import { Warehouse, Snowflake, MapPin, Thermometer, Search, Filter, Calendar, X, CheckCircle2, Loader2, Check, Plus, PenLine, Save } from 'lucide-react';

interface StorageProps {
  facilities: StorageFacility[];
  role: UserRole;
  country: Country;
  onAddFacility?: (facility: StorageFacility) => void;
  onUpdateFacility?: (facility: StorageFacility) => void;
  lang: Language;
}

const Storage: React.FC<StorageProps> = ({ facilities, role, country, onAddFacility, onUpdateFacility, lang }) => {
  const [produceCategory, setProduceCategory] = useState('ALL');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<(StorageFacility & { distance?: number })[]>(facilities);

  // Booking State (Buyer/Farmer)
  const [bookingFacility, setBookingFacility] = useState<StorageFacility | null>(null);
  const [bookingDuration, setBookingDuration] = useState('7');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Manage Facility State (Warehouse Owner)
  const [managingFacility, setManagingFacility] = useState<StorageFacility | null>(null);
  const [editForm, setEditForm] = useState<Partial<StorageFacility>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Add Facility State (Warehouse Owner)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newFacility, setNewFacility] = useState<Partial<StorageFacility>>({
    name: '', type: 'COLD_ROOM', capacityKg: 1000, pricePerKgDaily: 1, location: ''
  });

  // Booking Interaction State
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedFacilities, setBookedFacilities] = useState<string[]>([]);

  useEffect(() => {
    setResults(facilities);
  }, [facilities]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate search delay for realism
    setTimeout(() => {
      let filtered = facilities.filter(f => {
        // Filter by Capacity
        if (quantity && f.availableKg < Number(quantity)) return false;

        // Filter by Type
        if (produceCategory === 'PERISHABLE') {
          // Cold rooms only
          if (f.type !== 'COLD_ROOM') return false;
        } else if (produceCategory === 'DRY') {
          // Dry storage only
          if (f.type === 'COLD_ROOM') return false;
        }

        return true;
      });

      // Location/Distance Logic
      if (location.trim()) {
        filtered = filtered.map(f => {
          // Simple mock distance logic: if location name matches partially, it's close.
          const isLocal = f.location.toLowerCase().includes(location.toLowerCase()) || 
                          location.toLowerCase().includes(f.location.toLowerCase());
          
          // Randomize distance to look realistic
          const distance = isLocal 
            ? Math.floor(Math.random() * 15) + 2 
            : Math.floor(Math.random() * 300) + 50;
            
          return { ...f, distance };
        }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      } else {
        // If no location, map without distance
        filtered = filtered.map(f => ({ ...f, distance: undefined }));
      }

      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const handleConfirmBooking = () => {
     if (!bookingFacility) return;
     
     setIsProcessing(true);
     
     // Simulate API call delay
     setTimeout(() => {
         setBookedFacilities(prev => [...prev, bookingFacility.id]);
         setIsProcessing(false);
         setBookingFacility(null);
     }, 2000);
  };

  const handleAddFacilitySubmit = () => {
    if (!newFacility.name || !newFacility.capacityKg) return;
    
    setIsAdding(true);
    setTimeout(() => {
      const facility: StorageFacility = {
        id: Math.random().toString(36).substr(2, 9),
        ownerId: 'me',
        name: newFacility.name!,
        type: newFacility.type as 'COLD_ROOM' | 'WAREHOUSE' | 'SILO',
        location: newFacility.location || country.locations[0],
        capacityKg: Number(newFacility.capacityKg),
        availableKg: Number(newFacility.capacityKg), // Initially fully available
        pricePerKgDaily: Number(newFacility.pricePerKgDaily),
        temperature: newFacility.type === 'COLD_ROOM' ? 4 : undefined,
        imageUrl: newFacility.type === 'COLD_ROOM' 
          ? 'https://loremflickr.com/400/300/warehouse,cold' 
          : 'https://loremflickr.com/400/300/silo,grain'
      };

      if (onAddFacility) onAddFacility(facility);
      
      setIsAdding(false);
      setIsAddModalOpen(false);
      setNewFacility({ name: '', type: 'COLD_ROOM', capacityKg: 1000, pricePerKgDaily: 1, location: '' });
    }, 1500);
  };

  const openManageModal = (facility: StorageFacility) => {
    setManagingFacility(facility);
    setEditForm({
      availableKg: facility.availableKg,
      pricePerKgDaily: facility.pricePerKgDaily,
      temperature: facility.temperature
    });
  };

  const handleUpdateFacilitySubmit = () => {
    if (!managingFacility || !onUpdateFacility) return;
    
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateFacility({
        ...managingFacility,
        ...editForm
      });
      setIsUpdating(false);
      setManagingFacility(null);
    }, 1500);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{TRANSLATIONS[lang].storageHub}</h1>
          <p className="text-slate-500">{TRANSLATIONS[lang].storageDescription} {country.name}.</p>
        </div>
        {role === 'WAREHOUSE' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {TRANSLATIONS[lang].addFacility}
          </button>
        )}
      </div>

      {/* Search Section - Hidden for Warehouse Role */}
      {role !== 'WAREHOUSE' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-green-600" />
            {TRANSLATIONS[lang].findStorage}
          </h3>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{TRANSLATIONS[lang].produceType}</label>
              <div className="relative">
                <select 
                  value={produceCategory}
                  onChange={e => setProduceCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50"
                >
                  <option value="ALL">{TRANSLATIONS[lang].allCategories}</option>
                  <option value="PERISHABLE">{TRANSLATIONS[lang].perishable}</option>
                  <option value="DRY">{TRANSLATIONS[lang].dryGoods}</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{TRANSLATIONS[lang].quantityToStore} (kg)</label>
              <input 
                type="number" 
                placeholder="e.g. 500"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">{TRANSLATIONS[lang].yourLocation}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={`e.g. ${country.locations[0]}`}
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button 
                type="submit"
                disabled={isSearching}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
              >
                {isSearching ? TRANSLATIONS[lang].searching : TRANSLATIONS[lang].searchFacilities}
                {!isSearching && <Search className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
           <Warehouse className="w-12 h-12 text-slate-300 mx-auto mb-3" />
           <p className="text-slate-500">{TRANSLATIONS[lang].noFacilities}</p>
           <button onClick={() => { setResults(facilities); setProduceCategory('ALL'); setQuantity(''); setLocation(''); }} className="mt-2 text-green-600 font-medium hover:underline">
             {TRANSLATIONS[lang].clearFilters}
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(facility => {
            const isBooked = bookedFacilities.includes(facility.id);
            return (
              <div key={facility.id} className={`bg-white rounded-xl border transition-all overflow-hidden flex flex-col group ${isBooked ? 'border-green-200 shadow-md ring-1 ring-green-100' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <img src={facility.imageUrl} alt={facility.name} className={`w-full h-full object-cover transition-transform duration-500 ${isBooked ? 'opacity-80' : 'group-hover:scale-105'}`} />
                  
                  {isBooked && (
                    <div className="absolute inset-0 bg-green-900/10 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-white/95 text-green-700 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm flex items-center gap-2 transform -rotate-2">
                        <CheckCircle2 className="w-4 h-4 fill-green-600 text-white" />
                        {TRANSLATIONS[lang].booked}
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                     <span className="bg-white/95 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 flex items-center gap-1 shadow-sm">
                       {facility.type === 'COLD_ROOM' ? <Snowflake className="w-3 h-3 text-blue-500" /> : <Warehouse className="w-3 h-3 text-slate-500" />}
                       {facility.type.replace('_', ' ')}
                     </span>
                     {facility.type === 'COLD_ROOM' && (
                       <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-sm">
                         <Thermometer className="w-3 h-3" />
                         {facility.temperature}°C
                       </span>
                     )}
                  </div>
                  {facility.distance !== undefined && (
                     <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
                        <MapPin className="w-3 h-3" />
                        {facility.distance} {TRANSLATIONS[lang].kmAway}
                     </div>
                  )}
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{facility.name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {facility.location}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{TRANSLATIONS[lang].capacity}</div>
                      <div className="font-bold text-slate-700">{facility.capacityKg.toLocaleString()} kg</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">{TRANSLATIONS[lang].status}</div>
                      {isBooked ? (
                        <div className="font-bold text-green-700 flex items-center gap-1">
                           <Check className="w-3 h-3" /> {TRANSLATIONS[lang].booked}
                        </div>
                      ) : (
                        <div className="font-bold text-green-600">{facility.availableKg.toLocaleString()} {TRANSLATIONS[lang].kgFree}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-slate-900">{facility.pricePerKgDaily} <span className="text-sm font-normal text-slate-500">{country.currency}</span></span>
                      <span className="text-xs text-slate-400 block">{TRANSLATIONS[lang].perKgDay}</span>
                    </div>
                    <button 
                      onClick={() => role === 'WAREHOUSE' ? openManageModal(facility) : setBookingFacility(facility)}
                      disabled={isBooked && role !== 'WAREHOUSE'}
                      className={`w-full sm:w-auto px-6 py-2.5 text-sm font-medium rounded-lg transition-all shadow-sm flex-grow sm:flex-grow-0 text-center flex items-center justify-center gap-2 active:scale-95
                        ${isBooked && role !== 'WAREHOUSE'
                          ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200' 
                          : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                      {role === 'WAREHOUSE' ? (
                        <>
                          <PenLine className="w-4 h-4" />
                          {TRANSLATIONS[lang].manage}
                        </>
                      ) : isBooked ? TRANSLATIONS[lang].reserved : TRANSLATIONS[lang].bookSpace}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal (Buyer/Farmer) */}
      {bookingFacility && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h2 className="text-xl font-bold text-slate-900">{TRANSLATIONS[lang].bookStorageSpace}</h2>
               <button onClick={() => setBookingFacility(null)} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all rounded">
                 <X className="w-6 h-6" />
               </button>
             </div>
             
             <div className="p-6 space-y-4">
               <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-4">
                  <img src={bookingFacility.imageUrl} className="w-16 h-16 rounded-md object-cover" />
                  <div>
                    <h3 className="font-bold text-slate-900">{bookingFacility.name}</h3>
                    <p className="text-sm text-slate-500">{bookingFacility.location}</p>
                    <div className="mt-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded inline-block">
                      {bookingFacility.pricePerKgDaily} {country.currency}/kg {TRANSLATIONS[lang].daily}
                    </div>
                  </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].startDate}</label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      className="w-full pl-10 p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                    />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].durationDays}</label>
                 <input 
                   type="number" 
                   min="1"
                   className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                   value={bookingDuration}
                   onChange={e => setBookingDuration(e.target.value)}
                 />
               </div>
               
               <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-2">
                 <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                 <p>{TRANSLATIONS[lang].facilityHandles} {bookingFacility.type === 'COLD_ROOM' ? TRANSLATIONS[lang].perishable : TRANSLATIONS[lang].dryGoods}.</p>
               </div>
             </div>

             <div className="p-6 border-t border-slate-100 flex gap-3">
               <button 
                 onClick={() => setBookingFacility(null)}
                 disabled={isProcessing}
                 className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-all active:scale-95 disabled:opacity-50"
               >
                 {TRANSLATIONS[lang].cancel}
               </button>
               <button 
                 onClick={handleConfirmBooking}
                 disabled={isProcessing}
                 className="flex-1 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait active:scale-95"
               >
                 {isProcessing ? (
                   <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {TRANSLATIONS[lang].booking}...
                   </>
                 ) : (
                   TRANSLATIONS[lang].confirmBooking
                 )}
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Facility Modal (Warehouse Owner) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">{TRANSLATIONS[lang].addFacilityTitle}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all rounded">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].facilityName}</label>
                  <input 
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    placeholder="e.g. Nairobi Cold Hub"
                    value={newFacility.name || ''}
                    onChange={e => setNewFacility({...newFacility, name: e.target.value})}
                  />
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].location}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      className="w-full pl-9 p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                      placeholder={`e.g. ${country.locations[0]} Industrial`}
                      value={newFacility.location || ''}
                      onChange={e => setNewFacility({...newFacility, location: e.target.value})}
                    />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].type}</label>
                    <select 
                      className="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={newFacility.type || 'COLD_ROOM'}
                      onChange={e => setNewFacility({...newFacility, type: e.target.value as any})}
                    >
                      <option value="COLD_ROOM">{TRANSLATIONS[lang].coldRoom}</option>
                      <option value="SILO">{TRANSLATIONS[lang].grainSilo}</option>
                      <option value="WAREHOUSE">{TRANSLATIONS[lang].generalWarehouse}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].capacity} (kg)</label>
                    <input 
                      type="number"
                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                      value={newFacility.capacityKg ?? ''}
                      onChange={e => setNewFacility({...newFacility, capacityKg: Number(e.target.value)})}
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].pricePerKg} ({country.currency})</label>
                  <input 
                    type="number"
                    step="0.5"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                    value={newFacility.pricePerKgDaily ?? ''}
                    onChange={e => setNewFacility({...newFacility, pricePerKgDaily: Number(e.target.value)})}
                  />
               </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
               <button 
                 onClick={() => setIsAddModalOpen(false)}
                 disabled={isAdding}
                 className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-all active:scale-95 disabled:opacity-50"
               >
                 {TRANSLATIONS[lang].cancel}
               </button>
               <button 
                 onClick={handleAddFacilitySubmit}
                 disabled={isAdding || !newFacility.name}
                 className="flex-1 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
               >
                 {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                 {TRANSLATIONS[lang].saveFacility}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Facility Modal (Warehouse Owner) */}
      {managingFacility && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h2 className="text-xl font-bold text-slate-900">{TRANSLATIONS[lang].manageFacility}</h2>
               <button onClick={() => setManagingFacility(null)} className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all rounded">
                 <X className="w-6 h-6" />
               </button>
             </div>
             
             <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg">
                   <img src={managingFacility.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
                   <div>
                     <h3 className="font-bold text-slate-900">{managingFacility.name}</h3>
                     <p className="text-sm text-slate-500">{TRANSLATIONS[lang].totalCapacity}: {managingFacility.capacityKg.toLocaleString()} kg</p>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].availableSpace} (kg)</label>
                   <div className="flex gap-2">
                     <input 
                       type="number"
                       className="flex-1 p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                       value={editForm.availableKg ?? ''}
                       max={managingFacility.capacityKg}
                       onChange={e => setEditForm({...editForm, availableKg: Number(e.target.value)})}
                     />
                     <button 
                       onClick={() => setEditForm({...editForm, availableKg: managingFacility.capacityKg})}
                       className="px-3 text-xs font-bold text-green-700 bg-green-100 rounded-lg hover:bg-green-200 active:scale-95 transition-all"
                     >
                       {TRANSLATIONS[lang].resetMax}
                     </button>
                   </div>
                   <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-300" 
                        style={{ width: `${((editForm.availableKg || 0) / managingFacility.capacityKg) * 100}%` }}
                      ></div>
                   </div>
                   <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0 kg</span>
                      <span>{Math.round(((editForm.availableKg || 0) / managingFacility.capacityKg) * 100)}{TRANSLATIONS[lang].percentFree}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].priceDay}</label>
                    <input 
                       type="number"
                       step="0.1"
                       className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                       value={editForm.pricePerKgDaily ?? ''}
                       onChange={e => setEditForm({...editForm, pricePerKgDaily: Number(e.target.value)})}
                    />
                  </div>
                  {managingFacility.type === 'COLD_ROOM' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">{TRANSLATIONS[lang].temp}</label>
                      <input 
                         type="number"
                         step="0.5"
                         className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                         value={editForm.temperature ?? ''}
                         onChange={e => setEditForm({...editForm, temperature: Number(e.target.value)})}
                      />
                    </div>
                  )}
                </div>
             </div>

             <div className="p-6 border-t border-slate-100 flex gap-3">
               <button 
                 onClick={() => setManagingFacility(null)}
                 disabled={isUpdating}
                 className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-all active:scale-95 disabled:opacity-50"
               >
                 {TRANSLATIONS[lang].cancel}
               </button>
               <button 
                 onClick={handleUpdateFacilitySubmit}
                 disabled={isUpdating}
                 className="flex-1 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95"
               >
                 {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
                 {TRANSLATIONS[lang].updateFacility}
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Storage;