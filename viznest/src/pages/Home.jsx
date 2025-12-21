import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import EnhancedHero from '../components/EnhancedHero';
import BlogPreview from '../components/BlogPreview';
import { products } from '../data/products';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHero />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12">
            Design Your Space with Confidence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-rose-50 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Real-Time Customization</h3>
              <p className="text-gray-600">Change colors, fabrics, and finishes instantly.</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-amber-50 to-sage-50 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">See It in Your Room</h3>
              <p className="text-gray-600">Visualize products in your actual space.</p>
            </div>
            <div className="p-8 bg-gradient-to-br from-rose-50 to-indigo-50 rounded-2xl">
              <h3 className="text-2xl font-bold mb-4">Curated Collections</h3>
              <p className="text-gray-600">Handpicked pieces for timeless style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <Link to="/shop" className="text-indigo-600 font-medium hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <BlogPreview />
    </div>
  );
};

export default Home;