import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { timelineData } from '../data/portfolioData';
import CertificatesModal from './CertificatesModal';
import { FaTerminal, FaCertificate } from 'react-icons/fa';

const Experience = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredData = timelineData.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'training' && item.type.includes('training')) return true;
    if (activeTab === 'education' && item.type.includes('education')) return true;
    if (activeTab === 'certs' && item.type.includes('certs')) return true;
    return false;
  });

  // Keyboard navigation support for experience logs (safeguarded against input focus)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      if (filteredData.length === 0) return;

      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredData.length);
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredData.length) % filteredData.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredData.length]);

  return (
    <section className="terminal-container" id="experience">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="exp-header-wrap">
          <p className="prompt" style={{ margin: 0 }}>git log --oneline --graph</p>
          <h2 className="exp-title">
            Experience & Education Log
          </h2>
        </div>

        <div className="exp-controls-flex">
          <div className="exp-tabs-group">
            <button 
              onClick={() => { setActiveTab('all'); setSelectedIndex(0); }}
              className={`terminal-tab-btn exp-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              $ git log --all
            </button>
            <button 
              onClick={() => { setActiveTab('training'); setSelectedIndex(0); }}
              className={`terminal-tab-btn exp-tab-btn ${activeTab === 'training' ? 'active' : ''}`}
            >
              ./training.sh
            </button>
            <button 
              onClick={() => { setActiveTab('education'); setSelectedIndex(0); }}
              className={`terminal-tab-btn exp-tab-btn ${activeTab === 'education' ? 'active' : ''}`}
            >
              ./education.sys
            </button>
            <button 
              onClick={() => { setActiveTab('certs'); setSelectedIndex(0); }}
              className={`terminal-tab-btn exp-tab-btn ${activeTab === 'certs' ? 'active' : ''}`}
            >
              ./certs.log
            </button>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-terminal glow-text exp-modal-btn"
          >
            <FaCertificate /> [ VIEW_CERTIFICATES.sh ]
          </button>
        </div>
        
        <div className="terminal-block exp-terminal-block">
          
          <div className="exp-session-bar">
            <span>SESSION_ID: #8492-LOG</span>
            <span style={{ color: 'var(--green-main)' }}>USE [J] / [K] OR ARROWS TO NAVIGATE</span>
          </div>

          <div className="exp-logs-container">
            {filteredData.map((item, index) => {
              const isSelected = selectedIndex === index;
              return (
                <motion.div 
                  key={`${activeTab}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  onClick={() => setSelectedIndex(index)}
                  whileHover={{ scale: 1.01 }}
                  className={`exp-log-card ${isSelected ? 'selected' : 'unselected'}`}
                >
                  <div className="exp-card-header">
                    <span className="exp-card-process">
                      <FaTerminal style={{ fontSize: '0.75rem' }} /> {">"} process::{item.type}
                    </span>
                    <span className="exp-card-year">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="exp-card-title">
                    {item.title}
                  </h3>
                  
                  <h4 className="exp-card-location">
                    📍 {item.location}
                  </h4>
                  
                  <p className="exp-card-details">
                    {item.details}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="exp-footer-hint">
            <span style={{ color: 'var(--green-main)' }}>{">"}</span>
            <span>Click category tabs above or use keyboard shortcuts to query records _</span>
          </div>

        </div>
      </motion.div>

      <CertificatesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default Experience;