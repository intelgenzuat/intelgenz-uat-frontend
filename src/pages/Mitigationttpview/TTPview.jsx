import React, { useState } from 'react';

const TTPview = ({ showOverlaps }) => {
    const threatActors = [
        { id: 1, name: 'APT28 (Fancy Bear)' },
        { id: 2, name: 'APT29 (Cozy Bear)' },
        { id: 3, name: 'APT41 (Double Dragon / Barium)' },
        { id: 4, name: 'APT45 (Fancy Bear)' },
    ];

    const [selectedActors, setSelectedActors] = useState([1, 2, 3, 4]);

    const handleToggleActor = (actorId) => {
        if (selectedActors.includes(actorId)) {
            setSelectedActors(selectedActors.filter(id => id !== actorId));
        } else {
            setSelectedActors([...selectedActors, actorId]);
        }
    };

    const handleClearOrSelectAll = () => {
        if (selectedActors.length > 0) {
            setSelectedActors([]);
        } else {
            setSelectedActors(threatActors.map(a => a.id));
        }
    };

    const mappingData = [
        {
            col: 'Reconnaissance',
            cells: [
                { ttp: 'T1596', name: 'Network Sniffing', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1586', name: 'Account Manipulation', overlap: '', dot: 'bg-success' },
                { ttp: 'T1593', name: 'Network Enumeration', overlap: '', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Resource Development',
            cells: [
                { ttp: 'T1584', name: 'Install Malware', overlap: '', dot: 'bg-success' },
                { ttp: 'T1203', name: 'Exploitation for Client Execution', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1582', name: 'Stolen Credentials', overlap: '', dot: 'bg-success' },
            ]
        },
        {
            col: 'Initial Access',
            cells: [
                { ttp: 'T1590', name: 'Domain Spoofing', overlap: '', dot: 'bg-success' },
                { ttp: 'T1557', name: 'Adversary-in-the-Middle', overlap: '', dot: 'bg-success' },
                { ttp: 'T1568', name: 'Dynamic Resolution', overlap: 'overlap-75', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Execution',
            cells: [
                { ttp: 'T1210', name: 'Exploitation of Remote Services', overlap: '', dot: 'bg-success' },
                { ttp: 'T1070', name: 'Indicator Removal on Host', overlap: '', dot: 'bg-success' },
                { ttp: 'T1069', name: 'Permission Groups Discovery', overlap: 'overlap-50', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Persistence',
            cells: [
                { ttp: 'T1110', name: 'Brute Force', overlap: 'overlap-100', dot: 'bg-success' },
                { ttp: 'T1086', name: 'PowerShell', overlap: '', dot: 'bg-success' },
                { ttp: 'T1218', name: 'Signed Binary Proxy Execution', overlap: '', dot: 'bg-success' },
            ]
        }
    ];

    const filteredMappingData = mappingData.map(col => ({
        ...col,
        cells: showOverlaps ? col.cells.filter(cell => cell.overlap !== '') : col.cells
    }));
    
    const maxRows = Math.max(...filteredMappingData.map(col => col.cells.length), 0);

    return (
        <>
            {/* Threat Actors Section */}
            <div className="threat-actors-section">
                <div className="d-flex align-items-center">
                    <span className="section-title">THREAT ACTORS :</span>
                    <span className="selected-badge">{selectedActors.length} Selected</span>
                    <button className="btn clear-all-btn ms-auto d-flex align-items-center gap-1" onClick={handleClearOrSelectAll}>
                        {selectedActors.length > 0 ? 'Clear all' : 'Select all'} <i className="bi bi-x"></i>
                    </button>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-3 mt-3">
                    <div className="pills-container m-0 mt-0">
                        {threatActors.map((actor, idx) => {
                            const isSelected = selectedActors.includes(actor.id);
                            return (
                                <div 
                                    key={actor.id} 
                                    className={`actor-pill cursor-pointer ${isSelected ? 'active' : ''}`}
                                    onClick={() => handleToggleActor(actor.id)}
                                >
                                    <div className="dot" style={{ backgroundColor: idx === 0 || idx === 3 ? '#3b82f6' : '#5200ff' }}></div>
                                    {actor.name}
                                    <i className={`bi ${isSelected ? 'bi-check-square-fill' : 'bi-square text-muted'}`}></i>
                                </div>
                            );
                        })}
                    </div>
                    <button className="btn show-btn text-white px-4 py-2 flex-shrink-0" style={{ backgroundColor: '#5200ff', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', boxShadow: '0 2px 6px rgba(82, 0, 255, 0.2)' }}>
                        Show
                    </button>
                </div>
            </div>

            {/* Technique Mapping Section */}
            <div className="technique-mapping-container flex-grow-1 d-flex flex-column mx-4 mb-4">
                <div className="technique-mapping-card d-flex flex-column flex-grow-1">
                    <div className="mapping-header flex-shrink-0 bg-white">
                        <h4>Technique Mapping</h4>
                        <div className="overlap-legend">
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
                                    {mappingData.map((col, i) => (
                                        <th key={i}>
                                            <div className="header-content">
                                                <i className="bi bi-filter"></i>
                                                {col.col}
                                                <div style={{ width: '16px' }}></div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: maxRows }).map((_, rowIndex) => (
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
                                                            <i className="bi bi-info-circle text-muted"></i>
                                                        </div>
                                                        <div className="technique-name">{cell.name}</div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Pills */}
                    <div className="threat-techniques-footer flex-shrink-0 bg-white">
                        <div className="footer-title">
                            THREAT TEQUNIQES : <span>Click pill to see TTP's mapped to selected threat actors.</span>
                        </div>
                        <div className="footer-pills">
                            {threatActors.filter(actor => selectedActors.includes(actor.id)).map(actor => (
                                <div key={actor.id} className="footer-pill">
                                    <div className="dot" style={{ backgroundColor: '#3b82f6' }}></div> {actor.name} <i className="bi bi-chevron-right"></i>
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
