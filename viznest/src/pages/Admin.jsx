import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrdersContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit2, Upload, X, Image as ImageIcon, 
  CheckCircle, Package, Users, DollarSign, Layers, ArrowLeft 
} from 'lucide-react';

const Admin = () => {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders = [] } = useOrders();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders'
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const initialForm = {
    name: '',
    price: '',
    category: 'Furniture',
    description: '',
    customizable: false,
    image: '',
    mask: '',
    images: [],
    details: []
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEdit = (product) => {
    setFormData({
      ...product,
      images: product.images || [product.image],
      mask: product.mask || '',
      details: product.details || []
    });
    setEditingId(product.id);
    setActiveTab('products');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      price: parseFloat(formData.price),
      image: formData.image || formData.images[0] || '',
      mask: formData.customizable ? formData.mask : null,
      images: formData.images,
      details: formData.details
    };

    if (editingId) {
      updateProduct(editingId, finalData);
      showNotification('Product updated successfully!');
    } else {
      addProduct(finalData);
      showNotification('New product added successfully!');
    }

    setFormData(initialForm);
    setEditingId(null);
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (field === 'gallery') {
        setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      } else {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (!user || !user.isAdmin) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-8 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold flex items-center gap-3 z-50 animate-slide-in ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <CheckCircle size={24} />
          {notification.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-12">Manage products, orders, and your store.</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-12 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-3 rounded-lg font-bold transition ${activeTab === 'overview' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-8 py-3 rounded-lg font-bold transition ${activeTab === 'products' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600'}`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 rounded-lg font-bold transition ${activeTab === 'orders' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600'}`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Package className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <p className="text-4xl font-extrabold text-gray-900">{products.length}</p>
              <p className="text-gray-600 font-bold">Total Products</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <p className="text-4xl font-extrabold text-gray-900">${totalRevenue.toFixed(2)}</p>
              <p className="text-gray-600 font-bold">Total Revenue</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <p className="text-4xl font-extrabold text-gray-900">{pendingOrders}</p>
              <p className="text-gray-600 font-bold">Pending Orders</p>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Product Management</h2>
              <button
                onClick={() => {
                  setFormData(initialForm);
                  setEditingId(null);
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg"
              >
                <Plus size={20} /> Add New Product
              </button>
            </div>

            {/* Form */}
            {(editingId !== null || formData.name !== '') && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                  <button onClick={() => { setFormData(initialForm); setEditingId(null); }} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input required name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Product Name" className="p-4 border rounded-xl" />
                    <input required type="number" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="Price" className="p-4 border rounded-xl" />
                    <select name="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="p-4 border rounded-xl">
                      <option>Furniture</option>
                      <option>Lighting</option>
                      <option>Textiles</option>
                      <option>Decor</option>
                      <option>Art</option>
                    </select>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="customizable" checked={formData.customizable} onChange={(e) => setFormData({...formData, customizable: e.target.checked})} className="w-6 h-6 text-indigo-600 rounded" />
                      <span className="font-bold">Customizable (Studio Enabled)</span>
                    </label>
                  </div>

                  <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Description" rows="3" className="w-full p-4 border rounded-xl" />

                  {/* Gallery */}
                  <div>
                    <p className="font-bold mb-4">Gallery Images</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                      <label className="aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} className="hidden" />
                        <Upload size={28} className="text-gray-400" />
                        <span className="text-xs mt-2">Add</span>
                      </label>
                      {formData.images.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mask for Customizable */}
                  {formData.customizable && (
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                      <p className="font-bold mb-4 flex items-center gap-2"><Layers size={20} /> Custom Mask Layer (Required)</p>
                      <label className="block">
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'mask')} className="hidden" />
                        <div className="border-2 border-dashed border-indigo-300 rounded-xl p-8 text-center cursor-pointer hover:bg-indigo-100 transition">
                          {formData.mask ? (
                            <img src={formData.mask} className="mx-auto max-h-48 rounded-lg" />
                          ) : (
                            <>Upload Mask PNG (white = customizable area)</>
                          )}
                        </div>
                      </label>
                    </div>
                  )}

                  <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-indigo-700 shadow-lg transition">
                    {editingId ? 'Update Product' : 'Create Product'}
                  </button>
                </form>
              </div>
            )}

            {/* Product List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm font-bold text-gray-600 uppercase">
                    <th className="p-6">Product</th>
                    <th className="p-6">Category</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Custom</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="p-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                          <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{p.name}</p>
                          <p className="text-sm text-gray-500">{p.reviews || 0} reviews</p>
                        </div>
                      </td>
                      <td className="p-6 text-gray-700">{p.category}</td>
                      <td className="p-6 font-bold text-gray-900">${p.price}</td>
                      <td className="p-6">
                        {p.customizable ? (
                          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">Yes</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">No</span>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-800 mr-4 font-bold">Edit</button>
                        <button onClick={() => { if (confirm('Delete this product?')) { deleteProduct(p.id); showNotification('Product deleted'); } }} className="text-red-600 hover:text-red-800 font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8">Order Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm font-bold text-gray-600 uppercase">
                    <th className="p-6">Order ID</th>
                    <th className="p-6">Date</th>
                    <th className="p-6">Items</th>
                    <th className="p-6">Total</th>
                    <th className="p-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-12 text-gray-500">No orders yet</td></tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td className="p-6 font-bold">#{order.id.toString().slice(-6)}</td>
                        <td className="p-6">{order.date}</td>
                        <td className="p-6">{order.items?.length || 0}</td>
                        <td className="p-6 font-bold">${order.total?.toFixed(2) || '0.00'}</td>
                        <td className="p-6">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;