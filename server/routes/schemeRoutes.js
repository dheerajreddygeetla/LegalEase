const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAllSchemes,
    getSchemeById,
    recommendSchemes,
    checkSchemeEligibility,
} = require('../controllers/schemeController');

// Public routes
router.get('/', getAllSchemes);
router.get('/:id', getSchemeById);

// Protected routes
router.post('/recommend', protect, recommendSchemes);
router.post('/:id/check-eligibility', protect, checkSchemeEligibility);

module.exports = router;