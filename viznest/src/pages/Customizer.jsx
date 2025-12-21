import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Check, ArrowLeft, ShoppingBag, Info, Sparkles, Layers, Ban } from 'lucide-react';

const Customizer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));

  const [color, setColor] = useState(null);
  const [material, setMaterial] = useState('Standard');
  const [viewOriginal, setViewOriginal] = useState(false);

  const colors = [
    { name: 'Original', hex: null },
    { name: 'Midnight', hex: '#1e293b' },
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Rose', hex: '#e11d48' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Slate', hex: '#64748b' },
  ];

  const materials = [
    { name: 'Standard', price: 0, description: 'Base factory finish' },
    { name: 'Matte', price: 10, description: 'Soft, non-reflective' },
    { name: 'Glossy', price: 15, description: 'High-shine, ceramic look' },
    { name: 'Fabric', price: 25, description: 'Textured woven upholstery' },
  ];

  if (!product || !product.customizable) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-gray-500">
        This product is not customizable.
      </div>
    );
  }

  const materialCost = materials.find(m => m.name === material)?.price || 0;
  const finalPrice = product.price + materialCost;

  const handleAddToCart = () => {
    const isStandard = color === null && material === 'Standard';
    addToCart(
      product,
      isStandard ? null : {
        colorName: colors.find(c => c.hex === color)?.name || 'Custom',
        colorHex: color || 'transparent',
        material: material
      },
      finalPrice
    );
    navigate('/cart');
  };

  const maskUrl = product.mask || product.image;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-600"/>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-xs text-gray-500">Design Studio</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Estimate</p>
          <p className="text-2xl font-bold text-indigo-600">${finalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        {/* VISUALIZER */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center p-8">
          <div className="relative w-full max-w-2xl aspect-square bg-transparent rounded-2xl overflow-hidden shadow-2xl">
            <img src={product.image} alt="Base" className="w-full h-full object-contain z-0" />

            {!viewOriginal && color !== null && (
              <div 
                className="absolute inset-0 z-10 pointer-events-none transition-colors duration-500"
                style={{
                  backgroundColor: color,
                  mixBlendMode: 'multiply',
                  maskImage: `url(${maskUrl})`,
                  WebkitMaskImage: `url(${maskUrl})`,
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  opacity: material === 'Glossy' ? 0.6 : 0.85
                }}
              />
            )}

            {!viewOriginal && color !== null && material === 'Fabric' && (
              <div 
                className="absolute inset-0 z-20 pointer-events-none opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                  maskImage: `url(${maskUrl})`,
                  WebkitMaskImage: `url(${maskUrl})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center'
                }}
              />
            )}

            <button 
              onMouseDown={() => setViewOriginal(true)}
              onMouseUp={() => setViewOriginal(false)}
              onMouseLeave={() => setViewOriginal(false)}
              onTouchStart={() => setViewOriginal(true)}
              onTouchEnd={() => setViewOriginal(false)}
              className="absolute bottom-8 right-8 bg-white/95 backdrop-blur px-5 py-3 rounded-full text-sm font-bold shadow-2xl hover:scale-105 transition flex items-center gap-2 z-30"
            >
              <Info size={18}/> Hold to Compare
            </button>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-8 space-y-10 flex-1 overflow-y-auto">
            {/* Color */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Sparkles className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold">Choose Tone</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.hex)}
                    className={`w-16 h-16 rounded-2xl shadow-lg relative transition-all hover:scale-110 focus:ring-4 focus:ring-indigo-300 ${
                      color === c.hex ? 'ring-4 ring-indigo-600 scale-110' : ''
                    } ${c.hex === null ? 'bg-gray-100 border-4 border-gray-300' : ''}`}
                    style={{ backgroundColor: c.hex || 'transparent' }}
                  >
                    {c.hex === null ? (
                      <Ban size={28} className="text-gray-400 absolute inset-0 m-auto" />
                    ) : color === c.hex && (
                      <Check className="w-8 h-8 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Selected: <span className="font-bold text-gray-900">{colors.find(c => c.hex === color)?.name || 'Original'}</span>
              </p>
            </div>

            {/* Material */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Layers className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold">Select Finish</h3>
              </div>
              <div className="space-y-3">
                {materials.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setMaterial(m.name)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                      material === m.name 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{m.name}</p>
                        <p className="text-sm text-gray-600">{m.description}</p>
                      </div>
                      {m.price > 0 && (
                        <span className="text-indigo-600 font-bold text-lg">+${m.price}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="p-6 bg-white border-t border-gray-200 sticky bottom-0">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-indigo-700 shadow-2xl transition flex items-center justify-center gap-3"
            >
              <ShoppingBag size={24} />
              {color === null && material === 'Standard' 
                ? `Add Standard Item — $${product.price}` 
                : `Add Custom Design — $${finalPrice.toFixed(2)}`
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customizer;