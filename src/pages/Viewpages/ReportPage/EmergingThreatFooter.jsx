import React from 'react';
import { FaInstagram, FaWhatsapp, FaLinkedin, FaTwitter } from 'react-icons/fa';
import logo from '../../../assets/images/logo.png';
import '../../../assets/styles/ReportPage/EmergingThreatFooter.scss';

export default function EmergingThreatFooter() {
  return (
    <footer className="emerging-threat-footer">
      {/* Subtle watermark in the background */}
      <div className="footer-watermark"></div>

      <div className="footer-content">
        {/* Brand section */}
        <div className="footer-brand">
          <img src={logo} alt="INTELGENZ Logo" className="footer-logo-img" />
          <p className="footer-tagline">Illuminating The Dark Side Of The Web</p>
        </div>

        {/* Social media links */}
        <div className="footer-social-section">
          <h4 className="social-title">Social Media</h4>
          <div className="social-icons-wrapper">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaInstagram />
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaWhatsapp />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon-link">
              <FaTwitter />
            </a>
          </div>
        </div>
        
        {/* Right placeholder for centering */}
        <div className="footer-empty-right"></div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom-bar">
        <a href="#privacy" className="privacy-link">Privacy Policy</a>
        <p className="copyright-text">© 2026 Design & Development By Intelgenz</p>
      </div>
    </footer>
  );
}
