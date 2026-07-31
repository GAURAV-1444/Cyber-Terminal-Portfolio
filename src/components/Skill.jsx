import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '../data/portfolioData';
import { FaJava, FaReact, FaGitAlt, FaCode, FaMicrochip, FaSearch } from 'react-icons/fa';
import { SiSpringboot, SiMysql, SiJavascript, SiMongodb } from 'react-icons/si';

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [animatedLevels, setAnimatedLevels] = useState({});

  const getSkillIcon = (skillName) => {
    const name = skillName.toLowerCase();
    if (name.includes('java')) return <FaJava style={{ color: '#f89820' }} />;
    if (name.includes('spring')) return <SiSpringboot style={{ color: '#6db33f' }} />;
    if (name.includes('react')) return <FaReact style={{ color: '#61dafb' }} />;
    if (name.includes('sql') || name.includes('mysql')) return <SiMysql style={{ color: '#00758f' }} />;
    if (name.includes('mongo')) return <SiMongodb style={{ color: '#47a248' }} />;
    if (name.includes('git')) return <FaGitAlt style={{ color: '#f05032' }} />;
    if (name.includes('javascript') || name.includes('js')) return <SiJavascript style={{ color: '#f7df1e' }} />;
    return <FaCode style={{ color: 'var(--green-main)' }} />;
  };

  const skillDetails = {
    "Java": "Core language for scalable backend systems, robust OOP design patterns, and JVM performance optimization.",
    "Spring Boot": "Microservices architecture, RESTful API development, dependency injection, and enterprise security configurations.",
    "Microservices": "Distributed systems design, service discovery, fault tolerance, and inter-service communication.",
    "React.js": "Interactive modern UI development, component state management, hooks, and virtual DOM performance.",
    "JavaScript": "Asynchronous programming, ES6+ features, event loops, and full-stack integration.",
    "HTML / CSS": "Semantic markup, responsive layouts, flexbox, CSS grid, and custom dark-theme variables.",
    "MySQL": "Relational database design, complex indexing, ACID compliance, and query performance tuning.",
    "SQL": "Advanced data retrieval, joins, aggregations, and stored procedures.",
    "MongoDB": "NoSQL document storage, flexible schemas, aggregation pipelines, and high-throughput data operations.",
    "Git / GitHub": "Version control workflows, branching strategies, collaborative code reviews, and CI/CD pipelines.",
    "Maven": "Dependency management, build automation lifecycle, and multi-module project configuration.",
    "Postman": "API testing, automated endpoint validation, environment variables collection, and payload debugging."
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

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % currentSkills.length);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + currentSkills.length) % currentSkills.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSkills.length]);

  return (
    <section className="terminal-container" id="skills">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="terminal-header-flex">
          <div>
            <p className="prompt" style={{ margin: 0 }}>matrix_grid --load-telemetry</p>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.6rem', marginTop: '0.3rem' }}>
              Technical Competency Matrix
            </h2>
          </div>

          <div className="skills-search-box">
            <FaSearch style={{ color: 'var(--green-main)', fontSize: '0.8rem' }} />
            <input 
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
            <span style={{ color: 'var(--green-main)', fontFamily: 'monospace', fontSize: '0.8rem' }}>USE [↑] / [↓] OR ARROWS</span>
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
              <span className="skills-details-mastery">MASTERY: <strong style={{ color: 'var(--green-main)' }}>{animatedLevels[activeSkill.name] || 0}%</strong></span>
            </div>
            
            <p className="skills-details-desc">
              {">"} {skillDetails[activeSkill.name] || "Specialized engineering competency."}
            </p>
          </div>

          <div className="terminal-footer-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="about-footer-dot"></span>
              <span style={{ color: 'var(--green-main)' }}>Use Arrow Keys [↑] [↓] [←] [→] to navigate nodes.</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>GRID_PROTOCOL: SECURE</span>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default Skills;