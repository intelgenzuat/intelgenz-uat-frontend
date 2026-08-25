import React, { useState, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CustomDotAround, CustomDotAway, CustomDotGlobal, renderRadarBackground } from '../../../Helpers/RadarHelpers';

const threatActorsData = [
  { subject: '01', A: 60, B: 110, C: 140, fullMark: 150 },
  { subject: '02', A: 0, B: 120, C: 130, fullMark: 150 },
  { subject: '03', A: 50, B: 90, C: 115, fullMark: 150 },
  { subject: '04', A: 0, B: 80, C: 0, fullMark: 150 },
  { subject: '05', A: 60, B: 0, C: 0, fullMark: 150 },
  { subject: '06', A: 0, B: 0, C: 0, fullMark: 150 },
  { subject: '07', A: 0, B: 0, C: 0, fullMark: 150 },
  { subject: '08', A: 0, B: 0, C: 0, fullMark: 150 },
  { subject: '09', A: 70, B: 110, C: 130, fullMark: 150 },
  { subject: '10', A: 50, B: 100, C: 130, fullMark: 150 },
];

// Threat actor name mappings per data point index and category
const threatActorNames = {
  'Around You': {
    0: 'DarkLock',
    2: 'Shadow Team',
    4: 'PhishNet',
    8: 'StormBreak',
    9: 'AppTrap',
  },
  'Away': {
    0: 'Lazarus Group',
    1: 'APT28',
    2: 'Cobalt Group',
    3: 'Turla',
    8: 'FIN7',
    9: 'APT41',
  },
  'Global': {
    0: 'Sandworm',
    1: 'Kimsuky',
    2: 'Gh0stBins',
    8: 'Charming Kitten',
    9: 'Mustang Panda',
  },
};

const RenderDot = (props) => {
  const { cx, cy, value, index, OriginalDot, category, onHover, onLeave, onClick } = props;
  if (!value) return null;
  return (
    <g
      onMouseEnter={(e) => onHover(e, category, index)}
      onMouseLeave={onLeave}
      onClick={() => onClick(category, index)}
      style={{ cursor: 'pointer' }}
    >
      <OriginalDot cx={cx} cy={cy} value={value} index={index} />
    </g>
  );
};

export default function Threat() {
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const timeoutRef = useRef(null);
  const hoveredNameRef = useRef('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const getThreatActorName = (category, index) => {
    return threatActorNames[category]?.[index] || 'Unknown Actor';
  };

  const handleHover = (e, category, index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const name = getThreatActorName(category, index);
    hoveredNameRef.current = name;

    if (e && e.currentTarget && containerRef.current && popupRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      
      const popup = popupRef.current;
      popup.style.left = `${x}px`;
      popup.style.top = `${y - 12}px`;
      popup.style.display = 'flex';
      popup.textContent = name;
    }
  };

  const handleLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (popupRef.current) {
        popupRef.current.style.display = 'none';
      }
    }, 100);
  };

  const handlePopupMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  };

  const handleClick = (category, index) => {
    const name = getThreatActorName(category, index);
    const dataPoint = threatActorsData[index];
    setModalData({
      name,
      category,
      index: dataPoint?.subject || index,
      value: dataPoint?.[category === 'Around You' ? 'A' : category === 'Away' ? 'B' : 'C'] || 0,
    });
    setShowModal(true);
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  };

  const handlePopupClick = () => {
    if (hoveredNameRef.current && modalData) {
      setShowModal(true);
    } else if (hoveredNameRef.current) {
      setModalData({ name: hoveredNameRef.current, category: '', index: '', value: 0 });
      setShowModal(true);
    }
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  };

  return (
    <div className="custom-card shadow-hover h-100">
      <div className="d-flex justify-content-between align-items-center">
        <div className="chart-title">Threat Actors</div>
        <button className="expand-btn"><i className="bi bi-arrows-angle-expand"></i></button>
      </div>
      <div className="radar-chart-container" ref={containerRef}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={threatActorsData}>
            <PolarGrid gridType="circle" stroke="#e2e8f0" />
            <PolarRadiusAxis angle={30} domain={[0, 150]} ticks={[37.5, 75, 150]} tick={false} axisLine={false} />
            <Radar
              name="Around You"
              dataKey="A"
              stroke="none"
              fill="none"
              dot={
                <RenderDot
                  OriginalDot={CustomDotAround}
                  category="Around You"
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onClick={handleClick}
                />
              }
              activeDot={false}
              isAnimationActive={false}
            />
            <Radar
              name="Away"
              dataKey="B"
              stroke="none"
              fill="none"
              dot={
                <RenderDot
                  OriginalDot={CustomDotAway}
                  category="Away"
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onClick={handleClick}
                />
              }
              activeDot={false}
              isAnimationActive={false}
            />
            <Radar
              name="Global"
              dataKey="C"
              stroke="none"
              fill="none"
              dot={
                <RenderDot
                  OriginalDot={CustomDotGlobal}
                  category="Global"
                  onHover={handleHover}
                  onLeave={handleLeave}
                  onClick={handleClick}
                />
              }
              activeDot={false}
              isAnimationActive={false}
            />
            <g>{renderRadarBackground()}</g>
          </RadarChart>
        </ResponsiveContainer>
        <div
          ref={popupRef}
          className="radar-tooltip-popup"
          style={{
            display: 'none',
          }}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          onClick={handlePopupClick}
        >
          Threat Actor
        </div>
      </div>

      {/* Threat Actor Details Modal */}
      {showModal && (
        <div className="radar-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="radar-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="radar-modal-header">
              <h5 className="radar-modal-title">
                <i className="bi bi-person-badge me-2"></i>
                Threat Actor Details
              </h5>
              <button className="radar-modal-close" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="radar-modal-body">
              {modalData && (
                <>
                  <div className="radar-modal-info-row">
                    <span className="radar-modal-label">Name</span>
                    <span className="radar-modal-value highlight">{modalData.name}</span>
                  </div>
                  <div className="radar-modal-info-row">
                    <span className="radar-modal-label">Category</span>
                    <span className="radar-modal-value">
                      <span className={`radar-modal-badge ${modalData.category === 'Around You' ? 'badge-around' : modalData.category === 'Away' ? 'badge-away' : 'badge-global'}`}>
                        {modalData.category}
                      </span>
                    </span>
                  </div>
                  <div className="radar-modal-info-row">
                    <span className="radar-modal-label">Sector</span>
                    <span className="radar-modal-value">{modalData.index}</span>
                  </div>
                  <div className="radar-modal-info-row">
                    <span className="radar-modal-label">Threat Level</span>
                    <span className="radar-modal-value">
                      <div className="radar-modal-threat-bar">
                        <div
                          className="radar-modal-threat-fill"
                          style={{ width: `${(modalData.value / 150) * 100}%` }}
                        ></div>
                      </div>
                      <span className="radar-modal-threat-value">{modalData.value}/150</span>
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
