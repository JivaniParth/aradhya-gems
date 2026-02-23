// ============================================
// MEDIA UPLOAD ROUTES (Admin Only)
// ============================================

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadProductMedia, ALLOWED_IMAGE_TYPES } = require('../middleware/upload');
const { getCdnUrl, deleteFromS3 } = require('../config/s3');
const { asyncHandler } = require('../middleware/error');

// All routes require admin access
router.use(protect, authorize('admin'));

// @desc    Upload product media files (images/videos)
// @route   POST /api/upload/product-media
// @access  Private/Admin
// @body    productId (required), variantSlug (optional), media (files, max 10)
router.post('/product-media', (req, res, next) => {
    uploadProductMedia(req, res, (err) => {
        if (err) {
            // Handle multer errors
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Images: max 10MB, Videos: max 100MB.'
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    success: false,
                    message: 'Too many files. Maximum 10 files per upload.'
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message || 'Upload failed'
            });
        }
        next();
    });
}, asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No files uploaded'
        });
    }

    // Build response with CDN URLs
    const uploadedMedia = req.files.map((file) => {
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
        return {
            url: getCdnUrl(file.key),
            key: file.key,
            type: isImage ? 'image' : 'video',
            originalName: file.originalname,
            size: file.size,
            mimeType: file.contentType || file.mimetype
        };
    });

    res.status(201).json({
        success: true,
        message: `${uploadedMedia.length} file(s) uploaded successfully`,
        data: { media: uploadedMedia }
    });
}));

// @desc    Delete a media file from S3
// @route   DELETE /api/upload/product-media
// @access  Private/Admin
// @body    { key: "products/123/main/img.webp" }
router.delete('/product-media', asyncHandler(async (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({
            success: false,
            message: 'S3 object key is required'
        });
    }

    await deleteFromS3(key);

    res.json({
        success: true,
        message: 'File deleted successfully',
        data: { deletedKey: key }
    });
}));

module.exports = router;
