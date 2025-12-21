import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, MapPin, Smartphone, Banknote, ShieldCheck, Truck 
} from 'lucide-react';

const Checkout = () => {
  const { cart } = useCart() || {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'cod'

  // Redirect Logic
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/shop');
    }
    if (!user) {
        // Send to login, then redirect back here
        navigate('/login', { state: { from: '/checkout' } });
    }
  }, [cart, user, navigate]);

  if (!cart || !user) return <div className="min-h-screen flex items-center justify-center">Loading Secure Checkout...</div>;

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate Payment Processing
    setTimeout(() => {
      setIsLoading(false);
      navigate('/order-success');
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/cart')} className="p-2 hover:bg-white rounded-full transition">
            <ArrowLeft size={24} className="text-gray-600"/>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: Shipping & Payment Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. SHIPPING DETAILS */}
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-indigo-600" size={20}/> Shipping Address
              </h2>
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input required type="text" defaultValue={user.name} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input required type="email" defaultValue={user.email} className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
              </div>

              {/* Phone (New) */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input required type="tel" defaultValue={user.phone} placeholder="+1 (555) 000-0000" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
              </div>

              {/* Address Fields */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                <input required type="text" defaultValue={user.street} placeholder="123 Design St" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <input required type="text" defaultValue={user.city} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                  <input required type="text" defaultValue={user.state} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code</label>
                  <input required type="text" defaultValue={user.zipCode} placeholder="10001" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
              </div>
            </form>

            {/* 2. PAYMENT OPTIONS */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="text-indigo-600" size={20}/> Payment Method
              </h2>
              
              {/* Selection Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Option 1: CARD */}
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 hover:border-indigo-200 text-gray-600'
                  }`}
                >
                  <CreditCard className="mb-2" size={24}/>
                  <span className="font-bold text-sm">Card</span>
                </button>

                {/* Option 2: UPI */}
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'upi' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 hover:border-indigo-200 text-gray-600'
                  }`}
                >
                  <Smartphone className="mb-2" size={24}/>
                  <span className="font-bold text-sm">UPI / Netbanking</span>
                </button>

                {/* Option 3: COD */}
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cod' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 hover:border-indigo-200 text-gray-600'
                  }`}
                >
                  <Banknote className="mb-2" size={24}/>
                  <span className="font-bold text-sm">Cash on Delivery</span>
                </button>
              </div>

              {/* DYNAMIC CONTENT BASED ON SELECTION */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                        <input type="text" placeholder="123" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                   <div className="animate-fade-in text-center py-4">
                     <p className="font-medium text-gray-800 mb-2">Pay via UPI</p>
                     <input type="text" placeholder="username@upi" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 mb-2" />
                     <p className="text-xs text-gray-500">You will receive a payment request on your UPI app.</p>
                   </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="animate-fade-in flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    <Truck size={20}/>
                    <p className="text-sm font-bold">Pay via Cash or UPI upon delivery.</p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-200">
                       <img src={item.image} className="w-full h-full object-contain relative z-0" alt={item.name}/>
                       {item.customization && item.mask && (
                         <div className="absolute inset-0 z-10 mix-blend-multiply" style={{ backgroundColor: item.customization.colorHex, maskImage: `url(${item.mask})`, WebkitMaskImage: `url(${item.mask})`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', opacity: 0.8 }} />
                       )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                      {item.customization ? (
                        <p className="text-xs text-gray-500">{item.customization.colorName} / {item.customization.material}</p>
                      ) : (
                        <p className="text-xs text-gray-500">Standard</p>
                      )}
                    </div>
                    <p className="font-bold text-sm text-gray-900">${(item.price || 0).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (Estimated)</span>
                  <span>${(total * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t border-gray-100 mt-4">
                  <span>Total</span>
                  <span>${(total * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>Pay ${(total * 1.05).toFixed(2)}</>
                )}
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12}/> Secure SSL Encryption
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;