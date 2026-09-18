// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const jsonHandler = (req, res, next, options) => {
    res.status(options.statusCode).json({
        success: false,
        message: options.message || 'Too many requests, please try again later.',
    });
};

// General API-wide limiter: cheap safety net against abuse/scraping.
const apiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonHandler,
    message: 'Too many requests from this IP, please try again later.',
});

// Tighter limiter for auth endpoints to slow down credential stuffing /
// brute-force attempts against login and registration.
const authLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.AUTH_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonHandler,
    message: 'Too many authentication attempts. Please wait a while before trying again.',
    skipSuccessfulRequests: true,
});

// AI-backed endpoints (chat, document analysis) are the most expensive
// calls in the system (external Gemini API cost + latency), so they get
// their own, stricter budget per IP.
const aiLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.CHAT_RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonHandler,
    message: 'You are sending requests too quickly. Please slow down and try again shortly.',
});

module.exports = { apiLimiter, authLimiter, aiLimiter };
