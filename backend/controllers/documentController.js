const Document = require('../models/Document');
const { extractTextFromFile } = require('../services/documentService');
const { summarizeDocument } = require('../services/aiService');
const fs = require('fs');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const safeUnlink = (filePath) => {
    if (!filePath) return;
    fs.promises.unlink(filePath).catch(() => { /* already gone / never written */ });
};

/**
 * Upload and analyze a document
 * Route: POST /api/documents/upload
 * Access: Private
 */
exports.uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest('No document file provided');
    }

    const file = req.file;
    const userId = req.user.id;
    const fileType = path.extname(file.originalname).substring(1).toLowerCase();

    try {
        const extractedText = await extractTextFromFile(file.path, fileType);

        if (!extractedText || !extractedText.trim()) {
            safeUnlink(file.path);
            throw ApiError.badRequest(
                'No readable text could be extracted. Please ensure the document is not an empty or image-only scanned file.'
            );
        }

        const summary = await summarizeDocument(extractedText);

        const document = await Document.create({
            userId,
            filename: file.originalname,
            fileType,
            fileUrl: file.path,
            extractedText: (extractedText || '').substring(0, 15000),
            summary,
            status: 'processed',
        });

        res.status(201).json({
            success: true,
            data: {
                _id: document._id,
                filename: document.filename,
                fileType: document.fileType,
                fileUrl: document.fileUrl,
                summary: document.summary,
                status: document.status,
                createdAt: document.createdAt,
            },
        });
    } catch (error) {
        // Any failure in extraction/analysis: don't leave an orphaned file on disk.
        safeUnlink(file.path);
        throw error;
    }
});

/**
 * Get all documents for the logged-in user (paginated)
 * Route: GET /api/documents?page=&limit=
 * Access: Private
 */
exports.getUserDocuments = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    const [documents, total] = await Promise.all([
        Document.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('filename fileType summary status createdAt'),
        Document.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: documents,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
});

/**
 * Get a single document by ID
 * Route: GET /api/documents/:id
 * Access: Private
 */
exports.getDocumentById = asyncHandler(async (req, res) => {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!document) {
        throw ApiError.notFound('Document not found');
    }
    res.json({ success: true, data: document });
});

/**
 * Securely stream the original uploaded file to its owner.
 * Replaces the previous approach of serving /uploads as a public static
 * directory, which let anyone with a guessable filename download any
 * user's uploaded document without authentication.
 * Route: GET /api/documents/:id/file
 * Access: Private (owner only)
 */
exports.downloadDocumentFile = asyncHandler(async (req, res) => {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!document || !document.fileUrl) {
        throw ApiError.notFound('Document file not found');
    }
    if (!fs.existsSync(document.fileUrl)) {
        throw ApiError.notFound('The original file is no longer available on the server');
    }
    res.download(document.fileUrl, document.filename);
});

/**
 * Delete a document
 * Route: DELETE /api/documents/:id
 * Access: Private
 */
exports.deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user.id });
    if (!document) {
        throw ApiError.notFound('Document not found');
    }

    safeUnlink(document.fileUrl);
    await document.deleteOne();

    res.json({ success: true, message: 'Document deleted successfully' });
});
