import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Plus, Trash2, Sparkles, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../../hooks/useLanguage';
import * as chatService from '../../services/chatService';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatContainer = () => {
  console.log('ChatContainer component rendering');
  console.log('ChatContainer styles check:', {
    containerHeight: 'h-[calc(100vh-10rem)]',
    background: 'gradient set',
    backdropFilter: 'blur set'
  });

  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

  const suggestedPrompts = [
    'What are my basic rights as a residential tenant in India?',
    'How do I dispute an incorrect charge under Consumer Protection Act?',
    'What are the rules for gratuity payment after leaving a job?',
    'What should I do immediately if I face an online financial scam?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const response = await chatService.getConversations();
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Load conversations error:', error);
      toast.error(error.response?.data?.message || 'Failed to load consultation history.');
      setConversations([]); // Set empty array on error to prevent crashes
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSelectConversation = async (conversationId) => {
    if (conversationId === currentConversationId) return;
    setCurrentConversationId(conversationId);
    setIsLoadingMessages(true);
    try {
      const response = await chatService.getMessages(conversationId);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Load messages error:', error);
      toast.error(error.response?.data?.message || 'Failed to load messages.');
      setMessages([]); // Set empty array on error to prevent crashes
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = {
      _id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const response = await chatService.sendMessage(userMessage.content, currentConversationId);
      const { assistantMessage, conversationId: newConversationId } = response.data.data;

      setMessages((prev) => [...prev, assistantMessage]);

      if (!currentConversationId && newConversationId) {
        setCurrentConversationId(newConversationId);
        loadConversations();
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate legal response.';
      toast.error(errorMessage);
      
      // Add error message to chat to show what went wrong
      setMessages((prev) => [...prev, {
        _id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${errorMessage}. Please check if the backend server is running and configured with a valid GEMINI_API_KEY.`,
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice input is not supported by your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = () => {
      toast.error('Voice capture failed. Please check microphone permissions.');
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    inputRef.current?.focus();
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await chatService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (id === currentConversationId) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Delete conversation error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete consultation.');
    }
  };

  return (
    <div
      className="h-[calc(100vh-10rem)] min-h-[550px] rounded-2xl overflow-hidden flex shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(20, 26, 46, 0.95) 0%, rgba(12, 16, 28, 0.92) 100%)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        color: '#ffffff',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Collapsible History Sidebar */}
      <aside
        className={`transition-all duration-300 border-r border-slate-700/50 flex flex-col bg-slate-900/60 backdrop-blur-xl ${
          sidebarCollapsed ? 'w-0 overflow-hidden border-none' : 'w-64 sm:w-72 flex-shrink-0'
        }`}
      >
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between gap-2">
          <Button
            fullWidth
            size="sm"
            variant="primary"
            iconLeft={<Plus className="w-4 h-4" />}
            onClick={handleNewChat}
          >
            {t('newChat') || 'New Consultation'}
          </Button>
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="px-3 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Previous Consultations
          </div>
          {isLoadingConversations ? (
            <LoadingSpinner size="sm" className="py-8" />
          ) : conversations.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8 italic">No previous consultations</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => handleSelectConversation(conv._id)}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  conv._id === currentConversationId
                    ? 'bg-amber-500/20 border border-amber-500/40 text-white font-medium shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-600/30'
                }`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-sm truncate font-medium">{conv.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(conv.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conv._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-400 rounded-md transition-opacity hover:bg-rose-500/10"
                  title="Delete consultation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent">
        {/* Chat Header Bar */}
        <div className="h-16 px-4 sm:px-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                title="Expand consultations list"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/30" />
              <h2 className="text-base font-bold text-white font-sans tracking-tight">
                Statutory AI Counsel
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Shield className="w-3.5 h-3.5" />
              Indian Law Grounded
            </span>
          </div>
        </div>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {isLoadingMessages ? (
            <LoadingSpinner size="lg" className="py-16" />
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-lg backdrop-blur-sm">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 font-sans tracking-tight">
                What legal question can we answer?
              </h3>
              <p className="text-base text-slate-300 mb-10 leading-relaxed max-w-lg">
                Our AI analyzes constitutional rights, civil procedure, consumer law, and government welfare schemes to provide accurate legal guidance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(prompt)}
                    className="p-4 text-xs sm:text-sm font-medium rounded-xl border border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 hover:border-amber-500/50 text-slate-200 hover:text-white transition-all duration-200 text-left backdrop-blur-sm shadow-sm hover:shadow-md cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-5 sm:p-6 text-sm leading-relaxed shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-tr-sm font-medium border border-amber-500/30'
                        : 'bg-slate-800/80 text-white border border-slate-700/50 rounded-tl-sm backdrop-blur-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    {message.sources?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-600/50">
                        <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Shield className="w-3 h-3" />
                          Verified References
                        </p>
                        <div className="space-y-2">
                          {message.sources.map((source, index) => (
                            <div key={index} className="text-xs text-slate-300 flex items-start gap-2 p-2 rounded-lg bg-slate-700/30 border border-slate-600/30">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                              <span className="leading-relaxed">{source.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 flex items-center gap-3 backdrop-blur-sm shadow-lg">
                    <LoadingSpinner size="sm" />
                    <span className="text-sm text-slate-300">Analyzing legal precedents & statutes...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Command Dock */}
        <div className="p-4 sm:p-5 border-t border-slate-700/50 bg-slate-900/60 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t('typeMessage') || 'Ask a legal question or cite an issue...'}
              className="flex-1 px-5 py-3.5 rounded-xl border border-slate-600/50 bg-slate-800/50 text-sm text-white placeholder-slate-400 outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all font-sans backdrop-blur-sm shadow-sm"
            />
            <Button
              onClick={handleVoiceInput}
              variant={isListening ? 'danger' : 'secondary'}
              size="md"
              title="Voice Input"
              className="p-3 rounded-xl"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              size="md"
              disabled={!inputValue.trim() || isProcessing}
              variant="primary"
              className="p-3 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
