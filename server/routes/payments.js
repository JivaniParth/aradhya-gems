const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/payments
// @desc    Get all payments (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Filter by payment method
    if (req.query.paymentMethod) {
      filter.paymentMethod = req.query.paymentMethod;
    }
    
    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }
    
    const payments = await Payment.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('order', 'orderId status total')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Payment.countDocuments(filter);
    
    res.json({
      success: true,
      count: payments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: payments
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/payments/my-payments
// @desc    Get logged in user's payments
// @access  Private
router.get('/my-payments', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const payments = await Payment.find({ user: req.user._id })
      .populate('order', 'orderId status total items')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Payment.countDocuments({ user: req.user._id });
    
    res.json({
      success: true,
      count: payments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: payments
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/payments/statistics
// @desc    Get payment statistics (Admin only)
// @access  Private/Admin
router.get('/statistics', protect, authorize('admin'), async (req, res, next) => {
  try {
    const startDate = req.query.startDate 
      ? new Date(req.query.startDate) 
      : new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = req.query.endDate 
      ? new Date(req.query.endDate) 
      : new Date();
    
    const stats = await Payment.getStatistics(startDate, endDate);
    
    // Get payment method breakdown
    const methodBreakdown = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get daily transaction trend
    const dailyTrend = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'success'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get status breakdown
    const statusBreakdown = await Payment.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: stats,
        methodBreakdown,
        statusBreakdown,
        dailyTrend
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('order');
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Check if user is admin or payment belongs to user
    if (req.user.role !== 'admin' && payment.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/payments
// @desc    Create a new payment (initiate payment)
// @access  Private
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      orderId,
      amount,
      paymentMethod,
      paymentGateway,
      billingAddress
    } = req.body;
    
    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Create payment
    const payment = await Payment.create({
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      order: orderId,
      user: req.user._id,
      amount,
      paymentMethod,
      paymentGateway: paymentGateway || 'razorpay',
      billingAddress,
      customerEmail: req.user.email,
      customerPhone: req.user.phone,
      description: `Payment for Order ${order.orderId}`
    });
    
    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/payments/:id/verify
// @desc    Verify payment (from gateway callback)
// @access  Private
router.put('/:id/verify', protect, async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const {
      gatewayPaymentId,
      gatewaySignature,
      gatewayResponse
    } = req.body;
    
    // In production, verify signature with gateway
    // For now, mark as success
    await payment.markAsSuccess({
      paymentId: gatewayPaymentId,
      signature: gatewaySignature
    });
    
    // Update order payment status
    if (payment.order) {
      await Order.findByIdAndUpdate(payment.order, {
        paymentStatus: 'paid',
        'paymentResult.id': gatewayPaymentId,
        'paymentResult.status': 'captured',
        'paymentResult.updateTime': new Date()
      });
    }
    
    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/payments/:id/fail
// @desc    Mark payment as failed
// @access  Private
router.put('/:id/fail', protect, async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    const { errorCode, errorMessage } = req.body;
    
    await payment.markAsFailed(errorCode, errorMessage);
    
    // Update order payment status
    if (payment.order) {
      await Order.findByIdAndUpdate(payment.order, {
        paymentStatus: 'failed'
      });
    }
    
    res.json({
      success: true,
      message: 'Payment marked as failed',
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/payments/:id/refund
// @desc    Process refund (Admin only)
// @access  Private/Admin
router.post('/:id/refund', protect, authorize('admin'), async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    if (payment.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund successful payments'
      });
    }
    
    const { amount, reason } = req.body;
    
    await payment.processRefund(amount, reason, req.user._id);
    
    // Update order if full refund
    if (payment.order && payment.status === 'refunded') {
      await Order.findByIdAndUpdate(payment.order, {
        paymentStatus: 'refunded',
        status: 'cancelled'
      });
    }
    
    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: payment
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle payment gateway webhook
// @access  Public (but should verify signature)
router.post('/webhook', async (req, res, next) => {
  try {
    // In production, verify webhook signature from gateway
    const { event, payload } = req.body;
    
    // Handle different webhook events
    switch (event) {
      case 'payment.authorized':
        // Handle payment authorization
        break;
      case 'payment.captured':
        // Handle payment capture
        break;
      case 'payment.failed':
        // Handle payment failure
        break;
      case 'refund.processed':
        // Handle refund
        break;
      default:
        break;
    }
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
