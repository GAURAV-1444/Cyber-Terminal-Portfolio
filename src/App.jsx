import React, { useEffect } from 'react';
import Home from './components/Home';
import SystemStatus from './components/SystemStatus';
import './index.css';
import Projects from './components/Projects';
import About from './components/About';
import Navbar from './components/Navbar';
import Skills from './components/Skill';
import Contact from './components/Contact';
import Experience from './components/Experience';
import Footer from './components/Footer';
import MatrixBackground from './components/MatrixBackground';
import AIChatModal from './components/AIChatModal';
import { sfx } from './utils/sfx';

function App() {

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'matrix';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);


  useEffect(() => {
    const handleGlobalClick = (e) => {
      
      const target = e.target.closest(
        'button, a, .btn-terminal, .terminal-tab-btn, .skill-tag, .tech-tag, .nav-brand-chip'
      );

      if (target) {
        
        if (target.classList.contains('nav-sfx-toggle-btn')) {
          return;
        }

        
        if (
          target.classList.contains('btn-terminal') ||
          target.classList.contains('nav-brand-chip')
        ) {
          sfx.playExecuteSound?.();
        } else {
          
          sfx.playKeyClick?.();
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className="app">
      <MatrixBackground />
      <Navbar />
      <Home />
      <SystemStatus />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
      <Footer />
      <AIChatModal />
    </div>
  );
}

export default App;