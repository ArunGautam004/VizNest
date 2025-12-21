import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { SearchX, Layers, LayoutGrid, Filter } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  
  const { products } = useProducts(); 
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState(products);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  useEffect(() => {
    let result = products;

    if (initialQuery) {
      const lowerQuery = initialQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.category.toLowerCase().includes(lowerQuery)
      );
    } 
    else if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    setFilteredProducts(result);
  }, [initialQuery, activeCategory, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER SECTION (Compact) */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          
          {/* 1. SEARCH STATE: Show Title + Clear Button */}
          {initialQuery && (
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                Search: "{initialQuery}"
              </h1>
              <Link to="/shop" className="text-indigo-600 font-bold text-sm hover:underline">
                Clear Search
              </Link>
            </div>
          )}

          {/* 2. DEFAULT STATE: Show ONLY Filter Bar (No big title) */}
          {!initialQuery && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <Filter size={18} className="text-gray-400 flex-shrink-0" />
              <div className="h-6 w-px bg-gray-300 flex-shrink-0 mx-1"></div>
              
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all border
                    ${activeCategory === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'}
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* VIEW LOGIC */}

        {(initialQuery || activeCategory !== 'All') ? (
          <div>
            {filteredProducts.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                 <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-gray-600">No items found</h3>
                 <p className="text-gray-500 mt-2">Try selecting a different category.</p>
                 <button onClick={() => setActiveCategory('All')} className="mt-4 text-indigo-600 font-bold hover:underline">View All</button>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* "ALL" VIEW - SECTIONED LAYOUT */
          <div className="space-y-12">
            {categories.filter(c => c !== 'All').map((category) => {
              const categoryProducts = products.filter(p => p.category === category);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={category} className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Layers size={20} />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                    </div>
                    
                    <button 
                      onClick={() => setActiveCategory(category)}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      View All <LayoutGrid size={14}/>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;