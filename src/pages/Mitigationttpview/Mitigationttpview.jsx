import React, { useEffect, useRef, useState, useMemo } from 'react';
import Select, { components } from 'react-select';
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
import toast from 'react-hot-toast';
import { getThreatTTP, sendThreatDefend } from '../../Context/ThreatTTP';

// Custom sub-components for pill-styled search select
const CustomValueContainer = ({ children, ...props }) => (
    <components.ValueContainer {...props}>
        <i
            className="bi bi-search text-muted"
            style={{
                fontSize: "13.5px",
                marginLeft: "8px",
                marginRight: "6px",
                flexShrink: 0
            }}
        />
        {children}
    </components.ValueContainer>
);

const CustomDropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <i
            className="bi bi-filter text-muted"
            style={{
                fontSize: "15px",
                marginRight: "4px"
            }}
        />
    </components.DropdownIndicator>
);

const CustomOption = (props) => {
    const { data } = props;
    return (
        <components.Option {...props}>
            <div className="d-flex align-items-center justify-content-between w-100">
                <span className="suggestion-text">{data.label}</span>
                {data.aliases && (Array.isArray(data.aliases) ? data.aliases.length > 0 : String(data.aliases).trim().length > 0) && (
                    <span className="badge bg-light text-secondary ms-2 text-truncate" style={{ maxWidth: '120px' }}>
                        {Array.isArray(data.aliases) ? data.aliases.join(', ') : String(data.aliases)}
                    </span>
                )}
            </div>
        </components.Option>
    );
};

const CHIP_COLORS = [
    '#2563eb', // Royal Blue
    '#f97316', // Vivid Orange
    '#10b981', // Emerald Green
    '#8b5cf6', // Vivid Purple
    '#e11d48', // Crimson
    '#eab308', // Golden Yellow
    '#06b6d4', // Sky Cyan
    '#d946ef', // Fuchsia
    '#14b8a6', // Deep Teal
    '#84cc16', // Lime Green
];

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

    // Helper to extract numeric ID
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

    // Helper to extract only valid numeric actor_ids / malware_ids for checked malwares
    const getCheckedNumericIds = (selectedIds = selectedMalware, currentThreatList = threatlist) => {
        const resultIds = [];
        const list = Array.isArray(currentThreatList) ? currentThreatList : [];
        const selected = Array.isArray(selectedIds) ? selectedIds : [];

        list.forEach((m) => {
            if (!m || typeof m !== 'object') return;
            const isChecked =
                (m.id !== undefined && selected.includes(m.id)) ||
                (m.actor_id !== undefined && selected.includes(m.actor_id)) ||
                (m.malware_id !== undefined && selected.includes(m.malware_id)) ||
                (m.name && selected.includes(m.name));

            if (isChecked) {
                const num = extractNum(m.actor_id) ?? extractNum(m.malware_id) ?? extractNum(m.id);
                if (num !== null && !resultIds.includes(num)) {
                    resultIds.push(num);
                }
            }
        });

        selected.forEach((item) => {
            const num = extractNum(item);
            if (num !== null && !resultIds.includes(num)) {
                resultIds.push(num);
            }
        });

        return resultIds;
    };

    const fetchThreatDefendData = (selectedIds = selectedMalware, currentThreatList = threatlist) => {
        const numericIds = getCheckedNumericIds(selectedIds, currentThreatList);

        if (!numericIds || numericIds.length === 0) {
            setthreatData([]);
            setIsLoader(false);
            return;
        }

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
    };

    const formik = useFormik({
        initialValues: {
            malware_ids: getCheckedNumericIds(),
            actor_ids: getCheckedNumericIds(),
        },
        enableReinitialize: true,
        validate: () => {
            let errors = {};
            const numericIds = getCheckedNumericIds(selectedMalware, threatlist);

            if (!numericIds || numericIds.length === 0) {
                errors.malware_ids = 'Please select at least one valid threat actor';
            }

            return errors;
        },

        onSubmit: () => {
            fetchThreatDefendData(selectedMalware, threatlist);
        },
    });

    const handleToggleMalware = (threatId) => {
        setSelectedMalware((prev) => {
            const isCurrentlySelected = prev.includes(threatId);
            if (!isCurrentlySelected && prev.length >= 10) {
                toast.error('You can select a maximum of 10 threat actors.');
                return prev;
            }
            const updated = isCurrentlySelected
                ? prev.filter((id) => id !== threatId)
                : [...prev, threatId];
            try {
                localStorage.setItem('selected_threat_ids', JSON.stringify(updated));
            } catch (e) {
                console.error(e);
            }
            fetchThreatDefendData(updated, threatlist);
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
        fetchThreatDefendData(updatedSelected, updatedList);
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

        const existingMalware = threatlist.find(
            (m) => (m.name && typeof m.name === 'string' && m.name.toLowerCase() === String(itemName).toLowerCase()) ||
                (realActorId !== undefined && (m.actor_id === realActorId || m.id === realActorId || m.malware_id === realActorId)) ||
                (item.id !== undefined && m.id === item.id)
        );

        if (!existingMalware && threatlist.length >= 10) {
            toast.error('You can select a maximum of 10 threat actors.');
            setSearchQuery('');
            setData([]);
            setShowSuggestions(false);
            return;
        }

        let targetId;
        let updatedList = threatlist;
        if (existingMalware) {
            targetId = existingMalware.actor_id !== undefined && (typeof existingMalware.actor_id === 'number' || !String(existingMalware.actor_id).startsWith('malware-'))
                ? existingMalware.actor_id
                : (realActorId ?? existingMalware.id);
        } else {
            targetId = realActorId ?? (typeof item?.id === 'number' ? item.id : undefined) ?? `threat-${threatlist.length + 1}`;
            const newMalware = {
                ...(typeof item === 'object' && item !== null ? item : {}),
                id: targetId,
                actor_id: realActorId ?? targetId,
                name: String(itemName),
                ...(realActorId !== undefined ? { id: realActorId, actor_id: realActorId } : {})
            };
            updatedList = [...threatlist, newMalware];
            setthreatlist(updatedList);
            try {
                localStorage.setItem('selected_threat', JSON.stringify(updatedList));
            } catch (e) {
                console.error(e);
            }
        }

        // Save real actor_id / targetId into selected_threat_ids in localStorage
        const updatedSelected = selectedMalware.includes(targetId) ? selectedMalware : [...selectedMalware, targetId];
        setSelectedMalware(updatedSelected);
        try {
            localStorage.setItem('selected_threat_ids', JSON.stringify(updatedSelected));
        } catch (e) {
            console.error(e);
        }

        setSearchQuery('');
        setData([]);
        setShowSuggestions(false);

        fetchThreatDefendData(updatedSelected, updatedList);
    };

    useEffect(() => {
        const initialNumericIds = getCheckedNumericIds(selectedMalware, threatlist);
        if (initialNumericIds.length > 0) {
            fetchThreatDefendData(selectedMalware, threatlist);
        }
    }, []);

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

    const selectOptions = useMemo(() => {
        return (data || [])
            .filter((item) => {
                const itemName = typeof item === 'string'
                    ? item
                    : item?.name || item?.malware_name || item?.threat_name || item?.actor_name || item?.label || item?.title || item?.value || '';
                const rawActorId = item?.actor_id ?? item?.threat_id ?? item?.threat_actor_id;
                const rawMalwareId = item?.malware_id;
                const rawNumId = typeof item?.id === 'number' ? item.id : (typeof item?.id === 'string' && !item.id.startsWith('malware-') && !item.id.startsWith('threat-') && !isNaN(Number(item.id)) ? Number(item.id) : undefined);

                const realActorId = rawActorId !== undefined
                    ? (typeof rawActorId === 'number' || !isNaN(Number(rawActorId)) ? Number(rawActorId) : rawActorId)
                    : (rawMalwareId !== undefined
                        ? (typeof rawMalwareId === 'number' || !isNaN(Number(rawMalwareId)) ? Number(rawMalwareId) : rawMalwareId)
                        : rawNumId);

                const isAlreadySelected = threatlist.some(
                    (m) => (m.name && typeof m.name === 'string' && itemName && m.name.toLowerCase() === String(itemName).toLowerCase()) ||
                        (realActorId !== undefined && (m.actor_id === realActorId || m.id === realActorId || m.malware_id === realActorId)) ||
                        (item?.id !== undefined && m.id === item.id)
                );

                return !isAlreadySelected;
            })
            .map((item, index) => {
                const itemName = typeof item === 'string'
                    ? item
                    : item?.name || item?.malware_name || item?.threat_name || item?.actor_name || item?.label || item?.title || item?.value || '';
                const itemKey = item?.id || item?._id || item?.actor_id || index;
                return {
                    value: itemKey,
                    label: String(itemName),
                    rawItem: item,
                    aliases: item?.aliases
                };
            });
    }, [data, threatlist]);

    const reactSelectStyles = useMemo(() => ({
        container: (base) => ({
            ...base,
            width: '320px',
            minWidth: '320px',
            maxWidth: '320px'
        }),
        control: (base, state) => ({
            ...base,
            height: '38px',
            minHeight: '38px',
            flexWrap: 'nowrap',
            overflow: 'hidden',
            fontSize: '13.5px',
            borderColor: state.isFocused ? '#cbd5e1' : '#e2e8f0',
            boxShadow: 'none',
            borderRadius: '50px',
            backgroundColor: '#f8fafc',
            paddingLeft: '4px',
            paddingRight: '6px',
            cursor: 'text',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
        }),
        valueContainer: (base) => ({
            ...base,
            height: '38px',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '0 4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            display: 'flex',
            alignItems: 'center',
            '&::-webkit-scrollbar': { display: 'none' }
        }),
        input: (base) => ({
            ...base,
            color: '#1e293b',
            margin: 0,
            padding: 0
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: '38px',
            flexShrink: 0
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: '0 6px',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            '&:hover': { color: '#334155' }
        }),
        clearIndicator: (base) => ({
            ...base,
            padding: '0 4px',
            color: '#94a3b8',
            cursor: 'pointer',
            '&:hover': { color: '#64748b' }
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        menu: (base) => ({
            ...base,
            borderRadius: '12px',
            zIndex: 1050,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            marginTop: '6px',
            width: '320px',
            backgroundColor: '#ffffff'
        }),
        menuList: (base) => ({
            ...base,
            padding: '6px',
            maxHeight: '260px'
        }),
        option: (base, state) => ({
            ...base,
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13.5px',
            backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f1f5f9' : 'transparent',
            color: state.isSelected ? '#1d4ed8' : '#334155',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            '&:active': { backgroundColor: '#e2e8f0' }
        }),
        placeholder: (base) => ({
            ...base,
            color: '#94a3b8',
            fontSize: '13.5px',
            fontWeight: 400,
            whiteSpace: 'nowrap'
        }),
        loadingMessage: (base) => ({
            ...base,
            fontSize: '13px',
            color: '#64748b',
            padding: '12px 16px'
        }),
        noOptionsMessage: (base) => ({
            ...base,
            fontSize: '13px',
            color: '#64748b',
            padding: '12px 16px'
        })
    }), []);

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

                        <DefenseConvergenceTopContent category="Threat Actor" activeViewTab={activeViewTab}>
                            {(() => {
                                const isSearchDisabled = activeViewTab === 'nist' || activeViewTab === 'mitigation';

                                return (
                                    <div className="search-wrapper position-relative m-0" ref={searchWrapperRef}>
                                        <Select
                                            inputId="threat-actor-select"
                                            options={selectOptions}
                                            value={null}
                                            inputValue={searchQuery}
                                            onInputChange={(val, { action }) => {
                                                if (action === 'input-change') {
                                                    setSearchQuery(val);
                                                }
                                            }}
                                            onChange={(selected) => {
                                                if (selected?.rawItem) {
                                                    handleSelectSuggestion(selected.rawItem);
                                                }
                                            }}
                                            isDisabled={isSearchDisabled}
                                            isLoading={pending}
                                            placeholder="Search Threat Actor to add"
                                            isSearchable
                                            styles={reactSelectStyles}
                                            components={{
                                                ValueContainer: CustomValueContainer,
                                                DropdownIndicator: CustomDropdownIndicator,
                                                IndicatorSeparator: () => null,
                                                Option: CustomOption
                                            }}
                                            noOptionsMessage={() =>
                                                searchQuery.trim().length < 2
                                                    ? 'Type at least 2 characters to search...'
                                                    : pending
                                                    ? 'Searching...'
                                                    : 'No threat actor found'
                                            }
                                            className="malware-react-select"
                                            classNamePrefix="malware-rs"
                                        />
                                    </div>
                                );
                            })()}
                        </DefenseConvergenceTopContent>

                        <div className="view-controls-card flex-shrink-0 mx-4 mb-4">
                            <div className="view-controls-section d-flex flex-column align-items-stretch gap-3">
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
                                        <div className="d-flex align-items-center gap-3">
                                            <button
                                                type="button"
                                                className="btn clear-all-btn flex-shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClearOrSelectAll();
                                                }}
                                            >
                                                Clear all <i className="bi bi-x"></i>
                                            </button>
                                            <div className="accordion-toggle-icon d-flex align-items-center text-muted" style={{ fontSize: '16px' }}>
                                                <i className={`bi ${isAccordionOpen ? 'bi-dash' : 'bi-plus'}`}></i>
                                            </div>
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
                                                            <div className="dot" style={{ backgroundColor: CHIP_COLORS[idx % CHIP_COLORS.length] }}></div>
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
