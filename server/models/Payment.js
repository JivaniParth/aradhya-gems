const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cod', 'wallet', 'emi'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paytm', 'phonepe', 'cod', 'other'],
    default: 'razorpay'
  },
  // Payment Gateway Details
  gatewayOrderId: String,
  gatewayPaymentId: String,
  gatewaySignature: String,
  
  // Card Details (stored securely, only last 4 digits)
  cardDetails: {
    last4: String,
    brand: String, // Visa, Mastercard, Amex, etc.
    network: String,
    cardType: String, // credit, debit (renamed from 'type' to avoid mongoose conflict)
    issuer: String
  },
  
  // UPI Details
  upiDetails: {
    vpa: String, // Virtual Payment Address
    transactionId: String
  },
  
  // Bank Details
  bankDetails: {
    bankName: String,
    accountNumber: String, // masked
    ifsc: String
  },
  
  // Wallet Details
  walletDetails: {
    provider: String, // Paytm, PhonePe, GooglePay
    walletId: String
  },
  
  // EMI Details
  emiDetails: {
    tenure: Number, // in months
    interestRate: Number,
    monthlyInstallment: Number,
    emiProvider: String
  },
  
  status: {
    type: String,
    enum: ['pending', 'processing', 'authorized', 'captured', 'success', 'failed', 'cancelled', 'refunded', 'partial_refund'],
    default: 'pending',
    index: true
  },
  
  // Payment attempts tracking
  attempts: [{
    attemptedAt: { type: Date, default: Date.now },
    status: String,
    errorCode: String,
    errorMessage: String,
    gatewayResponse: mongoose.Schema.Types.Mixed
  }],
  
  // Refund information
  refund: {
    isRefunded: { type: Boolean, default: false },
    refundAmount: Number,
    refundId: String,
    refundReason: String,
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed']
    },
    refundedAt: Date,
    refundRequestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Gateway fees and settlement
  fees: {
    gatewayFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    netAmount: Number // Amount after deducting fees
  },
  
  // Settlement details
  settlement: {
    isSettled: { type: Boolean, default: false },
    settlementId: String,
    settlementDate: Date,
    settlementAmount: Number
  },
  
  // Billing information
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  
  // Customer details
  customerEmail: String,
  customerPhone: String,
  customerIP: String,
  
  // Security & fraud detection
  riskScore: {
    type: Number,
    min: 0,
    max: 100
  },
  fraudCheck: {
    isPassed: Boolean,
    provider: String,
    details: mongoose.Schema.Types.Mixed
  },
  
  // Webhook & callback data
  webhookData: mongoose.Schema.Types.Mixed,
  callbackUrl: String,
  
  // Payment metadata
  description: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  authorizedAt: Date,
  capturedAt: Date,
  completedAt: Date,
  failedAt: Date,
  
  // Notes & internal tracking
  internalNotes: String,
  tags: [String]
  
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ paymentGateway: 1, status: 1 });
paymentSchema.index({ 'refund.isRefunded': 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for payment age
paymentSchema.virtual('paymentAge').get(function() {
  return Date.now() - this.initiatedAt;
});

// Method to mark payment as successful
paymentSchema.methods.markAsSuccess = function(gatewayData) {
  this.status = 'success';
  this.completedAt = new Date();
  this.gatewayPaymentId = gatewayData.paymentId || this.gatewayPaymentId;
  this.gatewaySignature = gatewayData.signature || this.gatewaySignature;
  
  // Calculate net amount after fees
  if (!this.fees) {
    this.fees = {};
  }
  if (!this.fees.netAmount) {
    const gatewayFeePercent = 0.02; // 2% gateway fee
    this.fees.gatewayFee = Math.round(this.amount * gatewayFeePercent);
    this.fees.tax = Math.round(this.fees.gatewayFee * 0.18); // 18% GST on fee
    this.fees.netAmount = this.amount - this.fees.gatewayFee - this.fees.tax;
  }
  
  return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markAsFailed = function(errorCode, errorMessage) {
  this.status = 'failed';
  this.failedAt = new Date();
  
  this.attempts.push({
    attemptedAt: new Date(),
    status: 'failed',
    errorCode,
    errorMessage
  });
  
  return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = function(amount, reason, requestedBy) {
  if (!this.refund) {
    this.refund = {};
  }
  this.refund.isRefunded = true;
  this.refund.refundAmount = amount || this.amount;
  this.refund.refundReason = reason;
  this.refund.refundStatus = 'pending';
  this.refund.refundedAt = new Date();
  this.refund.refundRequestedBy = requestedBy;
  
  if (this.refund.refundAmount === this.amount) {
    this.status = 'refunded';
  } else {
    this.status = 'partial_refund';
  }
  
  return this.save();
};

// Static method to get payment statistics
paymentSchema.statics.getStatistics = async function(startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        },
        status: 'success'
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        avgTransaction: { $avg: '$amount' },
        totalFees: { $sum: '$fees.gatewayFee' },
        totalRefunds: {
          $sum: {
            $cond: ['$refund.isRefunded', '$refund.refundAmount', 0]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {};
};

// Ensure virtuals are included in JSON
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);
