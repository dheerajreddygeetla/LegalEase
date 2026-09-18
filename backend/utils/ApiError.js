// utils/ApiError.js
// A typed error class so controllers can throw a specific HTTP status
// instead of always falling through to a generic 500.

class ApiError extends Error {
    constructor(statusCode, message, details = undefined) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.isOperational = true; // expected/handled error, not a crash
        if (details !== undefined) this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, details) {
        return new ApiError(400, message, details);
    }

    static unauthorized(message = 'Not authorized') {
        return new ApiError(401, message);
    }

    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }

    static notFound(message = 'Resource not found') {
        return new ApiError(404, message);
    }

    static conflict(message = 'Resource already exists') {
        return new ApiError(409, message);
    }

    static tooManyRequests(message = 'Too many requests, please try again later') {
        return new ApiError(429, message);
    }

    static serviceUnavailable(message = 'Service temporarily unavailable') {
        return new ApiError(503, message);
    }

    static internal(message = 'Internal server error') {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;
