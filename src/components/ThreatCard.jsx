import React from 'react';
import './ThreatCard.scss';
import { FiArrowRight } from 'react-icons/fi';
import { ImEarth } from 'react-icons/im';
import { PiBug, PiMapPinAreaFill, PiShieldWarningDuotone, PiUsersFourDuotone, PiWarningFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { LiaIndustrySolid } from 'react-icons/lia';

export default function ThreatCard({ cardData }) {
  const navigate = useNavigate();

  // Helper to parse date string "YYYY-MM-DD"
  const parseDate = (dateStr) => {
    if (!dateStr) return { month: 'JAN', day: '01', year: '2024' };
    const date = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      month: months[date.getMonth()],
      day: String(date.getDate()).padStart(2, '0'),
      year: date.getFullYear()
    };
  };

  // Map backend keys to component expectations with fallbacks
  const data = {
    date: parseDate(cardData?.date),
    banner_text: cardData?.title || 'Unknown Threat',
    threat_type: cardData?.threat_type || 'N/A',
    threat_group: cardData?.threat_group_names?.join(', ') || 'Unknown',
    malware: cardData?.threat_type || 'N/A',
    target_region: cardData?.target_regions?.join(', ') || 'Global',
    target_country: cardData?.target_countries?.join(', ') || 'Global',
    target_sector: cardData?.industries?.join(', ') || 'General',
    severity: (cardData?.severity_level || 'Low').charAt(0).toUpperCase() + (cardData?.severity_level || 'Low').slice(1)
  };

  const getSeverityStyle = (level) => {
    const lowLevel = level?.toLowerCase();
    if (lowLevel === 'high' || lowLevel === 'critical') return { backgroundColor: '#FF6B6B', color: '#fff' };
    if (lowLevel === 'medium') return { backgroundColor: '#FFD166', color: '#000' };
    return { backgroundColor: '#06D6A0', color: '#fff' };
  };

  return (
    <div className="threat-card px-3 py-3 h-100 d-flex flex-column bg-white">

      {/* Top Banner specific to Threat Card */}
      <div className="card-header-banner mb-2 d-flex align-items-center gap-2">
        <div className="date-badge bg-white shadow-sm d-flex flex-column align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '54px', borderRadius: '8px' }}>
          <span className="tc-month mb-0">{data.date.month}</span>
          <span className="tc-day">{data.date.day}</span>
          <span className="tc-year">{data.date.year}</span>
        </div>
        <p className="tc-banner-text mb-0">
          {data.banner_text}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="card-body-content flex-grow-1">

        <div className="info-list">
          <div className="info-row d-flex align-items-center">
            <ImEarth className="text-danger flex-shrink-0 me-2 tc-icon" style={{ strokeWidth: 0 }} />
            <span className="tc-label me-2">Target Region :</span>
            <span className="badge rounded-pill px-3 border tc-badge-region">{data.target_region}</span>
          </div>

          <div className="info-row d-flex align-items-center">
            <PiMapPinAreaFill className="text-danger flex-shrink-0 me-2 tc-icon" style={{ strokeWidth: 0 }} />
            <span className="tc-label me-2">Target Country :</span>
            <span className="badge rounded-pill px-3 border tc-badge-region">{data.target_country}</span>
          </div>

          <div className="info-row d-flex align-items-center">
            <LiaIndustrySolid className="text-danger flex-shrink-0 me-2 tc-icon" style={{ strokeWidth: 0 }} />
            <span className="tc-label me-2">Target sector :</span>
            <span className="badge rounded-pill px-3 border tc-badge-region">{data.target_sector}</span>
          </div>

          {/* Severity */}
          <div className="info-row severity-row d-flex align-items-center">
            <PiWarningFill className="text-danger flex-shrink-0 me-2 tc-icon" style={{ strokeWidth: 0 }} />
            <span className="tc-label me-2">Severity level :</span>
            <span className="badge rounded-pill px-3 tc-badge-severity" style={getSeverityStyle(data.severity)}>{data.severity}</span>
          </div>
        </div>

        <button onClick={() => navigate('/emerging-threat-report')} className="view-report-btn w-100 py-2 d-flex justify-content-center align-items-center view-report-btn">
          <FiArrowRight className="me-2" style={{ strokeWidth: '2.5px' }} /> View Report
        </button>
      </div>
    </div >
  );
}
