// server/controllers/chatController.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { generateResponse } = require('../services/aiService');
const { translateText } = require('../services/translationService');
const { retrieveRelevantDocs } = require('../services/ragService');

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, message, lang = 'en' } = req.body;
    const userId = req.user.id;

    console.log('Received message request:', { conversationId, message, lang, userId });
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversation not found' });
      }
    } else {
      conversation = await Conversation.create({
        userId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        language: lang,
      });
    }

    // Save user message
    const userMessage = await Message.create({
      conversationId: conversation._id,
      role: 'user',
      content: message,
    });

    // 1. Retrieve relevant docs (RAG)
    const relevantDocs = await retrieveRelevantDocs(message, 3);
    const context = relevantDocs.map(doc => doc.content).join('\n\n');

    // 2. Generate AI response with context
    const aiResponse = await generateResponse(message, context);
    console.log('AI Response (English):', aiResponse);

    // 3. Translate if needed
    let finalResponse = aiResponse;
    if (lang !== 'en') {
      console.log('Translating to language:', lang);
      finalResponse = await translateText(aiResponse, lang);
    }

    // 4. Save assistant message with sources
    const assistantMessage = await Message.create({
      conversationId: conversation._id,
      role: 'assistant',
      content: finalResponse,
      sources: relevantDocs.map(doc => ({ title: doc.title, content: doc.content })),
    });

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        userMessage,
        assistantMessage,
        sources: relevantDocs.map(doc => ({ title: doc.title, content: doc.content })),
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('title language createdAt');
    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getConversationMessages = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    await Message.deleteMany({ conversationId: conversation._id });
    await conversation.deleteOne();
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};