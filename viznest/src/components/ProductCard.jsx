import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        
        {/* IMAGE SECTION */}
        <div className="h-64 overflow-hidden bg-gray-100 relative flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
          />
          {product.customizable && (
             <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold rounded-md text-indigo-600 shadow-sm">
               Customizable
             </span>
          )}
        </div>
        
        {/* CONTENT SECTION */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="overflow-hidden pr-2">
              {/* Added 'truncate' to prevent category from breaking layout */}
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide truncate">
                {product.category}
              </p>
              
              {/* Added 'truncate' here: This adds the '...' if text is too long */}
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition truncate" title={product.name}>
                {product.name}
              </h3>
            </div>
            
            {/* Price Tag (keeps its size) */}
            <span className="bg-indigo-50 text-indigo-700 text-sm font-bold px-2 py-1 rounded-lg flex-shrink-0">
              ${product.price}
            </span>
          </div>
          
          {/* Rating Section - Pushed to bottom if needed */}
          <div className="mt-auto pt-2 flex items-center gap-1 text-yellow-400 text-sm">
            <Star size={14} fill="currentColor" />
            <span className="font-medium text-gray-700">{product.rating}</span>
            <span className="text-gray-400 text-xs">({product.reviews} reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;