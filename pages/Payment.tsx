import React, { useState } from 'react';
import { CartItem, Country, Language, TRANSLATIONS } from '../types';
import { ArrowLeft, CreditCard, CheckCircle, Loader2, ShieldCheck, Truck } from 'lucide-react';

interface PaymentProps {
  cartItems: CartItem[];
  totalAmount: number;
  country: Country;
  onBack: () => void;
  onComplete: () => void;
  lang: Language;
}

const Payment: React.FC<PaymentProps> = ({ 
  cartItems, 
  totalAmount, 
  country, 
  onBack, 
  onComplete,
  lang 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const t = TRANSLATIONS[lang];
  const serviceFee = totalAmount * 0.02;
  const finalTotal = totalAmount + serviceFee;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
        <p className="text-slate-600 mb-8">
          Your order has been placed successfully. You will receive a confirmation message shortly.
        </p>
        
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Order ID</span>
              <span className="font-mono font-medium">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-medium">{finalTotal.toLocaleString()} {country.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Items</span>
              <span className="font-medium">{cartItems.length} products</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Secure Checkout
            </h2>

            <form onSubmit={handlePayment}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'mobile_money' 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="font-bold text-lg">M</span>
                    </div>
                    <span className="font-medium">Mobile Money</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-green-500 bg-green-50 text-green-700' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Card Payment</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'mobile_money' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. +254 712 345 678"
                      className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <p className="text-xs text-slate-500 mt-1">You will receive a prompt on your phone to complete the payment.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full mt-8 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay {finalTotal.toLocaleString()} {country.currency}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 sticky top-24">
            <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="text-slate-500 text-xs">{item.cartQuantity} x {item.price} {country.currency}</div>
                  </div>
                  <div className="font-medium text-slate-900">
                    {(item.price * item.cartQuantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{totalAmount.toLocaleString()} {country.currency}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Service Fee (2%)</span>
                <span>{serviceFee.toLocaleString()} {country.currency}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Delivery
                </span>
                <span className="text-green-600 font-medium">Calculated later</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                <span>Total</span>
                <span>{finalTotal.toLocaleString()} {country.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
