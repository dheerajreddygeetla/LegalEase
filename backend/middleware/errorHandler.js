// middleware/errorHandler.js
const { isProduction } = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * 404 handler for routes that don't match any registered route.
 * Must be registered AFTER all other routes.
 */
function notFound(req, res, next) {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

/**
 * Normalizes assorted error types (Mongoose, JWT, Multer, raw JS errors)
 * into a consistent { success, message, ... } JSON shape with the right
 * HTTP status code, instead of blanket 500s.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal server error';
    let details;

    // CORS rejections from the origin whitelist callback
    if (typeof message === 'string' && message.startsWith('CORS:')) {
        statusCode = 403;
    }

    // Mongoose invalid ObjectId (e.g. GET /api/schemes/not-a-real-id)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid value for field '${err.path}'`;
    }

    // Mongoose schema validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
        details = Object.values(err.errors || {}).map((e) => e.message);
    }

    // Mongo duplicate key error (e.g. duplicate email on register)
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `An account with this ${field} already exists`;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid authentication token';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Session expired, please log in again';
    }

    // Multer upload errors that reach here (not already handled at route level)
    if (err.name === 'MulterError') {
        statusCode = 400;
        message = err.code === 'LIMIT_FILE_SIZE' ? 'File size exceeds the maximum allowed limit.' : err.message;
    }

    // Malformed JSON body sent by client
    if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Malformed JSON in request body';
    }

    // Never leak internal error details for unexpected 500s in production
    if (statusCode === 500 && isProduction) {
        message = 'Internal server error';
    }

    if (statusCode >= 500) {
        console.error('❌ Server error:', err.stack || err);
    } else if (!isProduction) {
        console.warn(`⚠️ [${statusCode}] ${message}`);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(details ? { details } : {}),
        ...(req.requestId ? { requestId: req.requestId } : {}),
        ...(!isProduction && statusCode >= 500 ? { stack: err.stack } : {}),
    });
}

module.exports = { notFound, errorHandler, ApiError };
