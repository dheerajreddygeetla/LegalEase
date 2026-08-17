const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    uploadDocument,
    getUserDocuments,
    getDocumentById,
    deleteDocument,
} = require('../controllers/documentController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['pdf', 'docx', 'txt'];
    const ext = path.extname(file.originalname).substring(1).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// All routes are protected
router.use(protect);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getUserDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);

module.exports = router;