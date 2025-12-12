import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. Import useLocation

const Login = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 2. Hook to read the "state"

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    
    // 3. Check if we were redirected here from Cart
    // "location.state?.from" holds the URL '/checkout' if coming from Cart
    const destination = location.state?.from || '/profile';
    
    navigate(destination);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to VizNest</h2>
          <p className="mt-2 text-sm text-gray-600">Enter any email to simulate login.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;