import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('viznest_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('viznest_products', JSON.stringify(products));
  }, [products]);

  const addReview = (productId, review) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedReviews = [review, ...(product.reviewsList || [])];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...product,
          reviewsList: updatedReviews,
          reviews: updatedReviews.length,
          rating: Number(avgRating.toFixed(1))
        };
      }
      return product;
    }));
  };

  return (
    <ProductContext.Provider value={{ products, addReview }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);