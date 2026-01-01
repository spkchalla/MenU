import React from 'react';
import './Footer.css';

const Footer = () => {
  const handleAdminRequest = () => {
    alert("Please register first and then send a request via email to cspk1694@protonmail.com");
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="mailto:cspk1694@protonmail.com" className="footer-link">Contact Email</a>
          <a href="https://github.com/spkchalla/MenU" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="https://buymeachai.ezee.li/spkumar_buymeachai" target="_blank" rel="noopener noreferrer" className="footer-link">Buy me a Coffee</a>
        </div>

        <div className="footer-info">
          <p>Developed by <a href="https://github.com/spkchalla" target="_blank" rel="noopener noreferrer" className="footer-link-inline">SPKUMAR CHALLA</a></p>
          <p className="contributors">
            Contributors:<a href="https://github.com/garvita-d" target="_blank" rel="noopener noreferrer" className="footer-link-inline">Garvita</a>
          </p>
          <p className="contributors">
            Guidance: <a href="https://github.com/Likhith025" target="_blank" rel="noopener noreferrer" className="footer-link-inline">Likhith</a>
          </p>
          <button className="text-btn" onClick={handleAdminRequest}>Request Admin Access</button>
        </div>

        <div className="disclaimer">
          for MU, but using no MU resources
        </div>
      </div>
    </footer>
  );
};

export default Footer;
