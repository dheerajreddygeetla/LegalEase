const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { updateProfileRules, changePasswordRules } = require('../middleware/validators');
const {
    getUserProfile,
    updateUserProfile,
    changePassword,
    getUserStats,
    deleteAccount,
} = require('../controllers/userController');

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateProfileRules, updateUserProfile);
router.put('/password', changePasswordRules, changePassword);
router.get('/stats', getUserStats);
router.delete('/account', deleteAccount);

module.exports = router;
