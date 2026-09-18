import api from './api';

export const sendMessage = async (message, conversationId = null, lang = 'en') => {
  return api.post('/chat/message', { message, conversationId, lang });
};

export const getConversations = async () => {
  return api.get('/chat/conversations');
};

export const getMessages = async (conversationId) => {
  return api.get(`/chat/conversations/${conversationId}/messages`);
};

export const createConversation = async (title) => {
  return api.post('/chat/conversations', { title });
};

export const deleteConversation = async (conversationId) => {
  return api.delete(`/chat/conversations/${conversationId}`);
};

export const checkHealth = async () => {
  return api.get('/health');
};
