const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product'); 
const { protect, admin } = require('../middleware/auth');

// --- 1. CREATE NEW ORDER ---
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    // 1. Create Order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      status: 'Processing'
    });

    const createdOrder = await order.save();

    // 2. Increment 'sold' count for each product
    for (const item of orderItems) {
        try {
            const product = await Product.findById(item.product);
            if (product) {
                product.sold = (product.sold || 0) + item.qty;
                await product.save();
            }
        } catch (err) {
            console.error("Error updating sold count for product:", item.product);
        }
    }

    res.status(201).json(createdOrder);
  }
});

// --- 2. GET ALL ORDERS (ADMIN) --- 
// ✅ MOVED THIS UP (Before /:id)
router.get('/all', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Admin Order Fetch Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- 3. GET MY ORDERS ---
router.get('/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// --- 4. GET ORDER BY ID ---
router.get('/:id', protect, async (req, res) => {
  try {
      const order = await Order.findById(req.params.id).populate('user', 'name email');
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
  } catch (error) {
      // Check if error is CastError (invalid ID format)
      if (error.kind === 'ObjectId') {
          return res.status(404).json({ message: 'Order not found' });
      }
      res.status(500).json({ message: 'Server Error' });
  }
});

// --- 5. UPDATE ORDER STATUS (ADMIN) ---
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;