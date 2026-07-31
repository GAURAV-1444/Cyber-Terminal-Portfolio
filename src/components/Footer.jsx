import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <p className="prompt">exit</p>
      <p className="footer-author-text">
        Designed & Built by <span className="glow-text">Gaurav Kshirsagar</span>
      </p>
      <p className="footer-copyright-text">
        © {new Date().getFullYear()} Cyber Terminal Workspace
      </p>
    </footer>
  );
};

export default Footer;