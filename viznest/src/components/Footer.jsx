import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-1">
              Viz<span className="text-indigo-500">Nest</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Reimagining home decor with real-time visualization. Design your dream space, customize every detail, and shop with confidence.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Shop Catalog</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/shop?category=furniture" className="hover:text-indigo-400 transition">Modern Furniture</Link></li>
              <li><Link to="/shop?category=decor" className="hover:text-indigo-400 transition">Home Decor</Link></li>
              <li><Link to="/shop?category=lighting" className="hover:text-indigo-400 transition">Lighting Solutions</Link></li>
              <li><Link to="/shop?category=art" className="hover:text-indigo-400 transition">Wall Art</Link></li>
              <li><Link to="/shop" className="hover:text-indigo-400 transition">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Customer Care</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-indigo-400 transition">About VizNest</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition">Order Status</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition">FAQs</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Stay in the Loop</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive customization tips and early access to new bases.</p>
            <form className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700 placeholder-gray-500 text-sm"
                />
              </div>
              <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                Subscribe <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Contact */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} VizNest. All rights reserved.</p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>123 Design Avenue, NY</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;