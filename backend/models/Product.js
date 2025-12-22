const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [String],
  mask: { type: String },
  customizable: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  description: { type: String },
  details: [{ label: String, value: String }],
  reviewsList: [{
    user: { type: String },
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Product', productSchema);