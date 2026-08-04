import React from 'react';
import { motion } from 'framer-motion';
import { aboutData } from '../data/portfolioData';
import './About.css';

const About = () => {
  return (
    <section className="terminal-container" id="about">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="about-header-flex">
          <div>
            <p className="prompt about-prompt-title">system --overview</p>
            <h2 className="about-main-heading">
              System Architecture & Profile
            </h2>
          </div>
        </div>

        <div className="terminal-block about-terminal-border">
          <div className="projects-readme-header">
            <span className="projects-readme-cmd">$ summary --verbose</span>
            <span className="projects-status-dot"></span>
          </div>
          
          <p className="projects-readme-desc about-desc-spacing">
            {aboutData?.bio || "Passionate Software Engineer specializing in building robust, scalable backend architectures with Java and Spring Boot, complemented by responsive modern interfaces using React.js."}
          </p>

          <div className="about-structured-details">
            <div><strong className="about-shell-highlight">&gt; Education:</strong> B.E./B.Tech in Computer Science Engineering</div>
            <div><strong className="about-shell-highlight">&gt; Specialization:</strong> Backend Architecture & Responsive Frontend UI</div>
            <div><strong className="about-shell-highlight">&gt; Architecture Pattern:</strong> Layered Architecture, DTO Pattern, REST APIs</div>
            <div><strong className="about-shell-highlight">&gt; Problem Solving:</strong> Clean Code Practices, Modular Design & Scalability</div>
          </div>

          <div className="about-competencies-wrapper">
            <h4 className="about-competencies-title">// CORE COMPETENCIES & EXPERTISE:</h4>
            <div className="projects-deps-row">
              <span className="projects-dep-badge">Java 17</span>
              <span className="projects-dep-badge">Spring Boot</span>
              <span className="projects-dep-badge">Spring Data JPA</span>
              <span className="projects-dep-badge">RESTful APIs</span>
              <span className="projects-dep-badge">React.js</span>
              <span className="projects-dep-badge">MySQL & Hibernate</span>
              <span className="projects-dep-badge">Layered Architecture</span>
              <span className="projects-dep-badge">Git & GitHub</span>
              <span className="projects-dep-badge">Maven Build Tool</span>
            </div>
          </div>

          <div className="about-footer-bar about-footer-margin">
            <div className="about-footer-indicator">
              <span className="about-footer-dot"></span>
              <span className="about-footer-status-text">STATUS: READY_FOR_HIRE</span>
            </div>
            <span className="about-tty-text">READ_ONLY: TRUE</span>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default About;