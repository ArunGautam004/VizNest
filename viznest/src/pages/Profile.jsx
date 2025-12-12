import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, User, LogOut, MapPin, CreditCard } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'settings'

  // If not logged in, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock Orders Data
  const orders = [
    { id: '#VN-8832', date: 'Oct 24, 2025', total: '$120.00', status: 'Delivered', items: 'Minimalist Lounge Chair' },
    { id: '#VN-9921', date: 'Nov 02, 2025', total: '$45.00', status: 'Processing', items: 'Ceramic Geometric Vase' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-50" />
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            
            <div className="space-y-2 text-left">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Package size={18} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User size={18} /> Account Details
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Order History</h2>
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="font-bold text-lg">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <p className="text-gray-700">{order.items}</p>
                    <p className="font-bold">{order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" defaultValue={user.name} className="w-full border border-gray-300 rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" defaultValue={user.email} className="w-full border border-gray-300 rounded-lg p-2" disabled />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-500"><MapPin size={20} /></div>
                    <input type="text" defaultValue={user.address} className="flex-1 border border-gray-300 rounded-lg p-2" />
                  </div>
                </div>
                <button type="button" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;