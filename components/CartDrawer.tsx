import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { CartItem, Country } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  country: Country;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  country
}) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg text-green-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
              <p className="text-sm text-slate-500">{cartItems.length} items</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="text-green-600 font-medium hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.farmerName}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="font-bold text-green-700">
                      {item.price} {country.currency}
                      <span className="text-xs font-normal text-slate-400 ml-1">/ {item.unit}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.cartQuantity - 1))}
                        className="p-1 hover:bg-white rounded-md text-slate-500 hover:text-slate-700 transition-colors shadow-sm disabled:opacity-50"
                        disabled={item.cartQuantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.cartQuantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
                        className="p-1 hover:bg-white rounded-md text-slate-500 hover:text-slate-700 transition-colors shadow-sm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="self-start p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{total.toLocaleString()} {country.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee (2%)</span>
                <span className="font-medium">{(total * 0.02).toLocaleString()} {country.currency}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>{(total * 1.02).toLocaleString()} {country.currency}</span>
              </div>
            </div>
            
            <button 
              onClick={onCheckout}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
