import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Check, ArrowLeft, ShoppingBag, Info, Sparkles, Layers, Ban, RefreshCcw, Eye } from 'lucide-react';

const Customizer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Data States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Customization States
  const [color, setColor] = useState(null); // Null = Original
  const [material, setMaterial] = useState('Standard');
  const [viewOriginal, setViewOriginal] = useState(false);

  // 1. Static Color Palette
  const colors = [
    { name: 'Original', hex: null },
    { name: 'Midnight', hex: '#1e293b' },
    { name: 'Indigo', hex: '#4f46e5' },
    { name: 'Rose', hex: '#e11d48' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Slate', hex: '#64748b' },
    { name: 'Teal', hex: '#0d9488' },
    { name: 'Violet', hex: '#7c3aed' },
  ];

  // 2. Default Materials
  const defaultMaterials = [
    { name: 'Standard', price: 0, description: 'Base factory finish' },
    { name: 'Matte', price: 0, description: 'Soft, non-reflective' },
    { name: 'Glossy', price: 0, description: 'High-shine, ceramic look' },
    { name: 'Fabric', price: 0, description: 'Textured woven upholstery' },
  ];

  // 3. Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);

        const materialsToUse = (data.materials && data.materials.length > 0) 
            ? data.materials 
            : defaultMaterials;

        setMaterial(materialsToUse[0].name);

      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // ✅ HELPER: Fixes Image Paths for the Browser
  const getImageUrl = (path) => {
      if (!path) return null;
      
      // 1. Replace Windows backslashes (\) with Web forward slashes (/)
      let cleanPath = path.replace(/\\/g, '/');
      
      // 2. Remove "public/" if it was accidentally saved in the path (common mistake)
      cleanPath = cleanPath.replace('public/', '');

      // 3. Construct full URL
      // If the path already has 'http', assume it's an external link
      if (cleanPath.startsWith('http')) return cleanPath;

      // Otherwise, prepend the server URL
      const fullUrl = `http://localhost:5000/${cleanPath}`;
      
      return fullUrl;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-gray-400">Loading Studio...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Product not found</div>;

  // 4. Calculations
  const activeMaterials = (product.materials && product.materials.length > 0) ? product.materials : defaultMaterials;
  const selectedMatObj = activeMaterials.find(m => m.name === material) || activeMaterials[0];
  const materialCost = selectedMatObj?.price || 0;
  const finalPrice = product.price + materialCost;
  
  // Get Safe URLs
  const maskUrl = getImageUrl(product.mask);
  const imageUrl = getImageUrl(product.image);

  // DEBUGGING: Check your console (F12) to see these values
  console.log("Base Image URL:", imageUrl);
  console.log("Mask Image URL:", maskUrl);

  // 5. Add to Cart Handler
  const handleAddToCart = () => {
    const isStandard = color === null && materialCost === 0;

    const customizationData = {
        selectedColorName: colors.find(c => c.hex === color)?.name || 'Original',
        selectedColorHex: color || 'transparent',
        selectedMaterial: material,
        customPrice: finalPrice
    };

    addToCart(
      product, 
      1, 
      isStandard ? null : customizationData
    );
    
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-600"/>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xs text-indigo-600 font-bold tracking-wider uppercase">Customization Studio</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-500 font-bold uppercase">Total Estimate</p>
          <p className="text-xl font-black text-indigo-600">₹{finalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        
        {/* --- VISUALIZER AREA --- */}
        <div className="flex-1 bg-gray-50 relative overflow-hidden flex items-center justify-center p-4 lg:p-12 min-h-[50vh]">
          
          <div className="relative w-full max-w-xl aspect-square bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* LAYER 1: BASE IMAGE */}
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt="Base Product" 
                    className="absolute inset-0 w-full h-full object-contain z-0"
                    onError={(e) => {
                        e.target.onerror = null; 
                        console.error("Failed to load image:", imageUrl);
                        e.target.src = "https://via.placeholder.com/500?text=Image+Not+Found";
                    }} 
                />
            ) : (
                <div className="flex items-center justify-center h-full text-red-500 font-bold">No Image Available</div>
            )}

            {/* LAYER 2: COLOR MASK OVERLAY */}
            {!viewOriginal && color !== null && maskUrl && (
              <div 
                className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: color,
                  mixBlendMode: 'multiply',
                  WebkitMaskImage: `url("${maskUrl}")`, 
                  maskImage: `url("${maskUrl}")`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  opacity: 0.9
                }}
              />
            )}

            {/* LAYER 3: TEXTURE OVERLAY */}
            {!viewOriginal && material.toLowerCase().includes('fabric') && color !== null && maskUrl && (
               <div 
               className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay"
               style={{
                 backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                 backgroundSize: '4px 4px',
                 WebkitMaskImage: `url("${maskUrl}")`, 
                 maskImage: `url("${maskUrl}")`,
                 WebkitMaskSize: 'contain',
                 maskSize: 'contain',
                 WebkitMaskRepeat: 'no-repeat',
                 maskRepeat: 'no-repeat',
                 WebkitMaskPosition: 'center',
                 maskPosition: 'center',
               }}
             />
            )}

            {/* COMPARE BUTTON */}
            <button 
              onMouseDown={() => setViewOriginal(true)}
              onMouseUp={() => setViewOriginal(false)}
              onMouseLeave={() => setViewOriginal(false)}
              onTouchStart={() => setViewOriginal(true)}
              onTouchEnd={() => setViewOriginal(false)}
              className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition active:scale-95 flex items-center gap-2 z-30 text-gray-800"
            >
              <Eye size={16}/> Hold to Compare
            </button>
          </div>
        </div>

        {/* --- CONTROLS AREA --- */}
        <div className="w-full lg:w-[400px] bg-white border-l border-gray-200 flex flex-col h-auto lg:h-[calc(100vh-80px)] overflow-y-auto">
          
          <div className="p-8 space-y-8 flex-1">
            
            {/* Color Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-gray-900">Choose Color</h3>
                 </div>
                 <button onClick={() => setColor(null)} className="text-xs font-bold text-gray-400 hover:text-indigo-600 flex items-center gap-1">
                    <RefreshCcw size={12}/> Reset
                 </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                    className={`aspect-square rounded-full shadow-sm relative transition-all hover:scale-110 focus:outline-none ring-2 ring-offset-2 flex items-center justify-center 
                      ${color === c.hex ? 'ring-indigo-600 scale-110' : 'ring-transparent'}
                      ${c.hex === null ? 'bg-gray-100 border-2 border-gray-300' : ''}
                    `}
                    style={{ backgroundColor: c.hex || 'transparent' }}
                  >
                    {c.hex === null ? (
                      <Ban size={18} className="text-gray-400" />
                    ) : (
                      color === c.hex && <Check className="w-5 h-5 text-white absolute inset-0 m-auto drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-500 text-center bg-gray-50 py-2 rounded-lg border border-gray-100">
                  Active: <span className="font-bold text-gray-900">{colors.find(c => c.hex === color)?.name || 'Original'}</span>
              </p>
            </div>

            <hr className="border-gray-100" />

            {/* Material Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-gray-900">Select Finish</h3>
              </div>
              <div className="space-y-3">
                {activeMaterials.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setMaterial(m.name)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex justify-between items-center group ${
                      material === m.name ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'
                    }`}
                  >
                    <div>
                      <span className={`font-bold block ${material === m.name ? 'text-indigo-900' : 'text-gray-700'}`}>{m.name}</span>
                      <span className="text-xs text-gray-500">{m.description}</span>
                    </div>
                    {m.price > 0 && <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-indigo-600">+₹{m.price}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-gray-200 sticky bottom-0 z-40">
             <button 
               onClick={handleAddToCart}
               className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2"
             >
               <ShoppingBag size={20} /> 
               {color === null && materialCost === 0 
                 ? `Add to Cart — ₹${product.price}` 
                 : `Add Custom Order — ₹${finalPrice.toFixed(2)}`
               }
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;