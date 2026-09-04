import React, { useState } from 'react';
import { FiHome } from 'react-icons/fi';
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
    const [recentSearches, setRecentSearches] = useState(['T1078', 'T1486', 'T1021', 'T1204']);
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
                        <div className="breadcrumb-nav text-muted" style={{ fontSize: '14px' }}>
                            <FiHome className="home-icon me-2" />
                            <span onClick={() => Navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                            <span className="mx-2 text-black-50">/</span>
                            <span style={{ cursor: 'pointer' }}>Threat Actor</span>
                            {/* <span className="mx-2 text-black-50">/</span> */}
                            <span className="text-dark fw-medium"></span>
                        </div>

                        {/* Threat Actors */}


                        {/* View Controls & Legends Card */}
                        <div className="view-controls-card flex-shrink-0 mx-4 mb-4 mt-2">
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
                            {/* {activeViewTab === 'ttp' && (
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
                            )} */}
                        </div>

                        {/* Searchbar */}
                        {(() => {
                            const isSearchDisabled = activeViewTab === 'nist' || activeViewTab === 'mitigation';
                            return (
                                <div className={`threat-actor-search-section d-flex align-items-center justify-content-start mx-4 mb-2 gap-3 ${isSearchDisabled ? 'disabled' : ''}`}>
                                    <div className="d-flex flex-column">
                                        <span className={`fw-medium ${isSearchDisabled ? 'text-muted' : 'text-dark'}`} style={{ fontSize: '14.5px' }}>
                                            Enter Threat Actor Name
                                        </span>
                                    </div>
                                    <div className="search-wrapper position-relative m-0">
                                        <i className="bi bi-search position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
                                        <input
                                            type="text"
                                            className="form-control rounded-pill ps-5 pe-5"
                                            placeholder="Search threat actors to add"
                                            disabled={isSearchDisabled}
                                        />
                                        <i className="bi bi-filter position-absolute text-muted" style={{ right: '16px', top: '50%', transform: 'translateY(-50%)' }}></i>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Tab Content Area */}
                        {activeViewTab === 'ttp' && <TTPview showOverlaps={showOverlaps} />}


                        {activeViewTab === 'mitigation' && <Defend showOverlaps={showOverlaps} />}
                        {activeViewTab === 'nist' && <Nist showOverlaps={showOverlaps} />}



                    </div>
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
    );
};

export default Mitigationttpview;
