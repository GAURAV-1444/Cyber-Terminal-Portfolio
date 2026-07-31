
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aboutData } from '../data/portfolioData';


const ASCII_ART = {
  PROFILE: (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', lineHeight: '1.3', fontSize: '0.75rem', color: 'var(--green-main)', margin: '0.5rem 0' }}>
      {`
  [ PROFESSIONAL PROFILE ]
  --------------------------------------------------
  > Role: Java Full Stack Developer / Software Engineer
  > Education: B.E./B.Tech in Computer Science
  > Specialization: Backend Architecture & Frontend UI
  > Core Skills: Java, Spring Boot, Database Management, React.js
      `}
    </div>
  ),
  STACK: (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', lineHeight: '1', fontSize: '0.7rem', color: 'var(--green-main)', margin: '0.5rem 0' }}>
      {`
  ███████████████████████████████████████████████████████████████
  █                                                             █
  █   [ BACKEND ]    :: Java // Spring Boot // Maven             █
  █   [ FRONTEND ]   :: React.js // JavaScript // HTML/CSS       █
  █   [ DATABASE ]   :: MySQL // SQL // MongoDB                  █ 
  █   [ DEVOPS/VCS ] :: Git // GitHub                            █
  █                                                             █
  ███████████████████████████████████████████████████████████████
      `}
    </div>
  ),
  ROLES: (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', lineHeight: '1.3', fontSize: '0.75rem', color: 'var(--green-main)', margin: '0.5rem 0' }}>
      {`
  [ TARGETED ENGINEERING ROLES ]
  --------------------------------------------------
  > 01. Software Developer / Software Engineer
      - Scalable software solutions, clean architecture, and optimization.
  > 02. Full-Stack Software Engineer
      - End-to-end web architecture & API integration.
  > 03. Java & Spring Boot Backend Engineer
      - High-performance microservices, SQL, & security.
  > 04. React.js Frontend Developer
      - Responsive UI components, state management.
      `}
    </div>
  ),
  STATUS: (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', lineHeight: '1.2', fontSize: '0.8rem', color: 'var(--green-main)', margin: '0.5rem 0' }}>
      {`
  .-----------------------------------------.
  |  STATUS: [ ███████████████████ ] 100%   |
  |-----------------------------------------|
  | > Availability: Open for opportunities  |
  | > Role: Software Developer / Engineer   |
  | > Location: ${aboutData?.location || 'Remote/Global'}    |
  '-----------------------------------------'
      `}
    </div>
  )
};

const About = () => {
  const [inputCommand, setInputCommand] = useState('');
  const [outputHistory, setOutputHistory] = useState([
    { type: 'system', text: 'Initializing GauravOS kernel shell v4.2...' },
    { type: 'system', text: 'Type "help" or click preset command chips below to inspect profile files.' },
    { type: 'output', text: aboutData?.bio || "Passionate Software Engineer specializing in building robust, scalable backend architectures with Java and Spring Boot, complemented by responsive modern interfaces using React.js." }
  ]);

  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const terminalScreenRef = useRef(null);
  const inputRef = useRef(null);

  
  useEffect(() => {
    if (terminalScreenRef.current) {
      terminalScreenRef.current.scrollTop = terminalScreenRef.current.scrollHeight;
    }
  }, [outputHistory]);

  const executeCommand = (cmdStr) => {
    const cmd = cmdStr.trim().toLowerCase();
    let response = null;

    if (cmd === 'help') {
      response = "Available commands:\n\n- cat bio.txt     :: View executive summary\n- cat profile.txt :: View engineering profile\n- cat stack.txt   :: View technical stack matrix\n- cat roles.txt   :: View target engineering roles\n- cat status.txt  :: View availability status\n- clear           :: Clear terminal buffer";
    } else if (cmd === 'cat bio.txt' || cmd === 'bio') {
      response = aboutData?.bio || "Passionate Software Engineer specializing in building robust, scalable backend architectures with Java and Spring Boot, complemented by responsive modern interfaces using React.js.";
    } else if (cmd === 'cat profile.txt' || cmd === 'profile') {
      response = ASCII_ART.PROFILE;
    } else if (cmd === 'cat stack.txt' || cmd === 'stack') {
      response = ASCII_ART.STACK;
    } else if (cmd === 'cat roles.txt' || cmd === 'roles') {
      response = ASCII_ART.ROLES;
    } else if (cmd === 'cat status.txt' || cmd === 'status') {
      response = ASCII_ART.STATUS;
    } else if (cmd === 'clear') {
      setOutputHistory([]);
      setInputCommand('');
      setHistoryIndex(-1);
      return;
    } else if (cmd === '') {
      return;
    } else {
      response = `zsh: command not found: ${cmdStr}. Type 'help' for valid commands.`;
    }

    setOutputHistory(prev => [
      ...prev,
      { type: 'command', text: `gaurav@portfolio-core:~$ ${cmdStr}` },
      { type: 'output', text: response }
    ]);

    if (cmd !== 'clear' && cmd !== '') {
      setCommandHistory(prev => [cmdStr, ...prev]);
    }
    setHistoryIndex(-1);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeCommand(inputCommand);
    setInputCommand('');
  };

  
  const handleKeyDown = (e) => {
    if (commandHistory.length === 0) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(nextIndex);
      setInputCommand(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(nextIndex);
      if (nextIndex === -1) {
        setInputCommand('');
      } else {
        setInputCommand(commandHistory[nextIndex]);
      }
    }
  };

  const handleChipClick = (cmd) => {
    executeCommand(cmd);
    setInputCommand('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

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
            <p className="prompt" style={{ margin: 0 }}>zsh --interactive-shell</p>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.6rem', marginTop: '0.3rem' }}>
              System Architecture & Profile
            </h2>
          </div>

          
          <div className="about-chips-container">
            <button
              onClick={() => handleChipClick('cat bio.txt')}
              className="terminal-tab-btn about-chip-btn"
            >
              [ bio.txt ]
            </button>
            <button
              onClick={() => handleChipClick('cat profile.txt')}
              className="terminal-tab-btn about-chip-btn"
            >
              [ profile.txt ]
            </button>
            <button
              onClick={() => handleChipClick('cat stack.txt')}
              className="terminal-tab-btn about-chip-btn"
            >
              [ stack.txt ]
            </button>
            <button
              onClick={() => handleChipClick('cat roles.txt')}
              className="terminal-tab-btn about-chip-btn"
            >
              [ roles.txt ]
            </button>
            <button
              onClick={() => handleChipClick('cat status.txt')}
              className="terminal-tab-btn about-chip-btn"
            >
              [ status.txt ]
            </button>
          </div>
        </div>

       
        <div className="terminal-block" style={{ borderLeft: '2px solid var(--green-main)' }}>

          {/* Top Window Status Bar */}
          <div className="about-status-bar">
            <span>SHELL: <strong style={{ color: 'var(--green-main)' }}>ZSH (interactive)</strong></span>
            <span style={{ color: 'var(--green-main)', fontFamily: 'monospace' }}>TTY: /dev/ttys001</span>
          </div>

          
          <div
            ref={terminalScreenRef}
            className="about-terminal-screen"
          >
            {outputHistory.map((item, index) => (
              <div key={index} className="about-output-line">
                {item.type === 'system' && <span className="about-output-system"># {item.text}</span>}
                {item.type === 'command' && <span className="about-output-command">{item.text}</span>}
                {item.type === 'output' && <span className="about-output-response">{">"} {item.text}</span>}
              </div>
            ))}
          </div>

         
          <form onSubmit={handleFormSubmit} className="about-input-form">
            <span className="about-input-prompt">gaurav@core:~$</span>
            <input
              type="text"
              ref={inputRef}
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type 'help' or execute a command..."
              className="about-command-input"
            />
          </form>

          
          <div className="about-footer-bar">
            <div className="about-footer-indicator">
              <span className="about-footer-dot"></span>
              <span style={{ color: 'var(--green-main)' }}>All systems nominal. Ready for hire.</span>
            </div>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>INTERACTIVE_SHELL: READY</span>
          </div>

        </div>
      </motion.div>
    </section>
  );
};

export default About;