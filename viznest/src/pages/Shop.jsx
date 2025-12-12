import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { products } from '../data';
import { Wand2, SearchX } from 'lucide-react';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || ''; // Get search term from URL
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Filter products whenever the URL changes
  useEffect(() => {
    if (initialQuery) {
      const lowerQuery = initialQuery.toLowerCase();
      const results = products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) || 
        product.category.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products); // Show all if no search
    }
  }, [initialQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {initialQuery ? `Results for "${initialQuery}"` : "Base Catalog"}
        </h2>
        {initialQuery && (
          <Link to="/shop" className="text-indigo-600 hover:underline text-sm">Clear Search</Link>
        )}
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600">No products found</h3>
          <p className="text-gray-500">Try searching for "Chair", "Vase", or "Art".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="h-64 overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-indigo-500 font-semibold uppercase">{product.category}</p>
                    <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  </div>
                  <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded-full">${product.price}</span>
                </div>
                
                <div className="mt-4">
                  {product.customizable ? (
                    <Link 
                      to={`/customize/${product.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-900 text-white py-3 rounded-lg hover:bg-indigo-800 transition"
                    >
                      <Wand2 size={18} /> Customize This
                    </Link>
                  ) : (
                    <button className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg cursor-not-allowed">
                      Standard Only
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;