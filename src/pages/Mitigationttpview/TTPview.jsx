import React, { useState } from 'react';

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

const getTechniqueDotStyle = (tech, threatlist) => {
    const techActors = Array.isArray(tech.actors)
        ? tech.actors
        : (Array.isArray(tech.malwares) ? tech.malwares : []);

    const matchedColors = [];

    threatlist.forEach((item, i) => {
        const itemId = item.actor_id ?? item.malware_id ?? item.id;
        const itemName = item.name ? String(item.name).trim().toLowerCase() : '';

        const isMatch = techActors.some((a) => {
            const aId = a.actor_id ?? a.malware_id ?? a.id;
            const aName = (a.name ?? a.actor_name ?? a.malware_name) ? String(a.name ?? a.actor_name ?? a.malware_name).trim().toLowerCase() : '';
            return (aId !== undefined && itemId !== undefined && String(aId) === String(itemId)) ||
                   (aName && itemName && aName === itemName);
        }) || (tech.actor_id !== undefined && itemId !== undefined && String(tech.actor_id) === String(itemId)) ||
              (tech.malware_id !== undefined && itemId !== undefined && String(tech.malware_id) === String(itemId)) ||
              (tech.actor_name && itemName && String(tech.actor_name).trim().toLowerCase() === itemName) ||
              (tech.malware_name && itemName && String(tech.malware_name).trim().toLowerCase() === itemName);

        if (isMatch) {
            matchedColors.push(CHIP_COLORS[i % CHIP_COLORS.length]);
        }
    });

    if (matchedColors.length === 0) {
        return { backgroundColor: CHIP_COLORS[0] };
    }
    if (matchedColors.length === 1) {
        return { backgroundColor: matchedColors[0] };
    }
    return { background: `linear-gradient(135deg, ${matchedColors.join(', ')})` };
};

const TTPview = ({
    showOverlaps,
    setShowOverlaps,
    activeViewTab,
    setActiveViewTab,
    viewTabs = [],
    threatlist = [],
    selectedMalware: propSelectedMalware,
    onToggleMalware,
    onClearOrSelectAll,
    onRemoveMalware,
    onShow,
    isLoader = false,
    formikError,
    threatData
}) => {
    const [localSelectedMalware, setLocalSelectedMalware] = useState([]);
    const [collapsedCols, setCollapsedCols] = useState(() => new Set());
    const selectedMalware = propSelectedMalware !== undefined ? propSelectedMalware : localSelectedMalware;

    const toggleCol = (colId) => {
        setCollapsedCols((prev) => {
            const next = new Set(prev);
            if (next.has(colId)) {
                next.delete(colId);
            } else {
                next.add(colId);
            }
            return next;
        });
    };

    const getOverlapClass = (percentage, hasOverlap) => {
        const p = Number(percentage) || 0;
        if (p >= 100) return 'overlap-100';
        if (p >= 75) return 'overlap-75';
        if (p >= 50) return 'overlap-50';
        if (p >= 25) return 'overlap-25';
        if (hasOverlap && p > 0) return 'overlap-25';
        return '';
    };

    const tacticsList = Array.isArray(threatData?.tactics)
        ? threatData.tactics
        : Array.isArray(threatData)
            ? threatData
            : [];

    const mappingData = tacticsList.map((tactic) => ({
        col: tactic.tactic_name || tactic.name || 'Tactics',
        cells: (tactic.techniques || []).map((tech) => {
            const hasOverlap = Boolean(
                tech.has_overlap ||
                (tech.overlap_count !== undefined && tech.overlap_count > 1) ||
                (tech.overlap_percentage !== undefined && tech.overlap_percentage > 0)
            );
            const overlapClass = getOverlapClass(tech.overlap_percentage, hasOverlap);
            const dotStyle = getTechniqueDotStyle(tech, threatlist);

            return {
                ttp: tech.technique_id || tech.id || '',
                name: tech.technique_name || tech.name || '',
                subtechnique: tech.subtechnique_name,
                overlap: overlapClass,
                dotStyle: dotStyle,
                has_overlap: hasOverlap,
                overlap_count: tech.overlap_count,
                overlap_percentage: tech.overlap_percentage,
                actors: tech.actors || [],
                malwares: tech.malwares || [],
            };
        }),
    }));

    const filteredMappingData = mappingData.map((col) => ({
        ...col,
        cells: showOverlaps ? col.cells.filter((cell) => cell.has_overlap || cell.overlap !== '') : col.cells,
    }));

    const maxRows = filteredMappingData.length > 0
        ? Math.max(...filteredMappingData.map((col) => col.cells.length), 0)
        : 0;

    return (
        <>
            {/* Technique Mapping Section */}
            <div className="technique-mapping-container flex-grow-1 d-flex flex-column mx-4 mb-4">
                <div className="technique-mapping-card d-flex flex-column flex-grow-1">
                    <div className="mapping-header flex-shrink-0 bg-white">
                        <h4>Technique Mapping</h4>
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

                    <div className="table-responsive flex-grow-1 bg-white m-0">
                        <table className="mapping-table m-0">
                            <thead>
                                <tr>
                                    {mappingData.length > 0 ? (
                                        mappingData.map((col, i) => {
                                            const colId = col.col || i;
                                            const isCollapsed = collapsedCols.has(colId);
                                            return (
                                                <th key={i} className={isCollapsed ? 'col-collapsed' : ''}>
                                                    <div className="header-content">
                                                        <i className="bi bi-filter"></i>
                                                        <span className="header-col-title" title={col.col}>{col.col}</span>
                                                        <button
                                                            className="header-toggle-btn"
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleCol(colId);
                                                            }}
                                                            title={isCollapsed ? 'Expand column' : 'Collapse column'}
                                                        >
                                                            <i className={`bi ${isCollapsed ? 'bi-plus' : 'bi-dash'}`}></i>
                                                        </button>
                                                    </div>
                                                </th>
                                            );
                                        })
                                    ) : (
                                        <th>
                                            <div className="header-content">
                                                <i className="bi bi-filter"></i>
                                                <span className="header-col-title">Tactics</span>
                                                <div style={{ width: '16px' }}></div>
                                            </div>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoader ? (
                                    <tr>
                                        <td colSpan="100%" className="text-center py-5 text-muted">
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <span className="fw-medium">Loading technique mapping...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : mappingData.length === 0 ? (
                                    <tr>
                                        <td colSpan="100%" className="text-center py-5 text-muted">
                                            <i className="bi bi-info-circle me-2"></i>
                                            No technique mapping data available. Select threat actor and click "Show".
                                        </td>
                                    </tr>
                                ) : maxRows === 0 && showOverlaps ? (
                                    <tr>
                                        <td colSpan={mappingData.length || 1} className="text-center py-5 text-muted">
                                            <i className="bi bi-info-circle me-2"></i>
                                            No overlapping techniques found.
                                        </td>
                                    </tr>
                                ) : (
                                    Array.from({ length: maxRows }).map((_, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {filteredMappingData.map((col, colIndex) => {
                                                const colId = col.col || colIndex;
                                                const isCollapsed = collapsedCols.has(colId);
                                                if (isCollapsed) {
                                                    return <td key={colIndex} className="col-collapsed"></td>;
                                                }
                                                const cell = col.cells[rowIndex];
                                                if (!cell) return <td key={colIndex}></td>;
                                                return (
                                                    <td key={colIndex}>
                                                        <div className={`ttp-cell ${cell.overlap}`}>
                                                            <div className="ttp-id-wrapper">
                                                                <div className="dot" style={cell.dotStyle}></div>
                                                                {cell.ttp}
                                                                <i
                                                                    className="bi bi-info-circle text-muted"
                                                                    title={cell.subtechnique ? `${cell.name} (${cell.subtechnique})` : cell.name}
                                                                ></i>
                                                            </div>
                                                            <div className="technique-name">{cell.name}</div>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Pills */}
                    <div className="threat-techniques-footer flex-shrink-0 bg-white">
                        <div className="footer-title">
                            MALWARE TECHNIQUES : <span>Click pill to see TTP's mapped to selected threat actor.</span>
                        </div>
                        <div className="footer-pills">
                            {threatlist.map((malware, originalIdx) => {
                                const isSelected = selectedMalware.includes(malware.id) || (malware.actor_id !== undefined && selectedMalware.includes(malware.actor_id));
                                if (!isSelected) return null;
                                const dotColor = CHIP_COLORS[originalIdx % CHIP_COLORS.length];
                                return (
                                    <div key={malware.id ?? malware.actor_id ?? originalIdx} className="footer-pill">
                                        <div className="dot" style={{ backgroundColor: dotColor }}></div> {malware.name} <i className="bi bi-chevron-right"></i>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TTPview;
