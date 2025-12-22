const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// USER: Get my orders
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name image price').sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders', error: error.message });
  }
});

// USER: Create order
router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user._id,
      items: req.body.items,
      total: req.body.total
    });
    const populatedOrder = await Order.findById(order._id).populate('items.product', 'name image price');
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating order', error: error.message });
  }
});

// ADMIN: Get all orders
router.get('/all', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').populate('items.product', 'name image').sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders', error: error.message });
  }
});

// ADMIN: Update order status
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (order) res.json(order);
    else res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order', error: error.message });
  }
});

module.exports = router;