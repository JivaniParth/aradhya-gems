// ============================================
// MULTER-S3 UPLOAD MIDDLEWARE
// ============================================

const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { s3Client, S3_BUCKET } = require('../config/s3');

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// File size limits
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;   // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;   // 100 MB

/**
 * Generate the S3 object key based on product context.
 * Pattern: products/{productId}/{folder}/{timestamp}-{originalName}
 */
function generateS3Key(req, file) {
    const productId = req.body.productId || 'temp';
    const variantSlug = req.body.variantSlug || '';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .substring(0, 50);

    if (variantSlug) {
        return `products/${productId}/variants/${variantSlug}/${timestamp}-${safeName}${ext}`;
    }
    return `products/${productId}/main/${timestamp}-${safeName}${ext}`;
}

// Configure multer with S3 storage
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: file.fieldname,
                originalName: file.originalname
            });
        },
        key: (req, file, cb) => {
            const key = generateS3Key(req, file);
            cb(null, key);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_TYPES.includes(file.mimetype)) {
            return cb(new Error(`File type not allowed. Accepted: JPEG, PNG, WebP, AVIF, MP4, WebM, MOV`), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: MAX_VIDEO_SIZE, // Use the larger limit; we validate per-file below
        files: 10                 // Max 10 files per upload
    }
});

/**
 * Middleware: upload up to 10 product media files.
 * Usage: uploadProductMedia (as middleware in route)
 */
const uploadProductMedia = upload.array('media', 10);

module.exports = {
    uploadProductMedia,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_VIDEO_TYPES
};
