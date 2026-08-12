import React, { useState, useEffect, useRef } from 'react';
import { FaTerminal, FaClock, FaPowerOff, FaCheckCircle, FaRedo, FaHeart } from 'react-icons/fa';
import './Footer.css';

const FOOTER_COMMANDS = [
  'help', 'about', 'cd about', 'projects', 'cd projects',
  'skills', 'cd skills', 'experience', 'cd experience', 'contact', 'cd contact',
  'home', 'cd home', 'top', 'cd ~', 'clear', 'exit', 'ai', 'chat', 'ask', 'bot'
];

const Footer = () => {
  const [cmdInput, setCmdInput] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isTerminated, setIsTerminated] = useState(false);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [cmdCount, setCmdCount] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    let timer;
    if (!isTerminated) {
      timer = setInterval(() => {
        setSecondsSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTerminated]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
    }
    return `${pad(mins)}m ${pad(secs)}s`;
  };

  const showTemporaryFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg('');
    }, 4500);
  };

  // Helper function to dispatch nav locks and scroll smoothly
  const navigateToSection = (sectionId) => {
    // Notify Navbar to lock scroll spy observer during long transitions
    window.dispatchEvent(
      new CustomEvent('nav-change-section', { detail: { sectionId } })
    );

    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const offsetPosition = elementRect - bodyRect - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    setCmdCount((prev) => prev + 1);

    const cleanCmd = cmd.replace(/^cd\s+/, '');

    // AI Assistant Command
    if (['ai', 'chat', 'ask', 'bot'].includes(cmd)) {
      window.dispatchEvent(new CustomEvent('toggle-ai-chat', { detail: { open: true } }));
      showTemporaryFeedback('SYS_AI // Launching Interactive Gemini Assistant...');
    }
    // Root / Home Commands
    else if (['~', 'root', 'top', 'home'].includes(cleanCmd) || ['cd ~', 'cd root', 'top', 'cd home', 'home'].includes(cmd)) {
      navigateToSection('home');
      showTemporaryFeedback('Navigated to: ~ (Root/Home)');
    } 
    // About Commands
    else if (['about', 'bio'].includes(cleanCmd)) {
      navigateToSection('about');
      showTemporaryFeedback('Navigated to: #about');
    } 
    // Skills Commands
    else if (['skills', 'skill', 'stack'].includes(cleanCmd)) {
      navigateToSection('skills');
      showTemporaryFeedback('Navigated to: #skills');
    } 
    // Projects Commands
    else if (['projects', 'project', 'repo', 'repositories'].includes(cleanCmd)) {
      navigateToSection('projects');
      showTemporaryFeedback('Navigated to: #projects');
    } 
    // Experience / Log Commands
    else if (['experience', 'experiences', 'log', 'logs'].includes(cleanCmd)) {
      navigateToSection('experience');
      showTemporaryFeedback('Navigated to: #experience');
    } 
    // Contact Commands
    else if (['contact', 'contacts'].includes(cleanCmd)) {
      navigateToSection('contact');
      showTemporaryFeedback('Navigated to: #contact');
    } 
    // Exit / Quit
    else if (['exit', 'quit'].includes(cmd)) {
      setFeedbackMsg('Terminating session...');
      setTimeout(() => {
        setIsTerminated(true);
        setFeedbackMsg('');
      }, 600);
    } 
    // Help & Utilities
    else if (cmd === 'help') {
      showTemporaryFeedback('AVAILABLE COMMANDS: ai | cd [about | skills | projects | experience | contact | ~] | top | clear | exit');
    } else if (cmd === 'clear') {
      setFeedbackMsg('');
    } else {
      showTemporaryFeedback(`zsh: command not found: '${cmd}'. Type 'help' for available system commands.`);
    }

    setCmdInput('');
  };

  const handleRestart = () => {
    setSecondsSpent(0);
    setCmdCount(0);
    setIsTerminated(false);
    navigateToSection('home');
    showTemporaryFeedback('System kernel restarted successfully. Uptime reset.');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(cmdInput);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = FOOTER_COMMANDS.find(c => c.startsWith(cmdInput.trim().toLowerCase()));
      if (match) {
        setCmdInput(match);
      }
    }
  };

  return (
    <>
      {isTerminated && (
        <div className="system-shutdown-overlay">
          <div className="shutdown-content-box">
            <FaPowerOff className="shutdown-power-icon" />
            <h2 className="shutdown-heading">SESSION TERMINATED</h2>
            <p className="shutdown-message">
              Thank you for exploring my portfolio! I hope you found everything you were looking for. Have a great day ahead!
            </p>
            <p className="shutdown-subtext">
              Total Session Duration: <strong>{formatTime(secondsSpent)}</strong> | Commands Executed: <strong>{cmdCount}</strong>
            </p>
            <button 
              onClick={handleRestart} 
              className="shutdown-reboot-btn"
            >
              <FaRedo className="shutdown-btn-icon" /> [ RESTART SYSTEM SESSION ]
            </button>
            <div className="shutdown-visit-again-tag">
              <FaHeart className="visit-heart-icon" /> Please Visit Again Soon!
            </div>
          </div>
        </div>
      )}

      <footer className="footer-container">
        <div className="footer-panel-card">
          
          <div className="footer-panel-body">
            
            <div className="footer-greeting-box">
              <span className="footer-greeting-prefix">&gt; CONSOLE_STATUS:</span> 
              <span className="footer-greeting-text">End of page transmission // Enter CLI commands or navigate directly.</span>
            </div>

            <div className="footer-control-row">
              <div 
                className="footer-cli-box"
                onClick={() => inputRef.current?.focus()}
              >
                <span className="footer-cli-prompt">visitor@gaurav-dev:~$</span>
                <input 
                  ref={inputRef}
                  type="text" 
                  value={cmdInput}
                  onChange={(e) => setCmdInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type 'ai', 'help', 'cd project', 'cd ~', or press 'Tab'..."
                  className="footer-cli-input"
                />
                <button 
                  onClick={() => executeCommand(cmdInput)} 
                  className="footer-enter-btn"
                  title="Execute Command"
                >
                  EXEC [ ↵ ]
                </button>
              </div>

              <button 
                onClick={() => executeCommand('cd ~')} 
                className="footer-standalone-cd-btn"
                title="Return to Root (~)"
              >
                <span>cd ~</span>
                <span className="footer-cd-arrow">▲</span>
              </button>
            </div>

            {feedbackMsg && (
              <div className="footer-feedback-line">
                <span className="footer-feedback-arrow">&gt;&gt;</span> {feedbackMsg}
              </div>
            )}

            <div className="footer-telemetry-bar">
              <div className="footer-status-node">
                <span className="footer-blink-dot"></span>
                <FaCheckCircle className="footer-node-icon" />
                <span>SYSTEM_STATUS: <strong className="footer-neon-text">ACTIVE</strong></span>
              </div>

              <div className="footer-status-node">
                <span>CMDS_EXECUTED: <strong className="footer-neon-text">{cmdCount}</strong></span>
              </div>

              <div className="footer-center-tag">
                <span className="footer-bracket">[</span>
                <span className="footer-tag-text">GAURAV.DEV // SYS_OS v4.2</span>
                <span className="footer-bracket">]</span>
              </div>

              <div className="footer-status-node">
                <FaClock className="footer-icon-glow" />
                <span className="footer-uptime-label">SESSION_UPTIME:</span>
                <strong className="footer-uptime-value">{formatTime(secondsSpent)}</strong>
              </div>

              <div className="footer-status-node">
                <span>© {new Date().getFullYear()}</span>
                <span className="footer-neon-text">// EXIT_SUCCESS</span>
              </div>
            </div>

          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;