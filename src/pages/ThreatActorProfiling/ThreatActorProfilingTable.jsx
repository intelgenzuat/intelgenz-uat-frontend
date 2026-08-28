import React, { useState } from 'react';
import { PiDiamondFill } from 'react-icons/pi';
import { GoFlame } from 'react-icons/go';
import cube from '../../assets/images/cube.png';
import logo from '../../assets/images/logo.jpeg';
import '../../assets/styles/threatactorprofile/threatactorprofilimg.scss';

const MOCK_DATA = [
  { rank: '01', actor: 'Charming Kitten', capability: true, intent: true, opportunity: true, priority: 'Low' },
  { rank: '02', actor: 'Lumma Stealer', capability: true, intent: true, opportunity: true, priority: 'Medium' },
  { rank: '03', actor: 'Gold Sahara', capability: true, intent: true, opportunity: true, priority: 'Critical' },
  { rank: '04', actor: 'Kim Suky', capability: true, intent: true, opportunity: true, priority: 'Medium' },
  { rank: '05', actor: 'Charming Kitten', capability: true, intent: true, opportunity: true, priority: 'Medium' },
  { rank: '06', actor: 'Lumma Stealer', capability: true, intent: true, opportunity: true, priority: 'Critical' },
  { rank: '07', actor: 'Lumma Stealer', capability: true, intent: true, opportunity: true, priority: 'Low' },
  { rank: '08', actor: 'Gold Sahara', capability: true, intent: true, opportunity: true, priority: 'Critical' },
  { rank: '09', actor: 'Kim Suky', capability: true, intent: true, opportunity: true, priority: 'Low' },
  { rank: '10', actor: 'Charming Kitten', capability: true, intent: true, opportunity: true, priority: 'Critical' },
  { rank: '11', actor: 'Lumma Stealer', capability: true, intent: true, opportunity: true, priority: 'Medium' }
];

export default function ThreatActorProfilingTable() {
  const [techniqueId, setTechniqueId] = useState('');

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

  return (
    <div className="threat-actor-detail-page">
      {/* Top Header Section */}
      <div className="tap-header-section">
        {/* Background Image/Abstract Graphic */}
        <div className="tap-hero-bg d-none d-md-block" style={{ backgroundImage: `url(${cube})` }}>
        </div>

        <div className="tap-header-content">
          {/* Breadcrumbs */}
          <div className="tap-breadcrumb">
            <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_95_193)">
                <path d="M11.4563 12.6547H8.79534C8.14534 12.6547 7.5969 12.1266 7.5969 11.4563V9.30312C7.5969 9.14062 7.47502 9.01875 7.31252 9.01875H5.68752C5.52502 9.01875 5.40315 9.14062 5.40315 9.30312V11.4563C5.40315 12.1266 4.87502 12.6547 4.20471 12.6547H1.54377C0.893774 12.6547 0.345337 12.1266 0.345337 11.4563V4.61094C0.345337 4.26563 0.507837 3.96094 0.792212 3.77813L5.9719 0.507812C6.2969 0.304688 6.70315 0.304688 7.00784 0.507812L12.1875 3.79844C12.4719 3.98125 12.6344 4.28594 12.6344 4.63125V11.4563C12.6547 12.1063 12.1063 12.6547 11.4563 12.6547ZM5.68752 8.10469H7.31252C7.98284 8.10469 8.51096 8.63281 8.51096 9.30312V11.4563C8.51096 11.6188 8.63284 11.7406 8.79534 11.7406H11.4563C11.6188 11.7406 11.7406 11.6188 11.7406 11.4563V4.61094C11.7406 4.59063 11.7203 4.57031 11.7203 4.55L6.52034 1.27969C6.50002 1.25938 6.47971 1.25938 6.4594 1.27969L1.30002 4.55C1.27971 4.57031 1.2594 4.59063 1.2594 4.61094V11.4563C1.2594 11.6188 1.38127 11.7406 1.54377 11.7406H4.20471C4.36721 11.7406 4.48909 11.6188 4.48909 11.4563V9.30312C4.48909 8.65312 5.01721 8.10469 5.68752 8.10469Z" fill="#130C2C" />
              </g>
              <defs>
                <clipPath id="clip0_95_193">
                  <rect width="13" height="13" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Home <span>/</span> <span className="text-dark">Threat Actor Profile</span>
          </div>

          {/* Title Row */}
          <div className="tap-title-row">
            <div className="shield-icon-wrapper">
              <svg width="18" height="20" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.43627 16.4528C9.72418 16.4528 9.96554 16.3555 10.1604 16.1609C10.3552 15.9661 10.4526 15.7247 10.4526 15.4368C10.4526 15.1489 10.3552 14.9075 10.1604 14.7127C9.96554 14.5179 9.72418 14.4205 9.43627 14.4205C9.14836 14.4205 8.907 14.5179 8.7122 14.7127C8.51739 14.9075 8.41999 15.1489 8.41999 15.4368C8.41999 15.7247 8.51739 15.9661 8.7122 16.1609C8.907 16.3555 9.14836 16.4528 9.43627 16.4528ZM8.49265 12.1703H10.3799V6.09741H8.49265V12.1703ZM9.43627 23.8326C6.71506 23.0905 4.4621 21.4887 2.67739 19.0273C0.892462 16.5659 0 13.8141 0 10.7718V3.53263L9.43627 0L18.8725 3.53263V10.7718C18.8725 13.8141 17.9801 16.5659 16.1952 19.0273C14.4104 21.4887 12.1575 23.0905 9.43627 23.8326Z" fill="#E9004A" />
              </svg>
            </div>
            <h4>Threat Actor Profiling</h4>
            <div className="title-divider"></div>
            <span className="title-subtitle">Stay ahead of threat actor profiling</span>
          </div>

          {/* Search Input */}
          <div className="tap-search-container">
            <label>Enter MITRE Technique IDs</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={techniqueId}
                onChange={(e) => setTechniqueId(e.target.value)}
                placeholder="T1059.001,T1059.002"
              />
              <button>Submit</button>
            </div>
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
                  <div className="header-content">{filterLinesIcon} Capability</div>
                </th>
                <th className="th-int">
                  <div className="header-content">{filterLinesIcon} Intent</div>
                </th>
                <th className="th-opp">
                  <div className="header-content">{filterLinesIcon} Opportunity</div>
                </th>
                <th className="th-pri">
                  <div className="header-content">{funnelIcon} Priority</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DATA.map((row, idx) => (
                <tr key={idx}>
                  <td className="col-rank">{row.rank}</td>
                  <td className="col-actor">{row.actor}</td>
                  <td>{renderCheckIcon(row.capability)}</td>
                  <td>{renderCheckIcon(row.intent)}</td>
                  <td>{renderCheckIcon(row.opportunity)}</td>
                  <td>{getPriorityBadge(row.priority)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="tap-pagination">
          <div className="pagination-info">
            Showing 1 to 5 of 6 entries
          </div>
          <div className="pagination-buttons">
            <button className="btn-page btn-text">Previous</button>
            <button className="btn-page active">1</button>
            <button className="btn-page">2</button>
            <button className="btn-page btn-text">Next</button>
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
