import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import confetti from 'canvas-confetti'; // This will work now!

const OrderSuccess = () => {
  // In a real app, you might want to clear the cart here
  // const { clearCart } = useCart(); 
  
  useEffect(() => {
    // Fire the confetti!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }, // Start slightly lower than the middle
      colors: ['#4f46e5', '#818cf8', '#c7d2fe'] // VizNest Brand Colors (Indigos)
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-12 rounded-3xl shadow-lg max-w-lg w-full text-center animate-fade-in-up">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for your purchase. We are preparing your custom pieces with care. You will receive an email confirmation shortly.
        </p>

        {/* Fake Order ID */}
        <div className="bg-gray-50 p-4 rounded-xl mb-8 text-sm text-gray-500 border border-gray-100">
          Order ID: <span className="font-mono font-bold text-gray-900">#VN-{Math.floor(1000 + Math.random() * 9000)}</span>
        </div>

        <Link to="/" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform active:scale-95 duration-200">
          Return Home <ArrowRight size={20}/>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;