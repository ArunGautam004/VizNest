import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext'; // 1. Use Context
import { useCart } from '../context/CartContext';
import ReviewSection from '../components/ReviewSection'; // 2. Import Review Component
import ProductCard from '../components/ProductCard';
import { Star, Wand2, ShoppingBag, Zap, Ruler, Box, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // 3. Get products AND addReview function from context
  const { products, addReview } = useProducts(); 
  
  // Find product from LIVE context data (so we see new reviews immediately)
  const product = products.find(p => p.id === parseInt(id));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  if (!product) return <div className="p-20 text-center">Product not found.</div>;

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

  const nextSlide = () => setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  const relatedProducts = products
    .filter(p => p.id !== product?.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* ... (Keep your Image Slideshow & Product Info Code exactly as it was) ... */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             {/* LEFT: SLIDESHOW */}
             <div className="lg:sticky lg:top-24 h-fit select-none">
                <div className="bg-gray-100 rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative group border border-gray-100">
                  <img src={gallery[currentImageIndex]} alt="" className="w-full h-full object-cover transition-all duration-500" />
                  {product.customizable && currentImageIndex === 0 && (
                    <Link to={`/customize/${product.id}`} className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-indigo-600 shadow-lg flex items-center gap-2 z-20 hover:scale-105 transition">
                      <Wand2 size={16} /> Try in Studio
                    </Link>
                  )}
                  {gallery.length > 1 && (
                    <>
                      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition"><ChevronLeft size={24}/></button>
                      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-800 opacity-0 group-hover:opacity-100 transition"><ChevronRight size={24}/></button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {gallery.map((_, idx) => (
                          <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition-all shadow-sm ${currentImageIndex === idx ? 'bg-indigo-600 w-4' : 'bg-white/60'}`}/>
                        ))}
                      </div>
                    </>
                  )}
                </div>
             </div>

             {/* RIGHT: INFO */}
             <div>
                <div className="mb-6 border-b border-gray-100 pb-6">
                  <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mb-2">{product.category}</p>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    <div className="flex items-center gap-1 text-yellow-400 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm font-bold text-gray-900">{product.rating || 0}</span>
                      <span className="text-xs text-gray-500">({product.reviews || 0} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>
                
                {/* Keep Specifications & Action Buttons */}
                <div className="flex items-center gap-3 mb-8 text-sm text-gray-500 bg-white border border-gray-100 p-3 rounded-lg w-fit">
                   <Box size={16} /> <span>Free shipping on orders over $50 • 30-day returns</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <button onClick={handleBuyNow} className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"><Zap size={20} /> Buy Now</button>
                    <button onClick={() => addToCart(product)} className="flex-1 bg-gray-100 text-gray-900 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"><ShoppingBag size={20} /> Add to Cart</button>
                  </div>
                  {product.customizable && (
                    <Link to={`/customize/${product.id}`} className="w-full border-2 border-dashed border-indigo-200 text-indigo-600 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition flex items-center justify-center gap-2"><Wand2 size={16} /> Want to change colors? Customize this item</Link>
                  )}
                </div>
             </div>
        </div>

        {/* 4. INSERT REVIEW SECTION HERE */}
        <hr className="border-gray-100 my-12" />
        <ReviewSection 
          product={product} 
          onSubmitReview={(review) => addReview(product.id, review)} 
        />

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="bg-gray-50 py-16 border-t border-gray-200 mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;