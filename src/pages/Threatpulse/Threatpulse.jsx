import React, { useState, useEffect, useRef } from 'react';
import '../../assets/styles/view/View.scss';
import ViewSidebar from '../../components/sidebars/ViewSidebar'
import ThreatCard from './ThreatCard';
import AllViewList from './AllViewList';
import Filter from '../../components/Filter';
import Voicechatdrawer from '../../components/Drawers/Voicechatdrawer';
import Intelegenzchatdrawer from '../../components/Drawers/Intelegenzchatdrawer';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import { LuRefreshCw, LuChevronDown, LuCheck } from 'react-icons/lu';
import { IoFilterSharp } from 'react-icons/io5';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import Topcontent from './Topcontent';
import { getThreatPulseList, getThreatPulseDetailedReport } from '../../Context/Threatpulse';
import Pagination from '../../components/pagination/Pagination';
import Loader from '../../components/helper/Loader';


export default function Threatpulse() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'all');
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

  // Sorting state
  const [sortBy, setSortBy] = useState('New');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  const navigate = useNavigate();

  const sortOptions = ['New', 'Older', 'Severity'];

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
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const severityRank = {
    'critical': 4,
    'high': 3,
    'medium': 2,
    'low': 1,
    'info': 0
  };

  const getFilteredCards = () => {
    const results = cardData?.items || cardData?.data?.items || cardData?.data?.results || cardData?.results || (Array.isArray(cardData?.data) ? cardData.data : Array.isArray(cardData) ? cardData : []);
    let filtered = results;

    if (selectedType !== 'All') {
      const lowerType = selectedType.toLowerCase();
      filtered = results.filter(threat => {
        const impactSection = threat?.sections?.find(s => s.type === 'impact_overview') || threat?.sections?.[0] || {};
        const threatType = (threat.threat_type || '').toLowerCase();
        const groupNames = (threat.threat_group_names || []).map(g => g.toLowerCase());
        const title = (threat.report?.title || threat.title || '').toLowerCase();
        const sectors = (impactSection?.affected_sectors || threat.industries || []).map(s => s.toLowerCase());

        if (lowerType === 'threat actor') {
          return threatType.includes('actor') || threatType.includes('insider') || (groupNames.length > 0 && !groupNames.includes('unknown') && !groupNames.includes('internal actor'));
        }
        if (lowerType === 'malware') {
          return threatType.includes('malware') || threatType.includes('ransomware') || title.includes('ransomware') || title.includes('malware');
        }
        if (lowerType === 'campaign') {
          return threatType.includes('campaign') || threatType.includes('phishing') || title.includes('campaign');
        }
        if (lowerType === 'situation') {
          return threatType.includes('ddos') || threatType.includes('situation') || threatType.includes('zero-day');
        }
        if (lowerType === 'trends') {
          return title.includes('campaign') || title.includes('spread') || threatType.includes('supply chain');
        }
        return true;
      });
    }

    return [...filtered].sort((a, b) => {
      const dateA = a.report?.activity_period?.end || a.report?.activity_period?.start || a.date || 0;
      const dateB = b.report?.activity_period?.end || b.report?.activity_period?.start || b.date || 0;
      if (sortBy === 'New') {
        return new Date(dateB) - new Date(dateA);
      }
      if (sortBy === 'Older') {
        return new Date(dateA) - new Date(dateB);
      }
      if (sortBy === 'Severity') {
        const sevA = a.sections?.[0]?.severity || a.severity_level || a.severity || '';
        const sevB = b.sections?.[0]?.severity || b.severity_level || b.severity || '';
        const rankA = severityRank[String(sevA).toLowerCase()] || 0;
        const rankB = severityRank[String(sevB).toLowerCase()] || 0;
        return rankB - rankA;
      }
      return 0;
    });
  };

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const [page, setPage] = useState(1);

  const getThreatPulseListData = (pageNo = page, viewType = activeTab) => {
    setLoading(true);
    const viewParam = viewType === 'all' ? 'all' : 'curated';
    try {
      getThreatPulseList({
        client_name: 'MERIDIAN FINANCIAL GROUP',
        page: pageNo,
        view: viewParam,
      })((response) => {
        console.log(response, "res");
        if (response) {
          setCardData(response);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error("Error calling getThreatPulseList API:", error);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getThreatPulseListData(newPage, activeTab);
  };

  useEffect(() => {
    setPage(1);
    getThreatPulseListData(1, activeTab);
  }, [activeTab]);
  console.log(cardData, "cardData");
  console.log(selectedType, "selectedType");

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
            toggleSidebar={toggleSidebar}
            toggled={!isSidebarCollapsed && window.innerWidth < 992}
            onBackdropClick={toggleSidebar}
          />
        </div>

        {/* Dashboard Main Content Wrapper - Right side column */}
        <div className="d-flex flex-column flex-grow-1 overflow-y-auto" style={{ minHeight: 0 }}>

          <Topcontent showHeliosInfo={activeTab === 'customized'}>
            <div className="list-header-actions d-flex gap-3 position-relative align-items-center">
              {/* View Mode Checkboxes: Curated / All View (1 selectable at a time) */}
              <div className="view-mode-checkboxes d-flex align-items-center gap-3 me-2">
                <div className="form-check d-flex align-items-center gap-2 mb-0">
                  <input
                    className="form-check-input mt-0 cursor-pointer"
                    type="checkbox"
                    id="curatedViewCheck"
                    checked={activeTab === 'customized'}
                    onChange={() => setActiveTab('customized')}
                  />
                  <label
                    className="form-check-label user-select-none cursor-pointer"
                    htmlFor="curatedViewCheck"
                  >
                    Curated View
                  </label>
                </div>
                <div className="form-check d-flex align-items-center gap-2 mb-0">
                  <input
                    className="form-check-input mt-0 cursor-pointer"
                    type="checkbox"
                    id="allViewCheck"
                    checked={activeTab === 'all'}
                    onChange={() => setActiveTab('all')}
                  />
                  <label
                    className="form-check-label user-select-none cursor-pointer"
                    htmlFor="allViewCheck"
                  >
                    All View
                  </label>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="threat-type-dropdown-wrapper position-relative" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className={`dropdown-toggle-btn shadow-sm ${isSortDropdownOpen ? 'active' : ''}`}
                >
                  <span className="dropdown-selected-text">Sort: {sortBy}</span>
                  <LuChevronDown className="ms-2 dropdown-chevron" />
                </button>
                <div className={`dropdown-menu-custom shadow-lg ${isSortDropdownOpen ? 'show' : ''}`}>
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`dropdown-item-custom ${sortBy === option ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy(option);
                        setIsSortDropdownOpen(false);
                      }}
                    >
                      <span className="dropdown-item-text">{option}</span>
                      {sortBy === option && (
                        <LuCheck className="dropdown-check-icon ms-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button className="refresh-btn shadow-sm" onClick={getThreatPulseListData}>
                <LuRefreshCw />
              </button>

              {/* Threat Type Category Dropdown */}
              {/* {activeTab !== 'customized' && (
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
              )} */}

              <button
                onClick={() => setShowFilter(!showFilter)}
                className={`btn btn-white border rounded-pill shadow-sm d-flex align-items-center px-3 py-1 ${showFilter ? 'active' : ''}`}
                style={{ fontSize: '13px', fontWeight: '500' }}
              >
                <IoFilterSharp className="me-2" /> Filters
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
            <div className="cards-scroll-area px-3 w-100 flex-grow-1 d-flex flex-column">
              {loading ? (
                <div className="d-flex flex-grow-1 justify-content-center align-items-center w-100" style={{ minHeight: '60vh' }}>
                  <Loader text="Loading" />
                </div>
              ) : getFilteredCards().length === 0 ? (
                <div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center py-5 w-100" style={{ minHeight: '50vh' }}>
                  <div className="text-muted mb-2 fw-medium" style={{ fontSize: '15px' }}>
                    No reports found for "{activeTab === 'customized' ? (selectedType === 'All' ? 'Curated' : selectedType) : selectedType}"
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
                    <div key={threat.report_id || threat.id} className="col-12 col-xl-4 col-md-6 mb-1">
                      <ThreatCard cardData={threat} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination (Fixed at bottom) */}
            {!loading && getFilteredCards().length > 0 && (
              <Pagination
                currentPage={cardData?.page || page}
                totalPages={cardData?.total_pages || 1}
                totalItems={cardData?.total_items || getFilteredCards().length}
                pageSize={cardData?.page_size || 6}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>

        {/* Floating Chat Button (Bottom-Right) */}
        <FloatingChatButtons
          onIntelgenzOpen={() => setIsDrawerOpen(true)}
        />

        {/* Drawer components */}
        <Voicechatdrawer
          isOpen={isVoicechatDrawerOpen}
          onClose={() => setIsVoicechatDrawerOpen(false)}
          onEnableTextChat={() => {
            setIsVoicechatDrawerOpen(false);
            setIsDrawerOpen(true);
          }}
        />
        <Intelegenzchatdrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onEnableVoiceChat={() => {
            setIsDrawerOpen(false);
            setIsVoicechatDrawerOpen(true);
          }}
        />
      </div>
    </div>
  );
}
