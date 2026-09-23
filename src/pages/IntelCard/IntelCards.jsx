import React, { useState, useEffect } from 'react';
import { getThreatCard } from '../../Context/View';
import '../../assets/styles/Intelcard/intelcard.scss';
import { FiArrowRight } from 'react-icons/fi';
import { ImEarth } from 'react-icons/im';
import { PiBug, PiShieldWarningDuotone } from 'react-icons/pi';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getTheatreIntelCardsList } from '../../Context/Intelcard';
import Pagination from '../../components/pagination/Pagination';
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

  // Map backend keys to component expectations with fallbacks
  const summary = threatData?.summary || {};
  const targeting = summary?.targeting?.[0] || {};

  const data = {
    date: parseDate(summary?.last_seen?.date),
    banner_text: threatData?.name || 'Unknown Threat',
    threat_type: summary?.actor_types?.[0] || 'N/A',
    threat_group: summary?.actor_types?.join(', ') || 'Unknown',
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
        {/* Top Header with Active Indicator */}
        <div className="d-flex justify-content-end align-items-center mb-2 px-1 position-relative gap-1" style={{ zIndex: 1 }}>
          <div className="d-flex align-items-center gap-1">

          </div>

          <span
            style={{
              width: '7px',
              height: '7px',
              backgroundColor: data.status === 'Active' ? '#ef4444' : '#94a3b8',
              borderRadius: '50%',
              display: 'inline-block',
              boxShadow: data.status === 'Active' ? '0 0 0 2.5px rgba(239, 68, 68, 0.25)' : 'none'
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: '600', color: data.status === 'Active' ? '#ef4444' : '#64748b' }}>
            {data.status}
          </span>
        </div>

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
            onClick={() => navigate(`/intel-card-threat-details/${threatData?.actor_id}`)}
            className="btn rounded-pill text-white px-4 py-1 d-flex align-items-center position-relative"
            style={{ background: "linear-gradient(90deg, #4c0a829c 0%, #95051e85 50%, #e60026bb 100%)", fontSize: '12px', fontWeight: '500', transition: 'background-color 0.2s', border: 'none', zIndex: 2 }}

          >
            <FiArrowRight className="me-2" style={{ strokeWidth: '2.5px', fontSize: '14px' }} /> View Report
          </button>

          {/* Watermark Logo */}
          <img
            src={logoonly}
            alt="logo"
            className="position-absolute end-0"
            style={{ width: '40px', height: '40px', objectFit: 'contain', zIndex: 2 }}
          />
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
            <div className="intelcard-spinner-border spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
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
