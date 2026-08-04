import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { aboutData } from '../data/portfolioData';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending packet...');

    try {
      const response = await axios.post(`https://formsubmit.co/ajax/${aboutData.email}`, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        _subject: "New Portfolio Message!"
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const isSuccess = response.status === 200 && (response.data.success === true || response.data.success === "true" || response.data.success);

      if (isSuccess) {
        setStatus('Packet successfully delivered. Connection closed.');
        setFormData({ name: '', email: '', message: '' }); 
      } else {
        setStatus('Error: Packet dropped by server. Try direct email.');
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus('Error: Network failure. Try direct email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="terminal-container" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="prompt">./execute_contact.sh</p>
        
        <div className="terminal-block contact-block">
          <h3 className="contact-title">
            Initiate Secure Connection...
          </h3>
          
          <div className="contact-info-list">
            <p>
              <span className="prompt">email:</span>{' '}
              <a href={`mailto:${aboutData.email}`} className="glow-text contact-link">
                {aboutData.email}
              </a>
            </p>
            <p>
              <span className="prompt">phone:</span> {aboutData.phone}
            </p>
            <p>
              <span className="prompt">github:</span>{' '}
              <a href="https://github.com/GAURAV-1444" target="_blank" rel="noreferrer" className="glow-text contact-link">
                github.com/GAURAV-1444
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div>
              <label className="contact-label">
                {">"} Enter_Name:
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="_" 
                required
                disabled={isSubmitting}
                className="terminal-input"
              />
            </div>
            
            <div>
              <label className="contact-label">
                {">"} Enter_Email:
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="_" 
                required
                disabled={isSubmitting}
                className="terminal-input"
              />
            </div>
            
            <div>
              <label className="contact-label">
                {">"} Enter_Message:
              </label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4" 
                placeholder="_" 
                required
                disabled={isSubmitting}
                className="terminal-textarea"
              ></textarea>
            </div>
            
            {status && (
              <p className="contact-status-text" style={{ color: status.includes('Error') ? '#ff4d4d' : 'var(--green-main)' }}>
                {">"} {status}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn-terminal glow-text contact-submit-btn"
              style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? '[ TRANSMITTING... ]' : '[ SEND_PACKET ]'}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;