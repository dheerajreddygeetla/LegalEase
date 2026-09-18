// controllers/chatController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { generateResponse } = require('../services/aiService');
const { translateText } = require('../services/translationService');
const { retrieveRelevantDocs } = require('../services/ragService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

exports.sendMessage = asyncHandler(async (req, res) => {
    const { conversationId, message, lang = 'en' } = req.body;
    const userId = req.user.id;
    const trimmedMessage = message.trim();

    console.log('📨 Received chat message:', { userId, conversationId, messageLength: trimmedMessage.length, lang });

    // Find or create conversation
    let conversation;
    let priorMessages = [];

    if (conversationId) {
        conversation = await Conversation.findOne({ _id: conversationId, userId });
        if (!conversation) {
            throw ApiError.notFound('Conversation not found');
        }

        // Retrieve recent conversation history for multi-turn context
        priorMessages = await Message.find({ conversationId: conversation._id })
            .sort({ createdAt: -1 })
            .limit(6)
            .lean();
        priorMessages.reverse();
    } else {
        conversation = await Conversation.create({
            userId,
            title: trimmedMessage.substring(0, 60).trim() + (trimmedMessage.length > 60 ? '...' : ''),
            language: lang,
        });
    }

    // Save user message
    await Message.create({
        conversationId: conversation._id,
        role: 'user',
        content: trimmedMessage,
    });

    // 1. Retrieve relevant legal provisions (RAG)
    let relevantDocs = [];
    let context = '';
    try {
        relevantDocs = await retrieveRelevantDocs(trimmedMessage, 3);
        if (relevantDocs.length > 0) {
            context = relevantDocs
                .map((doc) => `[Statute: ${doc.title}]\n${doc.content}`)
                .join('\n\n');
        }
    } catch (ragError) {
        console.warn('RAG retrieval skipped:', ragError.message);
    }

    // 2. Generate AI response with conversation history and legal context
    let aiResponse;
    try {
        aiResponse = await generateResponse(trimmedMessage, context, priorMessages);
        console.log('✅ AI response generated successfully');
    } catch (aiError) {
        console.error('❌ AI generation error:', aiError.message);
        throw ApiError.serviceUnavailable(aiError.message || 'AI service is temporarily unavailable. Please try again.');
    }

    // 3. Translate if regional language requested
    let finalResponse = aiResponse;
    if (lang && lang !== 'en') {
        try {
            finalResponse = await translateText(aiResponse, lang);
        } catch (translateError) {
            console.warn('Translation skipped, using English:', translateError.message);
            finalResponse = aiResponse;
        }
    }

    // 4. Save assistant message
    const assistantMessage = await Message.create({
        conversationId: conversation._id,
        role: 'assistant',
        content: finalResponse,
        sources: relevantDocs.map((doc) => ({ title: doc.title, content: doc.content })),
    });

    console.log('✅ Message saved and response sent');

    res.json({
        success: true,
        data: {
            conversationId: conversation._id,
            assistantMessage,
            sources: relevantDocs.map((doc) => ({ title: doc.title, content: doc.content })),
        },
    });
});

exports.getConversations = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    const [conversations, total] = await Promise.all([
        Conversation.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('title language createdAt')
            .lean(),
        Conversation.countDocuments(filter),
    ]);

    res.json({
        success: true,
        data: conversations,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
});

exports.getConversationMessages = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!conversation) {
        throw ApiError.notFound('Conversation not found');
    }
    const messages = await Message.find({ conversationId: conversation._id })
        .sort({ createdAt: 1 })
        .lean();
    res.json({ success: true, data: messages });
});

exports.deleteConversation = asyncHandler(async (req, res) => {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user.id });
    if (!conversation) {
        throw ApiError.notFound('Conversation not found');
    }
    await Message.deleteMany({ conversationId: conversation._id });
    await conversation.deleteOne();
    res.json({ success: true, message: 'Conversation deleted' });
});

exports.deleteAllConversations = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const conversations = await Conversation.find({ userId }).select('_id');
    const convIds = conversations.map((c) => c._id);

    await Promise.all([
        Message.deleteMany({ conversationId: { $in: convIds } }),
        Conversation.deleteMany({ userId }),
    ]);

    res.json({ success: true, message: 'All consultation histories deleted successfully' });
});
