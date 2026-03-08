const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { isValidPhoneNumber } = require('libphonenumber-js');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/error');
const { sendVerificationEmail } = require('../config/email');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Password strength validator — matches client-side rules
const passwordStrengthValidator = body('newPassword')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number')
  .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().custom((value) => {
    if (!value) return true;
    if (!isValidPhoneNumber(value)) {
      throw new Error('Invalid phone number format');
    }
    return true;
  }),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone: phone || undefined
  });

  // Generate email verification token
  const verificationToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (err) {
    // If email fails, still create account but log error
    console.error('Failed to send verification email:', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: false
      }
    }
  });
}));

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Check if email is verified
  if (!user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email before logging in. Check your inbox for the verification link.',
      needsVerification: true,
      email: user.email
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = user.getSignedJwtToken();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    }
  });
}));

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
router.get('/verify-email/:token', asyncHandler(async (req, res) => {
  // Hash the token from URL to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification link. Please request a new one.'
    });
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // Generate token so user can log in immediately
  const token = user.getSignedJwtToken();

  res.json({
    success: true,
    message: 'Email verified successfully! You can now log in.',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: true
      },
      token
    }
  });
}));

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    // Don't reveal if user exists
    return res.json({
      success: true,
      message: 'If an account exists with this email, a verification link has been sent.'
    });
  }

  if (user.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified. Please log in.'
    });
  }

  // Generate new token
  const verificationToken = user.getEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    await sendVerificationEmail(user, verificationToken);
  } catch (err) {
    console.error('Failed to send verification email:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send verification email. Please try again later.'
    });
  }

  res.json({
    success: true,
    message: 'If an account exists with this email, a verification link has been sent.'
  });
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
        createdAt: user.createdAt
      }
    }
  });
}));

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().custom((value) => {
    if (!value) return true;
    if (!isValidPhoneNumber(value)) {
      throw new Error('Invalid phone number format');
    }
    return true;
  }),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key =>
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
}));

// @desc    Update password (logged-in user)
// @route   PUT /api/auth/password
// @access  Private
router.put('/password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordStrengthValidator,
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  user.password = req.body.newPassword;
  await user.save(); // triggers bcrypt hash in pre-save hook

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

// @desc    Forgot password — generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  handleValidationErrors
], asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // Always return success to prevent user enumeration attacks
  if (!user) {
    return res.json({
      success: true,
      message: 'If that email exists, a reset link has been sent.'
    });
  }

  // Generate a secure random token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Store the HASH of the token (not the plain token) in DB
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  // In production this would be emailed. For development, return the token.
  const resetUrl = `/reset-password/${resetToken}`;

  res.json({
    success: true,
    message: 'Password reset link generated.',
    // DEV ONLY — remove this in production and send via email instead
    resetToken,
    resetUrl
  });
}));

// @desc    Reset password using token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
router.put('/reset-password/:token', [
  passwordStrengthValidator,
  handleValidationErrors
], asyncHandler(async (req, res) => {
  // Hash the incoming token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  // Find user with valid (non-expired) token — no username/email needed
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Password reset token is invalid or has expired'
    });
  }

  // Set the new password (bcrypt hashing fires in pre-save hook)
  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful. You can now log in with your new password.'
  });
}));

// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
router.post('/addresses', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // If setting as default, remove default from others
  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added successfully',
    data: { addresses: user.addresses }
  });
}));

// @desc    Update address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    return res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  }

  // If setting as default, remove default from others
  if (req.body.isDefault) {
    user.addresses.forEach(addr => addr.isDefault = false);
  }

  Object.assign(address, req.body);
  await user.save();

  res.json({
    success: true,
    message: 'Address updated successfully',
    data: { addresses: user.addresses }
  });
}));

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses = user.addresses.filter(
    addr => addr._id.toString() !== req.params.addressId
  );

  await user.save();

  res.json({
    success: true,
    message: 'Address deleted successfully',
    data: { addresses: user.addresses }
  });
}));

// @desc    Logout (client-side, just for consistency)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
