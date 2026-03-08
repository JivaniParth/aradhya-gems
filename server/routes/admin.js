const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

// All routes require admin access
router.use(protect, authorize('admin'));

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueData
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isActive: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid', status: { $nin: ['cancelled', 'returned'] } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalTax: { $sum: '$tax' },
          totalShipping: { $sum: '$shippingCost' },
          totalDiscount: { $sum: '$discount' },
          // India GST breakdown
          totalMaterialGST: { $sum: '$taxBreakdown.materialGST' },
          totalMakingGST: { $sum: '$taxBreakdown.makingGST' }
        }
      }
    ])
  ]);

  // Orders by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$total' } } }
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'firstName lastName email');

  // Low stock products
  const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isActive: true })
    .select('name sku stock')
    .sort({ stock: 1 })
    .limit(10);

  // Monthly revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
        paymentStatus: 'paid'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        revenue: { $sum: '$total' },
        tax: { $sum: '$tax' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const rev = revenueData[0] || {};

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: rev.totalRevenue || 0,
        totalTax: rev.totalTax || 0,
        totalShipping: rev.totalShipping || 0,
        totalDiscount: rev.totalDiscount || 0,
        gstBreakdown: {
          materialGST: rev.totalMaterialGST || 0,
          makingGST: rev.totalMakingGST || 0
        }
      },
      ordersByStatus,
      recentOrders,
      lowStockProducts,
      monthlyRevenue
    }
  });
}));

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const users = await User.find(query)
    .select('-wishlist')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Get user's orders
  const orders = await Order.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .limit(10);

  // Get order stats
  const orderStats = await Order.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      user,
      orders,
      stats: orderStats[0] || { totalOrders: 0, totalSpent: 0 }
    }
  });
}));

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;

  // Find the user first to check their email
  let user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Prevent demoting or deactivating the primary admin
  if (user.email === 'psjivani001@gmail.com') {
    if (role === 'customer' || isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Action denied. The primary admin account cannot be downgraded or deactivated.'
      });
    }
  }

  // Proceed with update
  user.role = role || user.role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
}));

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Prevent deleting the primary admin
  if (user.email === 'psjivani001@gmail.com') {
    return res.status(403).json({
      success: false,
      message: 'Action denied. The primary admin account cannot be deleted.'
    });
  }

  await User.deleteOne({ _id: user._id });

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

// @desc    Admin change own password (requires current password — NO username bypass)
// @route   PUT /api/admin/change-password
// @access  Private/Admin
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Must contain at least one number')
    .matches(/[^a-zA-Z0-9]/).withMessage('Must contain at least one special character'),
  body('confirmPassword').custom((val, { req }) => {
    if (val !== req.body.newPassword) throw new Error('Passwords do not match');
    return true;
  }),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  // Use authenticated user ID from JWT — never trusts request body for identity
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Verify current password before allowing change
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Prevent reusing the same password
  const isSame = await user.matchPassword(req.body.newPassword);
  if (isSame) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from the current password'
    });
  }

  user.password = req.body.newPassword; // bcrypt hash fires in pre-save hook
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// @desc    Product inventory report
// @route   GET /api/admin/inventory
// @access  Private/Admin
router.get('/inventory', asyncHandler(async (req, res) => {
  const products = await Product.find()
    .select('name sku category stock price isActive')
    .sort({ stock: 1 });

  // Inventory summary
  const summary = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
        totalStock: { $sum: '$stock' },
        totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
      }
    }
  ]);

  res.json({
    success: true,
    data: { products, summary }
  });
}));

module.exports = router;
