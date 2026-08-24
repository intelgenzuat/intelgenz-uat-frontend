import React from 'react';
import { LiaDownloadSolid } from 'react-icons/lia';
import logo from '../../../assets/images/logo.png';
import '../../../assets/styles/ReportPage/EmergingThreatHeader.scss';

export default function EmergingThreatHeader() {
  const handleDownload = () => {
    // Implement print or download logic
    window.print();
  };

  return (
    <header className="emerging-threat-header">
      <div className="header-logo-container">
        <img src={logo} alt="INTELGENZ Logo" className="brand-logo-img" />
        <span className="brand-tagline">  </span>
      </div>
      <button className="download-btn-header" onClick={handleDownload}>
        <LiaDownloadSolid /> Download now
      </button>
    </header>
  );
}
