import React, { useState, useEffect } from 'react';
import './VoiceChatSidebar.scss';
import { BiHelpCircle } from 'react-icons/bi';
import { FiChevronRight, FiArrowUp, FiRefreshCw } from 'react-icons/fi';
import { BsLightningChargeFill } from 'react-icons/bs';

export default function VoiceChatSidebar({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answeringStep, setAnsweringStep] = useState(0);

  // Answering Steps for Voice Chat
  useEffect(() => {
    let timers = [];
    if (isAnswering) {
      setAnsweringStep(0);
      timers.push(setTimeout(() => setAnsweringStep(1), 800));
      timers.push(setTimeout(() => setAnsweringStep(2), 1600));
      timers.push(setTimeout(() => setAnsweringStep(3), 2400));
      timers.push(setTimeout(() => setAnsweringStep(4), 3200));
      timers.push(setTimeout(() => setAnsweringStep(5), 4000));
      timers.push(setTimeout(() => setAnsweringStep(6), 4800));
    } else {
      setAnsweringStep(0);
    }
    return () => timers.forEach(clearTimeout);
  }, [isAnswering]);

  return (
    <div className="voice-chat-sidebar d-flex flex-column bg-white border rounded-4 flex-shrink-0 overflow-hidden position-relative">

      {/* Voice Mode Gradient Background */}
      <div className="voice-mode-gradient"></div>

      {/* ── Header ── */}
      <div className="sidebar-header px-3 pt-3 pb-2 d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 2 }}>
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0" style={{ color: '#0f172a', fontSize: '16px' }}>
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
        <div className="d-flex flex-column flex-grow-1 align-items-center pt-4 pb-3 h-100">
          <div className="logo-container flex-shrink-0 mb-3 d-flex justify-content-center align-items-center mx-auto shadow-sm" style={{ width: '48px', height: '48px', minWidth: '48px', minHeight: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #7c3aed 100%)' }}>
            <BsLightningChargeFill className="text-white" style={{ fontSize: '20px' }} />
          </div>

          <h4 className="mb-3" style={{ fontSize: '19.2px' }}>
            <span style={{ color: '#8b5cf6' }}>Integenz </span>
            <span style={{ color: '#f43f5e' }}>Voice </span>
            <span style={{ color: '#c4b5fd', opacity: 0.8 }}>Chat</span>
          </h4>

          <div className={`transition-collapse ${isListening || isAnswering ? 'collapsed' : ''} text-center`}>
            <p className="text-center px-2 mb-4" style={{ fontSize: '12.5px', lineHeight: '1.5', color: '#475569' }}>
              Ask about emerging threats, vulnerabilities, or attack insights to get real-time intelligence.
            </p>
          </div>

          <button
            className={`status-pill mb-3 ${isAnswering ? 'answering' : ''}`}
            onClick={() => {
              if (!isListening && !isAnswering) setIsListening(true);
            }}
          >
            {isAnswering ? (
              <>ANSWERING <span className="status-dot"></span></>
            ) : isListening ? (
              <>LISTENING <span className="ms-1 text-danger"><i className="bi bi-record-circle"></i></span></>
            ) : (
              <>START SPEAKING <span className="ms-1" style={{ color: '#f87171' }}><i className="bi bi-grid-3x3-gap-fill"></i></span></>
            )}
          </button>

          {/* Answering Chat Bubbles */}
          {isAnswering && (
            <div className="w-100 d-flex flex-column gap-2 px-1 flex-grow-1 align-items-start">
              {answeringStep >= 1 && (
                <div className="chat-bubble user-question animation-fade-in">
                  Cyber Threat Brief — Active Ransomware Campaigns Targeting
                </div>
              )}
              {answeringStep >= 2 && (
                <div className="chat-bubble user-question animation-fade-in">
                  the Hospitality Sector in the Middle East
                </div>
              )}
              {answeringStep >= 3 && (
                <div className="chat-bubble ai-answer animation-fade-in mt-2">
                  <div className="mb-1" style={{ color: '#1e293b' }}>Akira:</div>
                  <div>“Here’s your latest intelligence update on ransomware activity impacting hospitality organizations across the Middle East and adjacent global hotel ecosystems.”</div>
                </div>
              )}
              {answeringStep >= 4 && (
                <div className="chat-bubble ai-answer animation-fade-in mt-2">
                  <div className="mb-1" style={{ color: '#1e293b' }}>Conti-lineage Groups</div>
                  <div>“Former Conti affiliates using credential theft and lateral movement to disrupt hotel operations and demand ransom payments.”</div>
                </div>
              )}
              {answeringStep >= 5 && (
                <div className="chat-bubble ai-answer animation-fade-in mt-2">
                  <div className="mb-1" style={{ color: '#1e293b' }}>AI-Enabled Extortion Campaigns</div>
                  <div>“Attackers use AI-generated phishing emails to steal staff credentials and deploy ransomware inside hotel environments.”</div>
                </div>
              )}
              {answeringStep >= 6 && (
                <div className="integenz-response-card w-100 animation-fade-in mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded-pill">
                      <div className="bg-purple rounded-circle d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px', backgroundColor: '#db2777' }}>
                        <BsLightningChargeFill className="text-white" style={{ fontSize: '12px' }} />
                      </div>
                      <span className="" style={{ fontSize: '12px', color: '#1e293b' }}>Integenz</span>
                    </div>
                    <button className="btn p-0 text-purple">
                      <FiRefreshCw style={{ fontSize: '14px' }} />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <button className="chip-btn border-0 py-1" style={{ backgroundColor: '#f3f7fb', fontSize: '11px' }}>More detailed narration</button>
                    <button className="chip-btn border-0 py-1" style={{ backgroundColor: '#f3f7fb', fontSize: '11px' }}>Summarize</button>
                    <button className="chip-btn border-0 py-1" style={{ backgroundColor: '#f3f7fb', fontSize: '11px' }}>Active campaigns</button>
                  </div>
                </div>
              )}
              {answeringStep < 6 && (
                <div className="typing-indicator-bubble animation-fade-in mt-1">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              )}
            </div>
          )}

          {/* Chips */}
          <div className={`chips-container d-flex flex-wrap gap-2 justify-content-center transition-collapse ${isListening || isAnswering ? 'collapsed' : ''}`}>
            {['Latest Threats Summary', 'Critical CVEs Today', 'Active Ransomware Campaigns', 'Phishing Attack Trends', 'Analyze Uploaded IOCs', 'Predict Attack Targets', 'Zero-Day Mitigations'].map(label => (
              <button key={label} className="chip-btn" onClick={() => { }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer / Input ── */}
      <div className="sidebar-footer px-3 pb-3 position-relative" style={{ zIndex: 2 }}>
        <div className="chat-input-wrapper bg-white rounded-4 p-2 shadow-sm">
          <div className={" px-2 mb-3 " + (isListening ? 'text-dark' : 'text-secondary')} style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
            {isListening
              ? 'What are some of the active ransomware campaigns targeting hospitality sector in the middle east'
              : 'Ask about threats, CVEs, or attack activity...'}
          </div>

          <div className="d-flex align-items-center justify-content-between gap-2">
            <button className="btn p-0 d-flex align-items-center justify-content-center border rounded-3" style={{ width: '32px', height: '32px', borderColor: '#f1f5f9' }}>
              <span style={{ fontSize: '19.2px', color: '#64748b', marginTop: '-2px' }}>+</span>
            </button>

            <div className="flex-grow-1 border rounded-pill d-flex align-items-center justify-content-between px-2" style={{ height: '32px', backgroundColor: '#ffffff', borderColor: '#f1f5f9' }}>
              <div className="d-flex align-items-center">
                <i className="bi bi-mic-fill" style={{ color: '#8b5cf6', fontSize: '14.4px' }}></i>
              </div>

              <div className="voice-wave-container flex-grow-1 px-2 justify-content-center">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`wave-bar ${isListening ? 'active' : ''}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  ></div>
                ))}
              </div>

              <button
                className="btn p-0 d-flex align-items-center justify-content-center"
                style={{ width: '20px', height: '20px', backgroundColor: '#fef2f2', borderRadius: '50%' }}
                onClick={() => {
                  if (isListening) {
                    setIsListening(false);
                    setIsAnswering(true);
                  } else if (isAnswering) {
                    setIsAnswering(false);
                    setIsListening(false);
                  }
                }}
              >
                {isListening ? (
                  <div style={{ width: '7px', height: '7px', backgroundColor: '#e11d48', borderRadius: '1.5px' }}></div>
                ) : (
                  <i className="bi bi-play-fill" style={{ color: '#e11d48', fontSize: '12px', marginLeft: '1px' }}></i>
                )}
              </button>
            </div>

            <button
              className="btn d-flex align-items-center justify-content-center border-0 rounded-3"
              style={{ width: '32px', height: '32px', backgroundColor: (isListening || isAnswering) ? '#5200ff' : '#f1f5f9', color: (isListening || isAnswering) ? 'white' : '#cbd5e1' }}
              onClick={() => {
                if (isListening) {
                  setIsListening(false);
                  setIsAnswering(true);
                }
              }}
            >
              <FiArrowUp style={{ fontSize: '17.6px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
