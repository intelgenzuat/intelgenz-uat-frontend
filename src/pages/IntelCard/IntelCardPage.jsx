import React, { useState, useRef, useEffect } from 'react';
import '../../assets/styles/Intelcard/intelcardpage.scss';
import Intelcardsidebar from '../../components/sidebars/Intelcardsidebar';
import Filter from '../../components/Filter';
import Voicechatdrawer from '../../components/Drawers/Voicechatdrawer';
import Intelegenzchatdrawer from '../../components/Drawers/Intelegenzchatdrawer';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import { IoFilterSharp } from 'react-icons/io5';
import { useLocation, useOutletContext, Outlet } from 'react-router-dom';
import IntelTopcontent from './IntelTopcontent';
import Select from 'react-select';

export default function IntelCardPage() {
  const location = useLocation();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedView, setSelectedView] = useState({ value: 'Priority Actor', label: 'Priority Actor' });
  const [selectedDateFilter, setSelectedDateFilter] = useState('30 Days');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  const dateOptions = ['7 Days', '30 Days', '90 Days', 'All'];

  const curatedViewOptions = [
    { value: 'Priority Actor', label: 'Priority Actor' },
    { value: 'Relevant Actor', label: 'Relevant Actor' },
    { value: 'Watch Actor',    label: 'Watch Actor' },
    { value: 'Low Relevance',  label: 'Low Relevance' },
    { value: 'All View',       label: 'All View' },
  ];

  const curatedSelectStyles = {
    container: (base) => ({ ...base, width: '160px' }),
    control: (base, state) => ({
      ...base,
      borderRadius: '50px',
      border: '1px solid #dee2e6',
      boxShadow: state.isFocused ? '0 0 0 0.15rem rgba(13,110,253,.2)' : '0 .125rem .25rem rgba(0,0,0,.075)',
      fontSize: '13px',
      fontWeight: '500',
      minHeight: '32px',
      height: '32px',
      cursor: 'pointer',
      backgroundColor: '#fff',
      '&:hover': { borderColor: '#adb5bd' },
    }),
    valueContainer: (base) => ({ ...base, padding: '0 10px' }),
    singleValue: (base) => ({ ...base, color: '#212529' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({ ...base, padding: '0 6px', color: '#6c757d' }),
    menu: (base) => ({ ...base, width: '160px', borderRadius: '12px', fontSize: '13px', zIndex: 9999, overflow: 'hidden' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#e7f1ff' : state.isFocused ? '#f8f9fa' : '#fff',
      color: state.isSelected ? '#0d6efd' : '#212529',
      fontWeight: state.isSelected ? '600' : '400',
      cursor: 'pointer',
    }),
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVoicechatDrawerOpen, setIsVoicechatDrawerOpen] = useState(false);
  const { isSidebarCollapsed, toggleSidebar } = useOutletContext() || {};

  const isKnowledgeGraph = location.pathname === '/view-knowlegde-graph';

  return (
    <div className="intelcard-page-container container-fluid p-0 d-flex flex-column h-100 overflow-hidden">

      {/* Main Layout Wrapper */}
      <div className="intelcard-layout-wrapper d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* Sidebar container - Full height sidebar */}
        <div className="intelcard-sidebar-container flex-shrink-0 h-100 overflow-hidden">
          <Intelcardsidebar
            collapsed={isSidebarCollapsed}
            toggled={!isSidebarCollapsed && window.innerWidth < 992}
            onBackdropClick={toggleSidebar}
          />
        </div>

        {/* Dashboard Main Content Wrapper - Right side column */}
        <div className="intelcard-dashboard-wrapper d-flex flex-column flex-grow-1 overflow-y-auto" style={{ minHeight: 0 }}>

          {!isKnowledgeGraph && (
            <IntelTopcontent showHeliosInfo={location.pathname === '/intel-card'}>
              <div className="intelcard-list-header-actions d-flex gap-3 position-relative align-items-center">

                {/* Curated View — react-select */}
                <Select
                  options={curatedViewOptions}
                  value={selectedView}
                  onChange={(opt) => setSelectedView(opt)}
                  styles={curatedSelectStyles}
                  isSearchable={false}
                  placeholder="Curated View"
                  menuPlacement="auto"
                />

                {/* Date Filter Dropdown */}
                {/* <div className="intelcard-date-dropdown-wrapper position-relative" ref={dateDropdownRef}>
                  <div
                    className="d-flex align-items-center bg-white border rounded-pill px-3 py-1 shadow-sm user-select-none"
                    style={{ cursor: 'pointer', fontSize: '13px' }}
                    onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                  >
                    <span className="me-2 text-dark fw-medium">{selectedDateFilter}</span>
                    <div className="d-flex flex-column ms-1 text-muted">
                      <i className="bi bi-chevron-up" style={{ fontSize: '9px', lineHeight: '1' }}></i>
                      <i className="bi bi-chevron-down" style={{ fontSize: '9px', lineHeight: '1' }}></i>
                    </div>
                  </div>

                  {isDateDropdownOpen && (
                    <div className="intelcard-date-dropdown-menu position-absolute bg-white shadow rounded-3 border py-1 mt-1 z-3">
                      {dateOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`intelcard-date-dropdown-item w-100 text-start border-0 bg-transparent px-3 py-2 d-flex align-items-center justify-content-between ${
                            selectedDateFilter === option ? 'active' : ''
                          }`}
                          onClick={() => {
                            setSelectedDateFilter(option);
                            setIsDateDropdownOpen(false);
                          }}
                        >
                          <span className="intelcard-date-dropdown-text">{option}</span>
                          {selectedDateFilter === option && (
                            <i className="bi bi-check2 text-primary fw-bold ms-2"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div> */}

                {/* Filters Button */}
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`btn btn-white border rounded-pill shadow-sm d-flex align-items-center px-3 py-1 ${showFilter ? 'active' : ''}`}
                  style={{ fontSize: '13px', fontWeight: '500' }}
                >
                  <IoFilterSharp className="me-2" /> Filters
                </button>
              </div>
            </IntelTopcontent>
          )}

          {/* MAIN SCROLLABLE CONTENT AREA */}
          {isKnowledgeGraph ? (
            <Outlet />
          ) : (
            <div className="intelcard-main-content flex-grow-1 d-flex flex-column">

              {/* List Header (Fixed inside main content) */}
              <div className="intelcard-list-header-wrapper">
                {/* Inline Filter Section */}
                {showFilter && (
                  <div className="mt-2 animation-fade-in intelcard-filter-inline-wrapper position-relative">
                    <div className="intelcard-filter-triangle"></div>
                    <Filter />
                  </div>
                )}
              </div>

              {/* SCROLLABLE GRID CONTAINER */}
              <Outlet context={{ selectedView: selectedView?.value, setSelectedView, selectedDateFilter, setSelectedDateFilter }} />

            </div>
          )}
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
