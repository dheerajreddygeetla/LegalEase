const express = require('express');
const router = express.Router();
const { register, login, googleAuth, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerRules, loginRules, googleAuthRules } = require('../middleware/validators');

router.post('/register', authLimiter, registerRules, register);
router.post('/login', authLimiter, loginRules, login);
router.post('/google', authLimiter, googleAuthRules, googleAuth);
router.get('/me', protect, getMe);

module.exports = router;
