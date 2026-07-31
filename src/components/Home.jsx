import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { motion } from 'framer-motion';
import { aboutData } from '../data/portfolioData';

const Home = () => {
  const typedRef = useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Software Engineer",
        "Java Developer",
        "Back End Developer",
        "Spring Boot Developer",
        "Full Stack Web Engineer",
        "React.js Frontend Developer"
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true,
      showCursor: false,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <section className="terminal-container" id="home">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="glow-text">System.initialize({aboutData.user}) --status=ready</p>
        <br />

        <p className="prompt">whoami</p>
        <h1 className="home-title">
          Gaurav<span className="name-break">_</span>Kshirsagar
        </h1>

        <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
          <span className="prompt">role --target </span>
          <span ref={typedRef} className="glow-text"></span>
          <span className="custom-cursor"></span>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{ marginTop: '2.5rem' }}
        >
          <a
            href="/Gaurav_Kshirsagar_Resume.pdf"
            download="Gaurav_Kshirsagar_Resume.pdf"
            className="btn-terminal glow-text"
          >
            [ DOWNLOAD_RESUME ]
          </a>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Home;