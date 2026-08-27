import React from "react";
import {
    FiSearch,
    FiZoomIn,
    FiZoomOut,
    FiMaximize,
    FiInfo,
} from "react-icons/fi";
import "./ThreatActorGraph.scss";

const ThreatActorGraph = () => {
    return (
        <div className="threat-page">
            <div className="graph-header">
                <div className="query-section">
                    <label>Entity Query</label>

                    <div className="search-box">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Enter Threat Actor Name / Mal"
                        />
                    </div>

                    <div className="filter-row">
                        <span className="filter-pill ta">TA</span>
                        <span className="filter-pill mal">MAL</span>
                        <span className="filter-pill cam">CAM</span>
                    </div>

                    <div className="checkbox-row">
                        <span className="check-item ta-check">
                            <span className="check-circle">✓</span>
                            TA
                        </span>

                        <span className="check-item mal-check">
                            <span className="check-circle">✓</span>
                            MAL
                        </span>

                        <span className="check-item cam-check">
                            <span className="check-circle">✓</span>
                            CAM
                        </span>
                    </div>
                </div>

                {/* Assessment Focus */}
                <div className="assessment-section">
                    <span className="assessment-label">Assessment Focus</span>

                    <div className="focus-tabs">
                        <button className="focus-tab active">Capability</button>
                        <button className="focus-tab">Intent</button>
                        <button className="focus-tab">Opportunity</button>
                    </div>
                </div>

                {/* Controls */}
                <div className="graph-controls">
                    <div className="radius-control">
                        <span>Radius:</span>
                        <button>1-5</button>
                        <span className="dropdown-arrow">⌄</span>
                    </div>

                    <button className="icon-button">
                        <FiZoomIn />
                    </button>

                    <button className="icon-button">
                        <FiZoomOut />
                    </button>

                    <button className="icon-button">
                        <FiMaximize />
                    </button>
                </div>
            </div>

            {/* ================= GRAPH ================= */}
            <div className="graph-container">
                <svg className="connections" viewBox="0 0 1000 600">
                    <line
                        x1="500"
                        y1="170"
                        x2="500"
                        y2="280"
                        className="connection-line"
                    />

                    <line
                        x1="500"
                        y1="280"
                        x2="345"
                        y2="390"
                        className="connection-line"
                    />

                    <line
                        x1="500"
                        y1="280"
                        x2="655"
                        y2="390"
                        className="connection-line"
                    />
                </svg>
                <div className="graph-node node-top">
                    <span>TA</span>
                </div>

                {/* Main TA */}
                <div className="graph-node node-main-ta">
                    <span>TA</span>
                </div>

                {/* CAM */}
                <div className="graph-node node-cam">
                    <span>CAM</span>
                </div>

                {/* MAL */}
                <div className="graph-node node-mal">
                    <span>Mal</span>
                </div>

                {/* Selection Details */}
                <div className="selection-card">
                    <div className="selection-title">
                        <span>Selection Details</span>
                        <FiInfo />
                    </div>

                    <p>
                        Hover over or click a node to view entity
                        <br />
                        attributes, confidence scores, and raw
                        <br />
                        intelligence references.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThreatActorGraph;