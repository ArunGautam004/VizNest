import React from 'react';

const Hero = () => {
  return (
    // Main container with a fixed height. 'relative' is needed for the background image.
    <div className="relative h-[600px] lg:h-[700px] flex items-center">

      {/* --- Background Image & Overlay --- */}
      <div className="absolute inset-0 z-0">
        <img
          // A placeholder image from Unsplash. You can replace this URL later.
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920&auto=format&fit=crop"
          alt="Stylish living room with warm lighting"
          className="w-full h-full object-cover"
        />
        {/* This is a semi-transparent black layer to make text pop */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* --- Content (Text & Button) --- */}
      {/* z-10 ensures this sits ON TOP of the image */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight drop-shadow-lg">
          Your Dream Home, <br />
          Curated & Delivered.
        </h1>
        
        {/* Sub-headline */}
        <p className="mt-6 text-lg sm:text-xl text-stone-100 max-w-xl drop-shadow-md">
          Discover unique furniture, artisanal decor, and lighting that brings timeless elegance to your space.
        </p>

        {/* Call to Action Button */}
        <div className="mt-10">
          <button className="px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white font-medium text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            Shop The Collection
          </button>
        </div>

      </div>
    </div>
  );
};

export default Hero;