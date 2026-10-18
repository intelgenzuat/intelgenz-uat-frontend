import React, { useState, useEffect, useRef } from 'react';
import './intelegenzchatdrawer.scss';
import { BiHelpCircle } from 'react-icons/bi';
import { FiChevronDown, FiPlus, FiArrowUp, FiShield, FiCrosshair, FiGlobe, FiAlertTriangle, FiArrowRight, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { BsLightningChargeFill, BsFillMicFill } from 'react-icons/bs';
import { LuHistory, LuBoxes } from 'react-icons/lu';
import ReactMarkdown from 'react-markdown';
import { chatWsUrl, chatHttpUrl } from '../../Context/chat';
import man from '../../assets/images/man.jpg';
import logoonly from '../../assets/images/logoonly.png';
import ChatHistorySidebar from './ChatHistorySidebar';
import { 
    getChatHistory, 
    saveChatSession, 
    getActiveSessionId, 
    setActiveSessionId 
} from '../../utils/chatHistory';

const Intelegenzchatdrawer = ({ isOpen, onClose, onEnableVoiceChat, isExpanded: propIsExpanded, onToggleExpand }) => {
    const [localIsExpanded, setLocalIsExpanded] = useState(false);
    const isExpanded = propIsExpanded !== undefined ? propIsExpanded : localIsExpanded;

    const toggleExpand = () => {
        const nextExpanded = !isExpanded;
        if (onToggleExpand) {
            onToggleExpand(nextExpanded);
        } else {
            setLocalIsExpanded(nextExpanded);
        }
        setIsHistoryOpen(nextExpanded);
    };

    const [chatState, setChatState] = useState('idle'); // idle | loading | done
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [enableNeura, setEnableNeura] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const chatBodyRef = useRef(null);
    const textareaRef = useRef(null);
    const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
    const wsRef = useRef(null);

    const toggleHistory = () => {
        setIsHistoryOpen(prev => {
            const next = !prev;
            if (next && !isExpanded) {
                if (onToggleExpand) {
                    onToggleExpand(true);
                } else {
                    setLocalIsExpanded(true);
                }
            }
            return next;
        });
    };

    const connectWebSocket = () => {
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            return;
        }
        const ws = new WebSocket(`${chatWsUrl}?session_id=${sessionId}`);
        
        ws.onopen = () => {
            console.log('Chat WebSocket connected');
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'response') {
                setChatState('done');
                setMessages(prev => {
                    const updated = [...prev, { sender: 'ai', text: data.response }];
                    saveChatSession({ id: sessionId, messages: updated });
                    return updated;
                });
            } else if (data.type === 'error') {
                setChatState('done');
                setMessages(prev => {
                    const updated = [...prev, { sender: 'ai', text: data.response, isError: true }];
                    saveChatSession({ id: sessionId, messages: updated });
                    return updated;
                });
            }
        };
        
        ws.onclose = () => {
            console.log('Chat WebSocket disconnected');
        };
        
        wsRef.current = ws;
    };

    // Reset when drawer closes or load active session when opens
    useEffect(() => {
        if (!isOpen) {
            setChatState('idle');
            setMessages([]);
            setInputValue('');
            setSessionId(crypto.randomUUID());
            setLocalIsExpanded(false);
            setIsHistoryOpen(false);
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        } else {
            const activeId = getActiveSessionId();
            if (activeId) {
                const history = getChatHistory();
                const session = history.find(s => s.id === activeId);
                if (session && session.messages && session.messages.length > 0) {
                    setSessionId(session.id);
                    setMessages(session.messages);
                    setChatState('done');
                } else {
                    connectWebSocket();
                }
            } else {
                connectWebSocket();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Auto-scroll when state changes
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatState, messages]);

    const handleSelectSession = (session) => {
        if (!session) return;
        setSessionId(session.id);
        setActiveSessionId(session.id);
        setMessages(session.messages || []);
        setChatState((session.messages && session.messages.length > 0) ? 'done' : 'idle');
        if (window.innerWidth < 680) {
            setIsHistoryOpen(false);
        }
    };

    const handleNewChat = () => {
        setChatState('idle');
        setMessages([]);
        setInputValue('');
        const newId = crypto.randomUUID();
        setSessionId(newId);
        setActiveSessionId(newId);
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    };

    const handleSendMsg = async (textToSend) => {
        if (!textToSend.trim()) return;
        const userMsg = { sender: 'user', text: textToSend.trim() };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        saveChatSession({ id: sessionId, messages: updatedMessages });
        setChatState('loading');
        setInputValue('');
        resetTextareaHeight();
        
        const payload = {
            message: textToSend.trim(),
            session_id: sessionId,
            enable_neura: enableNeura
        };
        
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
            connectWebSocket();
        }

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        } else {
            try {
                const response = await fetch(chatHttpUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                setChatState('done');
                const finalMessages = [...updatedMessages, { sender: 'ai', text: data.response }];
                setMessages(finalMessages);
                saveChatSession({ id: sessionId, messages: finalMessages });
            } catch (error) {
                setChatState('done');
                const errMessages = [...updatedMessages, { sender: 'ai', text: 'Error connecting to the service.', isError: true }];
                setMessages(errMessages);
                saveChatSession({ id: sessionId, messages: errMessages });
            }
        }
    };

    const handleChipClick = (label) => {
        handleSendMsg(label);
    };

    const handleSend = () => {
        handleSendMsg(inputValue);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e) => {
        setInputValue(e.target.value);
        e.target.style.height = 'auto'; // Reset height completely to allow shrinking
        e.target.style.height = `${e.target.scrollHeight}px`; // Set to scrollHeight
    };

    const resetTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const isInChat = chatState !== 'idle';

    return (
        <>
            <div className={`intelegenzchat-drawer ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''} ${isHistoryOpen ? 'has-history-open' : ''}`}>

                {/* ── Header ── */}
                <div className="drawer-header px-4 py-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <h4 className="mb-0" style={{ fontWeight: 600 }}>
                            {isInChat ? 'Report Chat' : 'Report Chat'}
                        </h4>
                        <BiHelpCircle className="help-icon mt-1" />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            className="btn voice-chat-header-btn d-flex align-items-center gap-2"
                            onClick={onEnableVoiceChat}
                            title="Enable Voice Chat"
                            aria-label="Enable Voice Chat"
                        >
                            <div className="voice-mic-badge d-flex align-items-center justify-content-center">
                                <BsFillMicFill className="voice-mic-icon" />
                            </div>
                            <span className="voice-btn-label">Voice Chat</span>
                        </button>
                        <button
                            className="btn drawer-expand-btn rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: '36px', height: '36px' }}
                            onClick={toggleExpand}
                            title={isExpanded ? "Collapse chat width" : "Expand chat width"}
                            aria-label={isExpanded ? "Collapse chat width" : "Expand chat width"}
                        >
                            {isExpanded ? (
                                <FiMinimize2 className="drawer-expand-icon" style={{ fontSize: '16px' }} />
                            ) : (
                                <FiMaximize2 className="drawer-expand-icon" style={{ fontSize: '16px' }} />
                            )}
                        </button>
                        <button
                            className="btn drawer-close-btn rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: '36px', height: '36px' }}
                            onClick={onClose}
                            title="Close Chat"
                            aria-label="Close Chat"
                        >
                            <FiChevronDown className="drawer-close-icon" style={{ fontSize: '18px' }} />
                        </button>
                    </div>
                </div>

                {/* ── Content Layout (Sidebar + Chat Area) ── */}
                <div className="drawer-content-layout">
                    {/* Chat History Sidebar */}
                    <ChatHistorySidebar
                        isOpen={isHistoryOpen}
                        onClose={() => setIsHistoryOpen(false)}
                        currentSessionId={sessionId}
                        onSelectSession={handleSelectSession}
                        onNewChat={handleNewChat}
                    />

                    {/* Main Chat Area */}
                    <div className="drawer-main-chat">

                {/* ── Body ── */}
                {!isInChat ? (
                    /* IDLE: centered logo + description */
                    <div className="drawer-body px-4 d-flex flex-column flex-grow-1 align-items-center justify-content-center my-auto">
                        <div className="logo-container mb-3 d-flex justify-content-center align-items-center mx-auto">
                            <img
                                src={logoonly}
                                alt="Integenz Logo"
                                style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                            />
                        </div>
                        <h3 className="mb-2 mt-1 chat-title-gradient">
                            Integenz Chat
                        </h3>
                        <div className="enable-neura-container mb-3 d-flex align-items-center justify-content-center">
                            <label className="enable-neura-label d-flex align-items-center gap-2" htmlFor="enable-neura-checkbox">
                                <input
                                    type="checkbox"
                                    id="enable-neura-checkbox"
                                    className="enable-neura-checkbox form-check-input"
                                    checked={enableNeura}
                                    onChange={(e) => setEnableNeura(e.target.checked)}
                                />
                                <span className="enable-neura-text">Enable Neura</span>
                            </label>
                        </div>
                        <p className="text-secondary text-center px-md-3 mb-5">
                            Ask about emerging threats, vulnerabilities, or attack insights to get real-time intelligence.
                        </p>
                    </div>
                ) : (
                    /* CHAT: message thread */
                    <div
                        ref={chatBodyRef}
                        className="drawer-chat-body px-3 flex-grow-1 d-flex flex-column gap-3 py-3"
                    >
                        {messages.map((msg, idx) => (
                            msg.sender === 'user' ? (
                                <div key={idx} className="user-message-container animation-fade-in w-100 mb-3 p-4 shadow-sm border">
                                    <div className="d-inline-flex align-items-center gap-2 mb-3 px-2 py-1 user-pill-badge rounded-pill shadow-sm border">
                                        <div className="user-avatar-wrap" style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                                            <img src={man} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <span className="sender-name">Manesh mani</span>
                                    </div>
                                    <p className="user-bubble-text mb-0 ps-1">{msg.text}</p>
                                </div>
                            ) : (
                                <div key={idx} className="intelgenz-response-row animation-fade-in">
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <div className="intelgenz-icon-wrap">
                                            <BsLightningChargeFill className="text-white" style={{ fontSize: '13px' }} />
                                        </div>
                                        <span className="sender-name" style={{ fontWeight: 600 }}>Integenz</span>
                                    </div>
                                    <div className="response-content shadow-sm border">
                                        {msg.isError ? (
                                            <p className="text-danger mb-0" style={{ fontSize: '14.5px' }}>{msg.text}</p>
                                        ) : (
                                            <ReactMarkdown components={{
                                                p: ({node, ...props}) => <p className="markdown-p mb-3" style={{ fontSize: '14.5px', lineHeight: '1.6' }} {...props} />,
                                                ul: ({node, ...props}) => <ul className="markdown-list ps-3 mb-4" style={{ fontSize: '14.5px', lineHeight: '1.6' }} {...props} />,
                                                ol: ({node, ...props}) => <ol className="markdown-list ps-3 mb-4" style={{ fontSize: '14.5px', lineHeight: '1.6' }} {...props} />,
                                                li: ({node, ...props}) => <li className="markdown-li mb-2" {...props} />,
                                                h1: ({node, ...props}) => <h1 className="markdown-h1 mb-3 mt-4" style={{ fontSize: '1.5rem', fontWeight: 600 }} {...props} />,
                                                h2: ({node, ...props}) => <h2 className="markdown-h2 mb-3 mt-4" style={{ fontSize: '1.3rem', fontWeight: 600 }} {...props} />,
                                                h3: ({node, ...props}) => <h3 className="markdown-h3 mb-3 mt-4" style={{ fontSize: '1.1rem', fontWeight: 600 }} {...props} />,
                                                h4: ({node, ...props}) => <h4 className="markdown-h4 mb-3 mt-4" style={{ fontSize: '1rem', fontWeight: 600 }} {...props} />,
                                                strong: ({node, ...props}) => <strong className="markdown-strong" style={{ fontWeight: 600 }} {...props} />
                                            }}>
                                                {msg.text}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            )
                        ))}

                        {/* Loading block at bottom */}
                        {chatState === 'loading' && (
                            <div className="intelgenz-response-row animation-fade-in">
                                <div className="d-flex align-items-center gap-2 mb-3">
                                    <div className="intelgenz-icon-wrap pulsing">
                                        <BsLightningChargeFill className="text-white" style={{ fontSize: '13px' }} />
                                    </div>
                                    <span className="sender-name" style={{ fontWeight: 600 }}>Integenz</span>
                                    <button
                                        className="btn p-0 ms-auto"
                                        style={{ lineHeight: 1 }}
                                        onClick={() => { 
                                            setChatState('done'); 
                                            setMessages(prev => [...prev, { sender: 'ai', text: 'Response stopped.' }]);
                                        }}
                                        title="Stop"
                                    >
                                        <div style={{ width: '11px', height: '11px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
                                    </button>
                                </div>
                                <div className="d-flex align-items-center gap-1 ps-1 mb-1">
                                    <span className="loading-dot" style={{ animationDelay: '0s' }} />
                                    <span className="loading-dot" style={{ animationDelay: '0.18s' }} />
                                    <span className="loading-dot" style={{ animationDelay: '0.36s' }} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Footer / Input ── */}
                <div className="drawer-footer px-4 pb-4">

                    {/* Chips — idle only */}
                    {!isInChat && (
                        <div className="chips-container d-flex flex-wrap gap-2 mb-4 justify-content-center">
                            {[
                                'Report Summary',
                                'Threat Landscape',
                                'Sector',
                                'Industry',
                                'Mitigations Methods',
                            ].map(label => (
                                <button key={label} className="chip-btn" onClick={() => handleChipClick(label)}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}


                    {/* Input box */}
                    {isInChat ? (
                        /* Chat state: single bordered card wrapping textarea + footer buttons */
                        <div className="chat-input-wrapper chat-input-wrapper--chat position-relative">
                            {chatState === 'loading' && <div className="dreamy-gradient-bg"></div>}
                            <textarea
                                ref={textareaRef}
                                className="form-control chat-input-field"
                                placeholder="Ask about threats, CVEs, or attack activity..."
                                rows="1"
                                value={inputValue}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                style={{ overflow: 'hidden', resize: 'none', position: 'relative', zIndex: 2 }}
                            />
                            <div className="chat-footer-actions d-flex justify-content-between align-items-center mt-2" style={{ position: 'relative', zIndex: 2 }}>
                                <button 
                                    className={`btn rounded-circle footer-icon-btn d-flex align-items-center justify-content-center ${isHistoryOpen ? 'active' : ''}`}
                                    onClick={toggleHistory}
                                    title={isHistoryOpen ? "Collapse chat history" : "Expand chat history"}
                                    aria-label="Toggle chat history"
                                >
                                    <LuHistory className="footer-history-icon" style={{ fontSize: '19.2px' }} />
                                </button>
                                <button 
                                    className="btn rounded-circle d-flex align-items-center justify-content-center text-white" 
                                    style={{ width: '38px', height: '38px', backgroundColor: '#5200ff', border: 'none', boxShadow: '0 2px 4px rgba(82, 0, 255, 0.3)' }}
                                    onClick={handleSend}
                                >
                                    <FiArrowUp style={{ fontSize: '17.6px' }} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Idle state: textarea with absolute plus + send */
                        <div className="chat-input-wrapper position-relative w-100">
                            <textarea
                                ref={textareaRef}
                                className="form-control chat-input-field shadow-sm"
                                placeholder="Ask about threats, CVEs, or attack activity..."
                                rows="1"
                                value={inputValue}
                                onChange={handleInput}
                                onKeyDown={handleKeyDown}
                                style={{ overflow: 'hidden', resize: 'none' }}
                            />
                            <button
                                className="btn btn-sm drawer-plus-btn border rounded-circle input-plus-btn shadow-sm d-flex align-items-center justify-content-center position-absolute"
                                style={{ width: '32px', height: '32px', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 5 }}
                            >
                                <FiPlus className="drawer-plus-icon" />
                            </button>
                            <button
                                className="btn rounded-circle input-send-btn shadow-sm d-flex align-items-center justify-content-center position-absolute text-white"
                                style={{ width: '38px', height: '38px', right: '12px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#5200ff', zIndex: 5 }}
                                onClick={handleSend}
                            >
                                <FiArrowUp style={{ fontSize: '17.6px' }} />
                            </button>
                        </div>
                    )}
                </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Intelegenzchatdrawer;
