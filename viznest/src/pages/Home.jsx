import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Palette, Box } from 'lucide-react';
import { products } from '../data';
import ProductCard from '../components/ProductCard';

const Home = () => {

  
  const heroImages = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=1600"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-white">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* FIX 1: Add 'relative' HERE to this parent container.
            This creates the boundary so the image fills this box (Text + Right Side),
            but doesn't spill into the far left margin of the screen.
          */}
          <div className="flex flex-col lg:flex-row items-center min-h-[600px] relative">
            
            {/* LEFT: Text Content */}
            {/* Ensure z-10 is here so text sits ON TOP of the image */}
            <div className="w-full lg:w-1/2 py-16 px-6 lg:px-12 bg-gradient-to-br from-indigo-50 via-white to-white flex flex-col justify-center h-full lg:min-h-[600px] z-10 relative">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold w-fit mb-6">
                <Palette size={16} /> The New Way to Shop
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                Design it. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Visualize it.
                </span> <br/>
                Own it.
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                Stop guessing how furniture will look. Customize colors, materials, and textures in real-time to match your unique style.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop" className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                  Start Designing <ArrowRight className="w-5 h-5"/>
                </Link>
                <Link to="/about" className="px-8 py-4 rounded-xl bg-white text-gray-700 font-bold text-lg border border-gray-200 hover:bg-gray-50 transition flex items-center justify-center">
                  How it Works
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="mt-12 flex items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                </div>
                <p>Loved by 10,000+ Designers</p>
              </div>
            </div>

            {/* RIGHT: Auto-Sliding Images */}
            {/* FIX 2: REMOVE 'relative' from here. 
               This allows the absolute images inside to expand to the parent flex container size.
            */}
            <div className="hidden md:block w-full lg:w-1/2 h-[600px] bg-transparent overflow-hidden">
               {heroImages.map((img, index) => (
                <div
                  key={index}
                  // These images are now absolute to the FLEX PARENT.
                  // They will span the full width behind the text.
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Slide ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/5"></div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4"><Palette /></div>
            <h3 className="text-xl font-bold mb-2">Custom Colors</h3>
            <p className="text-gray-600">Choose from thousands of shades to match your walls perfectly.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4"><Layers /></div>
            <h3 className="text-xl font-bold mb-2">Material Swaps</h3>
            <p className="text-gray-600">Switch between velvet, leather, or linen with a single click.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition duration-300">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4"><Box /></div>
            <h3 className="text-xl font-bold mb-2">2D Visualization</h3>
            <p className="text-gray-600">See exactly how the finished product will look.</p>
          </div>
        </div>
      </section>

        {/* TRENDING PRODUCTS SECTION */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Now</h2>
              <p className="text-gray-600">Top picks from our design community.</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:underline">
              View All <ArrowRight size={16}/>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Show only first 4 products */}
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop" className="inline-flex items-center gap-2 text-indigo-600 font-bold">
               View All Bases <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;