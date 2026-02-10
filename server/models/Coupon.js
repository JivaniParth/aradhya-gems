const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: [0, 'Discount value cannot be negative']
  },
  // Maximum discount amount (for percentage coupons)
  maxDiscount: {
    type: Number,
    default: null
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  usageLimit: {
    type: Number,
    default: null // null = unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  // Per-user usage limit
  perUserLimit: {
    type: Number,
    default: 1
  },
  usedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usedAt: { type: Date, default: Date.now }
  }],
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

/**
 * Validate coupon for a given user and subtotal.
 * Returns { valid, discount, message }
 */
couponSchema.methods.validateForOrder = function (userId, subtotal) {
  const now = new Date();

  if (!this.isActive) {
    return { valid: false, discount: 0, message: 'Coupon is inactive' };
  }

  if (now < this.validFrom) {
    return { valid: false, discount: 0, message: 'Coupon is not yet active' };
  }

  if (now > this.validUntil) {
    return { valid: false, discount: 0, message: 'Coupon has expired' };
  }

  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
    return { valid: false, discount: 0, message: 'Coupon usage limit reached' };
  }

  if (subtotal < this.minOrderAmount) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order amount is ₹${this.minOrderAmount}`
    };
  }

  // Per-user limit check
  if (userId) {
    const userUsageCount = this.usedBy.filter(
      u => u.user.toString() === userId.toString()
    ).length;
    if (userUsageCount >= this.perUserLimit) {
      return { valid: false, discount: 0, message: 'You have already used this coupon' };
    }
  }

  // Calculate discount
  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = Math.round(subtotal * (this.discountValue / 100) * 100) / 100;
    if (this.maxDiscount !== null && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.discountValue;
  }

  // Discount cannot exceed subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  // Round to 2 decimal places
  discount = Math.round(discount * 100) / 100;

  return { valid: true, discount, message: 'Coupon applied successfully' };
};

couponSchema.index({ validUntil: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
