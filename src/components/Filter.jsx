import React, { useState, useEffect, useRef } from 'react';
import './Filter.scss';
import { PiMaskHappyLight, PiShieldWarning, PiWarningDiamondLight } from "react-icons/pi";
import { TbWorld } from "react-icons/tb";
import { LuChevronDown, LuCheck } from "react-icons/lu";
import { useLocation } from 'react-router-dom';

const SEVERITY_OPTIONS = [
  { label: 'All Severities', value: '', color: '#94a3b8' },
  { label: 'Critical', value: 'Critical', color: '#dc2626' },
  { label: 'High', value: 'High', color: '#ef4444' },
  { label: 'Medium', value: 'Medium', color: '#f59e0b' },
  { label: 'Low', value: 'Low', color: '#10b981' },
];

export default function Filter({ selectedSeverity, onSeverityChange }) {
  const location = useLocation();
  const isEmergingThreats = location.pathname === '/emerging-threats';
  const [severity, setSeverity] = useState(selectedSeverity || '');
  const [isSeverityOpen, setIsSeverityOpen] = useState(false);
  const severityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (severityRef.current && !severityRef.current.contains(event.target)) {
        setIsSeverityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentSeverity = selectedSeverity !== undefined ? selectedSeverity : severity;

  const handleSelectSeverity = (val) => {
    setSeverity(val);
    setIsSeverityOpen(false);
    if (onSeverityChange) {
      onSeverityChange(val);
    }
  };

  const colClass = isEmergingThreats ? 'col-md-3' : 'col-md-4';

  return (
    <div className="filter-component p-3 w-100 position-relative">
      <div className="row g-0 align-items-center">

        {/* Threat Actor Name Input (Left) */}
        <div className={`${colClass} border-end pe-4 filter-section`}>
          <div className="d-flex align-items-center mb-1 text-dark gap-2">
            <PiShieldWarning className="text-secondary" style={{ strokeWidth: '0.4px' }} />
            <span style={{ fontSize: '14.4px' }}>Name</span>
          </div>
          <input
            type="text"
            className="form-control border-0 bg-transparent px-0 shadow-none text-muted"
            placeholder="Enter threat actor/malware name"
            style={{ fontSize: '14.4px', outline: 'none' }}
          />
        </div>

        {/* Region Dropdown (Center) */}
        <div className={`${colClass} border-end px-4 filter-section`}>
          <div className="d-flex justify-content-between align-items-end">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-1 text-dark gap-2">
                <TbWorld className="text-secondary" />
                <span style={{ fontSize: '14.4px' }}>Region</span>
              </div>
              <input
                type="text"
                className="form-control border-0 bg-transparent px-0 shadow-none text-muted"
                placeholder="Enter or choose"
                style={{ fontSize: '14.4px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Industry Dropdown */}
        <div className={`${colClass} ${isEmergingThreats ? 'border-end' : ''} px-4 filter-section`}>
          <div className="d-flex justify-content-between align-items-end">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-1 text-dark gap-2">
                <PiMaskHappyLight className="text-secondary" />
                <span style={{ fontSize: '14.4px' }}>Industry</span>
              </div>
              <input
                type="text"
                className="form-control border-0 bg-transparent px-0 shadow-none text-muted"
                placeholder="Enter or choose"
                style={{ fontSize: '14.4px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Severity Dropdown (Shown only on /emerging-threats page) */}
        {isEmergingThreats && (
          <div className="col-md-3 px-4 filter-section position-relative" ref={severityRef}>
            <div className="d-flex justify-content-between align-items-end">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-1 text-dark gap-2">
                  <PiWarningDiamondLight className="text-secondary" style={{ fontSize: '18px' }} />
                  <span style={{ fontSize: '14.4px' }}>Severity</span>
                </div>
                
                <div
                  className={`filter-dropdown-trigger d-flex align-items-center justify-content-between cursor-pointer ${isSeverityOpen ? 'active' : ''}`}
                  onClick={() => setIsSeverityOpen(!isSeverityOpen)}
                >
                  <span className={currentSeverity ? 'text-dark fw-medium' : 'text-muted'}>
                    {currentSeverity ? (
                      <span className="d-flex align-items-center gap-2">
                        <span
                          className="severity-dot rounded-circle d-inline-block"
                          style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor:
                              SEVERITY_OPTIONS.find((s) => s.value === currentSeverity)?.color || '#64748b'
                          }}
                        />
                        {currentSeverity}
                      </span>
                    ) : (
                      'Enter or choose'
                    )}
                  </span>
                  <LuChevronDown
                    className={`dropdown-chevron text-muted ms-2 ${isSeverityOpen ? 'rotated' : ''}`}
                    style={{ transition: 'transform 0.2s ease', fontSize: '14px' }}
                  />
                </div>
              </div>
            </div>

            {/* Custom Dropdown Menu */}
            {isSeverityOpen && (
              <div className="filter-dropdown-menu shadow-lg rounded-3 border bg-white position-absolute start-0 end-0 mx-3 mt-2 z-3 py-1">
                {SEVERITY_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className={`filter-dropdown-item px-3 py-2 d-flex align-items-center justify-content-between cursor-pointer ${(currentSeverity || '') === opt.value ? 'active' : ''}`}
                    onClick={() => handleSelectSeverity(opt.value)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="severity-dot rounded-circle d-inline-block"
                        style={{ width: '8px', height: '8px', backgroundColor: opt.color }}
                      />
                      <span className="filter-dropdown-item-label">{opt.label}</span>
                    </div>
                    {(currentSeverity || '') === opt.value && (
                      <LuCheck className="text-primary fw-bold" style={{ color: '#5200ff', fontSize: '14px' }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
