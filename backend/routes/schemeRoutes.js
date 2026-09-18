const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { mongoIdParam, recommendSchemesRules, listSchemesQueryRules } = require('../middleware/validators');
const {
    getAllSchemes,
    getSchemeCategories,
    getSchemeStates,
    getSchemeById,
    recommendSchemes,
    checkSchemeEligibility,
    toggleBookmark,
    getBookmarkedSchemes,
} = require('../controllers/schemeController');

// Metadata & Listing (Public)
router.get('/', listSchemesQueryRules, getAllSchemes);
router.get('/categories', getSchemeCategories);
router.get('/states', getSchemeStates);
router.post('/recommend', recommendSchemesRules, recommendSchemes);

// User-specific actions (Protected) — registered before the generic
// '/:id' route further down is irrelevant here since '/user/bookmarked'
// has two path segments and can never match a single ':id' param, but we
// keep protected routes grouped together for clarity.
router.get('/user/bookmarked', protect, getBookmarkedSchemes);

router.post('/:id/check-eligibility', mongoIdParam(), checkSchemeEligibility);
router.get('/:id', mongoIdParam(), getSchemeById);
router.post('/:id/bookmark', protect, mongoIdParam(), toggleBookmark);

module.exports = router;
