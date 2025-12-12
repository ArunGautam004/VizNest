import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // 1. Import Auth
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, MapPin, User as UserIcon } from 'lucide-react';

const Checkout = () => {
  const { cart } = useCart() || {};
  const { user } = useAuth(); // 2. Get User Data
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no cart
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/shop');
    }
    // New: If no user, kick them back to login (security fallback)
    if (!user) {
        navigate('/login', { state: { from: '/checkout' } });
    }
  }, [cart, user, navigate]);

  if (!cart || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/order-success');
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/cart')} className="p-2 hover:bg-white rounded-full transition">
            <ArrowLeft size={24} className="text-gray-600"/>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: Shipping Form (Auto-Filled) */}
          <div className="space-y-8">
            
            {/* Auto-Filled Banner */}
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3 text-indigo-800">
               <UserIcon size={20} />
               <p className="text-sm">Logged in as <strong>{user.name}</strong>. We've filled your details.</p>
            </div>

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-indigo-600" size={20}/> Shipping Address
              </h2>
              
              {/* FULL NAME (Auto-filled) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                    required 
                    type="text" 
                    defaultValue={user.name} // AUTO FILL
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50" 
                />
              </div>

              {/* EMAIL (Auto-filled & Disabled usually) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                    required 
                    type="email" 
                    defaultValue={user.email} // AUTO FILL
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50" 
                />
              </div>

              {/* ADDRESS (Auto-filled) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input 
                    required 
                    type="text" 
                    defaultValue={user.address} // AUTO FILL
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input required type="text" defaultValue="Design City" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="10001" />
                </div>
              </div>
            </form>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-indigo-600" size={20}/> Payment Method
              </h2>
              <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-lg flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-4 border-indigo-600"></div>
                <span className="font-bold text-indigo-900">Credit Card (Ending in 4242)</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                       <img src={item.image} className="w-full h-full object-contain relative z-0" alt={item.name}/>
                       {item.customization && item.mask && (
                         <div className="absolute inset-0 z-10 mix-blend-multiply" style={{ backgroundColor: item.customization.colorHex, maskImage: `url(${item.mask})`, WebkitMaskImage: `url(${item.mask})`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center' }} />
                       )}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-900">{item.name}</p>
                      {item.customization ? (
                        <p className="text-xs text-gray-500">{item.customization.colorName} / {item.customization.material}</p>
                      ) : (
                        <p className="text-xs text-gray-500">Standard</p>
                      )}
                    </div>
                    <p className="font-bold text-sm">${(item.price || 0).toFixed(0)}</p>
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
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-4 border-t border-gray-100 mt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? 'Processing...' : `Confirm & Pay $${total.toFixed(2)}`}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;