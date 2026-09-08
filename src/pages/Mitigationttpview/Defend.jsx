import React, { useState, useEffect } from 'react';
import '../../assets/styles/mitigation/MitigationView.scss';

const calculateLevel = (overlapPercentage, overlapCount) => {
    const pct = Number(overlapPercentage) || 0;
    if (pct >= 75) return 3;
    if (pct >= 50) return 2;
    if (pct >= 25) return 1;
    if (pct > 0) return 1;
    if (Number(overlapCount) > 1) return 1;
    return 0;
};

const transformD3fendTactics = (d3fendTactics) => {
    if (!Array.isArray(d3fendTactics)) return [];

    return d3fendTactics.map((tactic, tIdx) => {
        const tacticName = tactic.tactic_name || tactic.name || `Tactic ${tIdx + 1}`;
        const tacticId = tactic.id || tacticName.toLowerCase().replace(/\s+/g, '-');

        const columnsMap = new Map();
        (tactic.techniques || []).forEach((tech, techIdx) => {
            const parentName = tech.parent_technique || 'General';
            if (!columnsMap.has(parentName)) {
                columnsMap.set(parentName, []);
            }

            const children = Array.isArray(tech.children) ? tech.children : [];
            const subtitle = children.length > 0
                ? `${children.length} sub ${children.length === 1 ? 'category' : 'categories'}`
                : 'No sub categories';

            columnsMap.get(parentName).push({
                id: tech.d3fend_id || `${tacticId}-${parentName.toLowerCase().replace(/\s+/g, '-')}-${techIdx}`,
                d3fend_id: tech.d3fend_id,
                title: tech.name || tech.technique_name || '',
                subtitle: subtitle,
                overlaps: Number(tech.overlap_count) || 0,
                overlap_percentage: Number(tech.overlap_percentage) || 0,
                has_overlap: Boolean(tech.has_overlap),
                level: calculateLevel(tech.overlap_percentage, tech.overlap_count),
                expanded: false,
                children: children,
                attack_techniques: tech.attack_techniques || [],
                malwares: tech.malwares || []
            });
        });

        const columns = Array.from(columnsMap.entries()).map(([name, items]) => ({
            name,
            items
        }));

        return {
            id: tacticId,
            name: tacticName,
            expanded: true,
            columns
        };
    });
};

const getLevelClass = (level) => {
    switch (level) {
        case 3: return 'level-3';
        case 2: return 'level-2';
        case 1: return 'level-1';
        default: return 'level-0';
    }
};

const getIndentPx = (indent) => indent * 16 + 6;
const getLineLeftPx = (indent) => (indent - 1) * 16 + 13;
const getLineWidthPx = () => 9;

const Defend = ({
    showOverlaps,
    threatlist = [],
    selectedMalware: propSelectedMalware,
    onToggleMalware,
    onClearOrSelectAll,
    onRemoveMalware,
    onShow,
    isLoader = false,
    formikError,
    threatData,
}) => {
    const d3fendList = Array.isArray(threatData?.d3fend_tactics)
        ? threatData.d3fend_tactics
        : Array.isArray(threatData)
            ? threatData
            : [];

    const [tacticsData, setTacticsData] = useState(() => transformD3fendTactics(d3fendList));
    const [localSelectedMalware, setLocalSelectedMalware] = useState([]);
    const selectedMalware = propSelectedMalware !== undefined ? propSelectedMalware : localSelectedMalware;

    useEffect(() => {
        setTacticsData(transformD3fendTactics(d3fendList));
    }, [threatData]);

    const handleToggleMalware = (malwareId) => {
        if (onToggleMalware) {
            onToggleMalware(malwareId);
        } else {
            if (selectedMalware.includes(malwareId)) {
                setLocalSelectedMalware(selectedMalware.filter(id => id !== malwareId));
            } else {
                setLocalSelectedMalware([...selectedMalware, malwareId]);
            }
        }
    };

    const handleClearOrSelectAll = () => {
        if (onClearOrSelectAll) {
            onClearOrSelectAll();
        } else {
            if (selectedMalware.length > 0) {
                setLocalSelectedMalware([]);
            } else {
                setLocalSelectedMalware(threatlist.map(m => m.id));
            }
        }
    };

    const toggleTactic = (tacticId) => {
        setTacticsData(prevTactics =>
            prevTactics.map(tactic =>
                tactic.id === tacticId ? { ...tactic, expanded: !tactic.expanded } : tactic
            )
        );
    };

    const filterOverlaps = (items) => {
        return items
            .map(item => {
                const filteredChildren = item.children ? filterOverlaps(item.children) : [];
                if (item.overlaps > 0 || filteredChildren.length > 0) {
                    return { ...item, children: filteredChildren };
                }
                return null;
            })
            .filter(item => item !== null);
    };

    const toggleExpand = (idToToggle) => {
        const toggleRecursive = (items) => {
            return items.map(item => {
                if (item.id === idToToggle) {
                    return { ...item, expanded: !item.expanded };
                }
                if (item.children && item.children.length > 0) {
                    return { ...item, children: toggleRecursive(item.children) };
                }
                return item;
            });
        };

        setTacticsData(prevTactics =>
            prevTactics.map(tactic => ({
                ...tactic,
                columns: tactic.columns.map(col => ({
                    ...col,
                    items: toggleRecursive(col.items)
                }))
            }))
        );
    };

    const renderItem = (item, indent, treeLineType) => {
        return (
            <React.Fragment key={item.id}>
                <div className={`cell-wrapper ${getLevelClass(item.level)}`}>
                    <div className="cell-content" style={{ paddingLeft: `${getIndentPx(indent)}px` }}>
                        {treeLineType && (
                            <div className={`tree-line line-${treeLineType}`} style={{ left: `${getLineLeftPx(indent)}px`, width: `${getLineWidthPx()}px` }}></div>
                        )}
                        {item.expanded && item.children && item.children.length > 0 && (
                            <div className="tree-line-down" style={{ left: `${getLineLeftPx(indent + 1)}px` }}></div>
                        )}

                        <div className="card-top">
                            {item.children && item.children.length > 0 ? (
                                <button className="expand-btn" onClick={() => toggleExpand(item.id)}>
                                    <i className={`bi ${item.expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                </button>
                            ) : (
                                <button className="expand-btn" style={{ visibility: 'hidden' }}>
                                    <i className="bi bi-chevron-down"></i>
                                </button>
                            )}
                            <div className="text-content">
                                <div className="title" title={item.title}>{item.title}</div>
                                <div className="subtitle">{item.subtitle}</div>
                            </div>
                            <i className="bi bi-info-circle info-icon"></i>
                        </div>

                        {item.overlaps > 0 && (
                            <div className="overlaps-badge-wrapper" style={{ paddingLeft: '19px' }}>
                                <div className="overlaps-badge">
                                    <span className="label">Overlaps</span>
                                    <span className="value">{item.overlaps.toString().padStart(2, '0')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {item.children && item.children.length > 0 && (
                    <div className={`children-container ${item.expanded ? 'expanded' : ''}`}>
                        <div className="children-inner">
                            {item.children.map((child, idx) =>
                                renderItem(child, indent + 1, idx === item.children.length - 1 ? 'L' : 'T')
                            )}
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    };

    return (
        <>
            {/* Malware Selector Section */}
            <div className="threat-actors-section mb-4">
                <div className="d-flex align-items-center">
                    <span className="section-title">MALWARE :</span>
                    <span className="selected-badge">{selectedMalware.length} Selected</span>
                    <button className="btn clear-all-btn ms-auto d-flex align-items-center gap-1" onClick={handleClearOrSelectAll}>
                        {selectedMalware.length > 0 ? 'Clear all' : 'Select all'} <i className="bi bi-x"></i>
                    </button>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-3 mt-3">
                    <div className="pills-container m-0 mt-0">
                        {threatlist.map((malware, idx) => {
                            const malwareKey = malware.actor_id ?? malware.id;
                            const isSelected = selectedMalware.includes(malware.id) || (malware.actor_id !== undefined && selectedMalware.includes(malware.actor_id));
                            return (
                                <div
                                    key={malware.id ?? malware.actor_id ?? idx}
                                    className={`actor-pill cursor-pointer ${isSelected ? 'active' : ''}`}
                                    onClick={() => handleToggleMalware(malwareKey)}
                                >
                                    <div className="dot" style={{ backgroundColor: idx % 2 === 0 ? '#3b82f6' : '#5200ff' }}></div>
                                    <span>{malware.name}</span>
                                    <i className={`bi ${isSelected ? 'bi-check-square-fill' : 'bi-square text-muted'}`}></i>
                                    {onRemoveMalware && (
                                        <i
                                            className="bi bi-x chip-close-icon ms-1"
                                            title="Remove malware"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemoveMalware(malwareKey);
                                            }}
                                        ></i>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        className="btn show-btn text-white px-4 py-2 flex-shrink-0 d-flex align-items-center gap-2"
                        style={{
                            backgroundColor: '#5200ff',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: 600,
                            border: 'none',
                            boxShadow: '0 2px 6px rgba(82, 0, 255, 0.2)',
                            cursor: isLoader ? 'not-allowed' : 'pointer',
                            opacity: isLoader ? 0.75 : 1
                        }}
                        onClick={onShow}
                        disabled={isLoader}
                    >
                        {isLoader && (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        )}
                        <span>Show</span>
                    </button>
                </div>
                {formikError && (
                    <div className="text-danger mt-1 ms-1" style={{ fontSize: '12px' }}>
                        {formikError}
                    </div>
                )}
            </div>

            <div className="mitigation-view-container flex-grow-1 d-flex flex-column overflow-hidden mx-4 mb-4">
                <div className="mitigation-view-card d-flex flex-column flex-grow-1 bg-white mb-3">
                    <div className="table-responsive flex-grow-1 m-0 d-flex d3fend-matrix-scroll">
                        {isLoader ? (
                            <div className="d-flex justify-content-center align-items-center w-100 py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : tacticsData.length === 0 ? (
                            <div className="d-flex justify-content-center align-items-center w-100 py-5 text-muted">
                                No D3FEND tactics data available.
                            </div>
                        ) : (
                            tacticsData.map(tactic => {
                                return (
                                    <div key={tactic.id} className="tactic-group d-flex flex-column">
                                        <div className="tactic-group-header" onClick={() => toggleTactic(tactic.id)}>
                                            <button className="tactic-toggle-btn" type="button">
                                                <i className={`bi ${tactic.expanded ? 'bi-dash' : 'bi-plus'}`}></i>
                                            </button>
                                            <span className="tactic-name">{tactic.name}</span>
                                        </div>

                                        {tactic.expanded && (
                                            <div className="tactic-columns d-flex flex-grow-1">
                                                {tactic.columns.map((col, colIndex) => {
                                                    const displayedItems = showOverlaps ? filterOverlaps(col.items) : col.items;
                                                    return (
                                                        <div key={colIndex} className="mitigation-col d-flex flex-column">
                                                            <div className="col-header">
                                                                {col.name}
                                                            </div>
                                                            <div className="col-body d-flex flex-column">
                                                                {displayedItems.map(item => renderItem(item, 0, null))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>


            </div>
        </>
    );
};

export default Defend;

