import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import TerminalModal from './TerminalModal';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Guard flag to prevent scroll spy flickering during link click transitions
  const isNavigating = useRef(false);

  const sections = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];

  // Precise Viewport Section Spy with IntersectionObserver
  useEffect(() => {
    const sectionElements = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observerOptions = {
      root: null,
      // Adjust top offset to compensate for navbar height (-80px) and bottom window margin
      rootMargin: '-80px 0px -40% 0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      // Ignore scroll spy updates while programmatic click navigation is in progress
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

  // Keyboard Listener with Interactive Section Guard
  useEffect(() => {
    let animationFrameId = null;
    let activeDirection = null;
    const scrollSpeed = 14;

    const performSmoothScroll = () => {
      if (activeDirection === 'down') {
        window.scrollBy({ top: scrollSpeed, behavior: 'instant' });
        animationFrameId = requestAnimationFrame(performSmoothScroll);
      } else if (activeDirection === 'up') {
        window.scrollBy({ top: -scrollSpeed, behavior: 'instant' });
        animationFrameId = requestAnimationFrame(performSmoothScroll);
      }
    };

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl?.tagName);
      if (isTyping || isModalOpen) return;

      // Toggle Terminal CLI (Ctrl + K / ~)
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsModalOpen((prev) => !prev);
        return;
      }

      if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(e.key)) {
        const currentSectionEl = document.getElementById(activeSection);
        const isInteractive = currentSectionEl?.getAttribute('data-interactive-section') === 'true';

        if (isInteractive && currentSectionEl) {
          const rect = currentSectionEl.getBoundingClientRect();
          const isFullyCenteredInView = rect.top <= 120 && rect.bottom >= window.innerHeight * 0.5;

          if (isFullyCenteredInView) {
            const currentIndex = parseInt(currentSectionEl.getAttribute('data-current-index') || '0', 10);
            const maxIndex = parseInt(currentSectionEl.getAttribute('data-max-index') || '0', 10);

            if (['ArrowDown', 'PageDown'].includes(e.key)) {
              if (currentIndex < maxIndex) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('nav-next-slide', { detail: { sectionId: activeSection } }));
                return;
              }
            } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
              if (currentIndex > 0) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('nav-prev-slide', { detail: { sectionId: activeSection } }));
                return;
              }
            }
          }
        }

        if (['ArrowDown', 'PageDown'].includes(e.key) && activeDirection !== 'down') {
          e.preventDefault();
          activeDirection = 'down';
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(performSmoothScroll);
        } else if (['ArrowUp', 'PageUp'].includes(e.key) && activeDirection !== 'up') {
          e.preventDefault();
          activeDirection = 'up';
          cancelAnimationFrame(animationFrameId);
          animationFrameId = requestAnimationFrame(performSmoothScroll);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(e.key)) {
        activeDirection = null;
        cancelAnimationFrame(animationFrameId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeSection, isModalOpen]);

  // Handle direct tab clicks with smooth scrolling & lock guard
  const handleLinkClick = (e, sectionId) => {
    e.preventDefault();
    setIsOpen(false);
    setActiveSection(sectionId);
    
    // Lock scroll spy observer briefly during smooth scroll transition
    isNavigating.current = true;

    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }

    // Release navigation lock after smooth scroll settles
    setTimeout(() => {
      isNavigating.current = false;
    }, 800);
  };

  return (
    <>
      <motion.nav 
        className="navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="nav-brand-chip" 
          onClick={() => setIsModalOpen(true)}
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

        <button 
          className="nav-hamburger-btn" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <a 
              href="#home" 
              className={activeSection === 'home' ? 'active-link' : ''} 
              onClick={(e) => handleLinkClick(e, 'home')}
            >
              [ HOME ]
            </a>
          </li>
          <li>
            <a 
              href="#about" 
              className={activeSection === 'about' ? 'active-link' : ''} 
              onClick={(e) => handleLinkClick(e, 'about')}
            >
              [ ABOUT ]
            </a>
          </li>
          <li>
            <a 
              href="#projects" 
              className={activeSection === 'projects' ? 'active-link' : ''} 
              onClick={(e) => handleLinkClick(e, 'projects')}
            >
              [ PROJECTS ]
            </a>
          </li>
          <li>
            <a 
              href="#skills" 
              className={activeSection === 'skills' ? 'active-link' : ''} 
              onClick={(e) => handleLinkClick(e, 'skills')}
            >
              [ SKILLS ]
            </a>
          </li>
          <li>
            <a 
              href="#experience" 
              className={activeSection === 'experience' ? 'active-link' : ''} 
              onClick={(e) => handleLinkClick(e, 'experience')}
            >
              [ LOG ]
            </a>
          </li>
          <li>
            <a 
              href="#contact" 
              className={activeSection === 'contact' ? 'active-link' : ''} 
              onClick={(e) => handleLinkClick(e, 'contact')}
            >
              [ CONTACT ]
            </a>
          </li>
        </ul>
      </motion.nav>

      <TerminalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;