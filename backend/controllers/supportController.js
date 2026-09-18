const SupportInquiry = require('../models/SupportInquiry');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * Persist a citizen support / feedback inquiry
 * Route: POST /api/support/inquiry
 * Access: Public
 */
exports.createInquiry = asyncHandler(async (req, res) => {
    const { name, email, category, message } = req.body;

    const inquiry = await SupportInquiry.create({
        referenceId: SupportInquiry.createReferenceId(),
        name: (name && String(name).trim()) || 'Citizen',
        email: String(email).trim().toLowerCase(),
        category: (category && String(category).trim()) || 'General',
        message: String(message).trim(),
        userId: req.user?.id || null,
        userAgent: String(req.get('user-agent') || '').slice(0, 300),
        ipHash: SupportInquiry.hashIp(req.ip),
    });

    console.log(
        `📩 Support Inquiry ${inquiry.referenceId} from ${inquiry.name} (${inquiry.email}) [${inquiry.category}]`
    );

    res.status(201).json({
        success: true,
        message: 'Inquiry received. A legal support advisor will review your request shortly.',
        referenceId: inquiry.referenceId,
        data: {
            referenceId: inquiry.referenceId,
            status: inquiry.status,
            createdAt: inquiry.createdAt,
        },
    });
});

/**
 * Look up an inquiry by reference id (public, limited fields)
 * Route: GET /api/support/inquiry/:referenceId
 * Access: Public
 */
exports.getInquiryByReference = asyncHandler(async (req, res) => {
    const referenceId = String(req.params.referenceId || '').trim().toUpperCase();
    if (!/^LE-[A-F0-9]{8}$/.test(referenceId)) {
        throw ApiError.badRequest('Invalid reference ID format');
    }

    const inquiry = await SupportInquiry.findOne({ referenceId })
        .select('referenceId status category createdAt updatedAt')
        .lean();

    if (!inquiry) {
        throw ApiError.notFound('Inquiry not found');
    }

    res.json({ success: true, data: inquiry });
});
