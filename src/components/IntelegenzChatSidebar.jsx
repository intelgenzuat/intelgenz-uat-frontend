import React, { useState, useEffect, useRef } from 'react';
import './IntelegenzChatSidebar.scss';
import { BiHelpCircle } from 'react-icons/bi';
import { FiChevronRight, FiArrowUp } from 'react-icons/fi';
import { BsLightningChargeFill } from 'react-icons/bs';
import { LuHistory } from 'react-icons/lu';
import man from '../assets/images/man.jpg';

export default function IntelegenzChatSidebar({ onClose }) {
  const [chatState, setChatState] = useState('idle'); // idle | loading | done
  const [userMessage, setUserMessage] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const chatBodyRef = useRef(null);

  // Loading → done after 2.5 s for Intelgenz Chat
  useEffect(() => {
    if (chatState === 'loading') {
      const timer = setTimeout(() => {
        setChatState('done');
        setShowResponse(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [chatState]);

  // Auto-scroll when state changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatState, showResponse]);

  const handleChipClick = (label) => {
    setUserMessage(label);
    setChatState('loading');
  };

  const isInChat = chatState !== 'idle';

  return (
    <div className="intelegenz-chat-sidebar d-flex flex-column bg-white border rounded-4 flex-shrink-0 overflow-hidden position-relative">

      {/* ── Header ── */}
      <div className="sidebar-header px-3 pt-3 pb-2 d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 2 }}>
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0" style={{ color: '#0f172a', fontSize: '16px', fontWeight: 600 }}>
            Report Chat
          </h6>
          <BiHelpCircle className="text-purple mt-0" style={{ fontSize: '16px', cursor: 'pointer' }} />
        </div>
        <button
          className="btn btn-light bg-white border rounded-3 d-flex align-items-center justify-content-center shadow-sm"
          style={{ width: '38px', height: '38px' }}
          onClick={onClose}
        >
          <FiChevronRight className="text-secondary" style={{ fontSize: '20px' }} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="sidebar-body px-3 d-flex flex-column flex-grow-1 position-relative overflow-y-auto" style={{ zIndex: 2 }}>
        {!isInChat ? (
          <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center my-auto py-4">
            <div
              className="logo-container flex-shrink-0 mb-3 d-flex justify-content-center align-items-center mx-auto shadow-sm"
              style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #7c3aed 100%)' }}
            >
              <BsLightningChargeFill className="text-white" style={{ fontSize: '20px' }} />
            </div>
            <h4 className="integenz-chat-title mb-2">
              Integenz Chat
            </h4>
            <p className="text-dark text-center px-2 mb-4" style={{ fontSize: '12.5px', lineHeight: '1.5', color: '#475569' }}>
              Ask about emerging threats, vulnerabilities, or attack insights to get real-time intelligence.
            </p>
            <div className="chips-container d-flex flex-wrap gap-2 justify-content-center px-1 pb-3 mt-auto">
              {['Report Summary', 'Threat Landscape', 'Sector', 'Industry', 'Mitigations Methods'].map(label => (
                <button key={label} className="chip-btn" onClick={() => handleChipClick(label)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div ref={chatBodyRef} className="flex-grow-1 d-flex flex-column gap-3 py-4">

            <div className="user-message-wrapper animation-fade-in w-100 mb-2 p-4 shadow-sm border" style={{ background: '#f8fafc', borderRadius: '18px' }}>
              <div className="d-inline-flex align-items-center gap-2 mb-3  p-1 bg-white rounded-pill shadow-sm border border-light">
                <div className="user-avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                  <img src={man} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <span className="me-1" style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>Manesh mani</span>
              </div>
              <p className="mb-0 ps-1" style={{ fontSize: '15.5px', color: '#1e293b', lineHeight: '1.5' }}>
                {userMessage}
              </p>
            </div>

            <div className="d-flex flex-column gap-2 animation-fade-in">
              <div className="d-flex align-items-center justify-content-between mb-2 px-1">
                <div className="d-flex align-items-center gap-2">
                  <div className={"intelgenz-icon-wrap " + (chatState === 'loading' ? 'pulsing' : '')} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BsLightningChargeFill className="text-white" style={{ fontSize: '12px' }} />
                  </div>
                  <span className="" style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>Integenz</span>
                </div>
                {chatState === 'loading' && (
                  <div className="stop-btn" style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2.5px', cursor: 'pointer' }} onClick={() => setChatState('done')}></div>
                )}
              </div>

              {chatState === 'loading' && (
                <div className="loading-indicator ms-0 border shadow-sm p-2 px-3" style={{ backgroundColor: '#ffffff', borderRadius: '14px', width: 'fit-content' }}>
                  <div className="dot" style={{ width: '5px', height: '5px' }}></div>
                  <div className="dot" style={{ width: '5px', height: '5px' }}></div>
                  <div className="dot" style={{ width: '5px', height: '5px' }}></div>
                </div>
              )}

              {showResponse && (
                <div className="response-bubble ai ms-0 border shadow-sm p-4" style={{ maxWidth: '100%', borderRadius: '18px', background: '#ffffff' }}>
                  {userMessage === 'Report Summary' ? (
                    <>
                      <p className="mb-3" style={{ fontSize: '14.5px', fontWeight: 600, color: '#0f172a' }}>Here’s a quick summary of your report:</p>
                      <ul className="ps-3 mb-0" style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.7' }}>
                        <li className="mb-3">High-severity AI-driven malware campaign targeting Linux & Android</li>
                        <li className="mb-3">Uses obfuscation + modern frameworks to evade detection</li>
                        <li className="mb-3">Activities include data theft, ransomware, and crypto mining</li>
                        <li className="mb-3">Indicators: malicious hashes, cron job persistence</li>
                        <li className="mb-0">APT-level sophistication, requires immediate monitoring & EDR enforcement</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <p className="mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>Based on the report, here is the {userMessage.toLowerCase()}:</p>
                      <ul className="ps-3 mb-0" style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.6' }}>
                        <li>Relevant details regarding {userMessage.toLowerCase()} would appear here.</li>
                        <li>Analysis based on current threat intelligence.</li>
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer / Input ── */}
      <div className="sidebar-footer px-3 pb-3 position-relative" style={{ zIndex: 2 }}>
        <div className="chat-input-wrapper bg-white rounded-4 p-2 shadow-sm border">
          <div className="px-2 mb-3 text-secondary" style={{ fontSize: '12.8px' }}>
            Ask about information regarding this report...
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn p-0 d-flex align-items-center justify-content-center border rounded-3 shadow-sm" style={{ width: '38px', height: '38px', borderColor: '#f1f5f9' }}>
              <LuHistory style={{ fontSize: '18px', color: '#64748b' }} />
            </button>
            <button
              className="btn d-flex align-items-center justify-content-center border-0 rounded-3 shadow-sm"
              style={{ width: '38px', height: '38px', backgroundColor: '#5200ff', color: 'white' }}
            >
              <FiArrowUp style={{ fontSize: '18px' }} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
