const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * Requires a valid Bearer JWT. Attaches the authenticated user (minus
 * password) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw ApiError.unauthorized('Not authorized, no token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw ApiError.unauthorized('Not authorized, no token');
    }

    // jwt.verify throws JsonWebTokenError/TokenExpiredError on failure;
    // these are translated into clean 401s by the global error handler.
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
        throw ApiError.unauthorized('Not authorized, user not found');
    }

    req.user = user;
    next();
});

/**
 * Optional auth: attaches req.user if a valid token is present, but never
 * blocks the request if it's missing or invalid. Useful for endpoints that
 * are public but can personalize output for logged-in users.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) req.user = user;
    } catch (_) {
        // Invalid/expired token on an optional-auth route: proceed as anonymous.
    }
    next();
});

module.exports = { protect, optionalAuth };
