const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const { sendMessageRules, mongoIdParam } = require('../middleware/validators');
const {
    sendMessage,
    getConversations,
    getConversationMessages,
    deleteConversation,
    deleteAllConversations,
} = require('../controllers/chatController');

// All routes are protected
router.use(protect);

router.post('/message', aiLimiter, sendMessageRules, sendMessage);
router.get('/conversations', getConversations);
router.delete('/conversations', deleteAllConversations);
router.get('/conversations/:id/messages', mongoIdParam(), getConversationMessages);
router.delete('/conversations/:id', mongoIdParam(), deleteConversation);

module.exports = router;
