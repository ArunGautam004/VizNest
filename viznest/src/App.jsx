import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './cards/navbar'
import Hero from './cards/hero'



function App() {
  return (
    // changed background to white for a cleaner look
    <div className="bg-white min-h-screen"> 
      <Navbar />
      
      {/* 2. Place the Hero component here */}
      {/* We don't need padding-top (pt-32) anymore because the Hero image goes behind the navbar */}
      <main>
        <Hero />
        
        {/* Placeholder for future sections */}
        <div className="py-16 text-center text-stone-500">
          (Next sections will go here...)
        </div>
      </main>
    </div>
  );
}

export default App;
