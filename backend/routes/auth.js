const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../config/upload');
const jwt = require('jsonwebtoken');

// --- REGISTER USER ---
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- LOGIN USER ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses,
        isAdmin: user.isAdmin,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- GET USER PROFILE ---
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// --- UPDATE PROFILE ---
const uploadAvatar = upload.single('avatar');
router.put('/profile', protect, uploadAvatar, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    
    if (req.file) {
      user.avatar = req.file.path;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      addresses: updatedUser.addresses,
      isAdmin: updatedUser.isAdmin,
      token: req.headers.authorization.split(' ')[1]
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// --- ADD ADDRESS (POST) ---
router.post('/address', protect, async (req, res) => {
    const { street, city, state, zip, country, phone, isPrimary } = req.body;
    const user = await User.findById(req.user._id);

    if(user) {
        if(isPrimary) {
            user.addresses.forEach(a => a.isPrimary = false);
        }
        
        const shouldBePrimary = isPrimary || user.addresses.length === 0;

        user.addresses.push({ 
            street, city, state, zip, country, 
            phone, 
            isPrimary: shouldBePrimary 
        });
        
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// --- UPDATE ADDRESS (PUT) - ✅ NEW ROUTE ---
router.put('/address/:addressId', protect, async (req, res) => {
    const { street, city, state, zip, country, phone, isPrimary } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        const address = user.addresses.id(req.params.addressId);
        if (address) {
            // Update fields if provided
            address.street = street || address.street;
            address.city = city || address.city;
            address.state = state || address.state;
            address.zip = zip || address.zip;
            address.country = country || address.country;
            address.phone = phone || address.phone;

            // Handle Primary Toggle
            if (isPrimary) {
                user.addresses.forEach(a => a.isPrimary = false); // Unset others
                address.isPrimary = true;
            }

            await user.save();
            res.json(user.addresses);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// --- DELETE ADDRESS ---
router.delete('/address/:addressId', protect, async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;