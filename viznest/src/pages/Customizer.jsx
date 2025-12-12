import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data';
import { useCart } from '../context/CartContext';
import { Check, ArrowLeft, ShoppingBag, Info, Sparkles, Layers, Ban } from 'lucide-react';

const Customizer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));

  // State
  // Default to "Original" (null color) and "Standard" material
  const [color, setColor] = useState(null); 
  const [material, setMaterial] = useState('Standard');
  const [viewOriginal, setViewOriginal] = useState(false);

  // 1. Add "Original" as the first option
  const colors = [
    { name: 'Original', hex: null }, // Null hex means "No Change"
    { name: 'Midnight', hex: '#1e293b' },
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Rose', hex: '#e11d48' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Slate', hex: '#64748b' },
  ];

  // 2. Add "Standard" as the first material
  const materials = [
    { name: 'Standard', price: 0, description: 'Base factory finish' },
    { name: 'Matte', price: 10, description: 'Soft, non-reflective' },
    { name: 'Glossy', price: 15, description: 'High-shine, ceramic look' },
    { name: 'Fabric', price: 25, description: 'Textured woven upholstery' },
  ];

  if (!product) return <div className="p-10 text-center">Product not found</div>;

  const materialCost = materials.find(m => m.name === material)?.price || 0;
  // If color is Original, we don't charge for material unless it's a specific texture change on original
  // For simplicity: Base Price + Material Cost
  const finalPrice = product.price + materialCost;

  const handleAddToCart = () => {
    // LOGIC: If Color is Original AND Material is Standard, it's not a customization.
    const isStandard = color === null && material === 'Standard';

    addToCart(
      product, 
      isStandard ? null : { // Pass NULL if it's just the standard product
        colorName: colors.find(c => c.hex === color)?.name || 'Custom',
        colorHex: color || 'transparent', // Fallback for safety
        material: material 
      }, 
      finalPrice 
    );
    navigate('/cart');
  };

  // Fallback for mask logic
  const maskUrl = product.mask || product.image;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-16 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/shop')} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-600"/>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xs text-gray-500">Design Studio</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-500">Total Estimate</p>
          <p className="text-xl font-bold text-indigo-600">${finalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        
        {/* VISUALIZER AREA */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4 lg:p-12 min-h-[50vh]">
          
          <div className="relative w-full max-w-lg aspect-square bg-transparent rounded-xl overflow-hidden">
            
            {/* LAYER A: Base Image */}
            <img 
              src={product.image} 
              alt="Base Product" 
              className="w-full h-full object-contain relative z-0" 
            />

            {/* LAYER B: Color Mask */}
            {/* LOGIC: Only show this layer if 'color' is NOT null and we aren't holding 'Compare' */}
            {!viewOriginal && color !== null && (
              <div 
                className="absolute inset-0 z-10 pointer-events-none transition-colors duration-300"
                style={{
                  backgroundColor: color,
                  mixBlendMode: 'multiply', 
                  maskImage: `url(${maskUrl})`,
                  WebkitMaskImage: `url(${maskUrl})`, 
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                  opacity: material === 'Glossy' ? 0.6 : 0.85
                }}
              />
            )}

            {/* LAYER C: Texture Overlay */}
            {!viewOriginal && color !== null && material === 'Fabric' && (
              <div 
                className="absolute inset-0 z-20 pointer-events-none opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                  maskImage: `url(${maskUrl})`,
                  WebkitMaskImage: `url(${maskUrl})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}
              />
            )}

            {/* Toggle Button */}
            <button 
              onMouseDown={() => setViewOriginal(true)}
              onMouseUp={() => setViewOriginal(false)}
              onMouseLeave={() => setViewOriginal(false)}
              className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition active:scale-95 flex items-center gap-2 z-30"
            >
              <Info size={16}/> Hold to Compare
            </button>
          </div>
        </div>

        {/* CONTROLS AREA */}
        <div className="w-full lg:w-[450px] bg-white border-l border-gray-200 flex flex-col h-auto lg:h-[calc(100vh-80px)] overflow-y-auto">
          
          <div className="p-8 space-y-8 flex-1">
            
            {/* Color Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-gray-900">Choose Tone</h3>
              </div>
              <div className="grid grid-cols-6 gap-3">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                    className={`w-12 h-12 rounded-full shadow-sm relative transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 flex items-center justify-center 
                      ${color === c.hex ? 'ring-indigo-600 scale-110' : 'ring-transparent'}
                      ${c.hex === null ? 'bg-gray-100 border-2 border-gray-300' : ''}
                    `}
                    style={{ backgroundColor: c.hex || 'transparent' }}
                  >
                    {/* Render Icon for "Original" or Checkmark for colors */}
                    {c.hex === null ? (
                      <Ban size={18} className="text-gray-400" />
                    ) : (
                      color === c.hex && <Check className="w-5 h-5 text-white absolute inset-0 m-auto drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-500">Active: <span className="font-medium text-gray-900">{colors.find(c => c.hex === color)?.name}</span></p>
            </div>

            <hr className="border-gray-100" />

            {/* Material Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-gray-900">Select Finish</h3>
              </div>
              <div className="space-y-3">
                {materials.map((m) => (
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
                    {m.price > 0 && <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-indigo-600">+${m.price}</span>}
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
               {color === null && material === 'Standard' ? 'Add Standard Item' : `Add Custom - $${finalPrice.toFixed(2)}`}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;