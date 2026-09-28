import React, { useEffect, useState, useMemo, useRef } from 'react';
import Select, { components } from 'react-select';
import { useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { PiDiamondFill } from 'react-icons/pi';
import { GoFlame } from 'react-icons/go';
import cube from '../../assets/images/cube.png';
import logo from '../../assets/images/logo.jpeg';
import '../../assets/styles/threatactorprofile/threatactorprofilimg.scss';
import { getThreatActorProfiling, getThreatActorByTechniques, getThreatActorProfilingtable } from '../../Context/ThreatActorprofiling';
import AdversaryTriageTopcontent from './AdversaryTriageTopcontent';
import toast from 'react-hot-toast';

// Custom sub-components for pill-styled search select
const CustomValueContainer = ({ children, ...props }) => (
  <components.ValueContainer {...props}>
    <i
      className="bi bi-search text-muted"
      style={{
        fontSize: "13.5px",
        marginLeft: "8px",
        marginRight: "6px",
        flexShrink: 0
      }}
    />
    {children}
  </components.ValueContainer>
);

const CustomDropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <i
      className="bi bi-filter text-muted"
      style={{
        fontSize: "15px",
        marginRight: "4px"
      }}
    />
  </components.DropdownIndicator>
);

const CustomOption = (props) => {
  const { data } = props;
  const isSelected = data.isSelected;
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center gap-2 text-truncate">
          {data.technique_id && (
            <span className="suggestion-technique-id">{String(data.technique_id)}</span>
          )}
          <span className="suggestion-text text-truncate">{String(data.technique_name || data.label)}</span>
        </div>
        <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-2">
          {data.tactic && (
            <span className="badge bg-light text-secondary text-truncate" style={{ maxWidth: '100px', fontSize: '10px' }}>
              {String(data.tactic)}
            </span>
          )}
          {isSelected && (
            <i className="bi bi-check-circle-fill" style={{ color: '#5200ff', fontSize: '13px' }}></i>
          )}
        </div>
      </div>
    </components.Option>
  );
};

export default function ThreatActorProfilingTable() {
  const navigate = useNavigate();
  const [techniqueId, setTechniqueId] = useState('');
  const [error, setError] = useState('');
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchWrapperRef = useRef(null);
  const [tabledata, setTableData] = useState([]);
  const client = "MERIDIAN FINANCIAL GROUP";
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

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
    capability: true,
    intent: true,
    opportunity: true
  });

  const getThreatActorProfilingtableData = (clientName = client, filtersOverride = filters) => {
    setLoading(true);
    getThreatActorProfilingtable({
      client_name: clientName,
      capability: filtersOverride?.capability,
      intent: filtersOverride?.intent,
      opportunity: filtersOverride?.opportunity
    })((response) => {
      console.log("ThreatActorProfilingtable", response);
      if (response) {
        // Normalize the response into a flat array
        let actors = [];
        if (Array.isArray(response)) actors = response;
        else if (Array.isArray(response?.actors)) actors = response.actors;
        else if (Array.isArray(response?.items)) actors = response.items;
        else if (Array.isArray(response?.data?.items)) actors = response.data.items;
        else if (Array.isArray(response?.data)) actors = response.data;
        else if (Array.isArray(response?.results)) actors = response.results;
        setTableData(actors);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    // If techniques were saved in localStorage, use the by-techniques API on load;
    // otherwise fall back to the default by-assessment table
    if (selectedTechniques.length > 0) {
      const ids = selectedTechniques.map(t => t.technique_id);
      fetchThreatActorsByTechniques(ids, client, filters);
    } else {
      getThreatActorProfilingtableData(client, filters);
    }
  }, []);
  console.log(tabledata, 'tabledata')

  // filtersOverride lets callers pass the latest filter values before React state has updated
  // setLoadingFn controls which loading state to update (table spinner vs submit button)
  const fetchThreatActorsByTechniques = (techniqueIds, clientName = client, filtersOverride = filters, setLoadingFn = setLoading) => {
    if (!techniqueIds || (Array.isArray(techniqueIds) && techniqueIds.length === 0)) return;
    setLoadingFn(true);
    getThreatActorByTechniques({
      technique_ids: techniqueIds,
      client_name: clientName,
      capability: filtersOverride?.capability,
      intent: filtersOverride?.intent,
      opportunity: filtersOverride?.opportunity,
    })((response) => {
      console.log("threatDetail", response);
      if (response) {
        setdata(response);
      }
      setLoadingFn(false);
    });
  };

  // Central decision: use by-techniques API when techniques are selected, else fall back to by-assessment
  const refreshTable = (updatedTechniques = selectedTechniques, updatedFilters = filters) => {
    if (updatedTechniques.length > 0) {
      const ids = updatedTechniques.map(t => t.technique_id);
      fetchThreatActorsByTechniques(ids, client, updatedFilters);
    } else {
      // No techniques selected — reset to the initial assessment table
      setdata(null);
      getThreatActorProfilingtableData(client, updatedFilters);
    }
  };

  // Called by each checkbox — updates filters state and immediately re-fetches with correct API
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    refreshTable(selectedTechniques, updatedFilters);
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
      if (selectedTechniques.length >= 10) {
        toast.error('You can select a maximum of 10 techniques.');
        setShowSuggestions(false);
        setTechniqueId('');
        return;
      }
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
    // Switch API based on remaining techniques
    refreshTable(updated, filters);
  };

  const handleClearAllTechniques = () => {
    setSelectedTechniques([]);
    setdata(null);
    try {
      localStorage.removeItem('selected_techniques');
    } catch (e) {
      console.error("Error removing selected_techniques from localStorage:", e);
    }
    // No techniques left — fall back to assessment table
    getThreatActorProfilingtableData(client, filters);
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
    // Use submitLoading so only the Submit button shows a spinner
    fetchThreatActorsByTechniques(idsFromSelected, client, filters, setSubmitLoading);
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

  // Actors from techniques search (submitted via the search bar)
  const actorsList = useMemo(() => {
    if (!data) return null;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.actors)) return data.actors;
    if (Array.isArray(data.data?.items)) return data.data.items;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.results)) return data.results;
    return null;
  }, [data]);

  // Use techniques-search result when available, otherwise fall back to initial table data
  const baseActors = actorsList ?? tabledata;

  const processedActors = useMemo(() => {
    if (!baseActors || !Array.isArray(baseActors)) return [];

    const isAnyFilterActive = filters.capability || filters.intent || filters.opportunity;
    if (!isAnyFilterActive) {
      return baseActors;
    }

    return [...baseActors].sort((a, b) => {
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
  }, [baseActors, filters]);

  // Reset to page 1 whenever the filtered list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [processedActors]);

  const totalPages = Math.max(1, Math.ceil(processedActors.length / ITEMS_PER_PAGE));
  const paginatedActors = processedActors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const startEntry = processedActors.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endEntry = Math.min(currentPage * ITEMS_PER_PAGE, processedActors.length);

  const selectOptions = useMemo(() => {
    return (suggestions || [])
      .filter((item) => {
        const itemName = item?.name || item?.threat_name || item?.actor_name || item?.technique_name || '';
        const techId = item?.technique_id || item?.id || item?.actor_id || '';
        const isAlreadySelected = selectedTechniques.some(
          t => (techId && t.technique_id === techId) || (itemName && t.name && t.name.toLowerCase() === itemName.toLowerCase())
        );
        return !isAlreadySelected;
      })
      .map((item, index) => {
        const itemKey = item?.technique_id || item?.id || item?.actor_id || index;
        const itemName = item?.name || item?.threat_name || item?.actor_name || item?.technique_name || '';
        const techId = item?.technique_id || item?.id || item?.actor_id || '';
        return {
          value: itemKey,
          label: String(techId ? `${techId} - ${itemName}` : itemName),
          technique_id: techId,
          technique_name: itemName,
          tactic: item?.tactic,
          rawItem: item
        };
      });
  }, [suggestions, selectedTechniques]);

  const reactSelectStyles = useMemo(() => ({
    container: (base) => ({
      ...base,
      width: '320px',
      minWidth: '320px',
      maxWidth: '320px'
    }),
    control: (base, state) => ({
      ...base,
      height: '38px',
      minHeight: '38px',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      fontSize: '13.5px',
      borderColor: state.isFocused ? '#cbd5e1' : '#e2e8f0',
      boxShadow: 'none',
      borderRadius: '50px',
      backgroundColor: '#f8fafc',
      paddingLeft: '4px',
      paddingRight: '6px',
      cursor: 'text',
      transition: 'all 0.2s ease',
      '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
    }),
    valueContainer: (base) => ({
      ...base,
      height: '38px',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      overflowY: 'hidden',
      padding: '0 4px',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      '&::-webkit-scrollbar': { display: 'none' }
    }),
    input: (base) => ({
      ...base,
      color: '#1e293b',
      margin: 0,
      padding: 0
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '38px',
      flexShrink: 0
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: '0 6px',
      color: '#64748b',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      '&:hover': { color: '#334155' }
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '0 4px',
      color: '#94a3b8',
      cursor: 'pointer',
      '&:hover': { color: '#64748b' }
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (base) => ({
      ...base,
      borderRadius: '12px',
      zIndex: 1050,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginTop: '6px',
      width: '320px',
      backgroundColor: '#ffffff'
    }),
    menuList: (base) => ({
      ...base,
      padding: '6px',
      maxHeight: '260px'
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: '8px',
      padding: '8px 12px',
      fontSize: '13.5px',
      backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f1f5f9' : 'transparent',
      color: state.isSelected ? '#1d4ed8' : '#334155',
      fontWeight: 500,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '&:active': { backgroundColor: '#e2e8f0' }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#94a3b8',
      fontSize: '13.5px',
      fontWeight: 400,
      whiteSpace: 'nowrap'
    }),
    loadingMessage: (base) => ({
      ...base,
      fontSize: '13px',
      color: '#64748b',
      padding: '12px 16px'
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: '13px',
      color: '#64748b',
      padding: '12px 16px'
    })
  }), []);

  return (
    <div className="threat-actor-detail-page">
      {/* Top Header Section */}
      <AdversaryTriageTopcontent>
        <div className="search-wrapper position-relative m-0" ref={searchWrapperRef}>
          <Select
            inputId="technique-select"
            options={selectOptions}
            value={null}
            inputValue={techniqueId}
            onInputChange={(val, { action }) => {
              if (action === 'input-change') {
                setTechniqueId(val);
              }
            }}
            onChange={(selected) => {
              if (selected?.rawItem) {
                handleSelectTechnique(selected.rawItem);
              }
            }}
            isLoading={searchLoading}
            placeholder="Enter MITRE Technique IDs (T1059.001,T1059.002)"
            isSearchable
            styles={reactSelectStyles}
            components={{
              ValueContainer: CustomValueContainer,
              DropdownIndicator: CustomDropdownIndicator,
              IndicatorSeparator: () => null,
              Option: CustomOption
            }}
            noOptionsMessage={() =>
              techniqueId.trim().length < 2
                ? 'Type at least 2 characters to search...'
                : searchLoading
                ? 'Searching...'
                : 'No MITRE Technique found'
            }
            className="malware-react-select"
            classNamePrefix="malware-rs"
          />
        </div>
      </AdversaryTriageTopcontent>

      {/* View Controls Card */}
      <div className="view-controls-card flex-shrink-0 mx-4 mb-4">
        <div className="view-controls-section d-flex flex-column align-items-stretch gap-3">
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

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn show-btn text-white flex-shrink-0"
                  style={{
                    cursor: submitLoading ? 'not-allowed' : 'pointer',
                    opacity: submitLoading ? 0.75 : 1
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowThreatActors();
                  }}
                  disabled={submitLoading || selectedTechniques.length === 0}
                >
                  {submitLoading && (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
                  )}
                  <span>Submit</span>
                </button>

                <button
                  type="button"
                  className="btn clear-all-btn flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearAllTechniques();
                  }}
                >
                  Clear all <i className="bi bi-x"></i>
                </button>

                <div className="accordion-toggle-icon d-flex align-items-center text-muted" style={{ fontSize: '16px' }}>
                  <i className={`bi ${isAccordionOpen ? 'bi-dash' : 'bi-plus'}`}></i>
                </div>
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
                      onChange={(e) => handleFilterChange('capability', e.target.checked)}
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
                      onChange={(e) => handleFilterChange('intent', e.target.checked)}
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
                      onChange={(e) => handleFilterChange('opportunity', e.target.checked)}
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
              ) : paginatedActors.length > 0 ? (
                paginatedActors.map((actor, idx) => {
                  const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
                  const priority = getActorPriority(actor);
                  return (
                    <tr key={actor.actor_id || globalIdx}>
                      <td className="col-rank">{String(globalIdx + 1).padStart(2, '0')}</td>
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
                    No threat actors to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="tap-pagination">
          <div className="pagination-info">
            Showing {startEntry} to {endEntry} of {processedActors.length} entries
          </div>
          <div className="pagination-buttons">
            <button
              className="btn-page btn-text"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`btn-page ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="btn-page btn-text"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
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
