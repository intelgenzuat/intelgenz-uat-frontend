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

export default function IntelCardPage() {
  const location = useLocation();
  const [showFilter, setShowFilter] = useState(false);
  const [selectedView, setSelectedView] = useState('curated'); // 'curated' | 'all'
  const [selectedDateFilter, setSelectedDateFilter] = useState('30 Days');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  const dateOptions = ['7 Days', '30 Days', '90 Days', 'All'];

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

  return (
    <div className="intelcard-page-container container-fluid p-0 d-flex flex-column h-100 overflow-hidden">

      {/* Main Layout Wrapper */}
      <div className="intelcard-layout-wrapper d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* Sidebar container - Full height sidebar */}
        <div className="intelcard-sidebar-container flex-shrink-0">
          <Intelcardsidebar
            collapsed={isSidebarCollapsed}
            toggled={!isSidebarCollapsed && window.innerWidth < 992}
            onBackdropClick={toggleSidebar}
          />
        </div>

        {/* Dashboard Main Content Wrapper - Right side column */}
        <div className="intelcard-dashboard-wrapper d-flex flex-column flex-grow-1 overflow-y-auto" style={{ minHeight: 0 }}>

          <IntelTopcontent showHeliosInfo={location.pathname === '/intel-card'}>
            <div className="intelcard-list-header-actions d-flex gap-3 position-relative align-items-center">

              {/* Checkboxes: Curated view & All view (one selectable at a time, left of filter button) */}
              <div className="intelcard-view-checkboxes d-flex align-items-center gap-3">
                <label className="intelcard-checkbox-item d-flex align-items-center gap-2 mb-0" htmlFor="curatedViewCheckbox">
                  <input
                    type="checkbox"
                    id="curatedViewCheckbox"
                    className="intelcard-custom-checkbox"
                    checked={selectedView === 'curated'}
                    onChange={() => setSelectedView('curated')}
                  />
                  <span className="intelcard-checkbox-label">Curated view</span>
                </label>

                <label className="intelcard-checkbox-item d-flex align-items-center gap-2 mb-0" htmlFor="allViewCheckbox">
                  <input
                    type="checkbox"
                    id="allViewCheckbox"
                    className="intelcard-custom-checkbox"
                    checked={selectedView === 'all'}
                    onChange={() => setSelectedView('all')}
                  />
                  <span className="intelcard-checkbox-label">All view</span>
                </label>
              </div>

              {/* Date Filter Dropdown */}
              <div className="intelcard-date-dropdown-wrapper position-relative" ref={dateDropdownRef}>
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
              </div>

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

          {/* MAIN SCROLLABLE CONTENT AREA */}
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
            <Outlet context={{ selectedView, setSelectedView, isCuratedView: selectedView === 'curated', isAllView: selectedView === 'all', selectedDateFilter, setSelectedDateFilter }} />

            {/* Pagination (Fixed at bottom) */}

          </div>
          <div className="intelcard-pagination-wrapper">
            <div className="intelcard-pagination-container shadow-sm">
              <span className="intelcard-pagination-info">01-09 of 120</span>
              <div className="intelcard-pagination-controls">
                <button className="intelcard-pagination-btn"><i className="bi bi-chevron-left"></i></button>
                <button className="intelcard-pagination-btn active">1</button>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">2</button>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">3</button>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">4</button>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">5</button>
                <span className="intelcard-pagination-ellipsis">...</span>
                <button className="btn btn-sm btn-light bg-transparent border-0 text-secondary">20</button>
                <button className="intelcard-pagination-btn"><i className="bi bi-chevron-right"></i></button>
              </div>
              <div className="intelcard-pagination-page-jump">
                <span>Page</span>
                <input type="text" className="intelcard-pagination-input" defaultValue="101" />
                <button className="intelcard-pagination-go-btn">Go</button>
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
