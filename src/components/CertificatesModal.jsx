import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { certificatesData } from '../data/portfolioData';
import { FaExternalLinkAlt, FaTimes } from 'react-icons/fa';

const CertificatesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div 
          className="terminal-block modal-terminal-box"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
         
          <div className="modal-header">
            <p className="prompt" style={{ margin: 0 }}>cat /var/log/certificates.log</p>
            <button 
              onClick={onClose}
              className="modal-close-icon-btn"
            >
              <FaTimes />
            </button>
          </div>

         
          <div className="modal-cert-list">
            {certificatesData.map((cert, index) => (
              <div key={index} className="modal-cert-item">
                <div className="modal-cert-flex">
                  <div>
                    <h4 className="modal-cert-title">{cert.title}</h4>
                    <p className="modal-cert-info">Issuer: {cert.issuer} | Date: {cert.date}</p>
                  </div>
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-terminal modal-cert-link-btn"
                  >
                    View <FaExternalLinkAlt size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          
          <div className="modal-footer" style={{ textAlign: 'right' }}>
            <button 
              onClick={onClose}
              className="btn-terminal modal-close-action-btn"
            >
              [ CLOSE_WINDOW ]
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CertificatesModal;