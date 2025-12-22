import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Trash2, Edit2, X, Save, Package, DollarSign, TrendingUp,
  ShoppingCart, Clock, CheckCircle, Truck, XCircle, Search, Eye, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Products
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', category: 'Furniture', description: '',
    image: '', images: '', customizable: false, details: ''
  });

  // Orders
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, totalProducts: 0, pendingOrders: 0, recentOrders: []
  });

  // Redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      fetchProducts();
      fetchOrders();
    }
  }, [user, navigate]);

  useEffect(() => {
    calculateStats();
  }, [orders, products]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const token = localStorage.getItem('token');

  // Fetch Data
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      showNotification('error', 'Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      showNotification('error', 'Failed to load orders');
    }
  };

  const calculateStats = () => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    setStats({ totalRevenue, totalOrders: orders.length, totalProducts: products.length, pendingOrders, recentOrders });
  };

  // Product Operations
  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({ name: '', price: '', category: 'Furniture', description: '', image: '', images: '', customizable: false, details: '' });
    setShowProductModal(false);
  };

  const startEdit = (product) => {
    setEditingProduct(product._id);
    setProductForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || '',
      image: product.image,
      images: product.images?.join(', ') || '',
      customizable: product.customizable || false,
      details: product.details ? JSON.stringify(product.details, null, 2) : ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        images: productForm.images.split(',').map(s => s.trim()).filter(Boolean),
        details: productForm.details ? JSON.parse(productForm.details) : []
      };

      const url = editingProduct ? `/api/products/${editingProduct}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Operation failed');
      await fetchProducts();
      resetProductForm();
      showNotification('success', editingProduct ? 'Product updated!' : 'Product added!');
    } catch (err) {
      showNotification('error', 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchProducts();
      showNotification('success', 'Product deleted!');
    } catch (err) {
      showNotification('error', 'Failed to delete');
    }
  };

  // Order Operations
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Update failed');
      await fetchOrders();
      showNotification('success', 'Order status updated!');
    } catch (err) {
      showNotification('error', 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'All' || order.status === orderFilter;
    const matchesSearch = !searchTerm || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      Delivered: 'bg-green-100 text-green-700',
      Shipped: 'bg-blue-100 text-blue-700',
      Processing: 'bg-amber-100 text-amber-700',
      Pending: 'bg-gray-100 text-gray-700',
      Cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl text-white font-medium ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
            <ArrowLeft size={20} /> Back to Store
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-10">
            {['overview', 'products', 'orders'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 capitalize font-medium border-b-4 transition ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-start mb-4">
                  <DollarSign className="w-10 h-10 text-green-600" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <ShoppingCart className="w-10 h-10 text-blue-600 mb-4" />
                <p className="text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <Package className="w-10 h-10 text-purple-600 mb-4" />
                <p className="text-gray-600">Products</p>
                <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <Clock className="w-10 h-10 text-orange-600 mb-4" />
                <p className="text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Recent Orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats.recentOrders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-mono">#{order._id.slice(-6)}</td>
                        <td className="px-6 py-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm">{order.user?.name || 'Guest'}</td>
                        <td className="px-6 py-4 text-sm font-bold">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Management */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <button
                onClick={() => { resetProductForm(); setShowProductModal(true); }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700"
              >
                <Plus size={20} /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
                  <div className="aspect-square relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button onClick={() => startEdit(product)} className="p-3 bg-white rounded-full hover:scale-110 transition">
                        <Edit2 size={18} className="text-blue-600" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="p-3 bg-white rounded-full hover:scale-110 transition">
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-500 uppercase">{product.category}</p>
                    <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
                    <p className="text-2xl font-bold mt-2">${product.price}</p>
                    {product.customizable && <span className="inline-block mt-3 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Customizable</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Orders Management</h2>
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOrders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm">#{order._id.slice(-8)}</td>
                        <td className="px-6 py-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{order.user?.name || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{order.user?.email || '-'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">{order.items?.length || 0}</td>
                        <td className="px-6 py-4 font-bold text-lg">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-4 py-2 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option>Pending</option>
                              <option>Processing</option>
                              <option>Shipped</option>
                              <option>Delivered</option>
                              <option>Cancelled</option>
                            </select>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
              <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={resetProductForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Price *</label>
                  <input type="number" step="0.01" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option>Furniture</option>
                  <option>Lighting</option>
                  <option>Textiles</option>
                  <option>Decor</option>
                  <option>Art</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Main Image URL *</label>
                <input type="url" required value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Images (comma separated)</label>
                <input type="text" value={productForm.images} onChange={e => setProductForm({...productForm, images: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="https://..., https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Details (JSON)</label>
                <textarea rows="5" value={productForm.details} onChange={e => setProductForm({...productForm, details: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-indigo-500"
                  placeholder='[{"label": "Dimensions", "value": "30x20x15"}]'></textarea>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="custom" checked={productForm.customizable} onChange={e => setProductForm({...productForm, customizable: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded" />
                <label htmlFor="custom" className="font-medium">Customizable Product</label>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2">
                  <Save size={20} /> {editingProduct ? 'Update' : 'Add'} Product
                </button>
                <button type="button" onClick={resetProductForm} className="px-8 py-3 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-gray-600">#{selectedOrder._id.slice(-8)} • {new Date(selectedOrder.date).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{selectedOrder.user?.name || 'Guest'}</p>
                  <p className="text-sm">{selectedOrder.user?.email || '—'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block mt-1 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-3xl font-bold mt-1">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4">Items ({selectedOrder.items.length})</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <img src={item.product?.image || item.image} alt={item.product?.name} className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product?.name || item.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                        {item.customization && (
                          <p className="text-sm text-indigo-600 mt-1">
                            Custom: {item.customization.colorName} • {item.customization.material}
                          </p>
                        )}
                      </div>
                      <p className="font-bold self-center">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button onClick={() => setSelectedOrder(null)} className="px-6 py-3 border rounded-lg hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;