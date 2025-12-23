// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
      
      // ✅ CRITICAL: Ensure these 4 lines exist so Admin sees the choices
      selectedColorName: { type: String }, 
      selectedColorHex: { type: String },
      selectedMaterial: { type: String },
      customPrice: { type: Number }
    }
  ],
  // ... rest of your schema (shippingAddress, paymentMethod, status, etc.)
  status: { 
    type: String, 
    required: true, 
    default: 'Processing',
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'] 
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);