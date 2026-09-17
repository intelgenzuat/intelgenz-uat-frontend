import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { PiDiamondFill } from 'react-icons/pi';
import { GoFlame } from 'react-icons/go';
import cube from '../../assets/images/cube.png';
import logo from '../../assets/images/logo.jpeg';
import '../../assets/styles/threatactorprofile/threatactorprofilimg.scss';
import { getThreatActorProfiling, getThreatActorByTechniques } from '../../Context/ThreatActorprofiling';

export default function ThreatActorProfilingTable() {
  const navigate = useNavigate();
  const [techniqueId, setTechniqueId] = useState('');
  const [error, setError] = useState('');
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchWrapperRef = useRef(null);
  const client = "MERIDIAN FINANCIAL GROUP";

  const [selectedTechniques, setSelectedTechniques] = useState(() => {
    try {
      const saved = localStorage.getItem('selected_techniques');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading selected_techniques from localStorage:", e);
    }
    return [];
  });

  const [filters, setFilters] = useState({
    capability: false,
    intent: false,
    opportunity: false
  });

  const fetchThreatActorsByTechniques = (techniqueIds, clientName = client) => {
    if (!techniqueIds || (Array.isArray(techniqueIds) && techniqueIds.length === 0)) return;
    setLoading(true);
    getThreatActorByTechniques({ technique_ids: techniqueIds, client_name: clientName })((response) => {
      console.log("threatDetail", response);
      if (response) {
        setdata(response);
      }
      setLoading(false);
    });
  };

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  // Fetch suggestions when user types >= 2 characters
  useEffect(() => {
    const trimmed = techniqueId.trim();
    if (trimmed.length >= 2) {
      setSearchLoading(true);
      setShowSuggestions(true);
      const handler = setTimeout(() => {
        getThreatActorProfiling({ query: trimmed, limit: 10 })((response) => {
          console.log("profile data", response);
          let results = [];
          if (Array.isArray(response)) {
            results = response;
          } else if (Array.isArray(response?.items)) {
            results = response.items;
          } else if (Array.isArray(response?.data?.items)) {
            results = response.data.items;
          } else if (Array.isArray(response?.data)) {
            results = response.data;
          } else if (Array.isArray(response?.techniques)) {
            results = response.techniques;
          } else if (Array.isArray(response?.results)) {
            results = response.results;
          } else if (Array.isArray(response?.actors)) {
            results = response.actors;
          }
          setSuggestions(results);
          setSearchLoading(false);
        });
      }, 400);

      return () => clearTimeout(handler);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchLoading(false);
    }
  }, [techniqueId]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectTechnique = (item) => {
    const techId = item.technique_id || item.actor_id || item.id || item.name;
    const techName = item.name || item.actor_name || item.threat_name || item.technique_name || item.technique_id || '';
    const exists = selectedTechniques.some(t => t.technique_id === techId);
    let updated;
    if (exists) {
      updated = selectedTechniques.filter(t => t.technique_id !== techId);
    } else {
      updated = [...selectedTechniques, {
        technique_id: techId,
        name: techName
      }];
    }
    setSelectedTechniques(updated);
    try {
      localStorage.setItem('selected_techniques', JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving selected_techniques to localStorage:", e);
    }
    setShowSuggestions(false);
    setTechniqueId('');
  };

  const handleRemoveTechnique = (techId) => {
    const updated = selectedTechniques.filter(t => t.technique_id !== techId);
    setSelectedTechniques(updated);
    try {
      localStorage.setItem('selected_techniques', JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving selected_techniques to localStorage:", e);
    }
  };

  const handleClearAllTechniques = () => {
    setSelectedTechniques([]);
    try {
      localStorage.removeItem('selected_techniques');
    } catch (e) {
      console.error("Error removing selected_techniques from localStorage:", e);
    }
  };

  const handleSearchSubmit = () => {
    const trimmed = techniqueId.trim();
    if (!trimmed) {
      setError('Please enter a MITRE Technique ID or search query');
      return;
    }
    setError('');
    setSearchLoading(true);
    setShowSuggestions(true);
    getThreatActorProfiling({ query: trimmed, limit: 10 })((response) => {
      console.log("profile data", response);
      let results = [];
      if (Array.isArray(response)) {
        results = response;
      } else if (Array.isArray(response?.items)) {
        results = response.items;
      } else if (Array.isArray(response?.data?.items)) {
        results = response.data.items;
      } else if (Array.isArray(response?.data)) {
        results = response.data;
      } else if (Array.isArray(response?.techniques)) {
        results = response.techniques;
      } else if (Array.isArray(response?.results)) {
        results = response.results;
      } else if (Array.isArray(response?.actors)) {
        results = response.actors;
      }
      setSuggestions(results);
      setSearchLoading(false);
    });
  };

  const handleShowThreatActors = () => {
    const idsFromSelected = selectedTechniques.map(t => t.technique_id);
    if (idsFromSelected.length === 0) {
      setError('Please select at least one technique to show threat actor profiling');
      return;
    }
    setError('');
    fetchThreatActorsByTechniques(idsFromSelected, client);
  };

  console.log(data, "profile data");

  const getActorPriority = (actor) => {
    if (actor.priority) return actor.priority;
    const score = (actor.capability ? 1 : 0) + (actor.intent ? 1 : 0) + (actor.opportunity ? 1 : 0);
    if (score >= 3) return 'Critical';
    if (score === 2) return 'Medium';
    return 'Low';
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Low':
        return <span className="tap-priority-badge badge-low"><PiDiamondFill size={10} /> Low</span>;
      case 'Medium':
        return <span className="tap-priority-badge badge-medium"><PiDiamondFill size={10} /> Medium</span>;
      case 'Critical':
        return <span className="tap-priority-badge badge-critical"><GoFlame size={12} /> Critical</span>;
      default:
        return null;
    }
  };

  const renderCheckIcon = (value) => {
    if (value) {
      return (
        <div className="tap-check-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      );
    }
    return null;
  };

  const funnelIcon = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4300D2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
  );

  const filterLinesIcon = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4300D2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="6" y1="12" x2="18" y2="12"></line><line x1="8" y1="18" x2="16" y2="18"></line></svg>
  );

  const actorsList = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.actors)) return data.actors;
    if (Array.isArray(data.data?.items)) return data.data.items;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.results)) return data.results;
    return [];
  }, [data]);

  const processedActors = useMemo(() => {
    if (!actorsList || !Array.isArray(actorsList)) return [];

    const isAnyFilterActive = filters.capability || filters.intent || filters.opportunity;
    if (!isAnyFilterActive) {
      return actorsList;
    }

    return [...actorsList].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (filters.capability) {
        if (a.capability) scoreA += 1;
        if (b.capability) scoreB += 1;
      }
      if (filters.intent) {
        if (a.intent) scoreA += 1;
        if (b.intent) scoreB += 1;
      }
      if (filters.opportunity) {
        if (a.opportunity) scoreA += 1;
        if (b.opportunity) scoreB += 1;
      }

      return scoreB - scoreA;
    });
  }, [actorsList, filters]);

  return (
    <div className="threat-actor-detail-page">
      {/* Top Header Section */}
      <div className="tap-header-section">
        {/* Background Image/Abstract Graphic */}
        <div className="tap-hero-bg d-none d-md-block" style={{ backgroundImage: `url(${cube})` }}>
        </div>

        <div className="tap-header-content">
          {/* Breadcrumbs */}
          <div className="breadcrumb-nav text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
            <FiHome className="home-icon me-2" />
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
            <span className="mx-2 text-black-50">/</span>
            <span className="text-dark fw-medium">Threat Actor Profile</span>
          </div>

          {/* Title Row */}
          <div className="tap-title-row">
            <div className="shield-icon-wrapper">
              <svg width="18" height="20" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.43627 16.4528C9.72418 16.4528 9.96554 16.3555 10.1604 16.1609C10.3552 15.9661 10.4526 15.7247 10.4526 15.4368C10.4526 15.1489 10.3552 14.9075 10.1604 14.7127C9.96554 14.5179 9.72418 14.4205 9.43627 14.4205C9.14836 14.4205 8.907 14.5179 8.7122 14.7127C8.51739 14.9075 8.41999 15.1489 8.41999 15.4368C8.41999 15.7247 8.51739 15.9661 8.7122 16.1609C8.907 16.3555 9.14836 16.4528 9.43627 16.4528ZM8.49265 12.1703H10.3799V6.09741H8.49265V12.1703ZM9.43627 23.8326C6.71506 23.0905 4.4621 21.4887 2.67739 19.0273C0.892462 16.5659 0 13.8141 0 10.7718V3.53263L9.43627 0L18.8725 3.53263V10.7718C18.8725 13.8141 17.9801 16.5659 16.1952 19.0273C14.4104 21.4887 12.1575 23.0905 9.43627 23.8326Z" fill="#E9004A" />
              </svg>
            </div>
            <h4>Threat Actor Profiling</h4>
          </div>
        </div>
      </div>

      {/* View Controls Card */}
      <div className="view-controls-card flex-shrink-0 mx-4 mb-4" style={{ width: "900px" }}>
        <div className="view-controls-section d-flex flex-column align-items-stretch gap-3" style={{ width: "880px" }}>
          {/* Search bar */}
          <div className="threat-actor-search-section d-flex align-items-center justify-content-start gap-3">
            <div className="d-flex flex-column">
              <span className="fw-medium text-dark" style={{ fontSize: '14.5px' }}>
                Enter MITRE Technique IDs
              </span>
            </div>
            <div className="search-wrapper position-relative m-0" ref={searchWrapperRef}>
              <i
                className="bi bi-search position-absolute text-muted"
                style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              ></i>
              <input
                type="text"
                className="form-control rounded-pill ps-5 pe-5"
                placeholder="(T1059.001,T1059.002)"
                autoComplete="off"
                value={techniqueId}
                onChange={(e) => {
                  const val = e.target.value;
                  setTechniqueId(val);
                  if (error) setError('');
                  if (val.trim().length >= 2) {
                    setShowSuggestions(true);
                  } else {
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (techniqueId.trim().length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
              />
              <i
                className="bi bi-filter position-absolute text-muted"
                style={{ right: '16px', top: '50%', transform: 'translateY(-50%)' }}
              ></i>

              {/* Suggestions Dropdown */}
              {showSuggestions && techniqueId.trim().length >= 2 && (
                <div className="search-suggestions-dropdown">
                  {searchLoading ? (
                    <div className="suggestion-loading">
                      <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                      <span>Loading suggestions...</span>
                    </div>
                  ) : suggestions && suggestions.length > 0 ? (
                    <ul className="suggestion-list">
                      {suggestions.map((item, index) => {
                        const itemKey = item?.technique_id || item?.id || item?.actor_id || index;
                        const isSelected = selectedTechniques.some(t => t.technique_id === (item.technique_id || item.id || item.actor_id || item.name));
                        const itemName = item?.name || item?.threat_name || item?.actor_name || item?.technique_name || '';
                        const techId = item?.technique_id || item?.id || item?.actor_id || '';

                        return (
                          <li
                            key={itemKey}
                            className={`suggestion-item ${isSelected ? 'selected' : ''}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectTechnique(item);
                            }}
                          >
                            {techId && (
                              <span className="suggestion-technique-id">{String(techId)}</span>
                            )}
                            <span className="suggestion-text">{String(itemName || techId)}</span>
                            {item?.tactic && (
                              <span className="badge bg-light text-secondary text-truncate" style={{ maxWidth: '100px', fontSize: '10px' }}>
                                {String(item.tactic)}
                              </span>
                            )}
                            {isSelected && (
                              <i className="bi bi-check-circle-fill ms-auto" style={{ color: '#5200ff', fontSize: '13px', flexShrink: 0 }}></i>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="suggestion-empty">
                      <span>No MITRE Technique found</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons Row pushed to end */}
            <div className="ms-auto d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn show-btn text-white flex-shrink-0"
                style={{
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1
                }}
                onClick={handleShowThreatActors}
                disabled={loading || selectedTechniques.length === 0}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
                )}
                <span>Submit</span>
              </button>

              <button
                type="button"
                className="btn clear-all-btn flex-shrink-0"
                onClick={handleClearAllTechniques}
              >
                Clear all <i className="bi bi-x"></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="text-danger small ps-2">
              <i className="bi bi-exclamation-circle me-1"></i>
              {error}
            </div>
          )}

          {/* Threat Actors Section with Accordion */}
          <div className="threat-actors-section w-100">
            <div
              className="d-flex align-items-center justify-content-between cursor-pointer user-select-none"
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center">
                <span className="section-title">SELECTED TECHNIQUES :</span>
                <span className="selected-badge">{selectedTechniques.length} Selected</span>
              </div>

              {/* Filter checkboxes */}
              <div className="tap-filter-checkboxes d-flex align-items-center gap-3" onClick={(e) => e.stopPropagation()}>
                {[
                  { label: 'Capability' },
                  { label: 'Intent' },
                  { label: 'Opportunity' },
                ].map(({ label }) => (
                  <label key={label} className="tap-filter-label" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="tap-filter-checkbox"
                      defaultChecked={false}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="accordion-toggle-icon d-flex align-items-center gap-1 text-muted" style={{ fontSize: '13px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{isAccordionOpen ? 'Collapse' : 'Expand'}</span>
                <i className={`bi ${isAccordionOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
              </div>
            </div>

            {isAccordionOpen && (
              <div className="accordion-content mt-3">
                <div className="pills-container m-0 mt-0">
                  {selectedTechniques.map((tech, idx) => {
                    const techKey = tech.technique_id || idx;
                    const displayName = tech.technique_id;
                    return (
                      <div
                        key={techKey}
                        className="actor-pill cursor-pointer active"
                        onClick={() => handleRemoveTechnique(tech.technique_id)}
                      >
                        <div className="dot" style={{ backgroundColor: idx % 2 === 0 ? '#3b82f6' : '#5200ff' }}></div>
                        <span>{displayName}</span>
                        <i
                          className="bi bi-x chip-close-icon ms-1"
                          title="Remove threat actor"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTechnique(tech.technique_id);
                          }}
                        ></i>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="tap-table-section">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th className="th-rank">
                  <div className="header-content">{funnelIcon} Rank</div>
                </th>
                <th className="th-actor">
                  <div className="header-content">{funnelIcon} Threat Actor</div>
                </th>
                <th className="th-cap">
                  <div className="header-content">
                    <input
                      type="checkbox"
                      className="tap-header-checkbox"
                      checked={filters.capability}
                      onChange={(e) => setFilters(prev => ({ ...prev, capability: e.target.checked }))}
                    />
                    {filterLinesIcon} Capability
                  </div>
                </th>
                <th className="th-int">
                  <div className="header-content">
                    <input
                      type="checkbox"
                      className="tap-header-checkbox"
                      checked={filters.intent}
                      onChange={(e) => setFilters(prev => ({ ...prev, intent: e.target.checked }))}
                    />
                    {filterLinesIcon} Intent
                  </div>
                </th>
                <th className="th-opp">
                  <div className="header-content">
                    <input
                      type="checkbox"
                      className="tap-header-checkbox"
                      checked={filters.opportunity}
                      onChange={(e) => setFilters(prev => ({ ...prev, opportunity: e.target.checked }))}
                    />
                    {filterLinesIcon} Opportunity
                  </div>
                </th>
                <th className="th-pri">
                  <div className="header-content">{funnelIcon} Priority</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted" style={{ height: '320px', verticalAlign: 'middle' }}>
                    <div className="d-flex flex-column align-items-center justify-content-center gap-2">
                      <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}></div>
                      <span>Loading threat actors...</span>
                    </div>
                  </td>
                </tr>
              ) : processedActors.length > 0 ? (
                processedActors.map((actor, idx) => {
                  const priority = getActorPriority(actor);
                  return (
                    <tr key={actor.actor_id || idx}>
                      <td className="col-rank">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="col-actor">{actor.name}</td>
                      <td>{renderCheckIcon(actor.capability)}</td>
                      <td>{renderCheckIcon(actor.intent)}</td>
                      <td>{renderCheckIcon(actor.opportunity)}</td>
                      <td>{getPriorityBadge(priority)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted" style={{ height: '320px', verticalAlign: 'middle' }}>
                    No threat actors to display. Enter a search query above (at least 3 characters).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="tap-pagination">
          <div className="pagination-info">
            Showing {processedActors.length > 0 ? 1 : 0} to {processedActors.length} of {data?.matched_actor_count ?? processedActors.length} entries
          </div>
          <div className="pagination-buttons">
            <button className="btn-page btn-text" disabled={processedActors.length === 0}>Previous</button>
            <button className="btn-page active">1</button>
            <button className="btn-page btn-text" disabled={processedActors.length === 0}>Next</button>
          </div>
        </div>
      </div>

      {/* Custom Footer */}
      <div className="tap-custom-footer">
        <div className="footer-logo">
          <img src={logo} alt="INTELGENZ" />
        </div>
        <div className="footer-links">
          <a href="#data">Data Usage <i className="bi bi-arrow-up-right"></i></a>
          <a href="#privacy">Privacy <i className="bi bi-arrow-up-right"></i></a>
          <a href="#support">Support <i className="bi bi-arrow-up-right"></i></a>
        </div>
        <div className="footer-copyright">
          &copy; 2024 Threat all rights reserved
        </div>
      </div>
    </div>
  );
}
