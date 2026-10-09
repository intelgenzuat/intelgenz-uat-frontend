import React, { useState, useEffect } from 'react';
import '../../assets/styles/Intelcard/intelcard.scss';
import { FiArrowRight } from 'react-icons/fi';
import { ImEarth } from 'react-icons/im';
import { PiBug, PiShieldWarningDuotone } from 'react-icons/pi';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getTheatreIntelCardsList } from '../../Context/Intelcard';
import Pagination from '../../components/pagination/Pagination';
import Loader from '../../components/helper/Loader';
import logoonly from '../../assets/images/logoonly.png';



function IntelCard({ threatData }) {
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

  // Helper to truncate text with ellipsis
  const truncateText = (text, maxLength = 35) => {
    if (!text || text === 'Unknown' || text === 'N/A') return text || 'N/A';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const summary = threatData?.summary || {};
  const targeting = summary?.targeting?.[0] || {};

  const aliasesList = Array.isArray(threatData?.aliases)
    ? threatData.aliases.filter(Boolean).join(', ')
    : typeof threatData?.aliases === 'string'
      ? threatData.aliases
      : Array.isArray(summary?.aliases)
        ? summary.aliases.filter(Boolean).join(', ')
        : Array.isArray(threatData?.alias_names)
          ? threatData.alias_names.filter(Boolean).join(', ')
          : '';
  const aliasDisplay = aliasesList && aliasesList.trim() !== '' ? aliasesList : 'N/A';

  const fullData = {
    date: parseDate(summary?.last_seen?.date),
    banner_text: threatData?.name || 'Unknown Threat',
    threat_type: summary?.actor_types?.[0] || 'N/A',
    threat_group: aliasDisplay,
    aliases: aliasDisplay,
    target_region: targeting?.regions?.join(', ') || 'Global',
    target_country: summary?.nexus?.map(n => n.country_or_region).join(', ') || 'Global',
    target_sector: targeting?.sectors?.join(', ') || 'General',
    severity: summary?.actor_types?.includes('RANSOMWARE_EXTORTION_ACTOR') ? 'Critical'
      : summary?.actor_types?.includes('NATION_STATE') ? 'High'
        : 'Medium',
    status: summary?.status
      ? summary.status.charAt(0).toUpperCase() + summary.status.slice(1).toLowerCase()
      : 'Unknown'
  };

  return (
    <div
      className="custom-card-intel"
      onClick={() => navigate(`/intel-card-threat-details/${threatData?.actor_id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="intel-card-top-row">
        <div className="intel-card-content">
          <div className="d-flex justify-content-between align-items-center w-100">
            <h5 className="intel-card-title text-truncate" title={fullData.banner_text}>
              {truncateText(fullData.banner_text, 24)}
            </h5>
            <div className="d-flex align-items-center gap-1 flex-shrink-0 ms-2">
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  backgroundColor: fullData.status === 'Active' ? '#ef4444' : '#94a3b8',
                  borderRadius: '50%',
                  display: 'inline-block',
                  boxShadow: fullData.status === 'Active' ? '0 0 0 2.5px rgba(239, 68, 68, 0.25)' : 'none'
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: '600', color: fullData.status === 'Active' ? '#ef4444' : '#64748b' }}>
                {fullData.status}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="d-flex flex-column gap-2 mt-2 position-relative" style={{ zIndex: 1 }}>
            {/* Alias Names */}
            <div className="d-flex align-items-center" style={{ minWidth: 0, maxWidth: 'calc(100% - 50px)' }}>
              <div className="d-flex justify-content-center align-items-center me-1 rounded-circle flex-shrink-0" style={{ width: '22px', height: '22px', backgroundColor: 'var(--intel-card-bg)', border: '1px solid var(--intel-card-badge-border, #fae8eb)', color: '#e11d48' }}>
                <PiBug size={12} />
              </div>
              <span className="text-truncate" title={`Alias Names: ${fullData.aliases}`} style={{ fontSize: '11px', color: 'var(--intel-card-desc-color)' }}>
                <span style={{ fontWeight: '600', color: 'var(--intel-card-title-color)' }}>Alias: </span>{truncateText(fullData.aliases, 25)}
              </span>
            </div>
            {/* Region */}
            <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-center align-items-center me-1 rounded-circle flex-shrink-0" style={{ width: '22px', height: '22px', backgroundColor: 'var(--intel-card-bg)', border: '1px solid var(--intel-card-badge-border, #fae8eb)', color: '#e11d48' }}>
                <ImEarth size={11} />
              </div>
              <span className="text-truncate" title={`Region: ${fullData.target_region}`} style={{ fontSize: '11px', color: 'var(--intel-card-desc-color)' }}>
                <span style={{ fontWeight: '600', color: 'var(--intel-card-title-color)' }}>Region: </span>{truncateText(fullData.target_region, 35)}
              </span>
            </div>

            {/* Domain */}
            <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
              <div className="d-flex justify-content-center align-items-center me-1 rounded-circle flex-shrink-0" style={{ width: '22px', height: '22px', backgroundColor: 'var(--intel-card-bg)', border: '1px solid var(--intel-card-badge-border, #fae8eb)', color: '#e11d48' }}>
                <PiShieldWarningDuotone size={12} />
              </div>
              <span className="text-truncate" title={`Domain: ${fullData.target_sector}`} style={{ fontSize: '11px', color: 'var(--intel-card-desc-color)' }}>
                <span style={{ fontWeight: '600', color: 'var(--intel-card-title-color)' }}>Domain: </span>{truncateText(fullData.target_sector, 35)}
              </span>
            </div>


          </div>
        </div>
      </div>

      {/* Cutout Arrow Button */}
      <div className="intel-card-cutout">
        <div className="intel-card-btn-halo">
          <div className="intel-card-btn">
            <i className="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IntelCards() {
  const { selectedView } = useOutletContext() || {};
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [threatData, setThreatData] = useState([]);
  const [page, setPage] = useState(1);

  const getThreatIntelCardListData = (pageNo = page, curationValue = selectedView) => {
    setLoading(true);
    getTheatreIntelCardsList({
      page: pageNo,
      client_name: 'CERELYN BIOPHARMA',
      curation: curationValue,
    })((response) => {
      console.log("threatIntelCards", response);
      if (response) {
        setThreatData(response);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    setPage(1);
    getThreatIntelCardListData(1, selectedView);
  }, [selectedView]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getThreatIntelCardListData(newPage, selectedView);
  };

  console.log("ThreatData", threatData);
  return (
    <>
      <div className="intelcard-cards-scroll-area px-3 w-100">
        {loading ? (
          <div className="intelcard-spinner-container d-flex justify-content-center align-items-center py-5" style={{ minHeight: '300px' }}>
            <Loader />
          </div>
        ) : threatData?.items?.length > 0 ? (
          <div className="intelcard-cards-row row g-3 mb-2">
            {threatData?.items?.map(threat => (
              <div key={threat.actor_id} className="intelcard-card-column col-12 col-xl-4 col-md-6 mb-1">
                <IntelCard threatData={threat} />
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center py-5 text-muted" style={{ minHeight: '300px' }}>
            <span className="fs-6 fw-medium">No data available</span>
          </div>
        )}
      </div>
      {threatData?.items?.length > 0 && (
        <Pagination
          currentPage={threatData?.pagination?.page || page}
          totalPages={threatData?.pagination?.total_pages || 1}
          totalItems={threatData?.pagination?.total_items || 0}
          pageSize={threatData?.pagination?.page_size || 9}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
