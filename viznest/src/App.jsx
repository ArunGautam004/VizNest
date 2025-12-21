import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Customizer from './pages/Customizer';
import Cart from './pages/Cart';
import About from './pages/About';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Admin from './pages/Admin'; // NEW: Import Admin Page

// Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext'; // NEW: Import Product Provider

function App() {
  return (
    // 1. Auth Provider (User Data)
    <AuthProvider>
      {/* 2. Cart Provider (Shopping Cart) */}
      <CartProvider>
        {/* 3. Product Provider (Product Inventory & Admin) */}
        <ProductProvider>
          <Router>
            {/* Flex Column Layout to push Footer to bottom */}
            <div className="min-h-screen bg-gray-50 text-slate-900 font-sans flex flex-col">
              
              <Navbar />
              
              {/* Main Content Area (Grows to fill space) */}
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/customize/:id" element={<Customizer />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  {/* User Account Routes */}
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Checkout Flow */}
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  
                  {/* Admin Route */}
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </div>

              <Footer />
              
            </div>
          </Router>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;