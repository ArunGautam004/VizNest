import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isWished, setIsWished] = React.useState(false);

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          {product.customizable && (
            <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Customizable
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setIsWished(!isWished); }}
            className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition"
          >
            <Heart size={18} className={isWished ? "fill-rose-500 text-rose-500" : "text-gray-600"} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">{product.category}</p>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-indigo-600">${product.price}</span>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;