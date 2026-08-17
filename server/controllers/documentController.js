const Document = require('../models/Document');
const { extractTextFromFile } = require('../services/documentService');
const { summarizeDocument } = require('../services/aiService');
const fs = require('fs');
const path = require('path');

/**
 * Upload and analyze a document
 * Route: POST /api/documents/upload
 * Access: Private
 */
exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const userId = req.user.id;
        const file = req.file;
        const fileType = path.extname(file.originalname).substring(1); // pdf, docx, txt

        // Extract text from the file
        const extractedText = await extractTextFromFile(file.path, fileType);

        // Generate a summary using AI
        const summary = await summarizeDocument(extractedText);

        // Save document to database
        const document = await Document.create({
            userId,
            filename: file.originalname,
            fileType,
            fileUrl: file.path,
            extractedText: extractedText.substring(0, 10000), // Limit stored text
            summary,
            status: 'processed',
        });

        res.status(201).json({
            success: true,
            data: {
                _id: document._id,
                filename: document.filename,
                fileType: document.fileType,
                summary: document.summary,
                status: document.status,
            },
        });
    } catch (error) {
        console.error('Upload error details:', error);
        // Clean up uploaded file if error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Upload failed. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Get all documents for the logged-in user
 * Route: GET /api/documents
 * Access: Private
 */
exports.getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .select('filename fileType summary status createdAt');
        res.json({ success: true, data: documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Get a single document by ID
 * Route: GET /api/documents/:id
 * Access: Private
 */
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        res.json({ success: true, data: document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

/**
 * Delete a document
 * Route: DELETE /api/documents/:id
 * Access: Private
 */
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        // Delete the file from disk
        if (fs.existsSync(document.fileUrl)) {
            fs.unlinkSync(document.fileUrl);
        }
        await document.deleteOne();
        res.json({ success: true, message: 'Document deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};