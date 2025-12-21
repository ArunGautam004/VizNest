import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/shop" className="text-indigo-600 hover:underline text-lg">Continue Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.cartId} className="bg-white rounded-2xl p-6 shadow-sm flex gap-6">
                <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-xl" />

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  {item.customization && <p className="text-sm text-gray-500 mt-1">Customized</p>}
                  <p className="text-lg font-bold text-indigo-600 mt-4">${item.price}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="p-3 hover:bg-gray-100">
                      <Minus size={16} />
                    </button>
                    <span className="px-6 py-3 font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="p-3 hover:bg-gray-100">
                      <Plus size={16} />
                    </button>
                  </div>

                  <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm h-fit">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-center hover:bg-indigo-700 transition block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;