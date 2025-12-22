const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products', error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching product', error: error.message });
  }
});

// ADD review (protected)
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { rating, comment } = req.body;
    product.reviewsList.push({
      user: req.user.name,
      rating,
      comment,
      date: new Date()
    });
    product.reviews = product.reviewsList.length;
    const totalRating = product.reviewsList.reduce((acc, r) => acc + r.rating, 0);
    product.rating = product.reviews > 0 ? totalRating / product.reviews : 0; // Fix div by zero

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error adding review', error: error.message });
  }
});

// ADMIN: Add product
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating product', error: error.message });
  }
});

// ADMIN: Update product
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product', error: error.message });
  }
});

// ADMIN: Delete product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product', error: error.message });
  }
});

module.exports = router;