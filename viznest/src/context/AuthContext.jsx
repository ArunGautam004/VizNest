import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('viznest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('viznest_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('viznest_user');
    }
  }, [user]);

  // 1. LOGIN (Simulated)
  const login = (email, password) => {
    // In a real app, you would verify the password with a backend
    setUser({
      name: "Alex Designer", // Fallback for demo login
      email: email,
      phone: "+1 (987) 654-3210",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      street: "123 Creative St",
      city: "Design City",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      isAdmin: email.toLowerCase().includes('admin')
    });
  };

  // 2. SIGNUP (New: Accepts full user details)
  const signup = (userData) => {
    setUser({
      ...userData,
      avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=6366f1&color=fff`, // Auto-generate avatar
      isAdmin: userData.email.toLowerCase().includes('admin') // Security check
    });
  };

  const logout = () => setUser(null);
  
  const updateProfile = (data) => setUser((prev) => ({ ...prev, ...data }));

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);