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
                { ttp: 'T1595', name: 'Active Scanning', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1596', name: 'Search Open Tech DBs', overlap: '', dot: 'bg-success' },
                { ttp: 'T1593', name: 'Search Open Websites', overlap: '', dot: 'bg-danger' },
                { ttp: 'T1589', name: 'Gather Victim Identity', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1590', name: 'Gather Victim Network', overlap: '', dot: 'bg-success' },
            ]
        },
        {
            col: 'Resource Development',
            cells: [
                { ttp: 'T1583', name: 'Acquire Infrastructure', overlap: '', dot: 'bg-success' },
                { ttp: 'T1584', name: 'Compromise Infrastructure', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1585', name: 'Establish Accounts', overlap: '', dot: 'bg-success' },
                { ttp: 'T1588', name: 'Obtain Capabilities', overlap: '', dot: 'bg-success' },
                { ttp: 'T1608', name: 'Stage Capabilities', overlap: 'overlap-25', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Initial Access',
            cells: [
                { ttp: 'T1190', name: 'Exploit Public-Facing App', overlap: 'overlap-100', dot: 'bg-danger' },
                { ttp: 'T1566', name: 'Phishing', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1078', name: 'Valid Accounts', overlap: '', dot: 'bg-success' },
                { ttp: 'T1133', name: 'External Remote Services', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1091', name: 'Replication via Removable Media', overlap: '', dot: 'bg-success' },
            ]
        },
        {
            col: 'Execution',
            cells: [
                { ttp: 'T1059', name: 'Command & Scripting Interpreter', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1203', name: 'Exploitation for Client Exec', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1204', name: 'User Execution', overlap: '', dot: 'bg-success' },
                { ttp: 'T1047', name: 'Windows Mgmt Instrumentation', overlap: '', dot: 'bg-success' },
                { ttp: 'T1569', name: 'System Services', overlap: 'overlap-25', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Persistence',
            cells: [
                { ttp: 'T1053', name: 'Scheduled Task/Job', overlap: 'overlap-100', dot: 'bg-danger' },
                { ttp: 'T1547', name: 'Boot/Logon Autostart Exec', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1136', name: 'Create Account', overlap: '', dot: 'bg-success' },
                { ttp: 'T1543', name: 'Create or Modify System Process', overlap: '', dot: 'bg-success' },
                { ttp: 'T1078', name: 'Valid Accounts', overlap: 'overlap-50', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Privilege Escalation',
            cells: [
                { ttp: 'T1548', name: 'Abuse Elevation Control', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1068', name: 'Exploitation for Priv Escalation', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1055', name: 'Process Injection', overlap: '', dot: 'bg-success' },
                { ttp: 'T1134', name: 'Access Token Manipulation', overlap: '', dot: 'bg-success' },
                { ttp: 'T1484', name: 'Domain Policy Modification', overlap: 'overlap-25', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Defense Evasion',
            cells: [
                { ttp: 'T1562', name: 'Impair Defenses', overlap: 'overlap-100', dot: 'bg-danger' },
                { ttp: 'T1070', name: 'Indicator Removal', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1036', name: 'Masquerading', overlap: '', dot: 'bg-success' },
                { ttp: 'T1027', name: 'Obfuscated Files/Info', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1218', name: 'System Binary Proxy Exec', overlap: '', dot: 'bg-success' },
            ]
        },
        {
            col: 'Credential Access',
            cells: [
                { ttp: 'T1110', name: 'Brute Force', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1555', name: 'Credentials from Password Stores', overlap: '', dot: 'bg-success' },
                { ttp: 'T1003', name: 'OS Credential Dumping', overlap: 'overlap-100', dot: 'bg-danger' },
                { ttp: 'T1552', name: 'Unsecured Credentials', overlap: '', dot: 'bg-success' },
                { ttp: 'T1056', name: 'Input Capture', overlap: 'overlap-50', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Discovery',
            cells: [
                { ttp: 'T1083', name: 'File & Directory Discovery', overlap: '', dot: 'bg-success' },
                { ttp: 'T1046', name: 'Network Service Discovery', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1057', name: 'Process Discovery', overlap: '', dot: 'bg-success' },
                { ttp: 'T1018', name: 'Remote System Discovery', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1082', name: 'System Info Discovery', overlap: '', dot: 'bg-success' },
            ]
        },
        {
            col: 'Lateral Movement',
            cells: [
                { ttp: 'T1021', name: 'Remote Services', overlap: 'overlap-100', dot: 'bg-danger' },
                { ttp: 'T1210', name: 'Exploitation of Remote Services', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1534', name: 'Internal Spearphishing', overlap: '', dot: 'bg-success' },
                { ttp: 'T1570', name: 'Lateral Tool Transfer', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1080', name: 'Taint Shared Content', overlap: '', dot: 'bg-success' },
            ]
        },
        {
            col: 'Collection',
            cells: [
                { ttp: 'T1560', name: 'Archive Collected Data', overlap: '', dot: 'bg-success' },
                { ttp: 'T1185', name: 'Browser Session Hijacking', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1530', name: 'Data from Cloud Storage', overlap: '', dot: 'bg-success' },
                { ttp: 'T1213', name: 'Data from Info Repositories', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1056', name: 'Input Capture', overlap: '', dot: 'bg-success' },
            ]
        },
        {
            col: 'Command & Control',
            cells: [
                { ttp: 'T1071', name: 'Application Layer Protocol', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1132', name: 'Data Encoding', overlap: '', dot: 'bg-success' },
                { ttp: 'T1001', name: 'Data Obfuscation', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1568', name: 'Dynamic Resolution', overlap: '', dot: 'bg-success' },
                { ttp: 'T1105', name: 'Ingress Tool Transfer', overlap: 'overlap-25', dot: 'bg-danger' },
            ]
        },
        {
            col: 'Exfiltration',
            cells: [
                { ttp: 'T1041', name: 'Exfiltration Over C2 Channel', overlap: 'overlap-100', dot: 'bg-danger' },
                { ttp: 'T1048', name: 'Exfiltration Over Alt Protocol', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1567', name: 'Exfiltration Over Web Service', overlap: '', dot: 'bg-success' },
                { ttp: 'T1020', name: 'Automated Exfiltration', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1030', name: 'Data Transfer Size Limits', overlap: '', dot: 'bg-success' },
            ]
        },
        {
            col: 'Impact',
            cells: [
                { ttp: 'T1486', name: 'Data Encrypted for Impact', overlap: 'overlap-100', dot: 'bg-danger' },
                { ttp: 'T1485', name: 'Data Destruction', overlap: 'overlap-75', dot: 'bg-danger' },
                { ttp: 'T1490', name: 'Inhibit System Recovery', overlap: 'overlap-50', dot: 'bg-danger' },
                { ttp: 'T1491', name: 'Defacement', overlap: '', dot: 'bg-success' },
                { ttp: 'T1498', name: 'Network Denial of Service', overlap: '', dot: 'bg-success' },
            ]
        },
    ];

    const filteredMappingData = mappingData.map(col => ({
        ...col,
        cells: showOverlaps ? col.cells.filter(cell => cell.overlap !== '') : col.cells
    }));

    const maxRows = Math.max(...filteredMappingData.map(col => col.cells.length), 0);

    return (
        <>
            {/* Threat Actors Section */}
            <div className="threat-actors-section mb-4">
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
                        <div className="legends-area">
                            {/* <span className="legend-title">LEGENDS :</span> */}
                            <div className="legend-items">
                                {/* <div className="legend-pill">
                                    <div className="dot" style={{ backgroundColor: '#3b82f6' }}></div> Denotes threat actors
                                </div> */}
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
