import React, { useState, useEffect, useRef } from 'react';
import { FaTerminal, FaClock, FaPowerOff, FaCheckCircle, FaRedo, FaHeart } from 'react-icons/fa';

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

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    setCmdCount((prev) => prev + 1);

    if (['cd ~', 'cd root', 'top', 'cd home', 'home'].includes(cmd)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showTemporaryFeedback('Navigated to: ~ (Root/Home)');
    } else if (['cd about', 'about'].includes(cmd)) {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      showTemporaryFeedback('Navigated to: #about');
    } else if (['cd skills', 'skills'].includes(cmd)) {
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      showTemporaryFeedback('Navigated to: #skills');
    } else if (['cd projects', 'projects'].includes(cmd)) {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      showTemporaryFeedback('Navigated to: #projects');
    } else if (['cd contact', 'contact'].includes(cmd)) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      showTemporaryFeedback('Navigated to: #contact');
    } else if (['exit', 'quit'].includes(cmd)) {
      setFeedbackMsg('Terminating session...');
      setTimeout(() => {
        setIsTerminated(true);
        setFeedbackMsg('');
      }, 600);
    } else if (cmd === 'help') {
      showTemporaryFeedback('AVAILABLE COMMANDS: cd [about | skills | projects | contact | ~] | top | clear | exit');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showTemporaryFeedback('System kernel restarted successfully. Uptime reset.');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(cmdInput);
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
                  placeholder="type 'help', 'cd about', 'cd projects', or 'exit'..."
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

            {/* Strictly Aligned Single Line Bottom Telemetry Bar */}
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