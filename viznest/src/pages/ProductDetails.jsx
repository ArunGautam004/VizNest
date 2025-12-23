import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ReviewSection from '../components/ReviewSection';
import ProductCard from '../components/ProductCard'; 
import { Star, Wand2, ShoppingBag, Zap, ChevronLeft, ChevronRight, Palette } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // --- 1. FETCH DATA ---
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setCurrentImageIndex(0);

        // Fetch Related (Simplified)
        try {
            const allRes = await fetch('http://localhost:5000/api/products');
            if (allRes.ok) {
                const allData = await allRes.json();
                const related = allData
                    .filter(p => p._id !== data._id && p.category === data.category)
                    .slice(0, 4);
                setRelatedProducts(related);
            }
        } catch (e) { console.error(e); }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]); 

  // --- 2. HANDLERS ---
  const handleAddReview = async (reviewData) => { /* ... existing logic ... */ };
  const handleEditReview = async (reviewId, updatedData) => { /* ... existing logic ... */ };

  const handleAddToCart = () => {
    if (!product) return;
    // Adds the STANDARD version (no custom color)
    addToCart({ ...product, id: product._id });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({ ...product, id: product._id });
    navigate('/cart');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Product not found</div>;

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const productId = product._id || product.id;

  return (
    <div className="bg-white overflow-hidden min-h-screen"> 
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* LEFT: IMAGES */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square relative group">
              <img src={gallery[currentImageIndex]} alt={product.name} className="w-full h-full object-contain" />
              {gallery.length > 1 && (
                <>
                  <button onClick={() => setCurrentImageIndex(i => i === 0 ? gallery.length -1 : i - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md"><ChevronLeft size={20}/></button>
                  <button onClick={() => setCurrentImageIndex(i => i === gallery.length -1 ? 0 : i + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md"><ChevronRight size={20}/></button>
                </>
              )}
            </div>
            {/* Gallery Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
                 {gallery.map((img, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${currentImageIndex === idx ? 'border-indigo-600' : 'border-transparent'}`}>
                       <img src={img} className="w-full h-full object-cover" />
                    </button>
                 ))}
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div>
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">{product.category}</span>
            <h1 className="text-4xl font-black text-gray-900 mt-2 mb-2">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                <div className="flex items-center text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <span className="font-bold ml-1 text-gray-900">{product.rating}</span>
                    <span className="text-sm text-gray-400 ml-1">({product.numReviews} reviews)</span>
                </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">{product.description}</p>

            {/* ✅ CUSTOMIZATION CALL-TO-ACTION */}
            {product.customizable && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                            <Palette className="w-5 h-5"/> Design Your Own
                        </h3>
                        <p className="text-indigo-700/80 text-sm mt-1 mb-4">
                            Choose from 9+ premium colors and materials. Visualize it instantly.
                        </p>
                        <Link 
                            to={`/customize/${productId}`} 
                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg transform active:scale-95"
                        >
                            <Wand2 size={18} /> Open Design Studio
                        </Link>
                    </div>
                    {/* Decorative Background Icon */}
                    <Palette className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-100 opacity-50 z-0" />
                </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
                <button onClick={handleBuyNow} className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2 shadow-lg">
                    <Zap size={20} /> Buy Standard
                </button>
                <button onClick={handleAddToCart} className="flex-1 bg-white border-2 border-gray-200 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                    <ShoppingBag size={20} /> Add to Cart
                </button>
            </div>
            
            {/* Specs */}
            {product.details && product.details.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Product Specifications</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  {product.details.map((detail, idx) => (
                    <div key={idx} className="border-b border-gray-50 pb-2">
                      <dt className="text-sm text-gray-500">{detail.label}</dt>
                      <dd className="font-medium text-gray-900">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS & REVIEWS */}
        {relatedProducts.length > 0 && (
          <section className="py-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
        
        <div className="pt-12 border-t border-gray-100">
           <ReviewSection product={product} currentUser={user} onSubmitReview={handleAddReview} onEditReview={handleEditReview}/>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;