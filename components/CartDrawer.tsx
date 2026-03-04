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
        {/* Header */}
        <div className="p-6 flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-2xl text-green-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Your Cart</h2>
              <p className="text-sm text-slate-500 font-medium">{cartItems.length} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6">
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
              <div key={item.id} className="border-b border-slate-200 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0 flex flex-col gap-4">
                {/* Top Half: Image & Details */}
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover mix-blend-multiply border border-slate-100/50" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-start">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-medium text-slate-800 text-sm line-clamp-2">{item.name}</h3>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-slate-900 text-base">
                          {item.price.toLocaleString()} {country.currency}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-1">Farmer: {item.farmerName}</p>
                    <p className="text-xs text-green-600 mt-1 font-medium bg-green-50 w-max px-2 py-0.5 rounded-sm">In Stock</p>
                  </div>
                </div>

                {/* Bottom Half: Actions */}
                <div className="flex justify-between items-center pt-2">
                  {/* Remove Button (Left) */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 hover:bg-orange-50 px-2 py-1.5 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>

                  {/* Quantity Controls (Right) */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.cartQuantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-slate-400 hover:bg-slate-500 text-white rounded shadow-sm disabled:opacity-50 transition-colors"
                      disabled={item.cartQuantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center text-slate-800">{item.cartQuantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-[#f97316] hover:bg-orange-600 text-white rounded shadow-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 mt-auto">
            <div className="space-y-3 text-sm text-slate-500 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-700">{total.toLocaleString()} {country.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee (2%)</span>
                <span className="font-medium text-slate-700">{(total * 0.02).toLocaleString()} {country.currency}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-200/60">
                <span>Total</span>
                <span>{(total * 1.02).toLocaleString()} {country.currency}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-[#16a34a] text-white py-3.5 rounded-xl font-bold hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
