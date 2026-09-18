const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { mongoIdParam } = require('../middleware/validators');
const env = require('../config/env');
const {
    uploadDocument,
    getUserDocuments,
    getDocumentById,
    downloadDocumentFile,
    deleteDocument,
} = require('../controllers/documentController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'txt'];
// Extension alone is easy to spoof; also whitelist expected MIME types as a
// second, independent check.
const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
]);

// Configure multer disk storage with unique filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${uniqueSuffix}-${sanitized}`);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).substring(1).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are accepted.'), false);
    }
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        return cb(new Error('File content does not match an accepted document type.'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
});

// Multer upload wrapper for clean error messages
const handleUpload = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: `File size exceeds the ${env.MAX_UPLOAD_MB}MB maximum limit.` });
            }
            return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// All routes are protected
router.use(protect);

router.post('/upload', aiLimiter, handleUpload, uploadDocument);
router.get('/', getUserDocuments);
router.get('/:id', mongoIdParam(), getDocumentById);
router.get('/:id/file', mongoIdParam(), downloadDocumentFile);
router.delete('/:id', mongoIdParam(), deleteDocument);

module.exports = router;
