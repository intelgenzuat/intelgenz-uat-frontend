import React, { useState, useEffect, useRef } from 'react';
import '../../assets/styles/view/View.scss';
import ViewSidebar from '../../components/sidebars/ViewSidebar'
import ThreatCard from '../../components/ThreatCard';
import AllViewList from './AllViewList';
import Filter from '../../components/Filter';
import Voicechatdrawer from '../../components/Drawers/Voicechatdrawer';
import Intelegenzchatdrawer from '../../components/Drawers/Intelegenzchatdrawer';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import { LuRefreshCw, LuChevronDown, LuCheck } from 'react-icons/lu';
import { IoFilterSharp } from 'react-icons/io5';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import Topcontent from './Topcontent';
import { getThreatCard } from '../../Context/View';

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
  }
];


export default function View() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'customized');
  const [showFilter, setShowFilter] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVoicechatDrawerOpen, setIsVoicechatDrawerOpen] = useState(false);
  const { isSidebarCollapsed, toggleSidebar } = useOutletContext() || {};
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown filter state
  const [selectedType, setSelectedType] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const dropdownOptions = [
    'Threat Actor',
    'Malware',
    'Campaign',
    'Situation',
    'Trends',
    'All'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getFilteredCards = () => {
    const results = cardData?.data?.results || [];
    if (selectedType === 'All') return results;
    
    const lowerType = selectedType.toLowerCase();
    return results.filter(threat => {
      const threatType = (threat.threat_type || '').toLowerCase();
      const groupNames = (threat.threat_group_names || []).map(g => g.toLowerCase());
      const title = (threat.title || '').toLowerCase();

      if (lowerType === 'threat actor') {
        return threatType.includes('actor') || threatType.includes('insider') || (groupNames.length > 0 && !groupNames.includes('unknown') && !groupNames.includes('internal actor'));
      }
      if (lowerType === 'malware') {
        return threatType.includes('malware') || threatType.includes('ransomware');
      }
      if (lowerType === 'campaign') {
        return threatType.includes('campaign') || threatType.includes('phishing');
      }
      if (lowerType === 'situation') {
        return threatType.includes('ddos') || threatType.includes('situation') || threatType.includes('zero-day');
      }
      if (lowerType === 'trends') {
        return title.includes('campaign') || title.includes('spread') || threatType.includes('supply chain');
      }
      return true;
    });
  };

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTab === 'customized') {
      setSelectedType('All');
    }
  }, [activeTab]);

  const getThreatCardData = () => {
    setLoading(true)
    try {
      getThreatCard({})(response => {
        console.log(response, "res");
        if (response && response.status && response?.data?.data?.results) {
          setCardData(response?.data)
          setLoading(false)
        } else {
          setCardData({ data: { results: MOCK_CARDS } })
          setLoading(false)
        }
      })
    } catch (error) {
      console.error("Error calling getThreatCard API:", error);
      setCardData({ data: { results: MOCK_CARDS } })
      setLoading(false)
    }
  }
  useEffect(() => {
    getThreatCardData()
  }, [])
  console.log(cardData, "cardData");

  return (
    <div className="view-page-container container-fluid p-0 d-flex flex-column h-100 overflow-hidden">

      {/* Main Layout Wrapper */}
      <div className="d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* Sidebar container - Full height sidebar */}
        <div className="flex-shrink-0">
          <ViewSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={isSidebarCollapsed}
            toggled={!isSidebarCollapsed && window.innerWidth < 992}
            onBackdropClick={toggleSidebar}
          />
        </div>

        {/* Dashboard Main Content Wrapper - Right side column */}
        <div className="d-flex flex-column flex-grow-1 overflow-y-auto" style={{ minHeight: 0 }}>

          <Topcontent showHeliosInfo={activeTab === 'customized'}>
            <div className="list-header-actions d-flex gap-3 position-relative align-items-center">
              <button className="refresh-btn shadow-sm">
                <LuRefreshCw />
              </button>

              {/* Threat Type Category Dropdown */}
              {activeTab !== 'customized' && (
                <div className="threat-type-dropdown-wrapper position-relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`dropdown-toggle-btn shadow-sm ${isDropdownOpen ? 'active' : ''}`}
                  >
                    <span className="dropdown-selected-text">{selectedType}</span>
                    <LuChevronDown className="ms-2 dropdown-chevron" />
                  </button>
                  <div className={`dropdown-menu-custom shadow-lg ${isDropdownOpen ? 'show' : ''}`}>
                    {dropdownOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`dropdown-item-custom ${selectedType === option ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedType(option);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="dropdown-item-text">{option}</span>
                        {selectedType === option && (
                          <LuCheck className="dropdown-check-icon ms-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`filter-btn shadow-sm ${showFilter ? 'active' : ''}`}
              >
                <IoFilterSharp /> Filters
              </button>
            </div>
          </Topcontent>

          {/* MAIN SCROLLABLE CONTENT AREA */}
          <div className="view-main-content flex-grow-1 d-flex flex-column">

            {/* List Header (Fixed inside main content) */}
            <div className="list-header-wrapper">
              {/* Inline Filter Section */}
              {showFilter && (
                <div className="mt-2 animation-fade-in filter-inline-wrapper position-relative">
                  <div className="filter-triangle"></div>
                  <Filter />
                </div>
              )}
            </div>

            {/* SCROLLABLE GRID CONTAINER */}
            {activeTab === 'customized' ? (
              <div className="cards-scroll-area px-3 w-100">
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : getFilteredCards().length === 0 ? (
                  <div className="d-flex flex-column justify-content-center align-items-center py-5 w-100">
                    <div className="text-muted mb-2 fw-medium" style={{ fontSize: '15px' }}>
                      No reports found for "{selectedType}"
                    </div>
                    <button 
                      onClick={() => setSelectedType('All')}
                      className="btn btn-sm text-decoration-none fw-semibold"
                      style={{ color: '#4300d2', backgroundColor: '#f1f0fe', borderRadius: '8px', padding: '6px 16px' }}
                    >
                      Reset filter
                    </button>
                  </div>
                ) : (
                  <div className="row g-3 mb-2">
                    {getFilteredCards().map(threat => (
                      <div key={threat.id} className="col-12 col-xl-4 col-md-6 mb-1">
                        <ThreatCard cardData={threat} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <AllViewList selectedType={selectedType} />
            )}

            {/* Pagination (Fixed at bottom) */}

          </div>
          <div className="pagination-wrapper">
            <div className="pagination-container shadow-sm">
              <span className="pagination-info">01-09 of 120</span>
              <div className="pagination-controls">
                <button className="pagination-btn"><i className="bi bi-chevron-left"></i></button>
                <button className="pagination-btn active">1</button>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">2</button>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">3</button>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">4</button>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">5</button>
                <span className="pagination-ellipsis">...</span>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">20</button>
                <button className="pagination-btn"><i className="bi bi-chevron-right"></i></button>
              </div>
              <div className="pagination-page-jump">
                <span>Page</span>
                <input type="text" className="pagination-input" defaultValue="101" />
                <button className="pagination-go-btn">Go</button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Chat Drawers — individually draggable, right-edge only */}
        <FloatingChatButtons
          onVoiceChatOpen={() => setIsVoicechatDrawerOpen(true)}
          onIntelgenzOpen={() => setIsDrawerOpen(true)}
        />

        {/* Drawer components */}
        <Voicechatdrawer isOpen={isVoicechatDrawerOpen} onClose={() => setIsVoicechatDrawerOpen(false)} />
        <Intelegenzchatdrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>
    </div>
  );
}
