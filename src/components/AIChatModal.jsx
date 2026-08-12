import React, { useState, useEffect } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import TerminalChat from './TerminalChat';
import { sfx } from '../utils/sfx';
import './AIChatModal.css';

const AIChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    
    const handleToggleChat = (e) => {
      setIsOpen(e.detail?.open ?? true);
      sfx.playExecuteSound?.();
    };

    window.addEventListener('toggle-ai-chat', handleToggleChat);
    return () => window.removeEventListener('toggle-ai-chat', handleToggleChat);
  }, []);

  const handleOpenModal = () => {
    sfx.playExecuteSound?.();
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    sfx.playKeyClick?.();
    setIsOpen(false);
  };

  return (
    <>
     
      <button
        type="button"
        className="floating-ai-btn"
        onClick={handleOpenModal}
        title="Launch SYS_AI Assistant (or type 'ai' in terminal)"
        aria-label="Launch SYS_AI Assistant"
      >
        <FaRobot className="ai-btn-icon" />
        <span className="ai-btn-label">SYS_AI</span>
      </button>

      
      {isOpen && (
        <div className="ai-modal-overlay" onClick={handleCloseModal}>
          <div 
            className="ai-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="ai-modal-close-btn" 
              onClick={handleCloseModal}
              title="Close Assistant [ESC]"
            >
              <FaTimes />
            </button>
            <TerminalChat />
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatModal;
