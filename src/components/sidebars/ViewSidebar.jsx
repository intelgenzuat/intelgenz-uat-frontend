import React from 'react';
import './ViewSidebar.scss';
import { FiChevronRight, FiHeadphones, FiStar } from 'react-icons/fi';
import { BsShieldFillExclamation } from 'react-icons/bs';
import { MdCrisisAlert } from 'react-icons/md';
import { Sidebar } from 'react-pro-sidebar';

export default function ViewSidebar({ activeTab = 'customized', setActiveTab, collapsed }) {
  return (
    <Sidebar
      collapsed={collapsed}
      className="view-sidebar border-end"
      width="270px"
      collapsedWidth="80px"
      rootStyles={{ borderColor: 'var(--bs-border-color)' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', overflow: 'hidden' }}>
        <div className="sidebar-group">
          <h6 className="sidebar-heading px-3 pt-2 mb-4 d-flex align-items-center" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <BsShieldFillExclamation className="icon-shield text-danger me-2 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="text-dark" style={{ fontSize: '15.2px' }}>
                  Emerging Threats
                </span>
                <i className="bi bi-chevron-up ms-auto text-muted" style={{ fontSize: '12px' }}></i>
              </>
            )}
          </h6>

          <ul className="sidebar-nav list-unstyled mb-0 px-2">
            <li
              className={`nav-item d-flex align-items-center mb-2 px-3 py-2 rounded-3 ${activeTab === 'customized' ? 'active' : ''}`}
              onClick={() => setActiveTab && setActiveTab('customized')}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap', justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? '0' : undefined, paddingRight: collapsed ? '0' : undefined }}
            >
              <div className="icon-wrapper d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={activeTab === 'customized' ? { width: '28px', height: '28px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { width: '28px', height: '28px', backgroundColor: 'transparent', borderRadius: '50%' }}>
                <MdCrisisAlert className="text-danger" style={{ fontSize: '16px' }} />
              </div>
              {!collapsed && <span className={`  ${activeTab === 'customized' ? 'text-dark' : 'text-secondary'}`} style={{ fontSize: '15px', fontWeight: 500 }}>Curated View</span>}
            </li>

            <li
              className={`nav-item d-flex align-items-center px-3 py-2 rounded-3 ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab && setActiveTab('all')}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap', justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? '0' : undefined, paddingRight: collapsed ? '0' : undefined }}
            >
              <div className="icon-wrapper d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={activeTab === 'all' ? { width: '28px', height: '28px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { width: '28px', height: '28px', backgroundColor: 'transparent', borderRadius: '50%' }}>
                <FiStar className="text-danger" style={{ fontSize: '16px' }} />
              </div>
              {!collapsed && <span className={` ${activeTab === 'all' ? 'text-dark' : 'text-secondary'}`} style={{ fontSize: '15px', fontWeight: 500 }}>All View</span>}
            </li>
          </ul>
        </div>

        {!collapsed ? (
          <div className="sidebar-support p-3 rounded-4 mx-4 mb-1" style={{ backgroundColor: '#f5f6f9', border: 'none' }}>
            <div className="support-header d-flex align-items-center mb-3 px-1">
              <div className="icon-wrapper bg-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '46px', height: '46px' }}>
                <FiHeadphones style={{ color: '#4300d2', fontSize: '20.8px', strokeWidth: '2.5px' }} />
              </div>
              <span className="support-title" style={{ fontSize: '15px', color: '#111030', letterSpacing: '-0.5px' }}>Get Support</span>
            </div>

            <div className="support-links-container bg-white rounded-3 shadow-sm" style={{ border: 'none' }}>
              <ul className="support-links list-unstyled mb-0 d-flex flex-column">
                <li className="px-2 py-2 d-flex justify-content-between align-items-center cursor-pointer border-bottom" style={{ borderColor: '#f8fafc' }}>
                  <span className="" style={{ fontSize: '14px', color: '#475569' }}>Raise a ticket</span>
                  <FiChevronRight className="text-dark" style={{ strokeWidth: '2.5px' }} />
                </li>
                <li className="px-2 py-2 d-flex justify-content-between align-items-center cursor-pointer">
                  <span className="" style={{ fontSize: '14px', color: '#475569' }}>Faq's</span>
                  <FiChevronRight className="text-dark" style={{ strokeWidth: '2.5px' }} />
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="sidebar-support mb-1 mx-auto" style={{ border: 'none', backgroundColor: 'transparent' }}>
            <div className="icon-wrapper bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '46px', height: '46px', border: '1px solid #eaeaea' }}>
              <FiHeadphones style={{ color: '#4300d2', fontSize: '20.8px', strokeWidth: '2.5px' }} />
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
