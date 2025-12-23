const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true }, // ✅ Added Phone to Address
  isPrimary: { type: Boolean, default: false }
});

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String }, // Main Profile Phone
  avatar: { type: String },
  isAdmin: { type: Boolean, required: true, default: false },
  addresses: [addressSchema], 
}, { timestamps: true });

// ✅ FIX: Removed 'next' parameter. Async function automatically handles promise.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // Just return instead of calling next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);