import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    clearCart();
    window.location.href = '/order-success';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
            <form className="space-y-6">
              <input type="text" placeholder="Full Name" className="w-full px-6 py-4 border rounded-xl" required />
              <input type="email" placeholder="Email" className="w-full px-6 py-4 border rounded-xl" required />
              <input type="text" placeholder="Address" className="w-full px-6 py-4 border rounded-xl" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="px-6 py-4 border rounded-xl" required />
                <input type="text" placeholder="ZIP Code" className="px-6 py-4 border rounded-xl" required />
              </div>
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

            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-5 rounded-xl font-bold text-xl hover:bg-indigo-700 transition"
            >
              Complete Purchase
            </button>

            <p className="text-center mt-6 text-sm text-gray-500">
              Demo: Click to simulate successful order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;