import React, { useState, useMemo } from 'react';
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

            const rawAttackTechs = Array.isArray(tech.attack_techniques)
                ? tech.attack_techniques
                : (Array.isArray(tech.techniques) ? tech.techniques : []);

            // Map attack_techniques to children sub-items so overlaps can be expanded and viewed
            const children = (Array.isArray(tech.children) && tech.children.length > 0)
                ? tech.children
                : rawAttackTechs.map((att, attIdx) => {
                    const techId = att.technique_id || att.id || '';
                    const techName = att.technique_name || att.name || techId || '';
                    const subName = att.subtechnique_name ? ` (${att.subtechnique_name})` : '';
                    const attActors = Array.isArray(att.actors) ? att.actors : (Array.isArray(att.malwares) ? att.malwares : []);
                    const actorNames = attActors.map(a => a.name || a.actor_name || a.malware_name || a.id).filter(Boolean).join(', ');
                    const tacticsStr = Array.isArray(att.tactics) ? att.tactics.join(', ') : (att.tactic || '');

                    let subtitle = techId;
                    if (tacticsStr) {
                        subtitle = `${subtitle ? `${subtitle} • ` : ''}${tacticsStr}`;
                    }
                    if (actorNames) {
                        subtitle = `${subtitle ? `${subtitle} • ` : ''}${actorNames}`;
                    }

                    const overlapCount = attActors.length || Number(att.overlap_count) || 0;
                    const hasOverlap = Boolean(att.has_overlap || overlapCount > 1 || (Number(att.overlap_percentage) > 0));

                    return {
                        id: `${tacticId}-${tech.d3fend_id || techIdx}-${techId || attIdx}-${attIdx}`,
                        technique_id: techId,
                        title: `${techId ? `${techId} - ` : ''}${techName}${subName}`,
                        subtitle: subtitle || 'No details',
                        overlaps: overlapCount,
                        overlap_percentage: Number(att.overlap_percentage) || 0,
                        has_overlap: hasOverlap,
                        level: calculateLevel(att.overlap_percentage, overlapCount),
                        expanded: false,
                        children: [],
                        attack_technique: att,
                        actors: attActors,
                        malwares: attActors
                    };
                });

            const subtitle = children.length > 0
                ? `${children.length} sub ${children.length === 1 ? 'category' : 'categories'}`
                : 'No sub categories';

            const overlapCount = Number(tech.overlap_count) || 0;
            const overlapPct = Number(tech.overlap_percentage) || 0;
            const hasOverlap = Boolean(tech.has_overlap || overlapCount > 1 || overlapPct > 0);

            columnsMap.get(parentName).push({
                id: tech.d3fend_id || `${tacticId}-${parentName.toLowerCase().replace(/\s+/g, '-')}-${techIdx}`,
                d3fend_id: tech.d3fend_id,
                title: tech.name || tech.technique_name || tech.d3fend_id || '',
                subtitle: subtitle,
                overlaps: overlapCount,
                overlap_percentage: overlapPct,
                has_overlap: hasOverlap,
                level: calculateLevel(tech.overlap_percentage, tech.overlap_count),
                expanded: false,
                children: children,
                attack_techniques: rawAttackTechs,
                actors: tech.actors || [],
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
    setShowOverlaps,
    activeViewTab,
    setActiveViewTab,
    viewTabs = [],
    selectedMalware = [],
    isLoader = false,
    threatData,
}) => {
    const d3fendList = useMemo(() => {
        if (Array.isArray(threatData?.d3fend_tactics)) {
            return threatData.d3fend_tactics;
        }
        if (Array.isArray(threatData)) {
            return threatData;
        }
        return [];
    }, [threatData]);

    const tacticsData = useMemo(() => {
        return transformD3fendTactics(d3fendList, selectedMalware);
    }, [d3fendList, selectedMalware]);

    const [collapsedTactics, setCollapsedTactics] = useState(() => new Set());
    const [expandedItems, setExpandedItems] = useState(() => new Set());

    const toggleTactic = (tacticId) => {
        setCollapsedTactics(prev => {
            const next = new Set(prev);
            if (next.has(tacticId)) {
                next.delete(tacticId);
            } else {
                next.add(tacticId);
            }
            return next;
        });
    };

    const toggleExpand = (idToToggle) => {
        setExpandedItems(prev => {
            const next = new Set(prev);
            if (next.has(idToToggle)) {
                next.delete(idToToggle);
            } else {
                next.add(idToToggle);
            }
            return next;
        });
    };

    const filterOverlaps = (items) => {
        return items
            .map(item => {
                const filteredChildren = item.children ? filterOverlaps(item.children) : [];
                const hasOverlap = Boolean(item.has_overlap || item.overlaps > 1 || item.overlap_percentage > 0);
                if (hasOverlap || filteredChildren.length > 0) {
                    return { ...item, children: filteredChildren };
                }
                return null;
            })
            .filter(item => item !== null);
    };

    const renderItem = (item, indent, treeLineType) => {
        const hasOverlap = Boolean(item.has_overlap || item.overlaps > 1 || item.overlap_percentage > 0);
        const isExpanded = expandedItems.has(item.id);

        return (
            <React.Fragment key={item.id}>
                <div className={`cell-wrapper ${getLevelClass(item.level)}`}>
                    <div className="cell-content" style={{ paddingLeft: `${getIndentPx(indent)}px` }}>
                        {treeLineType && (
                            <div className={`tree-line line-${treeLineType}`} style={{ left: `${getLineLeftPx(indent)}px`, width: `${getLineWidthPx()}px` }}></div>
                        )}
                        {isExpanded && item.children && item.children.length > 0 && (
                            <div className="tree-line-down" style={{ left: `${getLineLeftPx(indent + 1)}px` }}></div>
                        )}

                        <div className="card-top">
                            {item.children && item.children.length > 0 ? (
                                <button className="expand-btn" type="button" onClick={() => toggleExpand(item.id)}>
                                    <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                                </button>
                            ) : (
                                <button className="expand-btn" type="button" style={{ visibility: 'hidden' }}>
                                    <i className="bi bi-chevron-down"></i>
                                </button>
                            )}
                            <div className="text-content">
                                <div className="title" title={item.title}>{item.title}</div>
                                <div className="subtitle">{item.subtitle}</div>
                            </div>
                            <i className="bi bi-info-circle info-icon"></i>
                        </div>

                        {hasOverlap && (
                            <div className="overlaps-badge-wrapper" style={{ paddingLeft: '19px' }}>
                                <div className="overlaps-badge">
                                    <span className="label">Overlaps</span>
                                    <span className="value">{String(item.overlaps).padStart(2, '0')}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {item.children && item.children.length > 0 && (
                    <div className={`children-container ${isExpanded ? 'expanded' : ''}`}>
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
            <div className="mitigation-view-container flex-grow-1 d-flex flex-column overflow-hidden mx-4 mb-4">
                <div className="mitigation-view-card d-flex flex-column flex-grow-1 bg-white mb-3">
                    <div className="mapping-header flex-shrink-0 bg-white">
                        <h4>D3FEND</h4>
                        <div className="d-flex align-items-center gap-3">
                            <div className="overlap-legend">
                                <span className="legend-label">OVERLAP % :</span>
                                <div className="overlap-items-container">
                                    <span className="gradient-label">100%</span>
                                    <div className="gradient-line"></div>
                                    <span className="gradient-label">25%</span>
                                </div>
                            </div>

                            <div className="controls-right">
                                <div className="show-overlaps-btn">
                                    <input
                                        type="checkbox"
                                        id="showOverlapsMalware"
                                        checked={showOverlaps}
                                        onChange={(e) => setShowOverlaps && setShowOverlaps(e.target.checked)}
                                    />
                                    <label htmlFor="showOverlapsMalware">Show overlaps only</label>
                                </div>

                                {viewTabs && viewTabs.length > 0 && (
                                    <ul className="nav nav-pills segment-control" id="malwareViewTab" role="tablist">
                                        {viewTabs.map((tab) => (
                                             <li key={tab.key} className="nav-item" role="presentation">
                                                <button
                                                    className={`nav-link${activeViewTab === tab.key ? ' active' : ''}`}
                                                    onClick={() => setActiveViewTab && setActiveViewTab(tab.key)}
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={activeViewTab === tab.key}
                                                >
                                                    {tab.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
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
                                const isTacticExpanded = !collapsedTactics.has(tactic.id);
                                return (
                                    <div key={tactic.id} className="tactic-group d-flex flex-column">
                                        <div className="tactic-group-header" onClick={() => toggleTactic(tactic.id)}>
                                            <button className="tactic-toggle-btn" type="button">
                                                <i className={`bi ${isTacticExpanded ? 'bi-dash' : 'bi-plus'}`}></i>
                                            </button>
                                            <span className="tactic-name">{tactic.name}</span>
                                        </div>

                                        {isTacticExpanded && (
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
