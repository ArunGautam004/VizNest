import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import WishlistPage from './pages/WishlistPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Customizer from './pages/Customizer';
import About from './pages/About';
import OrderSuccess from './pages/OrderSuccess';
import Admin from './pages/Admin';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { OrdersProvider } from './context/OrdersContext';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
          <OrdersProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/customize/:id" element={<Customizer />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
          </OrdersProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;