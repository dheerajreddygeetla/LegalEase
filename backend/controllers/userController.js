const fs = require('fs');
const User = require('../models/User');
const Document = require('../models/Document');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * Get current user profile and demographic data
 * Route: GET /api/users/profile
 * Access: Private
 */
exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .select('-password')
        .populate('savedSchemes');

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    res.json({ success: true, data: user });
});

/**
 * Update user profile and demographic criteria
 * Route: PUT /api/users/profile
 * Access: Private
 */
exports.updateUserProfile = asyncHandler(async (req, res) => {
    const { name, preferredLanguage, state, profile } = req.body || {};

    const user = await User.findById(req.user.id);
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    if (name && typeof name === 'string') user.name = name.trim();
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (state !== undefined) user.state = state;

    if (profile && typeof profile === 'object') {
        const currentProfile = user.profile || {};

        const parseNum = (val, fallback) => {
            if (val === undefined || val === null || val === '') return fallback;
            const n = Number(val);
            return Number.isNaN(n) ? fallback : n;
        };

        const parseBool = (val, fallback) => {
            if (val === undefined || val === null) return fallback;
            return Boolean(val);
        };

        user.profile = {
            age: parseNum(profile.age, currentProfile.age),
            gender: profile.gender !== undefined ? profile.gender : currentProfile.gender,
            state: profile.state !== undefined ? profile.state : (currentProfile.state || state || user.state),
            occupation: profile.occupation !== undefined ? profile.occupation : currentProfile.occupation,
            income: parseNum(profile.income, currentProfile.income),
            education: profile.education !== undefined ? profile.education : currentProfile.education,
            category: profile.category !== undefined ? profile.category : currentProfile.category,
            isFarmer: parseBool(profile.isFarmer, currentProfile.isFarmer),
            isStudent: parseBool(profile.isStudent, currentProfile.isStudent),
            isRural: parseBool(profile.isRural, currentProfile.isRural),
            isDisability: parseBool(profile.isDisability, currentProfile.isDisability),
            isBelowPovertyLine: parseBool(profile.isBelowPovertyLine, currentProfile.isBelowPovertyLine),
        };
    }

    const updatedUser = await user.save();

    res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            preferredLanguage: updatedUser.preferredLanguage,
            state: updatedUser.state,
            profile: updatedUser.profile,
        },
    });
});

/**
 * Change password
 * Route: PUT /api/users/password
 * Access: Private
 */
exports.changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    if (user.authProvider === 'google') {
        throw ApiError.badRequest(
            'This account uses Google Sign-In. Password changes are managed through your Google account.'
        );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw ApiError.badRequest('Incorrect current password');
    }

    if (currentPassword === newPassword) {
        throw ApiError.badRequest('New password must be different from the current password');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
});

/**
 * Get user aggregated usage and vault metrics
 * Route: GET /api/users/stats
 * Access: Private
 */
exports.getUserStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [docCount, convCount, user] = await Promise.all([
        Document.countDocuments({ userId }),
        Conversation.countDocuments({ userId }),
        User.findById(userId).select('savedSchemes createdAt'),
    ]);

    const savedSchemesCount = user?.savedSchemes?.length || 0;

    res.json({
        success: true,
        data: {
            docCount,
            chatCount: convCount,
            savedSchemesCount,
            memberSince: user?.createdAt,
        },
    });
});

/**
 * Delete account and all associated records (documents, conversations,
 * messages, and any physical files uploaded to disk).
 * Route: DELETE /api/users/account
 * Access: Private
 */
exports.deleteAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const [userConversations, userDocuments] = await Promise.all([
        Conversation.find({ userId }).select('_id'),
        Document.find({ userId }).select('fileUrl'),
    ]);
    const convIds = userConversations.map((c) => c._id);

    // Remove physical files from disk before deleting the DB records that
    // reference them, so nothing orphaned is left behind on the server.
    userDocuments.forEach((doc) => {
        if (doc.fileUrl) {
            fs.promises.unlink(doc.fileUrl).catch(() => { /* file may already be gone */ });
        }
    });

    await Promise.all([
        Message.deleteMany({ conversationId: { $in: convIds } }),
        Conversation.deleteMany({ userId }),
        Document.deleteMany({ userId }),
        User.findByIdAndDelete(userId),
    ]);

    res.json({ success: true, message: 'Account and associated records deleted successfully.' });
});
