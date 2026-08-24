import React, { useState, useEffect } from 'react';
import { getThreatCard } from '../../Context/View';
import '../../assets/styles/Intelcard/intelcard.scss';
import { FiArrowRight } from 'react-icons/fi';
import { ImEarth } from 'react-icons/im';
import { PiBug, PiShieldWarningDuotone } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

const MOCK_CARDS = [
  {
    "id": 1,
    "date": "2026-04-20",
    "title": "Ransomware Attack on Banking Sector",
    "threat_type": "Ransomware",
    "threat_group_names": ["DarkLock", "Shadow Team"],
    "target_countries": ["India", "United States"],
    "target_regions": ["Asia", "North America"],
    "industries": ["Banking", "Finance"],
    "severity_level": "high",
    "analyst_comments": "Multiple banks reported encrypted systems and ransom demands."
  },
  {
    "id": 2,
    "date": "2026-04-19",
    "title": "Phishing Campaign Targeting Healthcare",
    "threat_type": "Phishing",
    "threat_group_names": ["PhishNet"],
    "target_countries": ["United Kingdom"],
    "target_regions": ["Europe"],
    "industries": ["Healthcare"],
    "severity_level": "medium",
    "analyst_comments": "Fake emails impersonating hospital staff to steal credentials."
  },
  {
    "id": 3,
    "date": "2026-04-18",
    "title": "DDoS Attack on E-commerce Platforms",
    "threat_type": "DDoS",
    "threat_group_names": ["StormBreak"],
    "target_countries": ["Germany", "France"],
    "target_regions": ["Europe"],
    "industries": ["E-commerce"],
    "severity_level": "high",
    "analyst_comments": "Websites experienced downtime due to massive traffic floods."
  },
  {
    "id": 4,
    "date": "2026-04-17",
    "title": "Malware Spread via Mobile Apps",
    "threat_type": "Malware",
    "threat_group_names": ["AppTrap"],
    "target_countries": ["India"],
    "target_regions": ["Asia"],
    "industries": ["Technology"],
    "severity_level": "medium",
    "analyst_comments": "Malicious apps found stealing user data from mobile devices."
  },
  {
    "id": 5,
    "date": "2026-04-16",
    "title": "Insider Threat in IT Company",
    "threat_type": "Insider Threat",
    "threat_group_names": ["Internal Actor"],
    "target_countries": ["Canada"],
    "target_regions": ["North America"],
    "industries": ["IT Services"],
    "severity_level": "low",
    "analyst_comments": "Employee leaked sensitive company information."
  },
  {
    "id": 6,
    "date": "2026-04-15",
    "title": "Zero-Day Vulnerability Exploitation",
    "threat_type": "Zero-Day",
    "threat_group_names": ["Unknown"],
    "target_countries": ["Australia"],
    "target_regions": ["Oceania"],
    "industries": ["Government"],
    "severity_level": "critical",
    "analyst_comments": "Attackers exploited unknown vulnerability affecting systems."
  },
  {
    "id": 7,
    "date": "2026-04-14",
    "title": "Supply Chain Compromise",
    "threat_type": "Supply Chain",
    "threat_group_names": ["VendorX"],
    "target_countries": ["Global"],
    "target_regions": ["Global"],
    "industries": ["Manufacturing"],
    "severity_level": "critical",
    "analyst_comments": "Software update mechanism compromised to deliver payload."
  },
  {
    "id": 8,
    "date": "2026-04-13",
    "title": "Data Breach in Retail",
    "threat_type": "Data Breach",
    "threat_group_names": ["DataSnatch"],
    "target_countries": ["Brazil"],
    "target_regions": ["South America"],
    "industries": ["Retail"],
    "severity_level": "high",
    "analyst_comments": "Millions of customer records exposed."
  },
  {
    "id": 9,
    "date": "2026-04-12",
    "title": "Cryptojacking Campaign",
    "threat_type": "Malware",
    "threat_group_names": ["CoinMiner"],
    "target_countries": ["Japan"],
    "target_regions": ["Asia"],
    "industries": ["Education"],
    "severity_level": "low",
    "analyst_comments": "University servers infected with cryptomining malware."
  }
];

function IntelCard({ cardData }) {
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

  return (
    <div className="threat-card-wrapper" style={{ background: 'linear-gradient(90deg, #F2E8FC 0%, #FAEDF5 100%)', borderRadius: '14px', paddingTop: '6px' }}>
      <div
        className="threat-card position-relative d-flex flex-column bg-white"
        style={{
          borderRadius: '14px',
          padding: '12px 12px',
          border: '1px solid #f8f9fa',
          overflow: 'hidden'
        }}
      >

        {/* Title */}
        <h5 className="text-center mb-2 mt-1 px-1 position-relative" title={data.banner_text} style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#000',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          zIndex: 1
        }}>
          {data.banner_text}
        </h5>

        {/* Details section */}
        <div className="d-flex flex-column gap-2 mb-3 position-relative" style={{ zIndex: 1 }}>

          <div className="d-flex justify-content-center align-items-center gap-2 flex-nowrap w-100 px-1">
            {/* Region */}
            <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
              <div className="d-flex justify-content-center align-items-center me-2 rounded-circle flex-shrink-0" style={{ width: '24px', height: '24px', backgroundColor: '#fff', border: '1px solid #fae8eb', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', color: '#f43f5e' }}>
                <ImEarth size={12} />
              </div>
              <span className="text-dark" title={`Region: ${data.target_region}`} style={{
                fontSize: '11px',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                <span style={{ fontWeight: '600' }}>Region :</span> <span style={{ fontWeight: '400' }}>{data.target_region}</span>
              </span>
            </div>

            {/* Domain */}
            <div className="d-flex align-items-center" style={{ flex: 1, minWidth: 0 }}>
              <div className="d-flex justify-content-center align-items-center me-2 rounded-circle flex-shrink-0" style={{ width: '24px', height: '24px', backgroundColor: '#fff', border: '1px solid #fae8eb', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', color: '#f43f5e' }}>
                <PiShieldWarningDuotone size={13} />
              </div>
              <span className="text-dark" title={`Domain: ${data.target_sector}`} style={{
                fontSize: '11px',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                <span style={{ fontWeight: '600' }}>Domain:</span> <span style={{ fontWeight: '400' }}>{data.target_sector}</span>
              </span>
            </div>
          </div>

          {/* Alias Names */}
          <div className="d-flex justify-content-center align-items-center mt-1 px-2">
            <div className="d-flex justify-content-center align-items-center me-2 rounded-circle flex-shrink-0" style={{ width: '24px', height: '24px', backgroundColor: '#fff', border: '1px solid #fae8eb', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', color: '#f43f5e' }}>
              <PiBug size={13} />
            </div>
            <span className="text-dark" title={`Alias Names: ${data.threat_group}`} style={{
              fontSize: '11px',
              maxWidth: '220px',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              <span style={{ fontWeight: '600' }}>Alias Names:</span> <span style={{ fontWeight: '400' }}>{data.threat_group}</span>
            </span>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-auto d-flex justify-content-center position-relative w-100 align-items-center pb-1" style={{ zIndex: 1 }}>
          <button
            onClick={() => navigate('/intel-card-threat-details')}
            className="btn rounded-pill text-white px-4 py-1 d-flex align-items-center position-relative"
            style={{ backgroundColor: '#4300D2', fontSize: '12px', fontWeight: '500', transition: 'background-color 0.2s', border: 'none', zIndex: 2 }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#3100a3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4300D2'}
          >
            <FiArrowRight className="me-2" style={{ strokeWidth: '2.5px', fontSize: '14px' }} /> View Report
          </button>

          {/* Zi Watermark Logo */}
          <div className="position-absolute end-0 d-flex align-items-center justify-content-center rounded-circle" style={{ zIndex: 2 }}>
            <svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
              <rect width="43.7717" height="42" fill="url(#pattern0_143_129)" fillOpacity="0.31" />
              <defs>
                <pattern id="pattern0_143_129" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_143_129" transform="scale(0.00238095 0.00248139)" />
                </pattern>
                <image id="image0_143_129" width="420" height="403" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
              </defs>
            </svg>
          </div>
        </div>

        {/* Corner pizza pie / quarter circle shape */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '30px',
            height: '30px',
            backgroundColor: '#FDE4EA',
            borderTopLeftRadius: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      </div>
    </div>
  );
}

export default function IntelCards() {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getThreatCardData = () => {
    setLoading(true);
    try {
      getThreatCard({})(response => {
        console.log(response, "res");
        if (response && response.status && response?.data?.data?.results) {
          setCardData(response?.data);
          setLoading(false);
        } else {
          setCardData({ data: { results: MOCK_CARDS } });
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error calling getThreatCard API:", error);
      setCardData({ data: { results: MOCK_CARDS } });
      setLoading(false);
    }
  };

  useEffect(() => {
    getThreatCardData();
  }, []);

  return (
    <div className="intelcard-cards-scroll-area px-3 w-100">
      {loading ? (
        <div className="intelcard-spinner-container d-flex justify-content-center align-items-center py-5">
          <div className="intelcard-spinner-border spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="intelcard-cards-row row g-3 mb-2">
          {cardData?.data?.results?.map(threat => (
            <div key={threat.id} className="intelcard-card-column col-12 col-xl-4 col-md-6 mb-1">
              <IntelCard cardData={threat} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
