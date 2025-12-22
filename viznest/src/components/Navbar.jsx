import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Heart, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth(); // ← Added logout
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tighter flex items-center gap-1">
            Viz<span className="text-indigo-600">Nest</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium transition">Home</Link>
            <Link to="/shop" className="text-gray-700 hover:text-indigo-600 font-medium transition">Shop</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 font-medium transition">About</Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-indigo-600 font-medium transition flex items-center gap-1">
              <Heart size={18} /> Wishlist
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingBag size={24} className="text-gray-700 hover:text-indigo-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
                >
                  <User size={20} />
                  <span>{user.name || user.email.split('@')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-5 py-3 hover:bg-gray-50 transition"
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-5 py-3 hover:bg-gray-50 transition"
                      >
                        My Orders
                      </Link>

                      {/* ADMIN DASHBOARD - ONLY FOR ADMINS */}
                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-5 py-3 hover:bg-indigo-50 text-indigo-600 font-semibold transition border-t border-gray-100"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 transition flex items-center gap-2"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600">Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600">Shop</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600">About</Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600">Wishlist</Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600">
              Cart ({cartCount})
            </Link>

            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600">
                  My Profile
                </Link>
                {user.isAdmin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-indigo-600 font-bold">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left text-red-600 py-2">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-indigo-600 font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;