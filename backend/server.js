// 1. SSL FIX (Must be at the very top)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport'); // ✅ Added
const session = require('express-session'); // ✅ Added
const connectDB = require('./config/db');

dotenv.config();
connectDB();

// Initialize Passport Config
require('./config/passport')(passport); // ✅ Added (ensure this path is correct)

const app = express();

// 2. CORS (Allow Frontend)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// 3. INCREASE SIZE LIMITS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 4. SESSION MIDDLEWARE (Required for Passport OAuth) ✅ Added
app.use(session({
  secret: process.env.SESSION_SECRET || 'viznest_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// 5. INITIALIZE PASSPORT ✅ Added
app.use(passport.initialize());
app.use(passport.session());

// 6. ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products')); 
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));

// Static folder for uploaded avatars (if needed)
app.use('/uploads', express.static('uploads'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});
app.get('/api/config/razorpay', (req, res) => {
  res.send(process.env.RAZORPAY_KEY_ID);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));