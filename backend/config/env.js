// config/env.js
// Centralized environment configuration with fail-fast validation.
// Loading this module guarantees that every required variable is present
// and that insecure defaults (e.g. a hardcoded JWT secret) can never be
// used silently in production.

const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET'];

const RECOMMENDED_VARS = ['GEMINI_API_KEY'];

function readList(name, fallback = []) {
    const raw = process.env[name];
    if (!raw) return fallback;
    return raw.split(',').map((v) => v.trim()).filter(Boolean);
}

function validate() {
    const missing = REQUIRED_VARS.filter((key) => !process.env[key] || !process.env[key].trim());

    if (missing.length > 0) {
        // Fail fast and loud rather than silently falling back to an
        // insecure default (e.g. a hardcoded JWT secret).
        console.error(`❌ Missing required environment variable(s): ${missing.join(', ')}`);
        console.error('   Copy backend/.env.example to backend/.env and fill in real values.');
        process.exit(1);
    }

    if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
        console.error('❌ JWT_SECRET is too short/weak. Use at least 16 random characters.');
        process.exit(1);
    }

    const missingRecommended = RECOMMENDED_VARS.filter((key) => !process.env[key] || !process.env[key].trim());
    if (missingRecommended.length > 0) {
        console.warn(`⚠️ Missing recommended environment variable(s): ${missingRecommended.join(', ')}. Related features will be degraded/unavailable.`);
    }
}

validate();

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    NODE_ENV,
    isProduction: NODE_ENV === 'production',
    isDevelopment: NODE_ENV !== 'production',
    PORT: Number(process.env.PORT) || 5000,

    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',

    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',

    // Comma-separated list of allowed frontend origins for CORS.
    // Falls back to standard local dev ports if unset.
    CORS_ORIGINS: readList('CORS_ORIGINS', [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
    ]),

    MAX_UPLOAD_MB: Number(process.env.MAX_UPLOAD_MB) || 10,

    RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 300,
    AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
    CHAT_RATE_LIMIT_MAX: Number(process.env.CHAT_RATE_LIMIT_MAX) || 30,
};
