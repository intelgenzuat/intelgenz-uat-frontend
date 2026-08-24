import React, { useState, useEffect } from 'react';
import './Voicechatdrawer.scss';
import { BiHelpCircle } from 'react-icons/bi';
import { FiChevronRight, FiPlus, FiArrowUp, FiRefreshCw } from 'react-icons/fi';
import { BsLightningChargeFill } from 'react-icons/bs';

const Voicechatdrawer = ({ isOpen, onClose }) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answeringStep, setAnsweringStep] = useState(0);

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

  useEffect(() => {
    let timer;
    if (isOpen) {
      setIsVoiceMode(false);
      setIsListening(false);
      setIsAnswering(false);
      timer = setTimeout(() => {
        setIsVoiceMode(true);
      }, 500);
    } else {
      setIsVoiceMode(false);
      setIsListening(false);
      setIsAnswering(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <>
      {/* Overlay to dim background when drawer is open (optional, based on design) */}
      {isOpen && <div className="voice-drawer-overlay" onClick={onClose}></div>}

      {/* Sliding Drawer Container */}
      <div className={`voicechat-drawer ${isOpen ? 'open' : ''} ${isVoiceMode ? 'voice-mode' : ''}`}>

        {/* Voice Mode Gradient Background */}
        {isVoiceMode && <div className="voice-mode-gradient"></div>}

        {/* Drawer Header */}
        <div className="drawer-header px-4 py-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h4 className="mb-0">Chat</h4>
            <BiHelpCircle className="help-icon mt-1" />
          </div>
          <button
            className="btn btn-light bg-white border rounded-3 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: '34px', height: '34px' }}
            onClick={onClose}
          >
            <FiChevronRight className="text-secondary" />
          </button>
        </div>

        {/* Drawer Body Area (Scrollable if needed, currently just centered content) */}
        <div className="drawer-body px-4 d-flex flex-column flex-grow-1 align-items-center justify-content-center position-relative" style={{ zIndex: 2, paddingBottom: '10vh' }}>

          {/* Logo Section */}
          <div className={`logo-container mb-3 position-relative d-flex justify-content-center align-items-center mx-auto shadow-sm ${isVoiceMode ? 'voice-active' : ''}`} style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #7c3aed 100%)' }}>
            <BsLightningChargeFill className="text-white" style={{ fontSize: '22px' }} />
          </div>

          <h3 className={` mb-3 mt-1 ${isVoiceMode ? 'voice-title' : ''}`}>
            {isVoiceMode ? (
              <>Integenz Voice Chat</>
            ) : (
              <>
                <span style={{ color: '#6366f1' }}>Integenz </span>
                <span style={{ color: '#f43f5e', opacity: 0.8 }}>Chat</span>
              </>
            )}
          </h3>

          <div className={`transition-collapse ${isListening || isAnswering ? 'collapsed' : ''} text-center`}>
            <p className="intro-text px-md-3 mb-4">
              Ask about emerging threats, vulnerabilities, or attack insights to get real-time intelligence.
            </p>
          </div>

          {isVoiceMode && (
            <div
              className={`status-pill rounded-pill d-flex align-items-center gap-1 shadow-sm  animation-fade-in ${isListening ? 'listening' : 'answering'}`}
              onClick={() => {
                if (!isListening && !isAnswering) setIsListening(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              {isAnswering ? (
                <>ANSWERING <span className="status-dot"></span></>
              ) : isListening ? (
                <>LISTENING <span className="ms-1 text-danger"><i className="bi bi-record-circle"></i></span></>
              ) : (
                <>START SPEAKING <span className="ms-1" style={{ color: '#f87171' }}><i className="bi bi-grid-3x3-gap-fill"></i></span></>
              )}
            </div>
          )}

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
                <div className="chat-bubble ai-answer animation-fade-in ">
                  <div className="mb-1" style={{ color: '#1e293b' }}>Akira:</div>
                  <div>“Here’s your latest intelligence update on ransomware activity impacting hospitality organizations across the Middle East and adjacent global hotel ecosystems.”</div>
                </div>
              )}
              {answeringStep >= 4 && (
                <div className="chat-bubble ai-answer animation-fade-in ">
                  <div className="mb-1" style={{ color: '#1e293b' }}>Conti-lineage Groups</div>
                  <div>“Former Conti affiliates using credential theft and lateral movement to disrupt hotel operations and demand ransom payments.”</div>
                </div>
              )}
              {answeringStep >= 5 && (
                <div className="chat-bubble ai-answer animation-fade-in ">
                  <div className="mb-1" style={{ color: '#1e293b' }}>AI-Enabled Extortion Campaigns</div>
                  <div>“Attackers use AI-generated phishing emails to steal staff credentials and deploy ransomware inside hotel environments.”</div>
                </div>
              )}
              {answeringStep >= 6 && (
                <div className="integenz-response-card w-100 animation-fade-in ">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded-pill">
                      <div className="bg-purple rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', backgroundColor: '#db2777' }}>
                        <BsLightningChargeFill className="text-white" style={{ fontSize: '14px' }} />
                      </div>
                      <span className="" style={{ fontSize: '13.6px', color: '#1e293b' }}>Integenz</span>
                    </div>
                    <button className="btn p-0 text-purple">
                      <FiRefreshCw style={{ fontSize: '16px' }} />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="chip-btn border-0 py-1" style={{ backgroundColor: '#f3f7fb', fontSize: '12px' }}>More detailed narration</button>
                    <button className="chip-btn border-0 py-1" style={{ backgroundColor: '#f3f7fb', fontSize: '12px' }}>Summarize</button>
                    <button className="chip-btn border-0 py-1" style={{ backgroundColor: '#f3f7fb', fontSize: '12px' }}>Active campaigns</button>
                    <button className="chip-btn border-0 py-1" style={{ backgroundColor: '#f3f7fb', fontSize: '12px' }}>Attack trends</button>
                    <button className="chip-btn border-0 py-1" style={{ backgroundColor: '#f3f7fb', fontSize: '12px' }}>Mitigation techniques</button>
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

        </div>

        {/* Footer / Input Area */}
        <div className="drawer-footer px-4 pb-4 position-relative" style={{ zIndex: 2 }}>

          {/* Chips */}
          {/* Chips */}
          <div className={`chips-container d-flex flex-wrap gap-2 mb-4 justify-content-center transition-collapse ${isListening || isAnswering ? 'collapsed' : ''}`}>
            <button className="chip-btn">Latest Threats Summary</button>
            <button className="chip-btn">Critical CVEs Today</button>
            <button className="chip-btn">Active Ransomware Campaigns</button>
            <button className="chip-btn">Phishing Attack Trends</button>
            <button className="chip-btn">Analyze Uploaded IOCs</button>
            <button className="chip-btn">Predict Attack Targets</button>
            <button className="chip-btn">Zero-Day Mitigations</button>
          </div>

          {/* Input Box */}
          <div className={`chat-input-wrapper position-relative w-100 ${isVoiceMode ? 'voice-input-container' : ''}`}>
            {isVoiceMode && (
              <div className={` px-2 mb-3 ${isListening ? 'text-dark lh-sm' : 'text-secondary'}`} style={{ fontSize: '14.1px' }}>
                {isListening ? 'What are some of the active ransomware campaigns targeting hospitality sector in the middle east' : 'Ask about threats, CVEs, or attack activity...'}
              </div>
            )}

            {isVoiceMode ? (
              <div className="voice-input-row mt-2">
                <button className="btn btn-sm bg-white border rounded-circle input-plus-btn d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px' }}>
                  <FiPlus className="text-secondary" />
                </button>
                <div className="flex-grow-1 wave-pill">
                  <i className="bi bi-mic-fill ms-2 me-2" style={{ color: '#a78bfa', fontSize: '17.6px' }}></i>
                  <div className="flex-grow-1 d-flex align-items-center justify-content-center overflow-hidden px-1" style={{ height: '30px', gap: '3px' }}>
                    {[
                      8, 14, 10, 20, 12, 16, 24, 14, 18, 10, 14, 16, 12, 22, 10, 16, 12, 14, 20, 12, 18, 10, 14, 8
                    ].map((h, i) => (
                      <span
                        key={i}
                        style={{
                          width: '3.5px',
                          height: isListening ? `${h}px` : '4px',
                          borderRadius: '50px',
                          backgroundColor: isListening ? '#8b5cf6' : (i > 8 && i < 16 ? '#8b5cf6' : '#c4b5fd'),
                          transition: 'height 0.4s ease'
                        }}></span>
                    ))}
                  </div>
                  <button
                    className="stop-btn flex-shrink-0"
                    onClick={() => setIsListening(false)}
                  >
                    {isListening ? (
                      <div className="stop-icon"></div>
                    ) : (
                      <div className="stop-icon" style={{ borderRadius: '50%' }}></div>
                    )}
                  </button>
                </div>
                <button
                  className="btn rounded-circle input-send-btn d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                  style={{ width: '38px', height: '38px', backgroundColor: isListening ? '#5200ff' : '#f5f3ff', color: isListening ? 'white' : '#c4b5fd', transition: 'all 0.3s ease' }}
                  onClick={() => {
                    if (isListening) {
                      setIsListening(false);
                      setIsAnswering(true);
                    }
                  }}
                >
                  <FiArrowUp />
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-sm bg-white border rounded-circle input-plus-btn shadow-sm d-flex align-items-center justify-content-center position-absolute" style={{ width: '32px', height: '32px', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}>
                  <FiPlus className="text-secondary" />
                </button>

                <textarea
                  className="form-control chat-input-field shadow-sm"
                  placeholder="Ask about threats, CVEs, or attack activity..."
                  rows="1"
                ></textarea>

                <button className="btn rounded-circle input-send-btn shadow-sm d-flex align-items-center justify-content-center position-absolute text-white" style={{ width: '38px', height: '38px', right: '12px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#5200ff', zIndex: 5 }}>
                  <FiArrowUp />
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Voicechatdrawer;
