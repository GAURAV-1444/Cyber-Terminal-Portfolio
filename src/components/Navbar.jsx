import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import TerminalModal from './TerminalModal';
import { sfx } from '../utils/sfx';
import './NavBar.css';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Safely evaluate whether isMuted is a boolean or a method
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof sfx.isMuted === 'function') {
      return sfx.isMuted();
    }
    return Boolean(sfx.isMuted);
  });

  const isNavigating = useRef(false);

  const sections = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];

  const handleToggleAudio = () => {
    const mutedState = sfx.toggleMute();
    setIsMuted(mutedState);
    if (!mutedState) {
      sfx.playKeyClick?.();
    }
  };

  useEffect(() => {
    const handleExternalNav = (e) => {
      const targetId = e.detail?.sectionId;
      if (targetId) {
        isNavigating.current = true;
        setActiveSection(targetId);

        setTimeout(() => {
          isNavigating.current = false;
        }, 1200);
      }
    };

    window.addEventListener('nav-change-section', handleExternalNav);
    return () => window.removeEventListener('nav-change-section', handleExternalNav);
  }, []);

  useEffect(() => {
    const sectionElements = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -40% 0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      if (isNavigating.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    sfx.playKeyClick?.();
    setIsOpen(false);
    setActiveSection(sectionId);

    isNavigating.current = true;

    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  };

  return (
    <>
      <motion.nav
        className="navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="nav-left-group">
          <div
            className="nav-brand-chip"
            onClick={() => {
              sfx.playExecuteSound?.();
              setIsModalOpen(true);
            }}
            title="Click or press Ctrl + K to launch CLI"
          >
            <div className="chip-corner-tl"></div>
            <div className="chip-corner-br"></div>

            <span className="chip-prompt-symbol">&gt;_</span>

            <div className="chip-text-group">
              <span className="nav-brand glow-text">GAURAV.DEV</span>
              <span className="chip-subtext">SYS_OS // v4.2</span>
            </div>

            <span className="nav-logo-cursor"></span>
          </div>
        </div>

        <button
          type="button"
          className="nav-hamburger-btn"
          onClick={() => {
            sfx.playKeyClick?.();
            setIsOpen(!isOpen);
          }}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {sections.map((sec) => (
            <li key={sec}>
              <a
                href={`#${sec}`}
                className={activeSection === sec ? 'active-link' : ''}
                onClick={(e) => handleLinkClick(e, sec)}
              >
                [ {sec === 'experience' ? 'LOG' : sec.toUpperCase()} ]
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Floating Action Button for SFX Toggle */}
      <button
        type="button"
        className="nav-sfx-toggle-btn"
        onClick={handleToggleAudio}
        title={isMuted ? "Enable Audio SFX" : "Mute Audio SFX"}
        aria-label={isMuted ? "Enable Audio SFX" : "Mute Audio SFX"}
      >
        {isMuted ? (
          <FaVolumeMute className="sfx-muted-icon" />
        ) : (
          <FaVolumeUp className="sfx-active-icon" />
        )}
      </button>

      <TerminalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Navbar;