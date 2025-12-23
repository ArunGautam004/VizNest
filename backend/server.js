// 1. SSL FIX (Must be at the very top)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path'); // ✅ IMPORT PATH MODULE

dotenv.config();
connectDB();

const app = express();

// 2. CORS (Allow Frontend)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// 3. INCREASE SIZE LIMITS (Crucial for Images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 4. SERVE STATIC FILES (✅ THIS FIXES THE IMAGE ISSUE)
// This tells the server: "If a request comes for /uploads, look in the uploads folder"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products')); 
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack); // Log error to terminal
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));