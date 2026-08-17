import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, ArrowRight, Send, Sparkles, Copy, ThumbsUp, MessageSquare, Plus, Trash2 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';

const Assistant = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleLanguageChange = (newLang) => {
    console.log('Language changed from', lang, 'to', newLang);
    setLang(newLang);
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const res = await api.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(res.data.data);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setInput('');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      console.log('Sending message with language:', lang);
      const res = await api.post('/chat/message', {
        conversationId: currentConversationId,
        message: userMessage,
        lang,
      });
      console.log('Response received:', res.data);

      const { conversationId, assistantMessage, sources } = res.data.data;
      if (!currentConversationId) {
        setCurrentConversationId(conversationId);
        loadConversations();
      }

      // Add assistant message with sources
      setMessages(prev => [...prev, { ...assistantMessage, sources }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.slice(0, -1));
      alert('Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await api.delete(`/chat/conversations/${conversationId}`);
      if (currentConversationId === conversationId) startNewConversation();
      loadConversations();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  // Voice input
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-submit after a short delay
      setTimeout(() => {
        if (transcript.trim()) {
          // We need to trigger the form submit
          const form = document.getElementById('chat-form');
          if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
        }
      }, 300);
    };
    recognition.onerror = (event) => {
      console.error('Speech error:', event);
      setIsListening(false);
    };
    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;
  };

  return (
    <div className="h-[calc(100vh-180px)] bg-app flex flex-col overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-72 glass-card border-r border-border m-0 rounded-none overflow-hidden shrink-0 flex flex-col">
          <div className="p-4 shrink-0">
            <button onClick={startNewConversation} className="btn-primary w-full justify-center gap-2">
              <Plus className="w-4 h-4" />
              New chat
            </button>
          </div>
          <div className="overflow-y-auto flex-1 px-3">
            {conversations.map(conv => (
              <div
                key={conv._id}
                className={`px-3 py-3 cursor-pointer flex justify-between items-center rounded-xl text-sm transition-all mb-1 ${
                  currentConversationId === conv._id 
                    ? 'bg-white/[0.08] text-ink border border-border-hi' 
                    : 'text-ink-dim hover:text-ink hover:bg-white/[0.04] border border-transparent'
                }`}
                onClick={() => loadMessages(conv._id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                  <span className="flex-1 truncate">{conv.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv._id);
                  }}
                  className="text-ink-faint hover:text-risk-high p-1 rounded-md hover:bg-white/[0.05] transition-colors ml-2 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-app">
        {/* Header */}
        <div className="glass-card border-b border-border px-5 py-4 flex items-center justify-between shrink-0 m-0 rounded-none">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="font-display text-lg font-semibold leading-tight text-ink">AI Legal Assistant</h1>
              <span className="kicker mt-1.5 inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan" />
                RAG-powered
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="language-select" className="text-xs font-semibold text-ink-dim">Language</label>
            <select
              id="language-select"
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-auto rounded-xl border border-border bg-base-2/80 px-4 py-2 text-sm text-ink outline-none transition-all hover:bg-base-2/95 focus:border-blue/60 focus:bg-base-2/95 focus:ring-2 focus:ring-blue/20 cursor-pointer"
              style={{ backgroundColor: 'rgba(30, 30, 35, 0.8)' }}
            >
              <option value="en" style={{ backgroundColor: '#1e1e23', color: '#e5e5e5' }}>English</option>
              <option value="hi" style={{ backgroundColor: '#1e1e23', color: '#e5e5e5' }}>हिन्दी (Hindi)</option>
              <option value="te" style={{ backgroundColor: '#1e1e23', color: '#e5e5e5' }}>తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-ink-dim mt-20 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-grad-primary flex items-center justify-center shadow-glow animate-float">
                <MessageSquare className="w-8 h-8 text-white" strokeWidth={1.75} />
              </div>
              <h2 className="font-display text-xl font-semibold text-ink mb-3">
                Ask me anything about legal rights, documents, or government schemes.
              </h2>
              <p className="text-sm text-ink-dim leading-relaxed">
                Example: "What should I do if my employer doesn't pay my salary?"
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl ${msg.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                  <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-3 mt-3 pl-1">
                      <button className="text-ink-faint hover:text-ink transition-colors" title="Copy">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button className="text-ink-faint hover:text-ink transition-colors" title="Helpful">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <details className="mt-3 text-xs text-ink-dim cursor-pointer">
                      <summary className="hover:text-ink font-mono flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-cyan" />
                        Sources ({msg.sources.length})
                      </summary>
                      <ul className="list-disc pl-5 mt-2 space-y-2">
                        {msg.sources.map((src, i) => (
                          <li key={i} className="text-ink-dim">
                            <strong className="text-ink">{src.title}</strong>: {src.content.substring(0, 150)}...
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bubble-ai text-ink-dim flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan animate-pulse" />
                Thinking…
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form id="chat-form" onSubmit={sendMessage} className="glass-card border-t border-border p-4 flex gap-3 shrink-0 m-0 rounded-none">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a legal question..."
            className="flex-1 input-field"
          />
          <button
            type="button"
            onClick={startListening}
            disabled={isListening}
            className={`px-4 py-2 rounded-xl border border-border transition-all shrink-0 ${
              isListening 
                ? 'bg-cyan/10 border-cyan/30 text-cyan' 
                : 'bg-white/[0.03] hover:bg-white/[0.07] text-ink-dim hover:text-ink'
            }`}
          >
            {isListening ? (
              <span className="flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Listening...
              </span>
            ) : (
              <span className="text-lg">🎤</span>
            )}
          </button>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary px-5 py-2 flex items-center gap-2 shrink-0"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Assistant;
