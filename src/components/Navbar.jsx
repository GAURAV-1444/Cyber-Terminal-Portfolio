// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false); // Close mobile menu when a link is clicked
  };

  return (
    <motion.nav 
      className="navbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-brand glow-text">
        GAURAV.DEV
      </div>

      {/* Hamburger Toggle Button */}
      <button 
        className="nav-hamburger-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      {/* Navigation Links list (toggled via 'open' class on mobile) */}
      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li>
          <a href="#home" className={activeSection === 'home' ? 'active-link' : ''} onClick={handleLinkClick}>
            [ HOME ]
          </a>
        </li>
        <li>
          <a href="#about" className={activeSection === 'about' ? 'active-link' : ''} onClick={handleLinkClick}>
            [ ABOUT ]
          </a>
        </li>
        <li>
          <a href="#projects" className={activeSection === 'projects' ? 'active-link' : ''} onClick={handleLinkClick}>
            [ PROJECTS ]
          </a>
        </li>
        <li>
          <a href="#skills" className={activeSection === 'skills' ? 'active-link' : ''} onClick={handleLinkClick}>
            [ SKILLS ]
          </a>
        </li>
        <li>
          <a href="#experience" className={activeSection === 'experience' ? 'active-link' : ''} onClick={handleLinkClick}>
            [ LOG ]
          </a>
        </li>
        <li>
          <a href="#contact" className={activeSection === 'contact' ? 'active-link' : ''} onClick={handleLinkClick}>
            [ CONTACT ]
          </a>
        </li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;