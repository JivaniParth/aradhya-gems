const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cod', 'wallet'],
    required: true
  },
  paymentResult: {
    id: String,
    status: String,
    updateTime: String,
    email: String
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  taxBreakdown: {
    materialGST: { type: Number, default: 0 }, // 3% on gold/silver/diamond/stone values
    makingGST: { type: Number, default: 0 }    // 5% on making charges
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  trackingNumber: String,
  deliveryPartner: String,
  expectedDelivery: Date,
  deliveredAt: Date,
  notes: String,
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }]
}, {
  timestamps: true
});

// Generate order ID atomically before saving (prevents duplicates under concurrency)
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const Counter = require('./Counter');
    const seq = await Counter.getNextSequence('order');
    this.orderId = `ORD-${String(seq).padStart(5, '0')}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Create indexes
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
