// ============================================
// AWS S3 CLIENT & CLOUDFRONT HELPERS
// ============================================

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const S3_BUCKET = process.env.AWS_S3_BUCKET || 'aradhya-gems-media';
const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN || '';

/**
 * Convert an S3 object key to a CloudFront URL.
 * Falls back to direct S3 URL if CloudFront is not configured.
 */
function getCdnUrl(key) {
    if (CLOUDFRONT_DOMAIN) {
        return `https://${CLOUDFRONT_DOMAIN}/${key}`;
    }
    return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;
}

/**
 * Delete a single object from S3 by its key.
 */
async function deleteFromS3(key) {
    const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: key
    });
    return s3Client.send(command);
}

module.exports = {
    s3Client,
    S3_BUCKET,
    CLOUDFRONT_DOMAIN,
    getCdnUrl,
    deleteFromS3
};
