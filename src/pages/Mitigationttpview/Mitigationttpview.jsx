import React, { useEffect, useRef, useState } from 'react';
import MitigationSidebar from '../../components/sidebars/MitigationSidebar';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../../assets/styles/view/View.scss';
import '../../assets/styles/mitigation/Mitigationttpview.scss';
import MitigationView from './MitigationView';
import Nist from './Nist';
import Defend from './Defend';
import TTPview from './TTPview';
import DefenseConvergenceTopContent from './DefenseConvergenceTopContent';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import Voicechatdrawer from '../../components/Drawers/Voicechatdrawer';
import Intelegenzchatdrawer from '../../components/Drawers/Intelegenzchatdrawer';
import { useFormik } from 'formik';
import { getThreatTTP, sendThreatDefend } from '../../Context/ThreatTTP';

const Mitigationttpview = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [activeViewTab, setActiveViewTab] = useState('ttp');
    const [showOverlaps, setShowOverlaps] = useState(false);
    const { isSidebarCollapsed, toggleSidebar } = useOutletContext() || {};
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isVoicechatDrawerOpen, setIsVoicechatDrawerOpen] = useState(false);
    const [data, setData] = useState([]);
    const [threatData, setthreatData] = useState([]);
    const [pending, setPending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);
    const searchWrapperRef = useRef(null);

    // Malwares list and selected IDs synced with localStorage (starts empty until user selects from search)
    const [threatlist, setthreatlist] = useState(() => {
        try {
            const saved = localStorage.getItem('selected_threat');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Error reading selected_threat from localStorage:", e);
        }
        return [];
    });

    const [selectedMalware, setSelectedMalware] = useState(() => {
        try {
            const saved = localStorage.getItem('selected_threat_ids');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Error reading selected_threat_ids from localStorage:", e);
        }
        return [];
    });

    const viewTabs = [
        { key: 'ttp', label: 'TTP View' },
        { key: 'mitigation', label: 'D3FEND' },
        { key: 'nist', label: 'NIST' },
    ];

    const [isLoader, setIsLoader] = useState(false);

    // Helper to extract only valid numeric actor_ids / malware_ids from localStorage / selected malwares
    const getSavedMalwareNumericIds = (formikValues = null) => {
        let savedMalwares = [];
        let savedSelectedIds = [];

        try {
            const storedMalwares = localStorage.getItem('selected_threat');
            if (storedMalwares) {
                const parsed = JSON.parse(storedMalwares);
                if (Array.isArray(parsed)) {
                    savedMalwares = parsed;
                }
            }
        } catch (e) {
            console.error("Error parsing stored malwares:", e);
        }

        try {
            const storedIds = localStorage.getItem('selected_threat_ids');
            if (storedIds) {
                const parsed = JSON.parse(storedIds);
                if (Array.isArray(parsed)) {
                    savedSelectedIds = parsed;
                }
            }
        } catch (e) {
            console.error("Error parsing stored ids:", e);
        }

        const currentList = Array.isArray(savedMalwares) && savedMalwares.length > 0 ? savedMalwares : (Array.isArray(threatlist) ? threatlist : []);
        const currentSelected = Array.isArray(savedSelectedIds) && savedSelectedIds.length > 0
            ? savedSelectedIds
            : (formikValues?.actor_ids && Array.isArray(formikValues.actor_ids) && formikValues.actor_ids.length > 0)
                ? formikValues.actor_ids
                : (formikValues?.malware_ids && Array.isArray(formikValues.malware_ids) && formikValues.malware_ids.length > 0)
                    ? formikValues.malware_ids
                    : (Array.isArray(selectedMalware) ? selectedMalware : []);

        const resultIds = [];

        const extractNum = (val) => {
            if (val === null || val === undefined || typeof val === 'boolean') return null;
            if (typeof val === 'number') return isNaN(val) ? null : val;
            if (typeof val === 'string') {
                if (val.startsWith('threat-') || val.startsWith('malware-')) return null;
                const num = Number(val);
                return isNaN(num) ? null : num;
            }
            if (typeof val === 'object') {
                const innerId = val.actor_id ?? val.malware_id ?? val.id;
                if (innerId !== undefined && innerId !== val) {
                    return extractNum(innerId);
                }
            }
            return null;
        };

        currentList.forEach((m) => {
            if (!m || typeof m !== 'object') return;
            const num = extractNum(m.actor_id) ?? extractNum(m.malware_id) ?? extractNum(m.id);
            if (num !== null && !resultIds.includes(num)) {
                resultIds.push(num);
            }
        });

        if (Array.isArray(currentSelected)) {
            currentSelected.forEach((item) => {
                const num = extractNum(item);
                if (num !== null && !resultIds.includes(num)) {
                    resultIds.push(num);
                }
            });
        }

        return resultIds;
    };

    const formik = useFormik({
        initialValues: {
            malware_ids: getSavedMalwareNumericIds(),
            actor_ids: getSavedMalwareNumericIds(),
        },
        enableReinitialize: true,
        validate: (values) => {
            let errors = {};
            const numericIds = getSavedMalwareNumericIds(values);

            if (!numericIds || numericIds.length === 0) {
                errors.malware_ids = 'Please select at least one valid threat actor';
            }

            return errors;
        },

        onSubmit: (values) => {
            const numericIds = getSavedMalwareNumericIds(values);

            const payload = {
                actor_ids: numericIds,
                malware_ids: numericIds,
            };

            console.log('Sending sendThreatDefend payload:', payload);

            setIsLoader(true);
            sendThreatDefend(payload)((response) => {
                setIsLoader(false);
                console.log('sendThreatDefend API response:', response);
                setthreatData(response?.data);
            });
        },
    });

    const handleToggleMalware = (threatId) => {
        setSelectedMalware((prev) => {
            const updated = prev.includes(threatId)
                ? prev.filter((id) => id !== threatId)
                : [...prev, threatId];
            try {
                localStorage.setItem('selected_threat_ids', JSON.stringify(updated));
            } catch (e) {
                console.error(e);
            }
            return updated;
        });
    };

    const handleClearOrSelectAll = () => {
        setthreatlist([]);
        setSelectedMalware([]);
        setthreatData([]);
        try {
            localStorage.removeItem('selected_threat');
            localStorage.removeItem('selected_threat_ids');
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemoveMalware = (threatId) => {
        const updatedList = threatlist.filter((m) => m.id !== threatId && m.actor_id !== threatId);
        const updatedSelected = selectedMalware.filter((id) => id !== threatId);
        setthreatlist(updatedList);
        setSelectedMalware(updatedSelected);
        if (updatedList.length === 0) {
            setthreatData([]);
        }
        try {
            localStorage.setItem('selected_threat', JSON.stringify(updatedList));
            localStorage.setItem('selected_threat_ids', JSON.stringify(updatedSelected));
        } catch (e) {
            console.error(e);
        }
    };

    const handleSelectSuggestion = (item) => {
        const itemName = typeof item === 'string'
            ? item
            : item?.name || item?.threat_name || item?.actor_name || item?.malware_name || item?.label || item?.title || item?.value || '';

        if (!itemName) return;

        const rawActorId = item?.actor_id !== undefined && item?.actor_id !== null ? item.actor_id : undefined;
        const rawMalwareId = item?.malware_id !== undefined && item?.malware_id !== null ? item.malware_id : undefined;
        const rawNumId = typeof item?.id === 'number' ? item.id : (typeof item?.id === 'string' && !item.id.startsWith('malware-') && !item.id.startsWith('threat-') && !isNaN(Number(item.id)) ? Number(item.id) : undefined);

        const realActorId = rawActorId !== undefined
            ? (typeof rawActorId === 'number' || !isNaN(Number(rawActorId)) ? Number(rawActorId) : rawActorId)
            : (rawMalwareId !== undefined
                ? (typeof rawMalwareId === 'number' || !isNaN(Number(rawMalwareId)) ? Number(rawMalwareId) : rawMalwareId)
                : rawNumId);

        let targetId;
        const existingMalware = threatlist.find(
            (m) => (m.name && typeof m.name === 'string' && m.name.toLowerCase() === String(itemName).toLowerCase()) ||
                (realActorId !== undefined && (m.actor_id === realActorId || m.id === realActorId || m.malware_id === realActorId)) ||
                (item.id !== undefined && m.id === item.id)
        );

        if (existingMalware) {
            targetId = existingMalware.actor_id !== undefined && (typeof existingMalware.actor_id === 'number' || !String(existingMalware.actor_id).startsWith('malware-'))
                ? existingMalware.actor_id
                : (realActorId ?? existingMalware.id);
        } else {
            targetId = realActorId ?? (typeof item?.id === 'number' ? item.id : undefined) ?? `threat-${Date.now()}`;
            const newMalware = {
                ...(typeof item === 'object' && item !== null ? item : {}),
                id: targetId,
                actor_id: realActorId ?? targetId,
                name: String(itemName),
                ...(realActorId !== undefined ? { id: realActorId, actor_id: realActorId } : {})
            };
            const updatedList = [...threatlist, newMalware];
            setthreatlist(updatedList);
            try {
                localStorage.setItem('selected_threat', JSON.stringify(updatedList));
            } catch (e) {
                console.error(e);
            }
        }

        // Save real actor_id / targetId into selected_threat_ids in localStorage
        setSelectedMalware((prev) => {
            const updated = prev.includes(targetId) ? prev : [...prev, targetId];
            try {
                localStorage.setItem('selected_threat_ids', JSON.stringify(updated));
            } catch (e) {
                console.error(e);
            }
            return updated;
        });

        setSearchQuery('');
        setData([]);
        setShowSuggestions(false);
    };

    const getThreatTTPData = (query = '') => {
        setPending(true);
        getThreatTTP({ query: query, limit: 10 })((response) => {
            console.log("API Response:", response);
            let results = [];
            if (Array.isArray(response)) {
                results = response;
            } else if (response?.data?.results) {
                results = response.data.results;
            } else if (response?.results) {
                results = response.results;
            } else if (response?.data && Array.isArray(response.data)) {
                results = response.data;
            }
            if (response && (response.status === 200 || results.length >= 0)) {
                setData(results);
            }
            setPending(false);
        });
    };

    useEffect(() => {
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery.length < 2) {
            setData([]);
            return;
        }

        const handler = setTimeout(() => {
            getThreatTTPData(trimmedQuery);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="view-page-container container-fluid p-0 d-flex flex-column h-100 overflow-hidden">
            <div className="d-flex flex-grow-1 overflow-hidden" style={{ minHeight: 0 }}>
                {/* Sidebar */}
                <div className="flex-shrink-0">
                    <MitigationSidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        collapsed={isSidebarCollapsed}
                        toggleSidebar={toggleSidebar}
                    />
                </div>

                {/* Main Content — y-scrollable */}
                <div
                    className="d-flex flex-column flex-grow-1 bg-white"
                    style={{ minHeight: 0, overflowY: 'auto' }}
                >
                    <div className="mitigation-ttp-view d-flex flex-column">

                        <DefenseConvergenceTopContent category="Threat Actor" activeViewTab={activeViewTab} />

                        <div className="view-controls-card flex-shrink-0 mx-4 mb-4">
                            <div className="view-controls-section d-flex flex-column align-items-stretch gap-3">
                                {/* Search bar */}
                                {(() => {
                                    const isSearchDisabled = activeViewTab === 'nist' || activeViewTab === 'mitigation';
                                    const hasMinChars = searchQuery.trim().length >= 2;

                                    return (
                                        <div
                                            className={`threat-actor-search-section d-flex align-items-center justify-content-start gap-3${isSearchDisabled ? ' disabled' : ''}`}
                                        >
                                            <div className="d-flex flex-column">
                                                <span
                                                    className={`fw-medium ${isSearchDisabled ? 'text-muted' : 'text-dark'}`}
                                                    style={{ fontSize: '14.5px' }}
                                                >
                                                    Enter Threat Actor Name
                                                </span>
                                            </div>
                                            <div className="search-wrapper position-relative m-0" ref={searchWrapperRef}>
                                                <i
                                                    className="bi bi-search position-absolute text-muted"
                                                    style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                                                ></i>
                                                <input
                                                    type="text"
                                                    className="form-control rounded-pill ps-5 pe-5"
                                                    placeholder="Search Threat Actor to add"
                                                    disabled={isSearchDisabled}
                                                    autoComplete="off"
                                                    value={searchQuery}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setSearchQuery(val);
                                                        if (val.trim().length >= 2) {
                                                            setShowSuggestions(true);
                                                        } else {
                                                            setShowSuggestions(false);
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        if (searchQuery.trim().length >= 2) {
                                                            setShowSuggestions(true);
                                                        }
                                                    }}
                                                />
                                                <i
                                                    className="bi bi-filter position-absolute text-muted"
                                                    style={{ right: '16px', top: '50%', transform: 'translateY(-50%)' }}
                                                ></i>

                                                {/* Suggestions Dropdown */}
                                                {showSuggestions && !isSearchDisabled && hasMinChars && (
                                                    <div className="search-suggestions-dropdown">
                                                        {pending ? (
                                                            <div className="suggestion-loading">
                                                                <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div>
                                                                <span>Loading suggestions...</span>
                                                            </div>
                                                        ) : data && data.length > 0 ? (
                                                            <ul className="suggestion-list">
                                                                {data.map((item, index) => {
                                                                    const itemName = typeof item === 'string'
                                                                        ? item
                                                                        : item?.name || item?.malware_name || item?.threat_name || item?.actor_name || item?.label || item?.title || item?.value || '';
                                                                    const itemKey = item?.id || item?._id || index;

                                                                    return (
                                                                        <li
                                                                            key={itemKey}
                                                                            className="suggestion-item"
                                                                            onMouseDown={(e) => {
                                                                                e.preventDefault();
                                                                                handleSelectSuggestion(item);
                                                                            }}
                                                                        >
                                                                            <span className="suggestion-text">{String(itemName)}</span>
                                                                            {item?.aliases && item.aliases.length > 0 && (
                                                                                <span className="badge bg-light text-secondary ms-2 text-truncate" style={{ maxWidth: '120px' }}>
                                                                                    {Array.isArray(item.aliases) ? item.aliases.join(', ') : String(item.aliases)}
                                                                                </span>
                                                                            )}
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        ) : (
                                                            <div className="suggestion-empty">
                                                                <span>No malware found</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Buttons Row pushed to end */}
                                            <div className="ms-auto d-flex align-items-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn show-btn text-white flex-shrink-0"
                                                    style={{
                                                        cursor: isLoader ? 'not-allowed' : 'pointer',
                                                        opacity: isLoader ? 0.75 : 1
                                                    }}
                                                    onClick={formik.handleSubmit}
                                                    disabled={isLoader}
                                                >
                                                    {isLoader && (
                                                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
                                                    )}
                                                    <span>Submit</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn clear-all-btn flex-shrink-0"
                                                    onClick={handleClearOrSelectAll}
                                                >
                                                    Clear all <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Threat Actors Section with Accordion */}
                                <div className="threat-actors-section w-100">
                                    <div
                                        className="d-flex align-items-center justify-content-between cursor-pointer user-select-none"
                                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <span className="section-title">THREAT ACTORS :</span>
                                            <span className="selected-badge">{selectedMalware.length} Selected</span>
                                        </div>
                                        <div className="accordion-toggle-icon d-flex align-items-center text-muted" style={{ fontSize: '16px' }}>
                                            <i className={`bi ${isAccordionOpen ? 'bi-dash' : 'bi-plus'}`}></i>
                                        </div>
                                    </div>

                                    {isAccordionOpen && (
                                        <div className="accordion-content mt-3">
                                            <div className="pills-container m-0 mt-0">
                                                {threatlist.map((malware, idx) => {
                                                    const malwareKey = malware.actor_id ?? malware.id;
                                                    const isSelected = selectedMalware.includes(malware.id) || (malware.actor_id !== undefined && selectedMalware.includes(malware.actor_id));
                                                    const displayName = typeof malware.name === 'string' ? malware.name : (malware.name ? String(malware.name) : 'Threat Actor');
                                                    return (
                                                        <div
                                                            key={malware.id ?? malware.actor_id ?? idx}
                                                            className={`actor-pill cursor-pointer ${isSelected ? 'active' : ''}`}
                                                            onClick={() => handleToggleMalware(malwareKey)}
                                                        >
                                                            <div className="dot" style={{ backgroundColor: idx % 2 === 0 ? '#3b82f6' : '#5200ff' }}></div>
                                                            <span>{displayName}</span>
                                                            <i className={`bi ${isSelected ? 'bi-check-square-fill' : 'bi-square text-muted'}`}></i>
                                                            {handleRemoveMalware && (
                                                                <i
                                                                    className="bi bi-x chip-close-icon ms-1"
                                                                    title="Remove malware"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveMalware(malwareKey);
                                                                    }}
                                                                ></i>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {formik.errors.malware_ids && (
                                                <div className="text-danger mt-2 ms-1" style={{ fontSize: '12px' }}>
                                                    {formik.errors.malware_ids}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tab Content */}
                        {activeViewTab === 'ttp' && (
                            <TTPview
                                showOverlaps={showOverlaps}
                                setShowOverlaps={setShowOverlaps}
                                activeViewTab={activeViewTab}
                                setActiveViewTab={setActiveViewTab}
                                viewTabs={viewTabs}
                                threatlist={threatlist}
                                selectedMalware={selectedMalware}
                                onToggleMalware={handleToggleMalware}
                                onClearOrSelectAll={handleClearOrSelectAll}
                                onRemoveMalware={handleRemoveMalware}
                                onShow={formik.handleSubmit}
                                isLoader={isLoader}
                                formikError={formik.errors.malware_ids}
                                threatData={threatData}
                            />
                        )}
                        {activeViewTab === 'mitigation' && (
                            <Defend
                                showOverlaps={showOverlaps}
                                setShowOverlaps={setShowOverlaps}
                                activeViewTab={activeViewTab}
                                setActiveViewTab={setActiveViewTab}
                                viewTabs={viewTabs}
                                threatlist={threatlist}
                                selectedMalware={selectedMalware}
                                onToggleMalware={handleToggleMalware}
                                onClearOrSelectAll={handleClearOrSelectAll}
                                onRemoveMalware={handleRemoveMalware}
                                onShow={formik.handleSubmit}
                                isLoader={isLoader}
                                formikError={formik.errors.malware_ids}
                                threatData={threatData}
                            />
                        )}
                        {activeViewTab === 'nist' && (
                            <Nist
                                showOverlaps={showOverlaps}
                                setShowOverlaps={setShowOverlaps}
                                activeViewTab={activeViewTab}
                                setActiveViewTab={setActiveViewTab}
                                viewTabs={viewTabs}
                                threatlist={threatlist}
                                selectedMalware={selectedMalware}
                                onToggleMalware={handleToggleMalware}
                                onClearOrSelectAll={handleClearOrSelectAll}
                                onRemoveMalware={handleRemoveMalware}
                                onShow={formik.handleSubmit}
                                isLoader={isLoader}
                                formikError={formik.errors.malware_ids}
                                threatData={threatData}
                            />
                        )}

                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            <FloatingChatButtons onIntelgenzOpen={() => setIsDrawerOpen(true)} />

            {/* Drawers */}
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
