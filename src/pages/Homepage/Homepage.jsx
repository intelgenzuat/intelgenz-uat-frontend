import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRadio } from "react-icons/fi";
import '../../assets/styles/homepage/Homepage.scss'
import Threat from './Threat Distribution/Threat';
import HeliosInfoSection from '../../components/HeliosInfoSection/HeliosInfoSection';
import EmergingThreatDashboard from './Threat Intelligence/EmergingThreatDashboard';
import ThreatTTPMitigation from './Threat Intelligence/ThreatTTPMitigation';
import KnowledgeGraph from './Threat Intelligence/KnowledgeGraph';
import ThreatActorProfiling from './Threat Intelligence/ThreatActorProfiling';
// import Welcome from './Welcome';
import LiveThreatMap from './LiveThreatMap';
import TopReports from './TopReports';
import BlogsandNews from './BlogsandNews';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import Voicechatdrawer from '../../components/Drawers/Voicechatdrawer';
import Intelegenzchatdrawer from '../../components/Drawers/Intelegenzchatdrawer';

export default function Homepage() {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isVoicechatDrawerOpen, setIsVoicechatDrawerOpen] = useState(false);

    return (
        <>
            {/* Main Dashboard Content */}
            <div className="dashboard-container">
                <div className="homepage-content" style={{ gap: '32px' }}>
                    {/* Top Full Width Content */}
                    <div className="main-content" style={{ paddingBottom: 0 }}>
                        {/* Helios Info Section */}
                        <HeliosInfoSection />

                        {/* Threat Intelligence / Emerging Threat Dashboard */}
                        <div className="d-flex" style={{ flexDirection: "column", gap: "24px" }}>
                            <h5 className="section-title">
                                Threat Intelligence <i className="bi bi-question-circle"></i>
                            </h5>
                            <div className="d-flex flex-wrap gap-4 w-100">
                                <EmergingThreatDashboard />
                                <KnowledgeGraph />
                                <ThreatTTPMitigation />
                                <ThreatActorProfiling />
                            </div>
                        </div>
                    </div>

                    {/* Middle Row: Live Threat Map & Sidebar */}
                    <div className="homepage-row upper-row">
                        <main className="main-content" style={{ paddingTop: 0 }}>
                            {/* Live Threat Map 3D Globe */}
                            <div>
                                <LiveThreatMap />
                            </div>
                        </main>

                        <aside className="sidebar-content" style={{ paddingTop: 0, marginTop: 0 }}>
                            <BlogsandNews />
                        </aside>
                    </div>

                    {/* Lower Row: Threat Distribution & Top Reports */}
                    <div className="homepage-row lower-row">
                        <main className="main-content">
                            <div className="threat-distribution-section">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <h5 className="section-title mb-0 d-flex align-items-center" style={{ color: '#0f172a', fontWeight: '600', fontSize: '20px' }}>
                                        Threat Distribution <i className="bi bi-question-circle ms-2" style={{ color: '#5200ff', fontSize: '19.2px' }}></i>
                                    </h5>
                                    <div className="legend-indicators d-flex align-items-center">
                                        <span className="legend-label d-flex align-items-center gap-2 me-2">
                                            <FiRadio className="text-dark" />
                                            <span style={{ color: '#334155', fontWeight: '500' }}>Client:</span>
                                        </span>
                                        <span className="indicator client me-3" style={{ color: '#1e293b', fontWeight: '700' }}>HELIOS AI :</span>

                                        <span className="legend-divider mx-3"></span>

                                        <span className="legend-label d-flex align-items-center gap-2 me-2">
                                            <FiRadio className="text-dark" />
                                            <span style={{ color: '#334155', fontWeight: '500' }}>Distribution :</span>
                                        </span>
                                        <span className="indicator around me-3" style={{ color: '#1e293b', fontWeight: '700' }}>AROUND YOU</span>
                                        <span className="indicator away me-3" style={{ color: '#1e293b', fontWeight: '700' }}>AWAY</span>
                                        <span className="indicator global" style={{ color: '#1e293b', fontWeight: '700' }}>GLOBAL</span>
                                    </div>
                                </div>

                                <div className="threat-data-grid mt-4">
                                    <div className="threat-card-wrapper">
                                        <Threat />
                                    </div>
                                </div>
                            </div>
                        </main>

                        <aside className="sidebar-content">
                            <TopReports />
                        </aside>
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
        </>
    );
}
