import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '../data/portfolioData';
import { FaJava, FaReact, FaGitAlt, FaCode, FaMicrochip, FaSearch } from 'react-icons/fa';
import { SiSpringboot, SiMysql, SiMongodb } from 'react-icons/si';
import { IoLogoJavascript } from 'react-icons/io5';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [animatedLevels, setAnimatedLevels] = useState({});

  const getSkillIcon = (skillName) => {
    const name = skillName.toLowerCase();
    if (name.includes('java') && !name.includes('script') && !name.includes('js')) {
      return <FaJava className="skill-icon-java" />;
    }
    if (name.includes('spring')) return <SiSpringboot className="skill-icon-spring" />;
    if (name.includes('react')) return <FaReact className="skill-icon-react" />;
    if (name.includes('sql') || name.includes('mysql')) return <SiMysql className="skill-icon-mysql" />;
    if (name.includes('mongo')) return <SiMongodb className="skill-icon-mongo" />;
    if (name.includes('git')) return <FaGitAlt className="skill-icon-git" />;
    if (name.includes('javascript') || name.includes('js')) {
      return <IoLogoJavascript className="skill-icon-js" />;
    }
    return <FaCode className="skill-icon-default" />;
  };

  const skillDetails = {
    "Java": "Core language for enterprise-grade backend systems, featuring robust object-oriented programming (OOP) design patterns, multithreading capabilities, and JVM performance optimization for high-throughput applications.",
    "Spring Boot": "Microservices architecture development, enterprise RESTful API creation, dependency injection lifecycle management, and secure production-ready configurations with Spring Security.",
    "Microservices": "Distributed systems design, service discovery, fault tolerance, API gateway routing, and resilient inter-service communication protocols.",
    "React.js": "Modern interactive user interface development, custom hooks, efficient state management architecture, and virtual DOM rendering performance optimization.",
    "JavaScript": "Asynchronous event-driven programming, ES6+ advanced features, event loop execution model, and seamless full-stack client-server integration.",
    "HTML / CSS": "Semantic markup architecture, mobile-first responsive layouts, flexible box models, CSS grid systems, and scalable dark-theme design variables.",
    "MySQL": "Relational database schema engineering, complex indexing strategies, ACID transaction compliance, and high-performance query optimization.",
    "SQL": "Advanced data retrieval techniques, multi-table joins, analytical aggregations, views, and procedural query execution.",
    "MongoDB": "NoSQL document storage design, flexible JSON-like schemas, aggregation pipeline processing, and high-throughput data operations.",
    "Git / GitHub": "Version control workflows, trunk-based branching strategies, collaborative peer code reviews, conflict resolution, and automated CI/CD deployment pipelines.",
    "Maven": "Dependency lifecycle management, build automation lifecycles, project object model (POM) configuration, and multi-module project structuring.",
    "Postman": "Comprehensive API testing protocols, automated endpoint validation suites, environment variable collections, and detailed payload debugging."
  };

  const getFilteredSkills = () => {
    let list = [];
    if (activeCategory === 'backend') list = skillsData.backend || [];
    else if (activeCategory === 'frontend') list = skillsData.frontend || [];
    else if (activeCategory === 'database') list = skillsData.database || [];
    else if (activeCategory === 'tools') list = skillsData.tools || [];
    else list = [...(skillsData.backend || []), ...(skillsData.frontend || []), ...(skillsData.database || []), ...(skillsData.tools || [])];

    if (searchQuery.trim() === '') return list;
    return list.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const currentSkills = getFilteredSkills();
  const activeSkill = currentSkills[selectedIndex] || currentSkills[0] || { name: 'Java', level: 90 };

  useEffect(() => {
    const timers = [];
    const allSkills = [
      ...(skillsData.backend || []), 
      ...(skillsData.frontend || []), 
      ...(skillsData.database || []), 
      ...(skillsData.tools || [])
    ];
    
    allSkills.forEach((skill) => {
      let current = 0;
      const target = skill.level;
      const incrementTime = 20; 

      const timer = setInterval(() => {
        current += 2;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedLevels((prev) => ({
          ...prev,
          [skill.name]: current,
        }));
      }, incrementTime);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, []);

  // Single event listener driven by Navbar
  useEffect(() => {
    const handleNextSlide = (e) => {
      if (e.detail?.sectionId === 'skills') {
        setSelectedIndex((prev) => Math.min(prev + 1, currentSkills.length - 1));
      }
    };

    const handlePrevSlide = (e) => {
      if (e.detail?.sectionId === 'skills') {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('nav-next-slide', handleNextSlide);
    window.addEventListener('nav-prev-slide', handlePrevSlide);

    return () => {
      window.removeEventListener('nav-next-slide', handleNextSlide);
      window.removeEventListener('nav-prev-slide', handlePrevSlide);
    };
  }, [currentSkills.length]);

  return (
    <section 
      className="terminal-container" 
      id="skills"
      data-interactive-section="true"
      data-current-index={selectedIndex}
      data-max-index={Math.max(0, currentSkills.length - 1)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header-flex">
          <div>
            <p className="prompt skills-section-prompt">matrix_grid --load-telemetry</p>
            <h2 className="skills-section-heading">
              Technical Competency Matrix
            </h2>
          </div>

          <div 
            className="skills-search-box" 
            onClick={() => document.getElementById('skills-search-input-field')?.focus()}
          >
            <FaSearch className="skills-search-icon" />
            <input 
              id="skills-search-input-field"
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSelectedIndex(0); }}
              placeholder="filter skill nodes..."
              className="skills-search-input"
            />
          </div>
        </div>

        <div className="terminal-block skills-terminal-block">
          
          <div className="skills-filter-bar">
            <div className="skills-filter-btns-group">
              <button onClick={() => { setActiveCategory('all'); setSelectedIndex(0); }} className={`terminal-tab-btn skills-filter-tab ${activeCategory === 'all' ? 'active' : ''}`}>[ All Grid ]</button>
              <button onClick={() => { setActiveCategory('backend'); setSelectedIndex(0); }} className={`terminal-tab-btn skills-filter-tab ${activeCategory === 'backend' ? 'active' : ''}`}>[ Backend ]</button>
              <button onClick={() => { setActiveCategory('frontend'); setSelectedIndex(0); }} className={`terminal-tab-btn skills-filter-tab ${activeCategory === 'frontend' ? 'active' : ''}`}>[ Frontend ]</button>
              <button onClick={() => { setActiveCategory('database'); setSelectedIndex(0); }} className={`terminal-tab-btn skills-filter-tab ${activeCategory === 'database' ? 'active' : ''}`}>[ Database ]</button>
              <button onClick={() => { setActiveCategory('tools'); setSelectedIndex(0); }} className={`terminal-tab-btn skills-filter-tab ${activeCategory === 'tools' ? 'active' : ''}`}>[ Tools ]</button>
            </div>
            <span className="skills-nav-instruction">USE [↑] / [↓] OR ARROWS</span>
          </div>

          <div className="skills-grid">
            {currentSkills.map((skill, index) => {
              const currentLevel = animatedLevels[skill.name] || 0;
              const isSelected = selectedIndex === index;

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedIndex(index)}
                  className={`skill-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="skills-card-top-flex">
                    <span className="skills-card-icon-wrap">{getSkillIcon(skill.name)}</span>
                    <span className="glow-text skills-card-percent">{currentLevel}%</span>
                  </div>

                  <div>
                    <h4 className="skills-card-name">{skill.name}</h4>
                    <div className="skills-progress-track">
                      <div className="skills-progress-fill" style={{ width: `${currentLevel}%` }}></div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="skills-details-box">
            <div className="skills-details-header">
              <span className="skills-details-title">
                <FaMicrochip /> NODE_INSPECTOR // {activeSkill.name.toUpperCase()}
              </span>
              <span className="skills-details-mastery">MASTERY: <strong className="skills-mastery-highlight">{animatedLevels[activeSkill.name] || 0}%</strong></span>
            </div>
            
            <p className="skills-details-desc">
              {">"} {skillDetails[activeSkill.name] || "Specialized engineering competency configured for production environments."}
            </p>
          </div>

          <div className="terminal-footer-info">
            <div className="skills-footer-indicator-group">
              <span className="about-footer-dot"></span>
              <span className="skills-footer-instruction-text">Use Arrow Keys [↑] [↓] [←] [→] to navigate nodes.</span>
            </div>
            <span className="skills-footer-protocol-text">GRID_PROTOCOL: SECURE</span>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default Skills;