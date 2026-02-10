const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('wishlist', 'name price originalPrice image category material stock isNew isBestSeller');

  res.json({
    success: true,
    data: {
      wishlist: user.wishlist || []
    }
  });
}));

// @desc    Add item to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
router.post('/:productId', protect, asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const user = await User.findById(req.user.id);

  // Check if already in wishlist
  if (user.wishlist.includes(productId)) {
    return res.status(400).json({
      success: false,
      message: 'Product already in wishlist'
    });
  }

  user.wishlist.push(productId);
  await user.save();

  // Populate and return
  await user.populate('wishlist', 'name price originalPrice image category material stock isNew isBestSeller');

  res.json({
    success: true,
    message: 'Added to wishlist',
    data: {
      wishlist: user.wishlist
    }
  });
}));

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
router.delete('/:productId', protect, asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user.id);

  user.wishlist = user.wishlist.filter(
    id => id.toString() !== productId
  );

  await user.save();

  await user.populate('wishlist', 'name price originalPrice image category material stock isNew isBestSeller');

  res.json({
    success: true,
    message: 'Removed from wishlist',
    data: {
      wishlist: user.wishlist
    }
  });
}));

// @desc    Toggle item in wishlist
// @route   PUT /api/wishlist/:productId
// @access  Private
router.put('/:productId', protect, asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  const user = await User.findById(req.user.id);

  const isInWishlist = user.wishlist.includes(productId);

  if (isInWishlist) {
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  await user.populate('wishlist', 'name price originalPrice image category material stock isNew isBestSeller');

  res.json({
    success: true,
    message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
    data: {
      wishlist: user.wishlist,
      added: !isInWishlist
    }
  });
}));

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
router.delete('/', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  user.wishlist = [];
  await user.save();

  res.json({
    success: true,
    message: 'Wishlist cleared',
    data: {
      wishlist: []
    }
  });
}));

module.exports = router;
