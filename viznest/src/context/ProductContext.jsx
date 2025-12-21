import React, { createContext, useState, useContext, useEffect } from 'react';
import { products as initialData } from '../data';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('viznest_products');
    return savedProducts ? JSON.parse(savedProducts) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('viznest_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    setProducts((prev) => [
      { ...newProduct, id: Date.now(), rating: 0, reviews: 0, reviewsList: [] },
      ...prev
    ]);
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  // NEW: HANDLE REVIEWS
  const addReview = (productId, reviewData) => {
    setProducts((prev) => prev.map((product) => {
      if (product.id === productId) {
        // 1. Add new review to list
        const currentReviews = product.reviewsList || [];
        const newReviewsList = [reviewData, ...currentReviews];
        
        // 2. Recalculate Average Rating
        const totalStars = newReviewsList.reduce((sum, r) => sum + r.rating, 0);
        const newAverage = (totalStars / newReviewsList.length).toFixed(1);

        return {
          ...product,
          reviewsList: newReviewsList,
          reviews: newReviewsList.length,
          rating: parseFloat(newAverage)
        };
      }
      return product;
    }));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);