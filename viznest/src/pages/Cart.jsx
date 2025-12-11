import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // 1. Import Auth
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const cartContext = useCart();
  const { user } = useAuth(); // 2. Get User status
  const navigate = useNavigate();
  
  if (!cartContext) return <div className="p-20 text-center">Loading...</div>;

  const { cart, removeFromCart } = cartContext;
  const safeCart = cart || []; 
  const total = safeCart.reduce((sum, item) => sum + (item.price || 0), 0);

  // 3. New Checkout Logic
  const handleCheckout = () => {
    if (user) {
      // User is logged in, proceed normally
      navigate('/checkout');
    } else {
      // User is NOT logged in. Send to login, but remember we wanted to checkout.
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  if (safeCart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <Link to="/shop" className="block w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg mt-6">
            Start Designing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart ({safeCart.length})</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {safeCart.map((item) => (
            <div key={item.cartId} className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                 <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                 {item.customization && item.mask && (
                   <div className="absolute inset-0 z-10 mix-blend-multiply" style={{ backgroundColor: item.customization.colorHex, maskImage: `url(${item.mask})`, WebkitMaskImage: `url(${item.mask})`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', opacity: 0.8 }} />
                 )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.customization ? 'Customized' : 'Standard'}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-indigo-600">${(item.price || 0).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.cartId)} className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center justify-end gap-1 w-full"><Trash2 size={16}/> Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-8 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
            
            {/* 4. Use the new handler instead of direct navigate */}
            <button 
              onClick={handleCheckout}
              className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg"
            >
              Proceed to Checkout
            </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;