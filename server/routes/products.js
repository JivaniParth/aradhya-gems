const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');

// @desc    Get all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const {
    category,
    material,
    minPrice,
    maxPrice,
    isNew,
    isBestSeller,
    occasion,
    search,
    sort,
    page = 1,
    limit = 12
  } = req.query;

  // Build query
  let query = { isActive: true };

  // Category filter
  if (category) {
    query.categorySlug = category.toLowerCase();
  }

  // Material filter
  if (material) {
    query.materialId = material;
  }

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // New arrivals
  if (isNew === 'true') {
    query.isNewArrival = true;
  }

  // Best sellers
  if (isBestSeller === 'true') {
    query.isBestSeller = true;
  }

  // Occasion filter
  if (occasion) {
    query.occasions = { $in: [occasion] };
  }

  // Text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (sort) {
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'rating':
        sortOption = { 'reviews.average': -1 };
        break;
      case 'popularity':
        sortOption = { 'reviews.count': -1 };
        break;
    }
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  // Get total count
  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

// @desc    Get featured products (new arrivals + best sellers)
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const [newArrivals, bestSellers] = await Promise.all([
    Product.find({ isActive: true, isNewArrival: true }).limit(8),
    Product.find({ isActive: true, isBestSeller: true }).limit(8)
  ]);

  res.json({
    success: true,
    data: {
      newArrivals,
      bestSellers
    }
  });
}));

// @desc    Get categories with product counts
// @route   GET /api/products/categories
// @access  Public
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 });
  
  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ 
        categorySlug: cat.slug, 
        isActive: true 
      });
      return {
        ...cat.toObject(),
        productCount: count
      };
    })
  );

  res.json({
    success: true,
    data: { categories: categoriesWithCounts }
  });
}));

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Get related products (same category, different product)
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    categorySlug: product.categorySlug,
    isActive: true
  }).limit(4);

  res.json({
    success: true,
    data: {
      product,
      relatedProducts
    }
  });
}));

// ============== ADMIN ROUTES ==============

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, authorize('admin'), asyncHandler(async (req, res) => {
  // Whitelist allowed fields — prevents injection of unexpected fields
  const allowedFields = [
    'name', 'sku', 'price', 'originalPrice', 'category', 'categorySlug',
    'material', 'materialId', 'purity', 'image', 'images', 'description',
    'shortDescription', 'stock', 'isNewArrival', 'isBestSeller', 'isActive',
    'weight', 'dimensions', 'diamondDetails', 'priceBreakdown', 'hallmark',
    'certification', 'origin', 'occasions', 'idealFor', 'styleNote',
    'returnPolicy', 'exchangePolicy', 'warranty', 'careInstructions'
  ];

  const sanitizedBody = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) sanitizedBody[field] = req.body[field];
  });

  const product = await Product.create(sanitizedBody);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: { product }
  });
}));

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: { product }
  });
}));

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Soft delete
  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
}));

// @desc    Get all products (including inactive) for admin
// @route   GET /api/products/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments();

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }
  });
}));

module.exports = router;
