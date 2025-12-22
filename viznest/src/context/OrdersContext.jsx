import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchOrders = async () => {
    if (!user) return;
    try {
      setError('');
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const addOrder = async (orderData) => {
    try {
      setError('');
      const res = await axios.post('http://localhost:5000/api/orders', orderData);
      setOrders(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      throw err;
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      setError('');
      const res = await axios.put(`http://localhost:5000/api/orders/${id}`, { status: newStatus });
      setOrders(prev => prev.map(order => order._id === id ? res.data : order));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
      throw err;
    }
  };

  const fetchAllOrders = async () => { // For admin
    try {
      setError('');
      const res = await axios.get('http://localhost:5000/api/orders/all');
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch all orders');
    }
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      loading, 
      error, 
      addOrder, 
      updateOrderStatus, 
      fetchOrders, 
      fetchAllOrders 
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);