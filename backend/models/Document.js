const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    fileType: {
        type: String, // e.g., 'pdf', 'docx', 'txt'
        required: true,
    },
    fileUrl: {
        type: String, // path or cloud URL
        default: '',
    },
    extractedText: {
        type: String,
        default: '',
    },
    summary: {
        type: String,
        default: '',
    },
    analysis: {
        type: mongoose.Schema.Types.Mixed, // flexible JSON
    },
    status: {
        type: String,
        enum: ['uploaded', 'processing', 'processed', 'failed'],
        default: 'uploaded',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Speeds up the common "list a user's documents, newest first" query.
documentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);