import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';

const BASE_URL = 'https://oa-generator.onrender.com';

const Chatbot = ({ theme, onThemeToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI assistant. I can help you with coding questions, explain concepts, or assist with your assessments. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const chatVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      x: 'calc(100vw - 100px)'
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      x: 'calc(100vw - 100px)',
      transition: {
        duration: 0.2
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed bottom-24 right-6 z-40 w-96 h-[500px] rounded-2xl shadow-2xl border ${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    AI Assistant
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Powered by Groq AI
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onThemeToggle}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-gray-800 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[380px]">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? (theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500')
                          : (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200')
                      }`}>
                        {message.type === 'user' ? (
                          <User size={16} className="text-white" />
                        ) : (
                          <Bot size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                        )}
                      </div>
                      <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2 rounded-2xl ${
                          message.type === 'user'
                            ? (theme === 'dark' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-500 text-white')
                            : (theme === 'dark' 
                                ? 'bg-gray-800 text-gray-100' 
                                : 'bg-gray-100 text-gray-900')
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <span className={`text-xs mt-1 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <Bot size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                    </div>
                    <div className={`px-4 py-2 rounded-2xl ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex gap-2">
                <div className={`flex-1 relative ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                } rounded-xl`}>
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className={`w-full p-3 pr-12 resize-none border-0 outline-none bg-transparent ${
                      theme === 'dark' 
                        ? 'text-white placeholder-gray-400' 
                        : 'text-gray-900 placeholder-gray-500'
                    }`}
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`p-3 rounded-xl transition-colors ${
                    inputMessage.trim() && !isLoading
                      ? (theme === 'dark' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white')
                      : (theme === 'dark' 
                          ? 'bg-gray-700 text-gray-500' 
                          : 'bg-gray-200 text-gray-400')
                  }`}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot; 
