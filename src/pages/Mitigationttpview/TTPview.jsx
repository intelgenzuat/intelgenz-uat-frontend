import React, { useState } from 'react';

const TTPview = ({
    showOverlaps,
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
    const selectedMalware = propSelectedMalware !== undefined ? propSelectedMalware : localSelectedMalware;

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
            setLocalSelectedMalware([]);
        }
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
            const dotClass = hasOverlap ? 'bg-danger' : 'bg-success';

            return {
                ttp: tech.technique_id || tech.id || '',
                name: tech.technique_name || tech.name || '',
                subtechnique: tech.subtechnique_name,
                overlap: overlapClass,
                dot: dotClass,
                has_overlap: hasOverlap,
                overlap_count: tech.overlap_count,
                overlap_percentage: tech.overlap_percentage,
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
            {/* Malware Section */}
            <div className="threat-actors-section mb-4">
                <div className="d-flex align-items-center">
                    <span className="section-title">THREAT ACTORS :</span>
                    <span className="selected-badge">{selectedMalware.length} Selected</span>
                    <button className="btn clear-all-btn ms-auto d-flex align-items-center gap-1" onClick={handleClearOrSelectAll}>
                        Clear all <i className="bi bi-x"></i>
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

            {/* Technique Mapping Section */}
            <div className="technique-mapping-container flex-grow-1 d-flex flex-column mx-4 mb-4">
                <div className="technique-mapping-card d-flex flex-column flex-grow-1">
                    <div className="mapping-header flex-shrink-0 bg-white">
                        <h4>Technique Mapping</h4>
                        <div className="overlap-legend">
                            <div className="legends-area">
                                <div className="legend-items">
                                    <div className="legend-pill">
                                        <div className="dot" style={{ backgroundColor: '#ef4444' }}></div> Denotes overlaps
                                    </div>
                                    <div className="legend-pill">
                                        <div className="dot" style={{ backgroundColor: '#22c55e' }}></div> Denotes no overlaps
                                    </div>
                                </div>
                            </div>
                            <span className="legend-label">OVERLAP % :</span>
                            <div className="overlap-items-container">
                                <div className="overlap-item"><div className="dot" style={{ backgroundColor: '#ef4444' }}></div> 100%</div>
                                <div className="separator"></div>
                                <div className="overlap-item"><div className="dot" style={{ backgroundColor: '#fca5a5' }}></div> 75%</div>
                                <div className="separator"></div>
                                <div className="overlap-item"><div className="dot" style={{ backgroundColor: '#fecaca' }}></div> 50%</div>
                                <div className="separator"></div>
                                <div className="overlap-item"><div className="dot" style={{ backgroundColor: '#fee2e2' }}></div> 25%</div>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive flex-grow-1 bg-white m-0">
                        <table className="mapping-table m-0">
                            <thead>
                                <tr>
                                    {mappingData.length > 0 ? (
                                        mappingData.map((col, i) => (
                                            <th key={i}>
                                                <div className="header-content">
                                                    <i className="bi bi-filter"></i>
                                                    {col.col}
                                                    <div style={{ width: '16px' }}></div>
                                                </div>
                                            </th>
                                        ))
                                    ) : (
                                        <th>
                                            <div className="header-content">
                                                <i className="bi bi-filter"></i>
                                                Tactics
                                                <div style={{ width: '16px' }}></div>
                                            </div>
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {mappingData.length === 0 ? (
                                    <tr>
                                        <td colSpan="100%" className="text-center py-5 text-muted">
                                            <i className="bi bi-info-circle me-2"></i>
                                            {isLoader ? 'Loading technique mapping...' : 'No technique mapping data available. Select malware and click "Show".'}
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
                                                const cell = col.cells[rowIndex];
                                                if (!cell) return <td key={colIndex}></td>;
                                                return (
                                                    <td key={colIndex}>
                                                        <div className={`ttp-cell ${cell.overlap}`}>
                                                            <div className="ttp-id-wrapper">
                                                                <div className={`dot ${cell.dot}`}></div>
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
                            MALWARE TECHNIQUES : <span>Click pill to see TTP's mapped to selected malware.</span>
                        </div>
                        <div className="footer-pills">
                            {threatlist.filter(m => selectedMalware.includes(m.id)).map(malware => (
                                <div key={malware.id} className="footer-pill">
                                    <div className="dot" style={{ backgroundColor: '#3b82f6' }}></div> {malware.name} <i className="bi bi-chevron-right"></i>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TTPview;
