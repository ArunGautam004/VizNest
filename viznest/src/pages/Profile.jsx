import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Lock, Package, LogOut, Camera, Save, CheckCircle, 
  LayoutDashboard, Shield // NEW ICONS
} from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [msg, setMsg] = useState(null);

  // Form States (Pre-filled with user data)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.street || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    country: user?.country || ''
  });

  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });

  if (!user) {
    navigate('/login');
    return null;
  }

  const showMessage = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 3000);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(formData);
    showMessage("Profile details updated successfully!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      alert("New passwords do not match!");
      return;
    }
    showMessage("Password changed successfully!");
    setPassData({ current: '', new: '', confirm: '' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-gray-200"/>
              <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 border-2 border-white">
                <Camera size={14}/>
              </button>
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            
            {/* ADMIN BADGE */}
            {user.isAdmin && (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                <Shield size={12}/> Administrator
              </span>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col">
              
              {/* --- NEW: ADMIN BUTTON (Only shows if isAdmin is true) --- */}
              {user.isAdmin && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-3 px-6 py-4 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition shadow-inner"
                >
                  <LayoutDashboard size={18}/> Access Admin Panel
                </button>
              )}

              {/* Standard Links */}
              <button 
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition ${activeTab === 'details' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User size={18}/> Personal Details
              </button>
              <button 
                onClick={() => setActiveTab('address')}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition ${activeTab === 'address' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <MapPin size={18}/> Address Book
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition ${activeTab === 'orders' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Package size={18}/> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Lock size={18}/> Change Password
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-red-600 hover:bg-red-50 transition border-t border-gray-100"
              >
                <LogOut size={18}/> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="md:col-span-3">
          
          {msg && (
            <div className="mb-6 bg-green-100 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in-down">
              <CheckCircle size={20}/> {msg}
            </div>
          )}

          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none" 
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg p-3 cursor-not-allowed" 
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                  </div>
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 transition">
                  <Save size={18}/> Save Changes
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ADDRESS BOOK */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Address</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                  <input 
                    type="text" 
                    value={formData.street}
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">State / Province</label>
                    <input 
                      type="text" 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pincode / Zip</label>
                    <input 
                      type="text" 
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                    <input 
                      type="text" 
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 transition">
                  <Save size={18}/> Update Address
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="text-indigo-600" size={24}/>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">#VN-8832</p>
                      <p className="text-sm text-gray-500">Ordered on Oct 12, 2025</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Delivered</span>
                    <p className="font-bold text-gray-900 mt-1">$150.00</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="max-w-md">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={passData.current}
                    onChange={(e) => setPassData({...passData, current: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={passData.new}
                    onChange={(e) => setPassData({...passData, new: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passData.confirm}
                    onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 transition">
                  <Lock size={18}/> Update Password
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