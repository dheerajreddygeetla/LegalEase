// server.js
require('dotenv').config(); // <-- ADD THIS LINE (MUST BE FIRST)

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const fs = require('fs');

// Loads and validates all required environment variables up front — the
// process exits immediately with a clear message if something critical
// (e.g. JWT_SECRET, MONGODB_URI) is missing, instead of limping along with
// an insecure default.
const env = require('./config/env');

const connectDB = require('./config/db');
const { initVectorStore } = require('./services/ragService');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requestId } = require('./middleware/requestId');

console.log(`🔑 Gemini API Key configured: ${!!env.GEMINI_API_KEY}`);
console.log(`🔑 Google Sign-In configured: ${!!env.GOOGLE_CLIENT_ID}`);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

// Trust the first reverse proxy hop (Render/Heroku/Nginx/etc.) so
// req.ip and rate limiting see the real client IP instead of the proxy's.
app.set('trust proxy', 1);

// ---- Security & platform middleware -------------------------------------
app.use(requestId);
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin/non-browser requests (no Origin header, e.g.
        // curl, server-to-server, mobile apps) and any whitelisted origin.
        if (!origin || env.CORS_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        // In local development, allow any localhost/127.0.0.1 dev port automatically
        if (env.isDevelopment && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true,
}));
app.use(compression());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Strips any request keys starting with '$' or containing '.' from
// req.body/req.query/req.params to prevent MongoDB operator injection
// without attempting to reassign getter-only req.query property.
app.use((req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    if (req.query) mongoSanitize.sanitize(req.query);
    next();
});

// Baseline rate limit across the whole API; individual routers apply
// tighter limits for auth and AI-backed endpoints.
app.use('/api', apiLimiter);

// NOTE: uploaded documents are intentionally NOT served as a public static
// directory. They are streamed only via the authenticated, ownership-checked
// GET /api/documents/:id/file route (see routes/documentRoutes.js) — serving
// them statically here would let anyone with a guessable filename download
// another user's document without logging in.

// Root route for convenient browser checks
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'LegalEase AI Backend API is running',
        version: '2.7.0',
        frontend: 'http://localhost:3000',
        healthCheck: '/api/health',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            documents: '/api/documents',
            schemes: '/api/schemes',
            chat: '/api/chat',
            support: '/api/support',
        },
    });
});

// Health check endpoint with diagnostics
app.get('/api/health', (req, res) => {
    const mongoose = require('mongoose');
    const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    res.json({
        success: true,
        message: 'LegalEase AI API is operational',
        service: 'LegalEase-Backend',
        version: '2.7.0',
        environment: env.NODE_ENV,
        geminiConfigured: !!env.GEMINI_API_KEY,
        googleSignInConfigured: !!env.GOOGLE_CLIENT_ID,
        database: dbStates[mongoose.connection.readyState] || 'unknown',
        uptimeSeconds: Math.floor(process.uptime()),
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));

// 404 handler for unmatched routes, then the centralized error handler.
// Order matters: both must be registered after all other app.use()/routes.
app.use(notFound);
app.use(errorHandler);

// Process-level safety nets. These log loudly rather than silently
// swallowing failures; an operational monitor/process manager should still
// be configured to restart the process on crash in production.
process.on('unhandledRejection', (reason) => {
    console.error('⚠️ Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    // Uncaught exceptions leave the process in an undefined state; exit so
    // a process manager (pm2, systemd, Docker) can restart it cleanly.
    process.exit(1);
});

let server;

async function start() {
    try {
        await connectDB();
        console.log('✅ Database connected. Initializing vector store...');
        await initVectorStore();
        console.log('✅ Vector store ready.');
    } catch (err) {
        console.error('❌ Initialization error:', err.message);
        process.exit(1);
    }

    server = app.listen(env.PORT, () => {
        console.log(`🚀 LegalEase Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
}

// Graceful shutdown: stop accepting new connections and close the DB
// connection cleanly on SIGINT/SIGTERM (Ctrl+C, container stop, etc.).
async function shutdown(signal) {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    const { disconnectDB } = require('./config/db');
    if (server) {
        server.close(async () => {
            console.log('✅ HTTP server closed.');
            await disconnectDB().catch(() => {});
            process.exit(0);
        });
        // Force-exit if connections don't close within a reasonable time.
        setTimeout(() => process.exit(1), 10000).unref();
    } else {
        process.exit(0);
    }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();

module.exports = app;