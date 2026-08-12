import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../utils/aiContext';
import { sfx } from '../utils/sfx';
import './TerminalChat.css';

// Initialize SDK with Vite Environment Variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const TerminalChat = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'SYS_AI // Online. Ask me anything about Gaurav’s skills, projects, or background.',
    },
  ]);

  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const cleanText = input.trim();
    if (!cleanText || isLoading) return;

    sfx.playKeyClick?.();

    const newMessages = [...messages, { sender: 'user', text: cleanText }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (!apiKey) {
        throw new Error('VITE_GEMINI_API_KEY is missing in your .env file.');
      }

      // Standard Gemini 2.5 Flash call with systemInstruction properly nested inside config
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: newMessages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      sfx.playExecuteSound?.();
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: response.text || 'SYS_AI // No response received.' },
      ]);
    } catch (err) {
      console.error('AI Terminal Error:', err);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `SYS_ERR // ${err.message || 'Failed to connect to AI core.'}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="terminal-chat-card">
      <div className="chat-header">
        <span className="terminal-dot red"></span>
        <span className="terminal-dot yellow"></span>
        <span className="terminal-dot green"></span>
        <span className="chat-title">SYS_AI_CORE // DIRECT_GEMINI_LINK</span>
      </div>

      <div className="chat-viewport">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-line ${msg.sender}`}>
            <span className="chat-prefix">
              {msg.sender === 'user' ? 'visitor@gaurav-dev:~$' : '[SYS_AI]:'}
            </span>
            <span className="chat-text">{msg.text}</span>
          </div>
        ))}

        {isLoading && (
          <div className="chat-line ai loading">
            <span className="chat-prefix">[SYS_AI]:</span>
            <span className="chat-text">COMPUTING_RESPONSE...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      <form className="chat-input-bar" onSubmit={handleSendMessage}>
        <span className="input-prompt">&gt;_</span>
        <input
          type="text"
          className="chat-input"
          placeholder="Ask AI about Spring Boot, microservices, or education..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-btn" disabled={isLoading}>
          {isLoading ? 'THINKING...' : 'SEND [ ↵ ]'}
        </button>
      </form>
    </div>
  );
};

export default TerminalChat;