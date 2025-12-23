import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext'; // FIX: Add for order creation
import { MapPin, Phone, CreditCard, Check, AlertCircle, Package } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrders(); // FIX: Use context for orders
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  const [formData, setFormData] = useState({
    street: '', // FIX: Renamed from address
    city: '',
    state: '',
    zip: '', // FIX: Renamed from postalCode
    country: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        // FIX: Map for display
        const mappedAddresses = (data.addresses || []).map(addr => ({
          ...addr,
          address: addr.street,
          postalCode: addr.zip
        }));
        setSavedAddresses(mappedAddresses);
        if (mappedAddresses.length > 0) {
          setSelectedAddressId(mappedAddresses[0]._id);
          setFormData({
            street: mappedAddresses[0].street,
            city: mappedAddresses[0].city,
            state: mappedAddresses[0].state || '',
            zip: mappedAddresses[0].zip,
            country: mappedAddresses[0].country,
            phone: mappedAddresses[0].phone
          });
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      // Use selected or new address
      const shippingAddress = selectedAddressId === 'new' 
        ? { ...formData, address: formData.street, postalCode: formData.zip } // FIX: Map for order schema
        : savedAddresses.find(addr => addr._id === selectedAddressId);

      if (!shippingAddress) throw new Error('Address required');

      // Save new address if checked
      if (selectedAddressId === 'new' && saveNewAddress) {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            street: formData.street,
            city: formData.city,
            state: formData.state || '',
            zip: formData.zip,
            country: formData.country,
            phone: formData.phone
          })
        });
        if (!res.ok) throw new Error('Failed to save address');
      }

      // Create order
      const orderData = {
        orderItems: cart.map(item => ({
          ...item,
          product: item._id || item.product // Ensure product ID
        })),
        shippingAddress: {
          address: shippingAddress.street, // FIX: Use street
          city: shippingAddress.city,
          postalCode: shippingAddress.zip, // FIX: Use zip
          country: shippingAddress.country,
          phone: shippingAddress.phone
        },
        paymentMethod: 'Card', // Default
        totalPrice: cartTotal
      };

      await addOrder(orderData); // FIX: Use context
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Please <Link to="/login" className="text-indigo-600">login</Link> to checkout.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* Left: Address & Payment */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle size={20} className="text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form id="checkout-form" onSubmit={handleSubmit}>
            {/* Address Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin size={20} /> Shipping Address</h2>
              
              <select
                value={selectedAddressId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedAddressId(id);
                  if (id !== 'new') {
                    const addr = savedAddresses.find(a => a._id === id);
                    if (addr) setFormData({ street: addr.street, city: addr.city, state: addr.state || '', zip: addr.zip, country: addr.country, phone: addr.phone });
                  }
                }}
                className="w-full border border-gray-200 p-3 rounded-xl mb-4"
              >
                <option value="new">+ Add New Address</option>
                {savedAddresses.map(addr => (
                  <option key={addr._id} value={addr._id}>
                    {addr.street}, {addr.city} {addr.zip}
                  </option>
                ))}
              </select>

              {selectedAddressId === 'new' && (
                <div className="space-y-4">
                  <input name="street" placeholder="Address Line" value={formData.street} onChange={handleAddressChange} className="w-full border p-3 rounded-xl" required />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input name="city" placeholder="City" value={formData.city} onChange={handleAddressChange} className="w-full border p-3 rounded-xl" required />
                    <input name="state" placeholder="State (optional)" value={formData.state} onChange={handleAddressChange} className="w-full border p-3 rounded-xl" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input name="zip" placeholder="Postal Code" value={formData.zip} onChange={handleAddressChange} className="w-full border p-3 rounded-xl" required />
                    <select name="country" value={formData.country} onChange={handleAddressChange} className="w-full border p-3 rounded-xl" required>
                      <option value="">Country</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                    </select>
                  </div>
                  <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleAddressChange} className="w-full border p-3 rounded-xl" required />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={saveNewAddress} onChange={(e) => setSaveNewAddress(e.target.checked)} />
                    <span className="text-sm text-gray-600">Save this address</span>
                  </label>
                </div>
              )}

              {/* Payment - Placeholder */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard size={20} /> Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" value="card" className="text-indigo-600" defaultChecked />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" value="cod" className="text-indigo-600" />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item._id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                  </div>
                  <p className="font-bold text-gray-900">₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-2xl font-black text-gray-900 pt-4 border-t border-gray-100">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            form="checkout-form"
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-xl font-bold text-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : <>Confirm Order <Check size={24}/></>}
          </button>
          
          <p className="text-center mt-6 text-xs text-gray-400 flex items-center justify-center gap-2">
            <CreditCard size={14}/> Secure 256-bit SSL Encrypted Payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;