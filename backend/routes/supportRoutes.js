const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/rateLimiter');
const { supportInquiryRules } = require('../middleware/validators');
const { createInquiry, getInquiryByReference } = require('../controllers/supportController');

router.post('/inquiry', apiLimiter, supportInquiryRules, createInquiry);
router.get('/inquiry/:referenceId', apiLimiter, getInquiryByReference);

module.exports = router;
