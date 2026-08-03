import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { timelineData } from '../data/portfolioData';
import CertificatesModal from './CertificatesModal';
import { FaTerminal, FaCertificate, FaMapMarkerAlt, FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

const Experience = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const filteredData = timelineData.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'training' && item.type.includes('training')) return true;
    if (activeTab === 'education' && item.type.includes('education')) return true;
    if (activeTab === 'certs' && item.type.includes('certs')) return true;
    return false;
  });

  useEffect(() => {
    const handleNextSlide = (e) => {
      if (e.detail?.sectionId === 'experience') {
        setSelectedIndex((prev) => Math.min(prev + 1, filteredData.length - 1));
      }
    };

    const handlePrevSlide = (e) => {
      if (e.detail?.sectionId === 'experience') {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('nav-next-slide', handleNextSlide);
    window.addEventListener('nav-prev-slide', handlePrevSlide);

    return () => {
      window.removeEventListener('nav-next-slide', handleNextSlide);
      window.removeEventListener('nav-prev-slide', handlePrevSlide);
    };
  }, [filteredData.length]);

  const toggleSelect = (index) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section 
      className="terminal-container" 
      id="experience"
      data-interactive-section="true"
      data-current-index={selectedIndex ?? 0}
      data-max-index={Math.max(0, filteredData.length - 1)}
    >
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

          <div 
            className="exp-logs-container"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {filteredData.map((item, index) => {
              // When hovering ANY item, override click/keyboard selection so only the hovered item expands
              const isHoverActive = hoveredIndex !== null;
              const isExpanded = isHoverActive ? hoveredIndex === index : selectedIndex === index;

              return (
                <motion.div 
                  key={`${activeTab}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  onClick={() => toggleSelect(index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={`exp-log-card ${isExpanded ? 'selected' : 'unselected'}`}
                >
                  <div className="exp-card-header-row">
                    {/* Left Side: Title and Location */}
                    <div className="exp-card-main-info">
                      <h3 className="exp-card-title">
                        <FaTerminal style={{ fontSize: '0.75rem', marginRight: '6px' }} />
                        {item.title}
                      </h3>
                      <h4 className="exp-card-location">
                        <FaMapMarkerAlt className="exp-location-icon" />
                        {item.location}
                      </h4>
                    </div>

                    {/* Right Side: Year and Arrow */}
                    <div className="exp-card-meta-right">
                      <span className="exp-card-year">
                        <FaCalendarAlt style={{ fontSize: '0.7rem', marginRight: '4px' }} />
                        {item.year}
                      </span>
                      <FaChevronDown className={`exp-arrow-icon ${isExpanded ? 'rotated' : ''}`} />
                    </div>
                  </div>

                  {/* Expandable Details Box */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="exp-details-box"
                      >
                        <span className="exp-card-process">
                          {">"} process::{item.type}
                        </span>
                        <p className="exp-card-details">
                          {item.details}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
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