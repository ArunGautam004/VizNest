import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Ref to detect clicks outside
  const searchContainerRef = useRef(null);

  // Effect to close search if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

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
          
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tighter flex items-center gap-1">
              Viz<span className="text-indigo-600">Nest</span>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
            <Link to="/shop" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Shop Catalog</Link>
            <Link to="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About Us</Link>
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center space-x-6">
            
            {/* 1. SEARCH SECTION (Wrapped in Ref) */}
            <div className="" ref={searchContainerRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`hover:text-indigo-600 transition flex items-center ${isSearchOpen ? 'text-indigo-600' : 'text-gray-500'}`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* SEARCH BAR (Fixed Position = Full Width) */}
              {isSearchOpen && (
                <div className="fixed top-16 left-0 w-full bg-white border-b border-gray-200 p-4 shadow-lg z-40 animate-fade-in-down">
                  <div className="max-w-7xl mx-auto">
                    <form onSubmit={handleSearchSubmit} className="flex gap-4">
                      <input 
                        type="text" 
                        placeholder="Search for vases, chairs, art..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 text-lg">
                        Search
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* 2. PROFILE LOGIC */}
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                />
              </Link>
            ) : (
              <Link to="/login" className="text-gray-500 hover:text-indigo-600">
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* 3. CART ICON */}
            <Link to="/cart" className="relative text-gray-500 hover:text-indigo-600">
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* 4. MOBILE MENU BUTTON */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 font-medium text-gray-700 hover:bg-gray-50 rounded-md">Home</Link>
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 font-medium text-gray-700 hover:bg-gray-50 rounded-md">Shop Catalog</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 font-medium text-gray-700 hover:bg-gray-50 rounded-md">About Us</Link>
            <Link to={user ? "/profile" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 font-medium text-gray-700 hover:bg-gray-50 rounded-md">
              {user ? "My Profile" : "Login / Register"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;