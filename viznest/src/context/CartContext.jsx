import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load from localStorage or start empty
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ADD: Handles product + customization details + calculated price
  const addToCart = (product, customization = null, finalPrice = null) => {
    setCart((prevCart) => [
      ...prevCart, 
      { 
        ...product, 
        customization, 
        // Use finalPrice if provided (custom), otherwise use base product.price
        price: finalPrice || product.price, 
        cartId: Date.now() // Unique ID for deleting items
      }
    ]);
  };

  // REMOVE: Filters out the item by unique cartId
  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter(item => item.cartId !== cartId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);