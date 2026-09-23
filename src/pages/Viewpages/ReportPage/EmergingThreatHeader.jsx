import React, { useState, useEffect } from 'react';
import { LiaDownloadSolid } from 'react-icons/lia';
import logo from '../../../assets/images/logo.png';
import logodarkmode from '../../../assets/images/logodarkmode.png';
import '../../../assets/styles/ReportPage/EmergingThreatHeader.scss';

export default function EmergingThreatHeader() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const handleStorage = () => setTheme(localStorage.getItem('theme') || 'light');
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleDownload = () => {
    // Implement print or download logic
    window.print();
  };

  return (
    <header className="emerging-threat-header">
      <div className="header-logo-container">
        <img src={theme === 'dark' ? logodarkmode : logo} alt="INTELGENZ Logo" className="brand-logo-img" />
        <span className="brand-tagline">  </span>
      </div>
      <button className="download-btn-header" onClick={handleDownload}>
        <LiaDownloadSolid /> Download now
      </button>
    </header>
  );
}
