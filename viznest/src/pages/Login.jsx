import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, Lock, User, Phone, MapPin, ArrowRight, CheckCircle, ArrowLeft, Eye, EyeOff 
} from 'lucide-react';

// --- FIXED: Component defined OUTSIDE the main component ---
const InputField = ({ icon: Icon, type, placeholder, value, onChange, name }) => (
  <div className="relative mb-4">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <input
      required
      type={type}
      name={name}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition bg-white"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const Login = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/profile';

  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [showPass, setShowPass] = useState(false);
  const [notification, setNotification] = useState(null);

  // Login Data
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Signup Data
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Forgot Password Data
  const [resetEmail, setResetEmail] = useState('');

  // --- HANDLERS ---
  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login(loginData.email, loginData.password);
    navigate(from);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      showNotify("Passwords do not match!");
      return;
    }
    const { confirmPassword, ...finalData } = signupData;
    signup(finalData);
    navigate(from);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    showNotify(`Reset link sent to ${resetEmail}`);
    setTimeout(() => setView('login'), 2000);
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: VISUAL SHOWCASE */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-multiply"></div>
        <div className="relative z-10 p-12 text-white text-center max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6">VizNest</h1>
          <p className="text-xl text-indigo-100 leading-relaxed mb-8">
            Join our community of designers and creators. Customize, visualize, and bring your dream decor to life.
          </p>
          <div className="flex gap-4 justify-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <span className="text-2xl font-bold">4.9</span>
            </div>
            <div className="text-left">
              <div className="flex text-yellow-400 mb-1">★★★★★</div>
              <p className="text-sm text-indigo-200">Trusted by 10k+ Creators</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: FORMS */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto h-screen">
        <div className="max-w-md w-full">
          
          {notification && (
            <div className="mb-6 bg-indigo-900 text-white px-4 py-3 rounded-lg flex items-center gap-2 animate-bounce">
              <CheckCircle size={20}/> {notification}
            </div>
          )}

          {/* --- VIEW 1: LOGIN --- */}
          {view === 'login' && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
              </div>

              <form onSubmit={handleLogin}>
                <InputField 
                  icon={Mail} type="email" placeholder="Email Address" 
                  value={loginData.email} 
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
                />
                
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    required
                    type={showPass ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    placeholder="Password"
                    value={loginData.password} 
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600"
                  >
                    {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                  </button>
                </div>

                <div className="flex justify-end mb-6">
                  <button type="button" onClick={() => setView('forgot')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  Sign In <ArrowRight size={20}/>
                </button>
              </form>

              <div className="mt-8 text-center text-gray-600">
                Don't have an account? 
                <button onClick={() => setView('signup')} className="ml-2 font-bold text-indigo-600 hover:underline">
                  Sign up for free
                </button>
              </div>
            </div>
          )}

          {/* --- VIEW 2: SIGNUP --- */}
          {view === 'signup' && (
            <div className="animate-fade-in py-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-500 mt-2">Join us to start customizing.</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Personal Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <InputField icon={User} type="text" name="name" placeholder="Full Name" value={signupData.name} onChange={(e) => setSignupData({...signupData, name: e.target.value})} />
                  <InputField icon={Phone} type="tel" name="phone" placeholder="Phone Number" value={signupData.phone} onChange={(e) => setSignupData({...signupData, phone: e.target.value})} />
                </div>
                <InputField icon={Mail} type="email" name="email" placeholder="Email Address" value={signupData.email} onChange={(e) => setSignupData({...signupData, email: e.target.value})} />
                
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-2">Shipping Address</h3>
                <InputField icon={MapPin} type="text" name="street" placeholder="Street Address" value={signupData.street} onChange={(e) => setSignupData({...signupData, street: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="City" value={signupData.city} onChange={(e) => setSignupData({...signupData, city: e.target.value})} />
                  <input required className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Zip Code" value={signupData.zipCode} onChange={(e) => setSignupData({...signupData, zipCode: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="State" value={signupData.state} onChange={(e) => setSignupData({...signupData, state: e.target.value})} />
                  <input required className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Country" value={signupData.country} onChange={(e) => setSignupData({...signupData, country: e.target.value})} />
                </div>

                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-2">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField icon={Lock} type="password" name="password" placeholder="Password" value={signupData.password} onChange={(e) => setSignupData({...signupData, password: e.target.value})} />
                  <InputField icon={Lock} type="password" name="confirmPassword" placeholder="Confirm Pass" value={signupData.confirmPassword} onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})} />
                </div>

                <button type="submit" className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg flex items-center justify-center gap-2">
                  Create Account <ArrowRight size={20}/>
                </button>
              </form>

              <div className="mt-6 text-center text-gray-600">
                Already have an account? 
                <button onClick={() => setView('login')} className="ml-2 font-bold text-indigo-600 hover:underline">
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* --- VIEW 3: FORGOT PASSWORD --- */}
          {view === 'forgot' && (
            <div className="animate-fade-in text-center">
              <div className="mb-6 inline-flex p-4 bg-indigo-50 rounded-full text-indigo-600">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot password?</h2>
              <p className="text-gray-500 mb-8">No worries! Enter your email and we'll send you reset instructions.</p>

              <form onSubmit={handleForgot}>
                <InputField 
                  icon={Mail} type="email" placeholder="Enter your email" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)} 
                />
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">
                  Send Reset Link
                </button>
              </form>

              <button 
                onClick={() => setView('login')}
                className="mt-8 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 mx-auto"
              >
                <ArrowLeft size={18}/> Back to Log In
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;