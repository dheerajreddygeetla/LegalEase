const mongoose = require('mongoose');
const crypto = require('crypto');

const supportInquirySchema = new mongoose.Schema(
    {
        referenceId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            trim: true,
            default: 'Citizen',
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        category: {
            type: String,
            trim: true,
            default: 'General',
            maxlength: 80,
        },
        message: {
            type: String,
            required: true,
            maxlength: 3000,
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: 'open',
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        userAgent: {
            type: String,
            default: '',
            maxlength: 300,
        },
        ipHash: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

supportInquirySchema.index({ createdAt: -1 });

/**
 * Generate a human-friendly, collision-resistant reference id (e.g. LE-A1B2C3D4).
 */
supportInquirySchema.statics.createReferenceId = function createReferenceId() {
    return `LE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
};

/**
 * One-way hash of client IP so we can rate/audit without storing raw IPs.
 */
supportInquirySchema.statics.hashIp = function hashIp(ip) {
    if (!ip) return '';
    return crypto.createHash('sha256').update(String(ip)).digest('hex').slice(0, 32);
};

module.exports = mongoose.model('SupportInquiry', supportInquirySchema);
