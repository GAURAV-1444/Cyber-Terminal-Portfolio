import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectsData } from '../data/portfolioData';
import { FaGithub, FaExternalLinkAlt, FaChevronRight, FaKeyboard } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const [selectedRepo, setSelectedRepo] = useState(projectsData[0] || null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Single event listener driven by Navbar
  useEffect(() => {
    const handleNextSlide = (e) => {
      if (e.detail?.sectionId === 'projects') {
        setSelectedIndex((prev) => {
          const next = Math.min(prev + 1, projectsData.length - 1);
          setSelectedRepo(projectsData[next]);
          return next;
        });
      }
    };

    const handlePrevSlide = (e) => {
      if (e.detail?.sectionId === 'projects') {
        setSelectedIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          setSelectedRepo(projectsData[next]);
          return next;
        });
      }
    };

    window.addEventListener('nav-next-slide', handleNextSlide);
    window.addEventListener('nav-prev-slide', handlePrevSlide);

    return () => {
      window.removeEventListener('nav-next-slide', handleNextSlide);
      window.removeEventListener('nav-prev-slide', handlePrevSlide);
    };
  }, []);

  // Determine active project: hover overrides clicked/keyboard selection
  const activeRepo = hoveredIndex !== null ? projectsData[hoveredIndex] : selectedRepo;

  return (
    <section 
      className="terminal-container" 
      id="projects"
      data-interactive-section="true"
      data-current-index={selectedIndex}
      data-max-index={Math.max(0, projectsData.length - 1)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="projects-header-flex">
          <div>
            <p className="prompt" style={{ margin: 0 }}>cd /var/www/repositories && ls -la</p>
            <h2 className="projects-title">
              Repository Inspector
            </h2>
          </div>

          <div className="projects-controls">
            <span className="projects-keyboard-hint">
              <FaKeyboard style={{ color: 'var(--green-main)' }} /> [↑/↓ to Navigate]
            </span>
            <button 
              onClick={() => setViewMode('table')}
              className={`terminal-tab-btn projects-tab-btn ${viewMode === 'table' ? 'active' : ''}`}
            >
              [ CLI_TABLE ]
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`terminal-tab-btn projects-tab-btn ${viewMode === 'grid' ? 'active' : ''}`}
            >
              [ MATRIX_GRID ]
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="terminal-block projects-terminal-block">
            <div className="projects-buffer-bar">
              <span>ACTIVE_BUFFER: <strong style={{ color: 'var(--green-main)' }}>REPOSITORIES_VIEW</strong></span>
              <span style={{ color: 'var(--green-main)', fontFamily: 'monospace' }}>MODE: TABLE_VIEW</span>
            </div>

            <div className="projects-table-header">
              <span>PERMISSIONS</span>
              <span>PROJECT_NAME</span>
              <span>STACK</span>
              <span>STATUS</span>
            </div>

            <div 
              className="projects-table-rows"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {projectsData.map((project, idx) => {
                const isSelected = activeRepo?.id === project.id;
                return (
                  <div 
                    key={project.id}
                    onClick={() => {
                      setSelectedRepo(project);
                      setSelectedIndex(idx);
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className={`projects-row-item ${isSelected ? 'selected' : 'unselected'}`}
                  >
                    <span className="projects-row-perms">drwxr-xr-x</span>
                    <span className="projects-row-name" style={{ color: isSelected ? 'var(--green-main)' : 'var(--text-main)' }}>
                      <FaChevronRight style={{ fontSize: '0.7rem', opacity: isSelected ? 1 : 0.3, transform: isSelected ? 'translateX(2px)' : 'none' }} /> {project.repoName}
                    </span>
                    <span className="projects-row-stack">{project.tech?.[0] || 'Java'}</span>
                    
                    <span className="projects-row-status">
                      <span className="projects-status-dot"></span> 
                      <span>STABLE</span>
                    </span>
                  </div>
                );
              })}
            </div>

            {activeRepo && (
              <motion.div 
                key={activeRepo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="projects-readme-box"
              >
                <div className="projects-readme-header">
                  <span className="projects-readme-cmd">
                    {">"} executing: cat ./&lt;{activeRepo.repoName}&gt;/README.md
                  </span>
                  <div className="projects-action-links">
                    {activeRepo.github && (
                      <a href={activeRepo.github} target="_blank" rel="noreferrer" className="glow-text btn-terminal projects-action-btn" style={{ color: 'var(--text-main)' }}>
                        <FaGithub /> [ Source Code ]
                      </a>
                    )}
                    {activeRepo.live && activeRepo.live !== "#" && (
                      <a href={activeRepo.live} target="_blank" rel="noreferrer" className="btn-terminal projects-action-btn" style={{ color: 'var(--green-main)' }}>
                        <FaExternalLinkAlt /> [ Live Demo ]
                      </a>
                    )}
                  </div>
                </div>

                <p className="projects-readme-desc">
                  {activeRepo.description}
                </p>

                <div className="projects-deps-row">
                  <span className="projects-dep-label">DEPENDENCIES:</span>
                  {activeRepo.tech.map((t, idx) => (
                    <span key={idx} className="projects-dep-badge">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        ) : (
          <div className="card-grid">
            {projectsData.map((project, index) => (
              <motion.div 
                key={project.id}
                className="terminal-block projects-grid-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.02, borderColor: 'var(--green-main)' }}
              >
                <div>
                  <h3 className="glow-text projects-grid-title">
                    {project.repoName}
                  </h3>
                  <p className="projects-grid-desc">
                    {project.description}
                  </p>
                </div>
                
                <div>
                  <div className="projects-grid-tech-wrap">
                    {project.tech.map((t, i) => (
                      <span key={i} className="projects-grid-tech-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="btn-terminal projects-grid-btn">
                        [ GITHUB ]
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </motion.div>
    </section>
  );
};

export default Projects;