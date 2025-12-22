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
  const { products, addProduct, updateProduct, deleteProduct, loading: productsLoading } = useProducts();
  const { orders, fetchAllOrders, updateOrderStatus, loading: ordersLoading } = useOrders();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });
  const [error, setError] = useState('');

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
    } else {
      fetchAllOrders(); // Load all orders for admin
    }
  }, [user, navigate]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 3000);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct(formData);
      setFormData(initialForm);
      showNotification('success', 'Product added!');
    } catch (err) {
      setError(err);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(editingId, formData);
      setEditingId(null);
      setFormData(initialForm);
      showNotification('success', 'Product updated!');
    } catch (err) {
      setError(err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      customizable: product.customizable,
      image: product.image,
      images: product.images || [],
      details: product.details || []
    });
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await deleteProduct(id);
        showNotification('success', 'Product deleted!');
      } catch (err) {
        setError(err);
      }
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      showNotification('success', 'Status updated!');
    } catch (err) {
      setError(err);
    }
  };

  if (productsLoading || ordersLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {notification.message && (
        <div className={`p-4 rounded mb-4 ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {notification.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-indigo-600">
            <ArrowLeft size={20} /> Back to Shop
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-8">
          {['overview', 'products', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 -mb-px font-medium ${activeTab === tab ? 'border-indigo-500 text-indigo-600 border-b-2' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">Products</h3>
              <p className="text-3xl font-bold text-indigo-600">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">Orders</h3>
              <p className="text-3xl font-bold text-green-600">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">Revenue</h3>
              <p className="text-3xl font-bold text-blue-600">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(0)}</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Products</h2>
              <button onClick={() => setEditingId(null)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Add New
              </button>
            </div>
            {editingId ? (
              <form onSubmit={handleUpdateProduct} className="bg-white p-6 rounded-lg shadow mb-6">
                {/* Form fields - abbreviated for brevity; add inputs for name, price, etc. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 border rounded" />
                  <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="p-2 border rounded" />
                  {/* Add more fields */}
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mr-2">Update</button>
                <button type="button" onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </form>
            ) : (
              <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow mb-6">
                {/* Similar form for add */}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
              </form>
            )}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Category</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">${product.price}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleEditProduct(product)} className="text-blue-600 mr-2"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Items</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td className="p-6 font-bold">{order._id.slice(-6)}</td>
                    <td className="p-6">{new Date(order.date).toLocaleDateString()}</td>
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
                    <td className="p-6">
                      <select 
                        value={order.status} 
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="border rounded p-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;