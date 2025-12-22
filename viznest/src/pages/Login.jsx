import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignup) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-rose-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10">
        <h2 className="text-4xl font-bold text-center mb-8">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition text-lg"
          >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }} className="text-indigo-600 font-bold hover:underline">
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <p className="text-center mt-6 text-sm text-gray-500">
          Tip: Try email <strong>admin@viznest.com</strong> with any password to get admin access
        </p>
      </div>
    </div>
  );
};

export default Login;