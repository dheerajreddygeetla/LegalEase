// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const { initVectorStore } = require('./services/ragService');

// Load environment variables
dotenv.config();
console.log('🔑 Gemini API Key present:', !!process.env.GEMINI_API_KEY);

// Connect to MongoDB and initialize vector store
connectDB()
    .then(() => {
        console.log('✅ Database connected. Initializing vector store...');
        return initVectorStore();
    })
    .then(() => {
        console.log('✅ Vector store ready.');
    })
    .catch((err) => {
        console.error('❌ Initialization error:', err);
    });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'LegalEase AI API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});