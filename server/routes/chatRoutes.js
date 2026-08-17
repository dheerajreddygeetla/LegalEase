const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    sendMessage,
    getConversations,
    getConversationMessages,
    deleteConversation,
} = require('../controllers/chatController');

// All routes are protected
router.use(protect);

router.post('/message', sendMessage);
router.get('/conversations', getConversations);
router.get('/conversations/:id/messages', getConversationMessages);
router.delete('/conversations/:id', deleteConversation);

module.exports = router;