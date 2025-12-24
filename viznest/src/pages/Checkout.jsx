import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, CreditCard, Check, AlertCircle, Package } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [saveNewAddress, setSaveNewAddress] = useState(false);

  // ✅ FIX 1: Added 'state' to formData state
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '', 
    postalCode: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.addresses && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          const primary = data.addresses.find(a => a.isPrimary) || data.addresses[0];
          fillFormWithAddress(primary);
          setSelectedAddressId(primary._id);
        } else {
          setFormData(prev => ({ ...prev, phone: data.phone || '' }));
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, [user]);

  const fillFormWithAddress = (addr) => {
    setFormData({
      address: addr.street,
      city: addr.city,
      state: addr.state || '', // ✅ FIX: Populate state
      postalCode: addr.zip,
      country: addr.country,
      phone: addr.phone || user.phone || '' 
    });
  };

  const handleAddressSelection = (id) => {
    setSelectedAddressId(id);
    if (id === 'new') {
      // ✅ FIX: Reset state on new address
      setFormData({ address: '', city: '', state: '', postalCode: '', country: '', phone: user.phone || '' });
    } else {
      const addr = savedAddresses.find(a => a._id === id);
      if (addr) fillFormWithAddress(addr);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to checkout');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // ✅ FIX 2: Strict Error Checking for Address Save
      if (selectedAddressId === 'new' && saveNewAddress) {
        const addressResponse = await fetch('http://localhost:5000/api/auth/address', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            street: formData.address,
            city: formData.city,
            state: formData.state, // ✅ Pass state to backend
            zip: formData.postalCode,
            country: formData.country,
            phone: formData.phone,
            isPrimary: savedAddresses.length === 0
          })
        });

        // If server rejects address, stop here and show error
        if (!addressResponse.ok) {
  const text = await addressResponse.text(); // 👈 read raw HTML/text
  console.error("Address API raw response:", text);
  throw new Error("Address Save Failed. Check console for details.");
}

      }

      const orderItems = cart.map(item => ({
        product: item.product || item._id,
        name: item.name,
        qty: item.qty,
        image: item.image,
        mask: item.mask,
        price: item.price,
        selectedColor: item.selectedColor,
        selectedColorName: item.selectedColorName,
        selectedMaterial: item.selectedMaterial
      }));

      const orderPayload = {
        orderItems,
        shippingAddress: formData,
        paymentMethod: 'Card',
        totalPrice: cartTotal
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) throw new Error('Order failed');

      await clearCart();
      navigate('/order-success');

    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
            <Package size={48} className="mx-auto text-indigo-200 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <Link to="/shop" className="text-indigo-600 font-bold hover:underline">Start Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <CreditCard className="text-indigo-600" /> Checkout
        </h1>
        
        {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2 border border-red-100">
                <AlertCircle size={20}/> {error}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin size={20} className="text-gray-400"/> Shipping Details
              </h2>

              {savedAddresses.length > 0 && (
                  <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Select Saved Address</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {savedAddresses.map(addr => (
                              <button 
                                key={addr._id}
                                type="button"
                                onClick={() => handleAddressSelection(addr._id)}
                                className={`text-left p-3 rounded-xl border transition-all ${selectedAddressId === addr._id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}
                              >
                                  <div className="font-bold text-sm text-gray-900">{addr.city}, {addr.zip}</div>
                                  <div className="text-xs text-gray-500 truncate">{addr.street}</div>
                              </button>
                          ))}
                          <button 
                            type="button"
                            onClick={() => handleAddressSelection('new')}
                            className={`text-left p-3 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all ${selectedAddressId === 'new' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
                          >
                              <MapPin size={16} /> New Address
                          </button>
                      </div>
                  </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Full Name</label>
                        <input type="text" value={user?.name || ''} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email</label>
                        <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Street Address</label>
                    <input 
                        type="text" 
                        required 
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        placeholder="123 Main St, Apt 4B"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">City</label>
                        <input 
                            type="text" required 
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    {/* ✅ FIX 3: Added State Input Field */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">State / Province</label>
                        <input 
                            type="text" required 
                            value={formData.state}
                            onChange={e => setFormData({...formData, state: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">ZIP Code</label>
                        <input 
                            type="text" required 
                            value={formData.postalCode}
                            onChange={e => setFormData({...formData, postalCode: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Country</label>
                        <input 
                            type="text" required 
                            value={formData.country}
                            onChange={e => setFormData({...formData, country: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Phone</label>
                    <input 
                        type="tel" required 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="+91 98765 43210"
                    />
                </div>

                {selectedAddressId === 'new' && (
                    <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                        <input 
                            type="checkbox" 
                            id="saveAddr" 
                            checked={saveNewAddress} 
                            onChange={e => setSaveNewAddress(e.target.checked)}
                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="saveAddr" className="text-sm font-bold text-indigo-900 cursor-pointer">
                            Save this address for future orders
                        </label>
                    </div>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b pb-4">Order Summary</h2>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.cartId || item._id} className="flex gap-6 items-start border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="absolute inset-0 w-full h-full object-contain p-1" 
                        />
                        {item.selectedColor && item.mask && (
                          <div 
                            className="absolute inset-0 z-10 mix-blend-multiply pointer-events-none" 
                            style={{ 
                                backgroundColor: item.selectedColor, 
                                maskImage: `url(${item.mask})`, 
                                WebkitMaskImage: `url(${item.mask})`, 
                                maskSize: 'contain',
                                WebkitMaskSize: 'contain', 
                                maskRepeat: 'no-repeat', 
                                maskPosition: 'center',
                                WebkitMaskPosition: 'center',
                                opacity: 0.9 
                            }} 
                          />
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1">
                        <p className="font-bold text-gray-900 text-lg leading-tight mb-1 truncate">{item.name}</p>
                        <p className="text-sm font-semibold text-indigo-600 mb-2">Qty: {item.qty}</p>
                        <div className="space-y-1">
                          {item.selectedColorName && (
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Color: <span className="text-gray-900">{item.selectedColorName}</span>
                            </p>
                          )}
                          {item.selectedMaterial && (
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Finish: <span className="text-gray-900">{item.selectedMaterial}</span>
                            </p>
                          )}
                        </div>
                    </div>
                    <div className="font-bold text-lg text-gray-900 pt-1">
                        ₹{(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-100">
                <div className="flex justify-between text-gray-600 font-medium text-base">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium text-base">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
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
      </div>
    </div>
  );
};

export default Checkout;