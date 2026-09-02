import React, { useState } from 'react';
import '../../assets/styles/mitigation/MitigationView.scss';

const initialColumnsData = [
    // Column 1: Asset Inventory
    [
        { 
            id: '1-1', title: "Container Image Analysis", subtitle: "1 sub category", overlaps: 4, level: 3, expanded: false, 
            children: [
                { 
                    id: '1-1-1', title: "Image Vulnerability Scan", subtitle: "2 sub category", overlaps: 4, level: 1, expanded: false, 
                    children: [
                        { id: '1-1-1-1', title: "Base Image Scan", subtitle: "No sub categories", overlaps: 4, level: 1, expanded: false, children: [
                            { id: '1-1-1-1-1', title: "Detailed Scan Log", subtitle: "No sub categories", overlaps: 1, level: 0, expanded: false, children: [] }
                        ] },
                        { id: '1-1-1-2', title: "Base Image Scan", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [
                            { id: '1-1-1-2-1', title: "Layer Analysis", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [] }
                        ] }
                    ]
                }
            ]
        },
        { id: '1-2', title: "Cloud Asset Mapping", subtitle: "2 sub category", overlaps: 3, level: 2, expanded: false, children: [
            { id: '1-2-1', title: "AWS Resource Scan", subtitle: "1 sub category", overlaps: 2, level: 1, expanded: false, children: [
                { id: '1-2-1-1', title: "EC2 Instance Audit", subtitle: "No sub categories", overlaps: 1, level: 0, expanded: false, children: [] }
            ]}
        ]},
        { id: '1-3', title: "Container Image Analysis", subtitle: "2 sub category", overlaps: 0, level: 1, expanded: false, children: [
            { id: '1-3-1', title: "Registry Audit", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [] }
        ]}
    ],
    // Column 2: Network Mapping
    [
        { 
            id: '2-1', title: "Network Traffic Analysis", subtitle: "2 sub category", overlaps: 4, level: 3, expanded: false,
            children: [
                { id: '2-1-1', title: "Packet Inspection", subtitle: "2 sub category", overlaps: 0, level: 0, expanded: false, children: [
                    { id: '2-1-1-1', title: "Deep Packet Inspection", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [] }
                ] },
                { id: '2-1-2', title: "Network Registry Monitoring", subtitle: "2 sub category", overlaps: 3, level: 2, expanded: false, children: [
                    { id: '2-1-2-1', title: "Flow Log Analysis", subtitle: "No sub categories", overlaps: 1, level: 1, expanded: false, children: [] }
                ] }
            ]
        },
        { id: '2-2', title: "Network Registry Monitoring", subtitle: "2 sub category", overlaps: 0, level: 0, expanded: false, children: [
            { id: '2-2-1', title: "Endpoint Connection Log", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [] }
        ] },
        { id: '2-3', title: "Network Registry Monitoring", subtitle: "1 sub category", overlaps: 4, level: 3, expanded: false, children: [
            { id: '2-3-1', title: "Subnet Monitoring", subtitle: "No sub categories", overlaps: 2, level: 2, expanded: false, children: [] }
        ] },
        { id: '2-4', title: "Application Communication...", subtitle: "2 sub category", overlaps: 0, level: 0, expanded: false, children: [
            { id: '2-4-1', title: "API Gateway Logs", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [] }
        ] }
    ],
    // Column 3: Operational Activity Mapping
    [
        { 
            id: '3-1', title: "Process Behavior Monitoring", subtitle: "2 sub category", overlaps: 0, level: 0, expanded: false,
            children: [
                { id: '3-1-1', title: "Cloud Activity Monitoring", subtitle: "2 sub category", overlaps: 3, level: 2, expanded: false, children: [
                    { id: '3-1-1-1', title: "IAM Role Tracking", subtitle: "No sub categories", overlaps: 2, level: 1, expanded: false, children: [] }
                ] },
                { id: '3-1-2', title: "Operational Workflow Logs", subtitle: "2 sub category", overlaps: 0, level: 0, expanded: false, children: [
                    { id: '3-1-2-1', title: "CI/CD Pipeline Audit", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [] }
                ] }
            ]
        },
        { id: '3-2', title: "Service Dependency Graph", subtitle: "2 sub category", overlaps: 1, level: 0, expanded: false, children: [
            { id: '3-2-1', title: "Microservice Topology", subtitle: "No sub categories", overlaps: 1, level: 0, expanded: false, children: [] }
        ] },
        { id: '3-3', title: "Application Workflow Log", subtitle: "2 sub category", overlaps: 3, level: 2, expanded: false, children: [
            { id: '3-3-1', title: "Transaction Tracing", subtitle: "No sub categories", overlaps: 2, level: 1, expanded: false, children: [] }
        ] }
    ],
    // Column 4: System Mapping
    [
        { 
            id: '4-1', title: "System Configuration Mapping", subtitle: "2 sub category", overlaps: 2, level: 1, expanded: false,
            children: [
                { id: '4-1-1', title: "Application Dependency Graph", subtitle: "2 sub category", overlaps: 3, level: 1, expanded: false, children: [
                    { id: '4-1-1-1', title: "Library Vulnerability Scan", subtitle: "No sub categories", overlaps: 2, level: 1, expanded: false, children: [] }
                ] },
                { id: '4-1-2', title: "Cloud Resource Mapping", subtitle: "2 sub category", overlaps: 2, level: 1, expanded: false, children: [
                    { id: '4-1-2-1', title: "VPC Peering Review", subtitle: "No sub categories", overlaps: 1, level: 0, expanded: false, children: [] }
                ] }
            ]
        },
        { id: '4-2', title: "Data Dependency Graph", subtitle: "1 sub category", overlaps: 4, level: 3, expanded: false, children: [
            { id: '4-2-1', title: "Database Schema Audit", subtitle: "No sub categories", overlaps: 3, level: 2, expanded: false, children: [] }
        ] },
        { id: '4-3', title: "Application Dependency Graph", subtitle: "2 sub category", overlaps: 0, level: 0, expanded: false, children: [
            { id: '4-3-1', title: "Third-party SDK Audit", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [] }
        ] },
        { id: '4-4', title: "Data Dependency Graph", subtitle: "2 sub category", overlaps: 0, level: 1, expanded: false, children: [
            { id: '4-4-1', title: "Data Flow Mapping", subtitle: "No sub categories", overlaps: 0, level: 0, expanded: false, children: [] }
        ] }
    ]
];

const getLevelClass = (level) => {
    switch(level) {
        case 3: return 'level-3';
        case 2: return 'level-2';
        case 1: return 'level-1';
        default: return 'level-0';
    }
};

const getIndentPx = (indent) => indent * 28 + 16;
const getLineLeftPx = (indent) => (indent - 1) * 28 + 16 + 9;
const getLineWidthPx = () => 19;

const Defend = ({ showOverlaps }) => {
    const [columnsData, setColumnsData] = useState(initialColumnsData);

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

    const displayedColumnsData = showOverlaps ? columnsData.map(col => filterOverlaps(col)) : columnsData;

    const toggleExpand = (idToToggle) => {
        const toggleRecursive = (items) => {
            return items.map(item => {
                if (item.id === idToToggle) {
                    return { ...item, expanded: !item.expanded };
                }
                if (item.children) {
                    return { ...item, children: toggleRecursive(item.children) };
                }
                return item;
            });
        };

        setColumnsData(prevCols => prevCols.map(col => toggleRecursive(col)));
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
                            <button className="expand-btn" onClick={() => toggleExpand(item.id)}>
                                <i className={`bi ${item.expanded ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            </button>
                            <div className="text-content">
                                <div className="title" title={item.title}>{item.title}</div>
                                <div className="subtitle">{item.subtitle}</div>
                            </div>
                            <i className="bi bi-info-circle info-icon"></i>
                        </div>
                        
                        {item.overlaps > 0 && (
                            <div className="overlaps-badge-wrapper" style={{ paddingLeft: '28px' }}>
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

    const columnTitles = ['Asset Inventory', 'Network Mapping', 'Operational Activity Mapping', 'System Mapping'];

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

            <div className="mitigation-view-container flex-grow-1 d-flex flex-column overflow-hidden mx-4 mb-4">
                <div className="mitigation-view-card d-flex flex-column flex-grow-1 bg-white mb-3">
                    <div className="model-header flex-shrink-0">
                        <i className="bi bi-filter"></i>
                        <span>Model</span>
                    </div>
                    
                    <div className="table-responsive flex-grow-1 m-0 d-flex">
                        {displayedColumnsData.map((colData, colIndex) => (
                            <div key={colIndex} className="mitigation-col d-flex flex-column" style={{ flex: 1, minWidth: '250px' }}>
                                <div className="col-header">
                                    {columnTitles[colIndex]}
                                </div>
                                <div className="col-body d-flex flex-column">
                                    {colData.map(item => renderItem(item, 0, null))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination Footer */}
                <div className="pagination-footer bg-white d-flex align-items-center justify-content-between px-4 py-3 rounded-4 shadow-sm">
                    <div className="pagination-info text-muted">
                        01-09 of 120
                    </div>

                    <div className="pagination-controls d-flex align-items-center gap-2">
                        <button className="btn pagination-btn arrow-btn"><i className="bi bi-chevron-left"></i></button>
                        <button className="btn pagination-btn active">1</button>
                        <button className="btn pagination-btn">2</button>
                        <button className="btn pagination-btn">3</button>
                        <button className="btn pagination-btn">4</button>
                        <button className="btn pagination-btn">5</button>
                        <span className="pagination-ellipsis">...</span>
                        <button className="btn pagination-btn">20</button>
                        <button className="btn pagination-btn arrow-btn"><i className="bi bi-chevron-right"></i></button>
                    </div>

                    <div className="pagination-go-to d-flex align-items-center gap-2">
                        <span className="text-muted">Page</span>
                        <input type="text" className="form-control pagination-input text-center" defaultValue="101" style={{ width: '50px' }} />
                        <button className="btn go-btn fw-bold">Go</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Defend;
