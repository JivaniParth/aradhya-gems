const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Necklaces', 'Earrings', 'Rings', 'Bracelets']
  },
  categorySlug: {
    type: String,
    required: true,
    lowercase: true
  },
  material: {
    type: String,
    required: [true, 'Material is required']
  },
  materialId: {
    type: String,
    required: true
  },
  purity: String,
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  images: [String],
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  weight: {
    gross: Number,
    net: Number,
    unit: { type: String, default: 'grams' }
  },
  dimensions: {
    type: Map,
    of: String
  },
  diamondDetails: {
    carat: Number,
    cut: String,
    clarity: String,
    color: String,
    shape: String,
    totalCarat: Number,
    stoneCount: Number
  },
  priceBreakdown: {
    goldValue: Number,
    diamondValue: Number,
    stoneValue: Number,
    pearlValue: Number,
    rubyValue: Number,
    metalValue: Number,
    makingCharges: Number,
    gst: Number,
    total: Number
  },
  hallmark: String,
  certification: String,
  origin: String,
  occasions: [String],
  idealFor: [String],
  styleNote: String,
  reviews: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
    highlights: [String]
  },
  returnPolicy: { type: String, default: '30-day hassle-free returns' },
  exchangePolicy: String,
  warranty: { type: String, default: 'Lifetime manufacturing warranty' },
  careInstructions: [String]
}, {
  timestamps: true
});

// Create indexes for better search performance
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ categorySlug: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isBestSeller: 1 });

module.exports = mongoose.model('Product', productSchema);
