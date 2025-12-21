import React, { createContext, useState, useContext, useEffect } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('viznest_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('viznest_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (newOrder) => {
    setOrders(prev => [...prev, { ...newOrder, id: Date.now(), status: 'Pending', date: new Date().toLocaleDateString() }]);
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);