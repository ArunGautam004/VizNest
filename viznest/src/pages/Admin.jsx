import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Edit2, Upload, X, Image as ImageIcon, 
  CheckCircle, AlertCircle, Layers, ArrowLeft 
} from 'lucide-react';

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  // View State: 'list' or 'form'
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    price: '',
    category: 'Furniture',
    description: '',
    customizable: false,
    image: '', // Main thumbnail
    mask: '',  // Mask image (only if customizable)
    images: [], // Gallery array
    details: [] // Specs array
  };
  const [formData, setFormData] = useState(initialFormState);

  // Security Check
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  // --- HANDLERS ---

  const handleEditClick = (product) => {
    setFormData({
      ...product,
      images: product.images || [product.image], // Ensure array exists
      mask: product.mask || ''
    });
    setEditingId(product.id);
    setView('form');
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      showNotification("Product deleted successfully");
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setView('form');
  };

  // Generic Input Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Image Uploader (Base64)
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'gallery') {
          setFormData(prev => ({ ...prev, images: [...prev.images, reader.result] }));
        } else {
          setFormData(prev => ({ ...prev, [field]: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure main image is set (use first gallery image if main is empty)
    const finalData = {
      ...formData,
      price: parseFloat(formData.price),
      image: formData.image || formData.images[0],
      // If not customizable, remove mask data to save space
      mask: formData.customizable ? formData.mask : null
    };

    if (editingId) {
      updateProduct(editingId, finalData);
      showNotification("Product updated successfully!");
    } else {
      addProduct(finalData);
      showNotification("New product created!");
    }
    
    setView('list');
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  if (!user || !user.isAdmin) return null; // Prevent flash of content

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your catalog, prices, and customizations.</p>
          </div>
          {view === 'list' && (
            <button 
              onClick={handleAddNew}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} /> Add New Product
            </button>
          )}
        </div>

        {notification && (
          <div className="fixed top-24 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 animate-fade-in">
            <CheckCircle size={20}/> {notification}
          </div>
        )}

        {/* --- LIST VIEW --- */}
        {view === 'list' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-sm font-bold text-gray-500 uppercase">Product</th>
                    <th className="p-4 text-sm font-bold text-gray-500 uppercase">Category</th>
                    <th className="p-4 text-sm font-bold text-gray-500 uppercase">Price</th>
                    <th className="p-4 text-sm font-bold text-gray-500 uppercase">Status</th>
                    <th className="p-4 text-right text-sm font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                          <img src={p.image} alt="" className="w-full h-full object-cover"/>
                        </div>
                        <span className="font-bold text-gray-900">{p.name}</span>
                      </td>
                      <td className="p-4 text-gray-600">{p.category}</td>
                      <td className="p-4 font-bold text-gray-900">${p.price}</td>
                      <td className="p-4">
                        {p.customizable ? (
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-bold">Customizable</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">Standard</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditClick(p)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <Edit2 size={18}/>
                          </button>
                          <button onClick={() => handleDeleteClick(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- FORM VIEW --- */}
        {view === 'form' && (
          <div className="max-w-4xl mx-auto">
            <button onClick={() => setView('list')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium">
              <ArrowLeft size={20}/> Back to List
            </button>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-100">
                {editingId ? 'Edit Product' : 'Create Product'}
              </h2>

              <div className="space-y-8">
                
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3" placeholder="e.g. Velvet Chair" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3" placeholder="120" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white">
                      <option>Furniture</option>
                      <option>Art</option>
                      <option>Decor</option>
                      <option>Lighting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows="1" className="w-full border border-gray-300 rounded-lg p-3" />
                  </div>
                </div>

                {/* 2. Gallery Images */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Product Gallery</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {/* Add Button */}
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery')} className="hidden" />
                      <Upload size={24} className="text-gray-400 mb-2"/>
                      <span className="text-xs text-gray-500 font-bold">Add Image</span>
                    </label>

                    {/* Preview Images */}
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14}/>
                        </button>
                        {idx === 0 && <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-2 rounded">Main</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Customization Logic */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer mb-6">
                    <input 
                      type="checkbox" 
                      name="customizable" 
                      checked={formData.customizable} 
                      onChange={handleChange} 
                      className="w-5 h-5 text-indigo-600 rounded" 
                    />
                    <span className="font-bold text-gray-900">Enable Customization Studio?</span>
                  </label>

                  {formData.customizable && (
                    <div className="animate-fade-in">
                      <div className="flex items-start gap-4 mb-4">
                        <AlertCircle className="text-indigo-600 flex-shrink-0" size={20}/>
                        <p className="text-sm text-gray-600">
                          Since this is customizable, you must upload a <strong>Mask Image</strong>. 
                          This is a PNG where the customizable parts are white/transparent, and the rest is standard.
                        </p>
                      </div>

                      <div className="flex gap-6 items-center">
                        <label className="flex-1 border-2 border-dashed border-indigo-200 bg-white rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition">
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'mask')} className="hidden" />
                          <Layers size={24} className="text-indigo-400 mx-auto mb-2"/>
                          <span className="text-sm font-bold text-indigo-700">Upload Mask Layer</span>
                        </label>

                        {formData.mask && (
                          <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative">
                            <img src={formData.mask} alt="Mask" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white text-xs font-bold">Mask</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg text-lg">
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>

              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;