const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

// ── Helper: compute India GST for a single order item ──────────────────────
// 3% on material values (gold/diamond/stone/pearl/ruby/metal)
// 5% on making charges
// Falls back to 3% flat on item price if no priceBreakdown stored
function computeItemGST(product, quantity) {
  const pb = product.priceBreakdown;
  if (pb && (pb.goldValue || pb.diamondValue || pb.stoneValue || pb.pearlValue || pb.rubyValue || pb.metalValue || pb.makingCharges)) {
    const materialValue = ((pb.goldValue || 0) + (pb.diamondValue || 0) + (pb.stoneValue || 0) +
      (pb.pearlValue || 0) + (pb.rubyValue || 0) + (pb.metalValue || 0)) * quantity;
    const makingValue = (pb.makingCharges || 0) * quantity;
    const materialGST = Math.round(materialValue * 0.03 * 100) / 100;
    const makingGST = Math.round(makingValue * 0.05 * 100) / 100;
    return { materialGST, makingGST, total: Math.round((materialGST + makingGST) * 100) / 100 };
  }
  const fallback = Math.round(product.price * quantity * 0.03 * 100) / 100;
  return { materialGST: fallback, makingGST: 0, total: fallback };
}

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = { user: req.user.id };
  if (status) query.status = status;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate('items.product', 'name image');

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: {
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id
  }).populate('items.product', 'name image sku');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    data: { order }
  });
}));

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { shippingAddress, billingAddress, paymentMethod, notes, couponCode } = req.body;

  // Get user's cart — populate full product including priceBreakdown for GST
  const cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cart is empty'
    });
  }

  // Verify stock and prepare order items — prices from DB, NOT client
  const orderItems = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.product;

    if (!product || !product.isActive) {
      return res.status(400).json({
        success: false,
        message: `Product "${item.product?.name || 'Unknown'}" is no longer available`
      });
    }

    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock for "${product.name}". Available: ${product.stock}`
      });
    }

    // Use DB price, not cart-stored price — prevents price manipulation
    const lineTotal = Math.round(product.price * item.quantity * 100) / 100;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity
    });

    subtotal += lineTotal;
  }

  // Round subtotal
  subtotal = Math.round(subtotal * 100) / 100;

  // ── Coupon / Discount ──────────────────────────────────
  let discount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    const validation = coupon.validateForOrder(req.user.id, subtotal);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    discount = validation.discount;
    appliedCoupon = coupon;
  }

  // ── India GST: 3% on material value + 5% on making charges ─────────────
  let totalMaterialGST = 0;
  let totalMakingGST = 0;
  for (const item of cart.items) {
    const gst = computeItemGST(item.product, item.quantity);
    totalMaterialGST += gst.materialGST;
    totalMakingGST += gst.makingGST;
  }
  totalMaterialGST = Math.round(totalMaterialGST * 100) / 100;
  totalMakingGST = Math.round(totalMakingGST * 100) / 100;
  const tax = Math.round((totalMaterialGST + totalMakingGST) * 100) / 100;

  // ── Shipping (free above ₹50,000) ──────────────────────────────────────
  const shippingCost = subtotal >= 50000 ? 0 : 500;

  // ── Final total (subtotal - discount + GST + shipping) ─────────────────
  const total = Math.round((subtotal - discount + tax + shippingCost) * 100) / 100;

  // ── Atomic stock deduction (prevents overselling) ──────────────────────
  const stockUpdates = [];
  for (const item of cart.items) {
    const result = await Product.findOneAndUpdate(
      { _id: item.product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (!result) {
      // Rollback all stock changes made so far
      for (const update of stockUpdates) {
        await Product.findByIdAndUpdate(update.productId, {
          $inc: { stock: update.quantity }
        });
      }
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for "${item.product.name}". Please refresh your cart.`
      });
    }

    stockUpdates.push({ productId: item.product._id, quantity: item.quantity });
  }

  // ── Create order ────────────────────────────────────────────────────────
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    paymentMethod,
    subtotal,
    shippingCost,
    tax,
    taxBreakdown: { materialGST: totalMaterialGST, makingGST: totalMakingGST },
    discount,
    total,
    notes,
    status: 'confirmed',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
  });

  // ── Mark coupon as used ─────────────────────────────────────────────────
  if (appliedCoupon) {
    appliedCoupon.usedCount += 1;
    appliedCoupon.usedBy.push({ user: req.user.id });
    await appliedCoupon.save();
  }

  // Clear cart
  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully',
    data: { order }
  });
}));

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Can only cancel pending or confirmed orders
  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel order at this stage'
    });
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity }
    });
  }

  order.status = 'cancelled';
  if (order.paymentStatus === 'paid') {
    order.paymentStatus = 'refunded';
  }
  await order.save();

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: { order }
  });
}));

// ============== ADMIN ROUTES ==============

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name sku');

  const total = await Order.countDocuments(query);

  // Get order stats
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$total' },
        totalTax: { $sum: '$tax' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      orders,
      stats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { status, trackingNumber, deliveryPartner, expectedDelivery, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  order.status = status;

  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (deliveryPartner) order.deliveryPartner = deliveryPartner;
  if (expectedDelivery) order.expectedDelivery = expectedDelivery;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
  }

  // Add to status history with note
  order.statusHistory.push({
    status,
    note
  });

  await order.save();

  res.json({
    success: true,
    message: 'Order status updated',
    data: { order }
  });
}));

// @desc    Get order by orderId (admin)
// @route   GET /api/orders/admin/order/:orderId
// @access  Private/Admin
router.get('/admin/order/:orderId', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId })
    .populate('user', 'firstName lastName email phone')
    .populate('items.product', 'name image sku');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  res.json({
    success: true,
    data: { order }
  });
}));

module.exports = router;
