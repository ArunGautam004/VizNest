import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Search, User, Heart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Navigation Links Data
  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Furniture', href: '#' },
    { name: 'Lighting', href: '#' },
    { name: 'Decor', href: '#' },
    { name: 'Inspiration', href: '#' },
  ];

  return (
    // Outer container handles the "Floating" position
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      {/* The "Card" itself: Rounded, White, Shadow, Blur */}
      <nav className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-stone-100">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* 1. Mobile Menu Button (Left) */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-stone-600 hover:text-stone-900 focus:outline-none p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* 2. Logo (Center on mobile, Left on Desktop) */}
            <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-auto">
              <a href="/" className="text-2xl font-serif font-bold text-stone-800 tracking-wide">
                Viz<span className="text-amber-700">Nest</span>.
              </a>
            </div>

            {/* 3. Desktop Navigation Links (Center) */}
            <div className="hidden md:flex space-x-8 items-center justify-center flex-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors duration-200 uppercase tracking-wider"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* 4. Action Icons (Right) */}
            <div className="hidden md:flex items-center space-x-6">
              <button className="text-stone-500 hover:text-amber-700 transition-colors">
                <Search size={20} />
              </button>
              <button className="text-stone-500 hover:text-amber-700 transition-colors">
                <Heart size={20} />
              </button>
              <div className="relative group">
                <button className="text-stone-500 hover:text-amber-700 transition-colors flex items-center">
                  <ShoppingBag size={20} />
                  <span className="absolute -top-2 -right-2 bg-amber-700 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    2
                  </span>
                </button>
              </div>
              <button className="text-stone-500 hover:text-amber-700 transition-colors">
                <User size={20} />
              </button>
            </div>

            {/* Mobile Shopping Bag (Visible on Mobile) */}
            <div className="flex md:hidden">
               <button className="text-stone-600 p-2">
                  <ShoppingBag size={24} />
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown (Expands within the card) */}
        {isOpen && (
          <div className="md:hidden border-t border-stone-100">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-3 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-700"
                >
                  {link.name}
                </a>
              ))}
              {/* Mobile Action Icons Row */}
              <div className="flex justify-around pt-4 border-t border-stone-100 mt-4">
                 <button className="flex flex-col items-center text-xs text-stone-500">
                    <Search size={20} className="mb-1"/> Search
                 </button>
                 <button className="flex flex-col items-center text-xs text-stone-500">
                    <Heart size={20} className="mb-1"/> Saved
                 </button>
                 <button className="flex flex-col items-center text-xs text-stone-500">
                    <User size={20} className="mb-1"/> Account
                 </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;