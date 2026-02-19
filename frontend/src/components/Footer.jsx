import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const handleAdminRequest = () => {
    alert("Please register first and then send a request via email to cspk1694@protonmail.com");
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-branding">
          <h3>MenU</h3>
          <p>Authentication handled via Google OAuth</p>
        </div>

        <div className="footer-links">
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <Link to="/terms" className="footer-link">
            Terms & Conditions
          </Link>
          <a href="mailto:cspk1694@protonmail.com" className="footer-link">
            Contact Support
          </a>
          <a href="/suggestions" className="footer-link">
            Suggestions
          </a>
          <a
            href="https://github.com/spkchalla/MenU"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <a
            href="https://buymeachai.ezee.li/spkumar_buymeachai"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Buy me a Chai
          </a>
        </div>

        <div className="footer-info">
          <p>
            Developed by{" "}
            <a
              href="https://github.com/spkchalla"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-inline"
            >
              SPKUMAR CHALLA
            </a>
          </p>
          <div className="contributors-list">
            <span>
              Contributors:{" "}
              <a
                href="https://github.com/garvita-d"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-inline"
              >
                Garvita
              </a>
              ,{" "}
              <a
                href="https://github.com/gouthamx67"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-inline"
              >
                Goutham Reddy
              </a>
            </span>
            <span className="separator">•</span>
            <span>
              Guidance:{" "}
              <a
                href="https://github.com/Likhith025"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link-inline"
              >
                Likhith
              </a>
            </span>
          </div>
          <button className="text-btn" onClick={handleAdminRequest}>
            Request Admin Access
          </button>
        </div>
        <div className="disclaimer">for MU, by student of MU</div>
      </div>
    </footer>
  );
};

export default Footer;
