import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { PiWarningDiamondLight } from 'react-icons/pi';
import '../../assets/styles/view/ViewReport.scss';
import { LiaDownloadSolid } from 'react-icons/lia';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import IntelegenzChatSidebar from '../../components/IntelegenzChatSidebar';
import VoiceChatSidebar from '../../components/VoiceChatSidebar';
import { Home, IntelCard } from '../../Routes/Routes';

const overviewData = [
  { id: 1, label: "Name", value: "Linux/Ladvix.E, Linux/Promitei.B, Adware/SpyLoan!Android, Linux/Filecoder.BR!tr" },
  { id: 2, label: "Threat Summary", value: "A new report highlights how artificial intelligence is transforming both malware development and antivirus defenses. Malware authors are leveraging new frameworks, languages, and obfuscation methods, while defenders use AI to automate malware unpacking, string deobfuscation, and code analysis. Recent samples across Linux, Android, and ransomware families exemplify this ongoing arms race. The adoption of AI by both sides is increasing the sophistication and speed of cyber threats and defenses." },
  { id: 3, label: "Threat Type", value: "Malware" },
  { id: 4, label: "Threat Group Name", value: "Unknown" },
  { id: 5, label: "Malware Name", value: "Linux/Ladvix.E, Linux/Promitei.B, Adware/SpyLoan!Android, Linux/Filecoder.BR!tr" },
  { id: 6, label: "Target Sector", value: "Target Sector Enterprise environments, FinTech, Government, Healthcare, IT, Manufacturing, Telecom" },
  { id: 7, label: "Target Region", value: "Global" },
  { id: 8, label: "Severity Level", value: "High", badge: true },
  { id: 9, label: "Affected Platforms", value: "Linux, Android" }
];

export default function IntelCardDetailview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customized');
  const [activeChatMode, setActiveChatMode] = useState('voice');
  const [activeDiamondNode, setActiveDiamondNode] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'all') {
      navigate('/intel-card', { state: { tab: 'all' } });
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        const isClickOnDot = event.target.closest('.diamond-node') || event.target.closest('.diamond-text');
        if (!isClickOnDot) {
          setActiveDiamondNode(null);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <div className="view-report-container container-fluid p-0 d-flex flex-column h-100 overflow-hidden">
      {/* Main Layout Wrapper */}
      <div className="d-flex flex-grow-1 overflow-hidden">

        {/* Dashboard Main Content Wrapper */}
        <div className="d-flex flex-column flex-grow-1 overflow-y-auto report-content-wrapper" style={{ backgroundColor: '#f8fafc' }}>

          {/* Top Header Section */}
          <div className="px-5 pt-4 pb-1">
            <div className="rounded-4 overflow-hidden bg-white shadow-sm" style={{ border: '1px solid #f1f5f9' }}>
              <div style={{ height: '16px', background: 'linear-gradient(90deg, #f3e8ff 0%, #fce7f3 50%, #ffe4e6 100%)' }}></div>
              <div className="report-header px-4 py-4 pb-4">
                <div className="d-flex align-items-center gap-2 text-secondary mb-3" style={{ fontSize: '13px', fontWeight: 500 }}>
                  <Link to={Home} className="text-secondary text-decoration-none d-flex align-items-center gap-1">
                    <i className="bi bi-house"></i> Home
                  </Link>
                  <span className="text-muted">/</span>
                  <Link to={IntelCard} className="text-secondary text-decoration-none">
                    Intel Card
                  </Link>
                  <span className="text-muted">/</span> Malware <span className="text-muted">/</span> Detail Page
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="icon-box-shield d-flex align-items-center justify-content-center rounded-3 shadow-sm" style={{ width: '32px', height: '32px', backgroundColor: '#fff1f2' }}>
                      <i className="bi bi-shield-fill" style={{ fontSize: '14px', color: '#f43f5e' }}></i>
                    </div>
                    <div className="report-info d-flex flex-column justify-content-center">
                      <h3 className="mb-0 title fw-bold" style={{ 
                        background: 'linear-gradient(to right, #8b5cf6, #fb7185)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                        fontSize: '24px',
                        letterSpacing: '-0.5px'
                      }}>
                        OSX/CrescentCore.A
                      </h3>
                      <p className="summary-text mb-0 mt-1" style={{ fontSize: '14px', maxWidth: '700px', fontWeight: 500, color: '#334155' }}>
                        A New report highlight how artificial intelligence is transforming both malware development
                      </p>
                    </div>
                  </div>

                  <div className="action-buttons d-flex align-items-center gap-3 ms-md-auto mt-3 mt-md-0">
                    <button className="btn btn-outline-secondary d-flex align-items-center rounded-3 py-2 px-3 fw-bold bg-white shadow-sm" style={{ fontSize: '13px', borderColor: '#e2e8f0', color: '#1e293b' }}>
                      <LiaDownloadSolid className="me-2 fs-5" /> Download now
                    </button>
                    <div className="date-badge rounded-3 text-center px-3 py-1 bg-white d-flex flex-column align-items-center justify-content-center shadow-sm" style={{ border: '1px solid #fbcfe8' }}>
                      <div className="month text-secondary" style={{ fontSize: '10px', fontWeight: 600 }}>APR</div>
                      <div className="day fw-bold fs-5 lh-1 my-1" style={{ 
                        background: 'linear-gradient(to right, #8b5cf6, #fb7185)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent', 
                      }}>05</div>
                      <div className="year text-secondary" style={{ fontSize: '10px', fontWeight: 600 }}>2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Area (Table and Chat Container) */}
          <div className="px-5 pt-3 pb-5 d-flex flex-column flex-grow-1 report-details-section">
            <div className="d-flex flex-column w-100 gap-4">
              {/* Overview Table */}
              <div className="report-details-container rounded-4 bg-white d-flex flex-column w-100 overflow-hidden">
                <div className="d-flex flex-column w-100">
                  <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '400px' }}>
                    <div className="d-flex flex-column">
                      {overviewData.map((item, index) => (
                    <div key={item.id} className="d-flex border-bottom">
                      <div className="row-label flex-shrink-0">
                        <div className="icon-box flex-shrink-0">
                          <i className="bi bi-window"></i>
                        </div>
                        <span className="label-text">{item.label}</span>
                      </div>
                      <div className="row-value">
                        <div className="w-100">
                          {item.badge ? (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-1 severity-pill" style={{ fontSize: '12px', fontWeight: 600 }}><PiWarningDiamondLight className="me-1" />{item.value}</span>
                          ) : (
                            item.value
                          )}
                        </div>
                      </div>
                    </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline Section */}
              <div className="bg-white rounded-4 p-4 w-100">
                    <h5 className="mb-4 text-dark font-weight-bold d-flex align-items-center gap-2" style={{ fontSize: '15px', letterSpacing: '-0.3px' }}>
                      <i className="bi bi-clock-history text-primary"></i> Activity Timeline
                    </h5>
                    
                    <div className="position-relative w-100 bg-white border rounded-4 p-4" style={{ borderColor: '#e2e8f0' }}>
                      <svg viewBox="0 0 600 250" className="w-100 h-auto" style={{ maxHeight: '250px' }}>
                        <defs>
                          <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        </defs>

                        {/* Y-Axis Grid Lines & Labels */}
                        <g className="grid-lines" stroke="#f1f5f9" strokeWidth="1">
                          <line x1="60" y1="20" x2="550" y2="20" strokeDasharray="4 4" />
                          <line x1="60" y1="40" x2="550" y2="40" strokeDasharray="4 4" />
                          <line x1="60" y1="60" x2="550" y2="60" strokeDasharray="4 4" />
                          <line x1="60" y1="80" x2="550" y2="80" strokeDasharray="4 4" />
                          <line x1="60" y1="100" x2="550" y2="100" strokeDasharray="4 4" />
                          <line x1="60" y1="120" x2="550" y2="120" strokeDasharray="4 4" />
                          <line x1="60" y1="140" x2="550" y2="140" strokeDasharray="4 4" />
                          <line x1="60" y1="160" x2="550" y2="160" strokeDasharray="4 4" />
                          <line x1="60" y1="180" x2="550" y2="180" strokeDasharray="4 4" />
                          <line x1="60" y1="200" x2="550" y2="200" />
                        </g>

                        {/* Y-Axis Labels */}
                        <g className="axis-labels" fill="#64748b" fontSize="11" fontWeight="500" textAnchor="end">
                          <text x="45" y="24">90</text>
                          <text x="45" y="44">80</text>
                          <text x="45" y="64">70</text>
                          <text x="45" y="84">60</text>
                          <text x="45" y="104">50</text>
                          <text x="45" y="124">40</text>
                          <text x="45" y="144">30</text>
                          <text x="45" y="164">20</text>
                          <text x="45" y="184">10</text>
                          <text x="45" y="204">00</text>
                        </g>

                        {/* X-Axis Line & Labels */}
                        <line x1="60" y1="200" x2="550" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />
                        <line x1="60" y1="20" x2="60" y2="200" stroke="#cbd5e1" strokeWidth="1.5" />
                        
                        <g className="axis-labels" fill="#64748b" fontSize="11" fontWeight="500" textAnchor="middle">
                          <text x="141.6" y="222">Jan</text>
                          <text x="223.3" y="222">Feb</text>
                          <text x="305" y="222">Mar</text>
                          <text x="386.6" y="222">Apr</text>
                          <text x="468.3" y="222">May</text>
                          <text x="550" y="222">Jun</text>
                        </g>

                        {/* Area under the line */}
                        <path
                          d="M 60 200 L 60 120 C 100 120, 100 80, 141.6 80 C 180 80, 180 140, 223.3 140 C 260 140, 260 44, 305 44 C 340 44, 340 74, 386.6 74 C 420 74, 420 130, 468.3 130 C 500 130, 500 60, 550 60 L 550 200 Z"
                          fill="url(#chart-gradient)"
                        />

                        {/* Glowing Chart Line */}
                        <path
                          d="M 60 120 C 100 120, 100 80, 141.6 80 C 180 80, 180 140, 223.3 140 C 260 140, 260 44, 305 44 C 340 44, 340 74, 386.6 74 C 420 74, 420 130, 468.3 130 C 500 130, 500 60, 550 60"
                          fill="none"
                          stroke="url(#line-gradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data Points (Dots) */}
                        <g className="chart-points">
                          <circle cx="141.6" cy="80" r="5" fill="#a78bfa" stroke="#e9d5ff" strokeWidth="3" />
                          <circle cx="223.3" cy="140" r="5" fill="#a78bfa" stroke="#e9d5ff" strokeWidth="3" />
                          <circle cx="305" cy="44" r="5" fill="#a78bfa" stroke="#e9d5ff" strokeWidth="3" />
                          <circle cx="386.6" cy="74" r="5" fill="#a78bfa" stroke="#e9d5ff" strokeWidth="3" />
                        </g>
                      </svg>
                    </div>
              </div>

             

              {/* Embedded Chat Sidebars */}
              {/* {activeChatMode === 'text' && (
                <IntelegenzChatSidebar
                  onClose={() => setActiveChatMode(null)}
                />
              )}
              {activeChatMode === 'voice' && (
                <VoiceChatSidebar
                  onClose={() => setActiveChatMode(null)}
                />
              )} */}

            </div>

          </div>

        </div>

        {/* Floating Chat Buttons — right-edge draggable */}
        {/* <FloatingChatButtons
          activeChatMode={activeChatMode}
          onVoiceChatOpen={() => setActiveChatMode('voice')}
          onIntelgenzOpen={() => setActiveChatMode('text')}
        /> */}
      </div>



    </div>
  );
}
