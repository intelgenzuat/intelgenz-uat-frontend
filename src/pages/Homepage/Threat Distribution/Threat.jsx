import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
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

const RenderDot = (props) => {
  const { cx, cy, value, index, OriginalDot, category, onHover, onLeave, onClick } = props;
  if (!value) return null;
  return (
    <g
      onMouseEnter={(e) => onHover(e, category)}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <OriginalDot cx={cx} cy={cy} value={value} index={index} />
    </g>
  );
};

export default function Threat() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const timeoutRef = useRef(null);

  const handleHover = (e, category) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (e && e.currentTarget && containerRef.current && popupRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;
      
      const popup = popupRef.current;
      popup.style.left = `${x}px`;
      popup.style.top = `${y - 12}px`;
      popup.style.display = 'flex';
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

  const handleClick = () => {
    navigate('/emerging-threats');
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
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
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
          onClick={handleClick}
        >
          view <i className="bi bi-arrow-right ms-1"></i>
        </div>
      </div>
    </div>
  );
}
