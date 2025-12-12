// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetails from './pages/ProductDetails';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Customizer from './pages/Customizer';
import Cart from './pages/Cart';
import About from './pages/About';     // Make sure this file exists
import Login from './pages/Login';     // New Login Page
import Profile from './pages/Profile'; // New Profile Dashboard
import Checkout from './pages/Checkout'; // NEW
import OrderSuccess from './pages/OrderSuccess'; // NEW

// Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

function App() {
  return (
    // 1. Wrap the app in AuthProvider first so User data is global
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
            <Navbar />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/customize/:id" element={<Customizer />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              {/* New Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />  
            </Routes>
            
          </div>
          <div>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;