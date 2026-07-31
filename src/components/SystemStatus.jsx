import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aboutData } from '../data/portfolioData';

const SystemStatus = () => {
  const [uptime, setUptime] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(14);

 
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime((prev) => prev + 1);
      
      setCpuLoad(Math.floor(Math.random() * (28 - 12 + 1)) + 12);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="terminal-container sys-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="prompt">./sys_diagnostics.sh --live</p>

        <div className="terminal-block">
          
          
          <div className="sys-header-bar">
            <span>NODE_ENV: <strong style={{ color: 'var(--green-main)' }}>PRODUCTION</strong></span>
            <span>CPU_LOAD: <strong style={{ color: 'var(--green-main)' }}>{cpuLoad}%</strong></span>
            <span>UPTIME: <strong style={{ color: 'var(--text-main)' }}>{uptime}s</strong></span>
            <span style={{ color: 'var(--green-main)' }}>● SYSTEM SECURE</span>
          </div>

         
          <div className="card-grid" style={{ marginTop: '0', gap: '1rem' }}>
            
           
            <div className="sys-card">
              <span className="sys-card-label">CURRENT FOCUS</span>
              <p className="sys-card-value">
                Java, Spring Boot, SQL, REST API & React.js
              </p>
            </div>

            {/* Status Card 2 */}
            <div className="sys-card">
              <span className="sys-card-label">AVAILABILITY</span>
              <p className="sys-card-value">
                Open for Full-Time Roles 🟢 <br />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                  Ready for Java / Full-Stack Positions
                </span>
              </p>
            </div>

            {/* Status Card 3 */}
            <div className="sys-card">
              <span className="sys-card-label">LOCATION / BASE</span>
              <p className="sys-card-value">
                {aboutData.location || 'India'}
              </p>
            </div>

          </div>

          {/* Bottom Call to Action strip */}
          <div className="sys-footer-strip">
            <span className="sys-footer-text">
              {">"} Ready to deploy scalable backend architectures.
            </span>
            <a href="#contact" className="btn-terminal sys-cta-btn">
              [ INITIALIZE_CONTACT ]
            </a>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default SystemStatus;