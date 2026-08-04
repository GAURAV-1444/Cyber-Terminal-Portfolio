import React, { useState, useEffect, useRef } from 'react';
import { FaTerminal, FaTimes, FaRedo } from 'react-icons/fa';
import { sfx } from '../utils/sfx';
import './TerminalModal.css';

const COMMANDS_LIST = [
  'help', 'about', 'projects', 'skills', 'experience', 'contact', 'home',
  'whoami', 'neofetch', 'clear', 'exit', 'matrix',
  'theme', 'theme matrix', 'theme amber', 'theme cyan', 'theme crimson',
  'resume', 'cv', 'socials', 'links',
  'ls', 'cat bio.txt', 'cat stack.txt', 'cat skills.json', 'cat resume.pdf'
];

const VIRTUAL_FILES = {
  'bio.txt': `GAURAV_KSHIRSAGAR // JAVA FULL STACK ENGINEER
-------------------------------------------
Specializing in enterprise Java backends (Spring Boot, Microservices) 
and modern reactive web frontends (React.js, Tailwind CSS). 
Passionate about clean architecture, secure RESTful API design, and CLI toolings.`,

  'stack.txt': `CORE STACK: Java 17+ | Spring Boot | React.js | MySQL | MongoDB | REST APIs | Docker`,

  'skills.json': `{
  "backend": ["Java 17+", "Spring Boot", "Spring Data JPA", "RESTful APIs", "Microservices"],
  "frontend": ["React.js", "JavaScript (ES6+)", "Tailwind CSS"],
  "databases": ["MySQL", "MongoDB"],
  "tools": ["Git", "Docker", "Maven", "Postman"]
}`,

  'resume.pdf': `[FILE_TYPE: PDF Document]
Note: Run the 'resume' command to view or download the actual file.`
};

const INITIAL_LOGS = [
  { type: 'info', text: 'GauravOS Core Kernel [v4.2.0-STABLE]' },
  { type: 'info', text: 'Type "help" or click quick chips below to navigate.' }
];

const TerminalModal = ({ isOpen, onClose }) => {
  const [cmdInput, setCmdInput] = useState('');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'matrix';
  });

  const inputRef = useRef(null);
  const logEndRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when logs update
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCloseTerminal = () => {
    setCmdInput('');
    setHistoryIndex(-1);
    onClose();
  };

  const handleClear = () => {
    sfx.playKeyClick();
    setLogs([
      { type: 'info', text: 'GauravOS Core Kernel [v4.2.0-STABLE]' },
      { type: 'info', text: 'Buffer reset successfully.' }
    ]);
    setCmdInput('');
    setHistoryIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('portfolio-theme', themeName);
    setCurrentTheme(themeName);

    const themeColors = {
      matrix: '#00ff88',
      amber: '#ffb000',
      cyan: '#00e5ff',
      crimson: '#ff2a5f'
    };

    window.dispatchEvent(
      new CustomEvent('theme-changed', {
        detail: { theme: themeName, color: themeColors[themeName] || '#00ff88' }
      })
    );
  };

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Handle exit / quit immediately without appending "exit" command to persistent logs
    if (['exit', 'quit'].includes(cmd)) {
      sfx.playExecuteSound();
      setCmdInput('');
      setHistoryIndex(-1);
      onClose();
      return;
    }

    const newLogs = [...logs, { type: 'cmd', text: `visitor@gaurav-dev:~$ ${rawCmd}` }];

    // --- VIRTUAL FILE SYSTEM COMMANDS ---
    if (cmd === 'ls' || cmd === 'ls -a' || cmd === 'ls -l') {
      sfx.playExecuteSound();
      newLogs.push({
        type: 'info',
        text: `DIRECTORY CONTENTS (./):\nbio.txt     stack.txt     skills.json     projects/     resume.pdf`
      });
    } else if (cmd.startsWith('cat ')) {
      const fileName = cmd.replace('cat ', '').trim();

      if (fileName === 'projects' || fileName === 'projects/') {
        sfx.playErrorSound();
        newLogs.push({
          type: 'error',
          text: `cat: ${fileName}: Is a directory. Type 'projects' to navigate to the projects section.`
        });
      } else if (VIRTUAL_FILES[fileName]) {
        sfx.playExecuteSound();
        newLogs.push({
          type: 'info',
          text: VIRTUAL_FILES[fileName]
        });
      } else {
        sfx.playErrorSound();
        newLogs.push({
          type: 'error',
          text: `cat: ${fileName}: No such file or directory`
        });
      }
    }
    // --- RESUME & SOCIALS ---
    else if (['resume', 'cv'].includes(cmd)) {
      sfx.playExecuteSound();
      window.open('/Gaurav_Kshirsagar_Resume.pdf', '_blank');
      newLogs.push({
        type: 'success',
        text: 'FETCHING_DOC: Opening Gaurav_Kshirsagar_Resume.pdf in a new window...'
      });
    } else if (['socials', 'links'].includes(cmd)) {
      sfx.playExecuteSound();
      newLogs.push({
        type: 'info',
        text: `CONNECT_NETWORKS:\n- GitHub:   https://github.com/GAURAV-1444\n- LinkedIn: https://www.linkedin.com/in/gaurav-kshirsagar-229087333/\n- Email:    mailto:gauravmanojkshirsagar333@gmail.com`
      });
    }
    // --- THEME COMMAND ---
    else if (cmd.startsWith('theme')) {
      const parts = cmd.split(' ');
      const themeArg = parts[1];
      const availableThemes = ['matrix', 'amber', 'cyan', 'crimson'];

      if (!themeArg) {
        sfx.playExecuteSound();
        newLogs.push({
          type: 'info',
          text: `CURRENT THEME: [ ${currentTheme.toUpperCase()} ]\nAVAILABLE THEMES: ${availableThemes.join(' | ')}\nUSAGE: theme <name> (e.g., 'theme amber')`
        });
      } else if (availableThemes.includes(themeArg)) {
        sfx.playExecuteSound();
        applyTheme(themeArg);
        newLogs.push({
          type: 'success',
          text: `SYSTEM THEME UPDATED: Switched accent palette to '${themeArg.toUpperCase()}'.`
        });
      } else {
        sfx.playErrorSound();
        newLogs.push({
          type: 'error',
          text: `Unknown theme '${themeArg}'. Available themes: ${availableThemes.join(', ')}`
        });
      }
    }
    // --- NAVIGATION COMMANDS ---
    else if (['cd ~', 'cd root', 'cd home', 'home', 'top'].includes(cmd)) {
      sfx.playExecuteSound();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      newLogs.push({ type: 'success', text: 'Navigated to: ~ (Root/Home)' });
      handleCloseTerminal();
    } else if (['cd about', 'about'].includes(cmd)) {
      sfx.playExecuteSound();
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      newLogs.push({ type: 'success', text: 'Navigated to: #about' });
      handleCloseTerminal();
    } else if (['cd skills', 'skills'].includes(cmd)) {
      sfx.playExecuteSound();
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      newLogs.push({ type: 'success', text: 'Navigated to: #skills' });
      handleCloseTerminal();
    } else if (['cd projects', 'projects'].includes(cmd)) {
      sfx.playExecuteSound();
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      newLogs.push({ type: 'success', text: 'Navigated to: #projects' });
      handleCloseTerminal();
    } else if (['cd experience', 'experience', 'logs'].includes(cmd)) {
      sfx.playExecuteSound();
      document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
      newLogs.push({ type: 'success', text: 'Navigated to: #experience' });
      handleCloseTerminal();
    } else if (['cd contact', 'contact'].includes(cmd)) {
      sfx.playExecuteSound();
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      newLogs.push({ type: 'success', text: 'Navigated to: #contact' });
      handleCloseTerminal();
    } 
    // --- SYSTEM UTILITIES ---
    else if (cmd === 'whoami') {
      sfx.playExecuteSound();
      newLogs.push({ 
        type: 'info', 
        text: 'USER: Guest Visitor | ROLE: Reviewer / Engineer | PERMISSIONS: Read-Only Shell' 
      });
    } else if (cmd === 'neofetch') {
      sfx.playExecuteSound();
      newLogs.push({
        type: 'info',
        text: `OS: GauravOS v4.2 x86_64\nHOST: Java Full Stack Portfolio\nKERNEL: Spring Boot & React.js\nTHEME: ${currentTheme.toUpperCase()}\nSHELL: ZSH Interactive CLI`
      });
    } else if (cmd === 'sudo') {
      sfx.playErrorSound();
      newLogs.push({ type: 'error', text: 'Permission denied: Visitor is not in the sudoers file. This incident will be reported.' });
    } else if (cmd === 'matrix') {
      sfx.playExecuteSound();
      newLogs.push({ type: 'success', text: 'Wake up, Neo... The Matrix has you. Follow the white rabbit.' });
    } else if (cmd === 'clear') {
      sfx.playExecuteSound();
      setLogs([]);
      setCmdInput('');
      setHistoryIndex(-1);
      return;
    } else if (cmd === 'help') {
      sfx.playExecuteSound();
      newLogs.push({ 
        type: 'info', 
        text: 'AVAILABLE COMMANDS:\n- Virtual FS: ls | cat <filename> (e.g., cat bio.txt, cat skills.json)\n- Navigation: about | skills | projects | experience | contact | home\n- Portfolio: resume | socials\n- System Info: whoami | neofetch | theme [matrix|amber|cyan|crimson]\n- Utilities: clear | exit ' 
      });
    } else {
      sfx.playErrorSound();
      newLogs.push({ 
        type: 'error', 
        text: `zsh: command not found: '${cmd}'. Type 'help' for available system options.` 
      });
    }

    setLogs(newLogs);
    setHistory(prev => [rawCmd, ...prev]);
    setHistoryIndex(-1);
    setCmdInput('');
  };

  const handleInputChange = (e) => {
    setCmdInput(e.target.value);
    sfx.playKeyClick();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(cmdInput);
    } else if (e.key === 'Escape') {
      handleCloseTerminal();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMANDS_LIST.find(c => c.startsWith(cmdInput.trim().toLowerCase()));
      if (match) {
        setCmdInput(match);
        sfx.playKeyClick();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(nextIdx);
      setCmdInput(history[nextIdx] || '');
      sfx.playKeyClick();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setCmdInput('');
      } else {
        const prevIdx = historyIndex - 1;
        setHistoryIndex(prevIdx);
        setCmdInput(history[prevIdx] || '');
      }
      sfx.playKeyClick();
    }
  };

  return (
    <div className="terminal-modal-overlay" onClick={handleCloseTerminal}>
      <div className="terminal-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Bar */}
        <div className="terminal-modal-header">
          <div className="terminal-modal-title">
            <FaTerminal className="modal-terminal-icon" />
            <span>GAURAV_OS // INTERACTIVE_SHELL</span>
          </div>
          <div className="terminal-modal-actions">
            <button 
              className="terminal-modal-action-btn" 
              onClick={handleClear} 
              title="Reset Terminal Buffer"
            >
              <FaRedo />
            </button>
            <button 
              className="terminal-modal-close-btn" 
              onClick={handleCloseTerminal} 
              title="Close Terminal [ESC]"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Quick Command Chips */}
        <div className="terminal-modal-chips">
          {['ls', 'cat bio.txt', 'projects', 'resume', 'socials', 'theme amber', 'theme cyan', 'help'].map((chip) => (
            <button 
              key={chip} 
              className="terminal-chip-btn"
              onClick={() => executeCommand(chip)}
            >
              [ {chip} ]
            </button>
          ))}
        </div>

        {/* Terminal Body Logs */}
        <div className="terminal-modal-body" onClick={() => inputRef.current?.focus()}>
          {logs.map((log, index) => (
            <div key={index} className={`terminal-log-line ${log.type}`}>
              {log.text.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          ))}

          {/* Active Input Line */}
          <div className="terminal-modal-input-row">
            <span className="modal-prompt-symbol">visitor@gaurav-dev:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={cmdInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="type 'ls', 'resume', 'theme amber' or 'help'..."
              className="modal-cli-input"
            />
          </div>
          <div ref={logEndRef} />
        </div>

      </div>
    </div>
  );
};

export default TerminalModal;