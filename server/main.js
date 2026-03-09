// ============================================
// ARADHYA GEMS - EXPRESS SERVER
// ============================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');
const couponRoutes = require('./routes/coupons');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/upload');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ===================
// MIDDLEWARE
// ===================

// CORS configuration
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim().replace(/\/$/, '')); // remove trailing slashes

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    // Check strict exact match
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Check if the incoming origin is just the "www." version of an allowed origin
    const originWithoutWww = origin.replace('://www.', '://');
    if (allowedOrigins.includes(originWithoutWww)) {
      return callback(null, true);
    }

    // Check if the incoming origin is a Vercel preview URL of the main domain
    if (origin.endsWith('.vercel.app')) {
       return callback(null, true); 
    }

    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers
app.use(helmet());

// Rate limiting — 100 requests per 15 min per IP (general)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

// Stricter limiter for order creation (5 per 15 min per IP)
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many order attempts, please try again later.' }
});

// Auth limiter — prevent brute-force login/register (10 per 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});

// Password reset limiter (3 per 15 min per IP)
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many password reset attempts, please try again later.' }
});

// Apply general rate limiter to all API routes
app.use('/api/', apiLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ===================
// ROUTES
// ===================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Aradhya Gems API is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// API routes — auth routes get stricter limiter
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', passwordResetLimiter);
app.use('/api/auth/resend-verification', passwordResetLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// ===================
// ERROR HANDLING
// ===================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// ===================
// SERVER START
// ===================

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║       🌟 ARADHYA GEMS API SERVER 🌟            ║');
    console.log('╠════════════════════════════════════════════════╣');
    console.log(`║  🚀 Server running on port ${PORT}               ║`);
    console.log(`║  📦 Environment: ${process.env.NODE_ENV || 'development'}               ║`);
    console.log(`║  🔗 API URL: http://localhost:${PORT}/api       ║`);
    console.log('╚════════════════════════════════════════════════╝');
    console.log('');
    console.log('📋 Available Endpoints:');
    console.log('   GET  /api/health         - Health check');
    console.log('   POST /api/auth/register  - Register user');
    console.log('   POST /api/auth/login     - Login user');
    console.log('   GET  /api/products       - Get products');
    console.log('   GET  /api/cart           - Get cart');
    console.log('   GET  /api/orders         - Get orders');
    console.log('   GET  /api/wishlist       - Get wishlist');
    console.log('   GET  /api/admin/stats    - Admin dashboard');
    console.log('');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
