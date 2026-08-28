import React from 'react';
import './ThreatActorsidebar.scss';
import { FiChevronRight, FiHeadphones } from 'react-icons/fi';
import { BsShieldFillExclamation } from 'react-icons/bs';
import { Sidebar } from 'react-pro-sidebar';
import { PiTreeStructureLight } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThreatActorprofile, viewinKnowlegdeGraph } from '../../Routes/Routes';

export default function ThreatActorsidebar({ collapsed }) {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Sidebar
            collapsed={collapsed}
            className="threatactor-sidebar view-sidebar border-end"
            width="270px"
            collapsedWidth="80px"
            rootStyles={{
                borderColor: 'var(--bs-border-color)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                }}
            >
                {/* MENU */}
                <div className="sidebar-group">
                    <h6
                        className="sidebar-heading px-3 pt-2 mb-4 d-flex align-items-center"
                        style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <BsShieldFillExclamation
                            className="icon-shield text-danger me-2 flex-shrink-0"
                        />

                        {!collapsed && (
                            <>
                                <span
                                    className="text-dark"
                                    style={{ fontSize: '15.2px' }}
                                >
                                    Threat Actor Profiling
                                </span>

                                <i
                                    className="bi bi-chevron-up ms-auto text-muted"
                                    style={{ fontSize: '12px' }}
                                />
                            </>
                        )}
                    </h6>

                    <ul className="actor-sidebar-nav list-unstyled mb-0 px-2">

                        {/* THREAT ACTOR PROFILING */}
                        <li
                            onClick={() => navigate(ThreatActorprofile)}
                            className={`nav-item d-flex align-items-center py-2 rounded-3 ${location.pathname === ThreatActorprofile ? 'active' : ''
                                }`}
                            style={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                justifyContent: collapsed
                                    ? 'center'
                                    : 'flex-start',
                                paddingLeft: collapsed ? '0' : '12px',
                                paddingRight: collapsed ? '0' : '12px',
                                cursor: 'pointer',
                            }}
                        >
                            <div className="icon-wrapper d-flex align-items-center justify-content-center me-3 flex-shrink-0">
                                <PiTreeStructureLight
                                    className="text-danger"
                                    style={{
                                        fontSize: '18px',
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            </div>

                            {!collapsed && (
                                <span className="nav-label">
                                    Threat Actor Profiling
                                </span>
                            )}
                        </li>

                        {/* VIEW IN KNOWLEDGE GRAPH */}
                        <li
                            onClick={() => navigate(viewinKnowlegdeGraph)}
                            className={`nav-item d-flex align-items-center py-2 rounded-3 ${location.pathname === viewinKnowlegdeGraph
                                ? 'active'
                                : ''
                                }`}
                            style={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                justifyContent: collapsed
                                    ? 'center'
                                    : 'flex-start',
                                paddingLeft: collapsed ? '0' : '12px',
                                paddingRight: collapsed ? '0' : '12px',
                                marginTop: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            <div className="icon-wrapper d-flex align-items-center justify-content-center me-3 flex-shrink-0">
                                <PiTreeStructureLight
                                    className="text-danger"
                                    style={{
                                        fontSize: '18px',
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            </div>

                            {!collapsed && (
                                <span className="nav-label">
                                    View in Knowledge Graph
                                </span>
                            )}
                        </li>
                    </ul>
                </div>

                {/* SUPPORT */}
                {!collapsed ? (
                    <div
                        className="sidebar-support p-3 rounded-4 mx-4 mb-1"
                        style={{
                            backgroundColor: '#f5f6f9',
                            border: 'none',
                        }}
                    >
                        <div className="support-header d-flex align-items-center mb-3 px-1">
                            <div
                                className="icon-wrapper bg-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                style={{
                                    width: '46px',
                                    height: '46px',
                                }}
                            >
                                <FiHeadphones
                                    style={{
                                        color: '#4300d2',
                                        fontSize: '20.8px',
                                        strokeWidth: '2.5px',
                                    }}
                                />
                            </div>

                            <span
                                className="support-title"
                                style={{
                                    fontSize: '15px',
                                    color: '#111030',
                                    letterSpacing: '-0.5px',
                                }}
                            >
                                Get Support
                            </span>
                        </div>

                        <div className="support-links-container bg-white rounded-3 shadow-sm">
                            <ul className="support-links list-unstyled mb-0 d-flex flex-column">
                                <li className="px-2 py-2 d-flex justify-content-between align-items-center border-bottom">
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            color: '#475569',
                                        }}
                                    >
                                        Raise a ticket
                                    </span>

                                    <FiChevronRight
                                        className="text-dark"
                                        style={{
                                            strokeWidth: '2.5px',
                                        }}
                                    />
                                </li>

                                <li className="px-2 py-2 d-flex justify-content-between align-items-center">
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            color: '#475569',
                                        }}
                                    >
                                        Faq's
                                    </span>

                                    <FiChevronRight
                                        className="text-dark"
                                        style={{
                                            strokeWidth: '2.5px',
                                        }}
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="sidebar-support mb-1 mx-auto">
                        <div
                            className="icon-wrapper bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{
                                width: '46px',
                                height: '46px',
                                border: '1px solid #eaeaea',
                            }}
                        >
                            <FiHeadphones
                                style={{
                                    color: '#4300d2',
                                    fontSize: '20.8px',
                                    strokeWidth: '2.5px',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}