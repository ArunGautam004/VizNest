import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tighter flex items-center gap-1">
            Viz<span className="text-indigo-600">Nest</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-indigo-600 font-medium transition">Shop</Link>
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition">About</Link>
            <Link to="/wishlist" className="text-gray-600 hover:text-indigo-600 font-medium transition flex items-center gap-1">
              <Heart size={18} /> Wishlist
            </Link>

            {user ? (
              <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
                <User size={20} />
                <span className="font-medium">{user.name}</span>
              </Link>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                <User size={20} />
              </Link>
            )}

            <Link to="/cart" className="relative">
              <ShoppingBag size={24} className="text-gray-600 hover:text-indigo-600 transition" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                </span>
              )}
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg">
          <div className="flex flex-col p-4 space-y-4">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist</Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>Cart ({cart.length})</Link>
            {user ? <Link to="/profile">Profile</Link> : <Link to="/login">Login</Link>}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;