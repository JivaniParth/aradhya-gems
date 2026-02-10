const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const Cart = require('../models/Cart');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

// @desc    Validate a coupon code (customer)
// @route   POST /api/coupons/validate
// @access  Private
router.post('/validate', protect, asyncHandler(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Coupon code is required'
    });
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    return res.status(404).json({
      success: false,
      message: 'Invalid coupon code'
    });
  }

  // Get user's cart subtotal for validation
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product ? item.product.price : item.price;
    return sum + Math.round(price * item.quantity * 100) / 100;
  }, 0);

  const validation = coupon.validateForOrder(req.user.id, subtotal);

  res.json({
    success: validation.valid,
    message: validation.message,
    data: validation.valid ? {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: validation.discount,
      description: coupon.description
    } : null
  });
}));

// ============== ADMIN ROUTES ==============

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
router.get('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json({ success: true, data: { coupons } });
}));

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const {
    code, description, discountType, discountValue,
    maxDiscount, minOrderAmount, usageLimit, perUserLimit,
    validFrom, validUntil
  } = req.body;

  const coupon = await Coupon.create({
    code, description, discountType, discountValue,
    maxDiscount, minOrderAmount, usageLimit, perUserLimit,
    validFrom, validUntil
  });

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: { coupon }
  });
}));

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const allowedFields = [
    'description', 'discountType', 'discountValue',
    'maxDiscount', 'minOrderAmount', 'usageLimit', 'perUserLimit',
    'validFrom', 'validUntil', 'isActive'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  res.json({ success: true, message: 'Coupon updated', data: { coupon } });
}));

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }
  res.json({ success: true, message: 'Coupon deleted' });
}));

module.exports = router;
