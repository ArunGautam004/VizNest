import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to checkout');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Post to backend
      const orderData = {
        items: cart.map(item => ({
          product: item._id || item.id, // Use Mongo _id if available
          quantity: item.quantity,
          price: item.price,
          customization: item.customization
        })),
        total: cartTotal
      };
      await addOrder(orderData);
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Link to="/shop">Cart empty, shop now</Link></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Checkout</h1>
        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 border rounded-xl" 
                required 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 border rounded-xl" 
                required 
              />
              <input 
                type="text" 
                placeholder="Address" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-6 py-4 border rounded-xl" 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="w-full px-6 py-4 border rounded-xl" required />
                <input type="text" placeholder="ZIP Code" className="w-full px-6 py-4 border rounded-xl" required />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-5 rounded-xl font-bold text-xl hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Purchase'}
              </button>
            </form>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.cartId} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 text-xl font-bold flex justify-between">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-center mt-6 text-sm text-gray-500">
              Secure checkout. Free shipping on orders over $100.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;