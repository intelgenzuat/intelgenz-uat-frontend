import React, { useState } from 'react';
import MitigationSidebar from '../../components/sidebars/MitigationSidebar';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../../assets/styles/view/View.scss';
import '../../assets/styles/mitigation/Mitigationttpview.scss';
import MitigationView from './MitigationView';
import Nist from './Nist';
import Defend from './Defend';
import TTPview from './TTPview';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import Voicechatdrawer from '../../components/Drawers/Voicechatdrawer';
import Intelegenzchatdrawer from '../../components/Drawers/Intelegenzchatdrawer';
const Mitigationttpview = () => {
    const [activeTab, setActiveTab] = useState('customized');
    const [activeViewTab, setActiveViewTab] = useState('ttp');
    const [recentSearches, setRecentSearches] = useState([ 'T1078', 'T1486', 'T1021', 'T1204']);
    const [showOverlaps, setShowOverlaps] = useState(false);
    const { isSidebarCollapsed, toggleSidebar } = useOutletContext() || {};
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isVoicechatDrawerOpen, setIsVoicechatDrawerOpen] = useState(false);

    const Navigate = useNavigate();

    const handleRemoveRecentSearch = (techId) => {
        setRecentSearches(recentSearches.filter(item => item !== techId));
    };



    return (
        <div className="view-page-container container-fluid p-0 d-flex flex-column h-100 overflow-hidden">
            <div className="d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
                {/* Sidebar container */}
                <div className="flex-shrink-0">
                    <MitigationSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        collapsed={isSidebarCollapsed}
                    />
                </div>

                {/* Main Content Area */}
                <div className="d-flex flex-column flex-grow-1 bg-white overflow-y-auto" style={{ minHeight: 0 }}>

                    <div className="mitigation-ttp-view d-flex flex-column min-h-100">

                        {/* Header */}
                        <div className="header-actions">
                            <button className="btn btn-link text-decoration-none p-0 back-btn d-flex align-items-center gap-2" onClick={() => Navigate("/")}>
                                <i className="bi bi-arrow-left"></i> Back
                            </button>
                        </div>

                        {/* Threat Actors */}


                        {/* View Controls & Legends Card */}
                        <div className="view-controls-card flex-shrink-0 mx-4 mb-4 mt-4">
                            {/* View Controls */}
                            <div className="view-controls-section">
                                <div className="title-area">
                                    <h3>{activeViewTab === 'nist' ? 'NIST' : activeViewTab === 'mitigation' ? ' D3FEND' : 'TTP View'}</h3>
                                    <i className="bi bi-question-circle"></i>
                                </div>
                                <div className="controls-right">
                                    <div className="show-overlaps-btn">
                                        <input
                                            type="checkbox"
                                            id="showOverlaps"
                                            checked={showOverlaps}
                                            onChange={(e) => setShowOverlaps(e.target.checked)}
                                        />
                                        <label htmlFor="showOverlaps">Show overlaps only</label>
                                    </div>
                                    <ul className="nav nav-pills segment-control" id="viewTab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeViewTab === 'ttp' ? 'active' : ''}`}
                                                onClick={() => setActiveViewTab('ttp')}
                                                type="button"
                                                role="tab"
                                            >
                                                TTP View
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeViewTab === 'mitigation' ? 'active' : ''}`}
                                                onClick={() => setActiveViewTab('mitigation')}
                                                type="button"
                                                role="tab"
                                            >
                                                D3FEND
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className={`nav-link ${activeViewTab === 'nist' ? 'active' : ''}`}
                                                onClick={() => setActiveViewTab('nist')}
                                                type="button"
                                                role="tab"
                                            >
                                                NIST
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Legends */}
                            {activeViewTab === 'ttp' && (
                                <div className="legends-area">
                                    <span className="legend-title">LEGENDS :</span>
                                    <div className="legend-items">
                                        <div className="legend-pill">
                                            <div className="dot" style={{ backgroundColor: '#3b82f6' }}></div> Denotes threat actors
                                        </div>
                                        <div className="legend-pill">
                                            <div className="dot" style={{ backgroundColor: '#ef4444' }}></div> Denotes overlaps
                                        </div>
                                        <div className="legend-pill">
                                            <div className="dot" style={{ backgroundColor: '#22c55e' }}></div> Denotes no overlaps
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Searchbar */}
                        {activeViewTab === 'ttp' && (
                            <div className="d-flex align-items-center justify-content-start mx-4 mb-4 gap-3">
                                <div className="d-flex flex-column" >
                                    <span className="text-dark fw-medium" style={{ fontSize: '14.5px' }}>
                                        Enter Threat Actor Name
                                    </span>
                                </div>
                                <div className="search-wrapper position-relative m-0">
                                    <i className="bi bi-search position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
                                    <input type="text" className="form-control rounded-pill ps-5 pe-5" placeholder="Search threat actors to add" />
                                    <i className="bi bi-filter position-absolute text-muted" style={{ right: '16px', top: '50%', transform: 'translateY(-50%)' }}></i>
                                </div>

                                {/* Recent Searches Chips */}
                                {/* {recentSearches.length > 0 && (
                                    <div className="recent-searches d-flex align-items-center gap-2 ms-3">
                                        <span className="text-secondary fw-semibold" style={{ fontSize: '13px' }}>Recent searches:</span>
                                        <div className="d-flex gap-2">
                                            {recentSearches.map(techId => (
                                                <span 
                                                    key={techId}
                                                    className="recent-search-chip badge rounded-pill px-3 py-2 border border-1 d-inline-flex align-items-center gap-2"
                                                    style={{ fontSize: '12px', fontWeight: 500 }}
                                                >
                                                    <span>{techId}</span>
                                                    <i 
                                                        className="bi bi-x cursor-pointer ms-1 text-muted" 
                                                        style={{ fontSize: '14px', verticalAlign: 'middle', padding: '0 2px' }}
                                                        onClick={() => handleRemoveRecentSearch(techId)}
                                                    ></i>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        )}

                        {/* Tab Content Area */}
                        {activeViewTab === 'ttp' && <TTPview showOverlaps={showOverlaps} />}


                        {activeViewTab === 'mitigation' && <Defend showOverlaps={showOverlaps} />}
                        {activeViewTab === 'nist' && <Nist showOverlaps={showOverlaps} />}



                    </div>
                </div>
            </div>
            
            {/* Floating Chat Drawers */}
            <FloatingChatButtons
                onVoiceChatOpen={() => setIsVoicechatDrawerOpen(true)}
                onIntelgenzOpen={() => setIsDrawerOpen(true)}
            />

            {/* Drawer components */}
            <Voicechatdrawer isOpen={isVoicechatDrawerOpen} onClose={() => setIsVoicechatDrawerOpen(false)} />
            <Intelegenzchatdrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </div>
    );
};

export default Mitigationttpview;
