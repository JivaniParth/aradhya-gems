const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
// ── Helper: compute India GST for a single cart item ──────────────────────
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
  // Fallback: 3% flat on item price
  const fallback = Math.round(product.price * quantity * 0.03 * 100) / 100;
  return { materialGST: fallback, makingGST: 0, total: fallback };
}

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product', 'name image price stock sku isActive priceBreakdown');

  if (!cart) {
    return res.json({
      success: true,
      data: { cart: { items: [], total: 0, itemCount: 0 } }
    });
  }

  // Refresh prices from DB and remove inactive products
  let pricesUpdated = false;
  cart.items = cart.items.filter(item => {
    if (!item.product || !item.product.isActive) return false;
    if (item.price !== item.product.price) {
      item.price = item.product.price;
      pricesUpdated = true;
    }
    // Cap quantity to available stock
    if (item.quantity > item.product.stock) {
      item.quantity = item.product.stock;
      pricesUpdated = true;
    }
    return item.quantity > 0;
  });

  if (pricesUpdated) {
    cart.updatedAt = new Date();
    await cart.save();
    // Re-populate after save
    cart = await Cart.findById(cart._id)
      .populate('items.product', 'name image price stock sku isActive priceBreakdown');
  }

  // Calculate server-side totals with India GST
  const subtotal = Math.round(cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
  const shippingCost = subtotal >= 50000 ? 0 : 500;

  // India GST: 3% on material value + 5% on making charges (per product's priceBreakdown)
  let totalMaterialGST = 0;
  let totalMakingGST = 0;
  cart.items.forEach(item => {
    const gst = computeItemGST(item.product, item.quantity);
    totalMaterialGST += gst.materialGST;
    totalMakingGST += gst.makingGST;
  });
  totalMaterialGST = Math.round(totalMaterialGST * 100) / 100;
  totalMakingGST = Math.round(totalMakingGST * 100) / 100;
  const tax = Math.round((totalMaterialGST + totalMakingGST) * 100) / 100;
  const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;
  const itemCount = cart.items.reduce((c, item) => c + item.quantity, 0);

  res.json({
    success: true,
    data: {
      cart,
      pricing: {
        subtotal,
        shippingCost,
        tax,
        gstBreakdown: { materialGST: totalMaterialGST, makingGST: totalMakingGST },
        total,
        itemCount
      }
    }
  });
}));

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  // Check if product exists and is in stock
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: 'Not enough stock available'
    });
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user.id,
      items: [{
        product: productId,
        quantity,
        price: product.price
      }]
    });
  } else {
    // Check if item already in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Not enough stock available'
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    cart.updatedAt = new Date();
    await cart.save();
  }

  // Populate and return
  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name image price stock sku');

  res.json({
    success: true,
    message: 'Item added to cart',
    data: { cart }
  });
}));

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', protect, asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be at least 1'
    });
  }

  // Check product stock
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      success: false,
      message: 'Not enough stock available'
    });
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Item not in cart'
    });
  }

  item.quantity = quantity;
  cart.updatedAt = new Date();
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name image price stock sku');

  res.json({
    success: true,
    message: 'Cart updated',
    data: { cart }
  });
}));

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: 'Cart not found'
    });
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== req.params.productId
  );

  cart.updatedAt = new Date();
  await cart.save();

  cart = await Cart.findById(cart._id)
    .populate('items.product', 'name image price stock sku');

  res.json({
    success: true,
    message: 'Item removed from cart',
    data: { cart }
  });
}));

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user.id });

  res.json({
    success: true,
    message: 'Cart cleared'
  });
}));

module.exports = router;
