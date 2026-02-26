import React, { useState, useRef } from 'react';
import { Product, UserRole, Language, TRANSLATIONS, Country } from '../types';
import { Search, Filter, Plus, Clock, MapPin, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { getShelfLifePrediction } from '../services/geminiService';

interface MarketplaceProps {
  products: Product[];
  role: UserRole;
  onAddProduct: (p: Product) => void;
  lang: Language;
  country: Country;
  onAddToCart?: (p: Product) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ products, role, onAddProduct, lang, country, onAddToCart }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const t = TRANSLATIONS[lang];

  // New Listing State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Vegetables',
    price: 0,
    quantity: 0,
    description: '',
    location: '',
    imageUrl: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiPrediction, setAiPrediction] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      // Use uploaded image or generate a relevant image URL based on the product name
      let finalImageUrl = newProduct.imageUrl;
      
      if (!finalImageUrl) {
        const keywords = newProduct.name.split(' ').join(',');
        finalImageUrl = `https://loremflickr.com/400/300/${encodeURIComponent(keywords)},produce`;
      }
      
      onAddProduct({
        ...newProduct,
        id: Math.random().toString(36).substr(2, 9),
        farmerId: 'me',
        farmerName: 'My Farm',
        harvestDate: new Date().toISOString().split('T')[0],
        imageUrl: finalImageUrl,
        unit: 'kg',
      } as Product);
      setIsModalOpen(false);
      setNewProduct({ name: '', price: 0, quantity: 0, description: '', imageUrl: '' });
      setAiPrediction('');
    }
  };

  const handleAnalyze = async () => {
    if (!newProduct.name) return;
    setIsAnalyzing(true);
    const result = await getShelfLifePrediction(
      newProduct.name || '',
      new Date().toISOString(),
      newProduct.description || ''
    );
    setAiPrediction(result || '');
    setIsAnalyzing(false);
  };

  const handleAddToCartClick = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      alert(`Order placed successfully for ${product.name}!`);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase()) || 
    p.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.marketplace}</h1>
          <p className="text-slate-500">Fresh produce directly from farmers in {country.name}.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search crops, location..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          {role === 'FARMER' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 active:bg-green-800 active:scale-95 transition-all whitespace-nowrap shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">{t.newListing}</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-slate-700 shadow-sm">
                {product.category}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md text-sm">
                  {product.price} {country.currency}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                   <MapPin className="w-4 h-4 text-slate-400" />
                   {product.location}
                </div>
                <div className="flex items-center gap-2">
                   <Clock className="w-4 h-4 text-slate-400" />
                   Harvested: {product.harvestDate}
                </div>
              </div>

              {role !== 'FARMER' && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={() => handleAddToCartClick(product)}
                    className="flex-1 bg-slate-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-slate-800 active:bg-slate-950 active:scale-95 transition-all shadow-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Add New Listing</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 active:scale-90 transition-all rounded p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />

                {newProduct.imageUrl ? (
                  <div className="relative h-48 w-full rounded-lg overflow-hidden border border-slate-200 group bg-slate-50">
                    <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => {
                        setNewProduct(prev => ({...prev, imageUrl: ''}));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-white text-slate-700 p-1.5 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors active:scale-90"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition-all gap-2 group active:scale-[0.99]"
                  >
                    <div className="p-3 bg-slate-100 rounded-full group-hover:bg-white transition-colors shadow-sm">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">Click to upload photo</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input 
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                  value={newProduct.name || ''}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g. Red Onions"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Price ({country.currency})</label>
                   <input 
                     type="number"
                     className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                     value={newProduct.price ?? ''}
                     onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                   <input 
                     type="number"
                     className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                     value={newProduct.quantity ?? ''}
                     onChange={(e) => setNewProduct({...newProduct, quantity: Number(e.target.value)})}
                   />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  className="w-full border border-slate-200 rounded-lg p-2.5 h-24 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none transition-all"
                  value={newProduct.description || ''}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                ></textarea>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                    <Loader2 className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : 'hidden'}`} />
                    AI Shelf-Life Predictor
                  </h4>
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !newProduct.name}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 transition-all active:scale-95 font-medium"
                  >
                    Analyze
                  </button>
                </div>
                <p className="text-sm text-blue-700 min-h-[20px] leading-relaxed">
                  {aiPrediction || "Enter details and click Analyze for storage tips."}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 text-slate-600 font-medium hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProduct}
                className="px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 active:bg-green-800 active:scale-95 transition-all shadow-md shadow-green-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Post Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;