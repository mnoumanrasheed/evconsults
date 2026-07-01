"use client";
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, User, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am **EVBot**, your EVConsults AI specialist. ⚡\n\nI can help with **NEPRA Chapter 16 compliance**, **IESCO connection documents**, **earthing & protection**, **tariff/margin rules**, **transformer sizing**, and our consultancy services in Pakistan. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) {
      setInput('');
    }

    setError(null);
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
          })) // send last 6 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      console.error(err);
      setError('Connection issue. Please try again.');
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please feel free to email our team at **alviaatif@hotmail.com** or call **0322 5131504**." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionChips = [
    { label: "IESCO documents checklist", query: "What documents are required for IESCO EVCS connection?" },
    { label: "NEPRA Chapter 16 overview", query: "Explain NEPRA Chapter 16 for public EV charging stations" },
    { label: "Transformer sizing for 120kW", query: "What transformer size is needed for a 120 kW EV charger?" },
    { label: "Earthing requirements", query: "What are the earthing requirements for an EV charging station?" },
  ];

  return (
    <div style={{ position: 'fixed', bottom: '6.5rem', right: '2rem', zIndex: 1000, fontFamily: 'var(--font-inter), sans-serif' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: '4.5rem',
              right: 0,
              width: '360px',
              height: '520px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(4, 13, 26, 0.15), 0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backdropFilter: 'blur(10px)',
              zIndex: 1001
            }}
            className="chatbot-panel"
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0B1F33 0%, #040D1A 100%)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(0, 174, 239, 0.15)',
                  border: '1px solid rgba(0, 174, 239, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00AEEF',
                  position: 'relative'
                }}>
                  <Bot size={22} />
                  <span style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#39D353',
                    border: '2px solid #0B1F33'
                  }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem', fontWeight: 700 }}>EVBot</h4>
                  <span style={{ fontSize: '0.72rem', color: '#A0AEC0', display: 'block' }}>Advisory Assistant</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#A0AEC0',
                  transition: 'background-color 0.2s, color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#A0AEC0'; }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Conversation Flow */}
            <div style={{
              flex: 1,
              padding: '1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              background: '#F8FAFC'
            }} className="chatbot-messages">
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                      flexDirection: isAssistant ? 'row' : 'row-reverse',
                      maxWidth: '85%'
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isAssistant ? 'linear-gradient(135deg, #0B1F33, #040D1A)' : '#00AEEF',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      flexShrink: 0,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                      {isAssistant ? <Bot size={14} style={{ color: '#00AEEF' }} /> : <User size={14} />}
                    </div>

                    {/* Bubble */}
                    <div style={{
                      backgroundColor: isAssistant ? '#ffffff' : '#00AEEF',
                      color: isAssistant ? '#1A202C' : '#ffffff',
                      padding: '0.75rem 1rem',
                      borderRadius: isAssistant ? '0 16px 16px 16px' : '16px 0 16px 16px',
                      fontSize: '0.85rem',
                      lineHeight: '1.5',
                      boxShadow: isAssistant ? '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' : '0 4px 10px rgba(0, 174, 239, 0.25)',
                      border: isAssistant ? '1px solid #E2E8F0' : 'none',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {/* Simple markdown parsing for bold and links */}
                      {m.content.split('\n').map((paragraph, pIdx) => {
                        // Match links like [text](url)
                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                        const boldRegex = /\*\*([^*]+)\*\*/g;
                        
                        let elements = [];
                        let lastIndex = 0;
                        let match;

                        // Process bold text and links in paragraphs
                        const text = paragraph;
                        
                        // Fallback simple renderer
                        return (
                          <p key={pIdx} style={{ margin: pIdx > 0 ? '0.5rem 0 0 0' : 0 }}>
                            {text.split('**').map((chunk, cIdx) => {
                              if (cIdx % 2 === 1) {
                                // Bold part
                                return <strong key={cIdx} style={{ fontWeight: 700 }}>{chunk}</strong>;
                              }
                              // Parse links inside normal text
                              const subChunks = chunk.split(/\[([^\]]+)\]\(([^)]+)\)/g);
                              if (subChunks.length > 1) {
                                const renderChunks = [];
                                for (let k = 0; k < subChunks.length; k += 3) {
                                  renderChunks.push(subChunks[k]); // regular text
                                  if (subChunks[k + 1] && subChunks[k + 2]) {
                                    renderChunks.push(
                                      <a
                                        key={k}
                                        href={subChunks[k + 2]}
                                        style={{
                                          color: isAssistant ? '#00AEEF' : '#ffffff',
                                          textDecoration: 'underline',
                                          fontWeight: '600'
                                        }}
                                      >
                                        {subChunks[k + 1]}
                                      </a>
                                    );
                                  }
                                }
                                return renderChunks;
                              }
                              return chunk;
                            })}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0B1F33, #040D1A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={14} style={{ color: '#00AEEF' }} />
                  </div>
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0 16px 16px 16px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#A0AEC0', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                    <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#A0AEC0', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both 0.2s' }} />
                    <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#A0AEC0', borderRadius: '50%', display: 'inline-block', animation: 'bounce 1.4s infinite ease-in-out both 0.4s' }} />
                  </div>
                </div>
              )}

              {/* Quick suggestions chips */}
              {!isLoading && messages.length === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#718096', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Suggestions:</span>
                  {suggestionChips.map((chip, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => handleSend(chip.query)}
                      style={{
                        padding: '0.6rem 1rem',
                        backgroundColor: '#ffffff',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        color: '#4A5568',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00AEEF'; e.currentTarget.style.color = '#00AEEF'; e.currentTarget.style.backgroundColor = '#F0F9FF'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#4A5568'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
                    >
                      <Sparkles size={12} style={{ color: '#00AEEF' }} />
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error state alert */}
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#FFF5F5',
                borderTop: '1px solid #FED7D7',
                padding: '0.5rem 1rem',
                color: '#E53E3E',
                fontSize: '0.75rem'
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {/* Input Form */}
            <div style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about licensing, studies, cost..."
                style={{
                  flex: 1,
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '0.65rem 1rem',
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#F8FAFC'
                }}
                disabled={isLoading}
                onFocus={(e) => e.currentTarget.style.borderColor = '#00AEEF'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: (isLoading || !input.trim()) ? '#E2E8F0' : '#00AEEF',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s, transform 0.1s'
                }}
                onMouseEnter={(e) => { if (!isLoading && input.trim()) e.currentTarget.style.backgroundColor = '#008ebb'; }}
                onMouseLeave={(e) => { if (!isLoading && input.trim()) e.currentTarget.style.backgroundColor = '#00AEEF'; }}
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '3.5rem',
          height: '3.5rem',
          background: 'linear-gradient(135deg, #0B1F33 0%, #00AEEF 100%)',
          color: '#ffffff',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(0, 174, 239, 0.45)',
          zIndex: 1000,
          position: 'relative'
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={26} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Bot size={26} />
              {/* Pulsing indicator badge on closed button */}
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#39D353',
                border: '2px solid #ffffff'
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        @media (max-width: 480px) {
          .chatbot-panel {
            width: calc(100vw - 2rem) !important;
            height: calc(100vh - 12rem) !important;
            max-height: 480px !important;
            right: -0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
