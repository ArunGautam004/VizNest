const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    price: Number,
    customization: { colorName: String, colorHex: String, material: String }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);