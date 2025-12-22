// backend/seed.js - Run this once to add products
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: "Minimalist Lounge Chair",
    price: 299,
    category: "Furniture",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800"],
    customizable: true,
    description: "A perfect blend of modern minimalism and comfort.",
    details: [
      { label: "Dimensions", value: "H 32” x W 24” x D 24”" },
      { label: "Material", value: "Solid Ash Wood" }
    ],
    reviewsList: []
  },
  {
    name: "Sage Arc Floor Lamp",
    price: 189,
    category: "Lighting",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"],
    customizable: true,
    description: "Graceful arched lamp with customizable shade.",
    details: [{ label: "Height", value: "72 inches" }],
    reviewsList: []
  },
  {
    name: "Handwoven Jute Rug",
    price: 149,
    category: "Textiles",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"],
    customizable: false,
    description: "Natural texture and warmth.",
    details: [{ label: "Size", value: "8' x 10'" }],
    reviewsList: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit();
  }
};

seedDB();