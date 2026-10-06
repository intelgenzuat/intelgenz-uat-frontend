import React from 'react';
import '../../components/ThreatCard.scss';
import { FiArrowRight } from 'react-icons/fi';
import { ImEarth } from 'react-icons/im';
import { PiBug, PiMapPinAreaFill, PiShieldWarningDuotone, PiUsersFourDuotone, PiWarningFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { LiaIndustrySolid } from 'react-icons/lia';

export default function ThreatCard({ cardData }) {
  const navigate = useNavigate();

  // Helper to parse date string "YYYY-MM-DD" or "YYYY-MM"
  const parseDate = (dateStr) => {
    if (!dateStr) return { month: 'JAN', day: '01', year: '2024' };
    const date = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    if (isNaN(date.getTime())) {
      const parts = String(dateStr).split('-');
      if (parts.length >= 2) {
        const y = parts[0];
        const m = parseInt(parts[1], 10) - 1;
        const d = parts[2] ? parts[2] : '01';
        return {
          month: months[m] || 'JAN',
          day: String(d).padStart(2, '0'),
          year: y || '2024'
        };
      }
      return { month: 'JAN', day: '01', year: '2024' };
    }
    return {
      month: months[date.getMonth()],
      day: String(date.getDate()).padStart(2, '0'),
      year: date.getFullYear()
    };
  };

  const impactSection = cardData?.sections?.find(s => s.type === 'impact_overview') || cardData?.sections?.[0] || {};
  const rawDate = cardData?.report?.activity_period?.end || cardData?.report?.activity_period?.start || cardData?.date;
  const rawTitle = cardData?.report?.title || cardData?.title || 'Unknown Threat';
  const rawRegions = impactSection?.affected_regions || cardData?.target_regions || [];
  const rawCountries = impactSection?.affected_countries || cardData?.target_countries || [];
  const rawSectors = impactSection?.affected_sectors || cardData?.industries || [];
  const rawSeverity = impactSection?.severity || cardData?.severity_level || cardData?.severity || 'Low';

  // Map backend keys to component expectations with fallbacks
  const data = {
    date: parseDate(rawDate),
    banner_text: rawTitle,
    threat_type: cardData?.threat_type || 'N/A',
    threat_group: cardData?.threat_group_names?.join(', ') || 'Unknown',
    malware: cardData?.threat_type || 'N/A',
    target_region: Array.isArray(rawRegions) && rawRegions.length > 0 ? rawRegions.join(', ') : 'Global',
    target_country: Array.isArray(rawCountries) && rawCountries.length > 0 ? rawCountries.join(', ') : 'Global',
    target_sector: Array.isArray(rawSectors) && rawSectors.length > 0 ? rawSectors.join(', ') : 'General',
    severity: String(rawSeverity).charAt(0).toUpperCase() + String(rawSeverity).slice(1).toLowerCase()
  };

  const truncateText = (text, maxLength = 28) => {
    if (!text || typeof text !== 'string') return text || 'N/A';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
        <p className="tc-banner-text mb-0" title={data.banner_text}>
          {data.banner_text}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="card-body-content flex-grow-1">

        <div className="info-list">
          <div className="info-row d-flex align-items-center">
            <ImEarth className="text-danger flex-shrink-0 me-2 tc-icon" style={{ strokeWidth: 0 }} />
            <span className="tc-label flex-shrink-0 me-2">Target Region :</span>
            <span
              className="badge rounded-pill px-3 border tc-badge-region flex-grow-1 text-truncate"
              title={data.target_region}
            >
              {truncateText(data.target_region, 26)}
            </span>
          </div>

          <div className="info-row d-flex align-items-center">
            <PiMapPinAreaFill className="text-danger flex-shrink-0 me-2 tc-icon" style={{ strokeWidth: 0 }} />
            <span className="tc-label flex-shrink-0 me-2">Target Country :</span>
            <span
              className="badge rounded-pill px-3 border tc-badge-region flex-grow-1 text-truncate"
              title={data.target_country}
            >
              {truncateText(data.target_country, 26)}
            </span>
          </div>

          <div className="info-row d-flex align-items-center">
            <LiaIndustrySolid className="text-danger flex-shrink-0 me-2 tc-icon" style={{ strokeWidth: 0 }} />
            <span className="tc-label flex-shrink-0 me-2">Target sector :</span>
            <span
              className="badge rounded-pill px-3 border tc-badge-region flex-grow-1 text-truncate"
              title={data.target_sector}
            >
              {truncateText(data.target_sector, 26)}
            </span>
          </div>

          {/* Severity */}
          <div className="info-row severity-row d-flex align-items-center">
            <PiWarningFill className="text-danger flex-shrink-0 me-2 tc-icon" style={{ strokeWidth: 0 }} />
            <span className="tc-label flex-shrink-0 me-2">Severity level :</span>
            <span className="badge rounded-pill px-3 tc-badge-severity" style={getSeverityStyle(data.severity)}>
              {data.severity}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            const reportId = cardData?.report_id || cardData?.id;
            if (reportId) {
              navigate(`/emerging-threat-report/${reportId}`, {
                state: { report_id: reportId, data: cardData }
              });
            } else {
              navigate('/emerging-threat-report', {
                state: { data: cardData }
              });
            }
          }}
          className="view-report-btn w-100 py-2 d-flex justify-content-center align-items-center view-report-btn"
        >
          <FiArrowRight className="me-2" style={{ strokeWidth: '2.5px' }} /> View Report
        </button>
      </div>
    </div >
  );
}
