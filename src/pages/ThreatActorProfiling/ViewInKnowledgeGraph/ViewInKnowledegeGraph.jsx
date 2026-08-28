import React from "react";
import { Link } from "react-router-dom";
import {
    FiSearch,
    FiZoomIn,
    FiZoomOut,
    FiMaximize,
    FiInfo,
} from "react-icons/fi";
import "../../../assets/styles/threatactorprofile/ViewinKnowledgegraph.scss";

const ThreatActorGraph = () => {
    return (
        <div className="threat-page">
            <div className="graph-header">
                {/* Breadcrumb Header */}
                <div className="tap-breadcrumb">
                    <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_95_193_kg)">
                            <path d="M11.4563 12.6547H8.79534C8.14534 12.6547 7.5969 12.1266 7.5969 11.4563V9.30312C7.5969 9.14062 7.47502 9.01875 7.31252 9.01875H5.68752C5.52502 9.01875 5.40315 9.14062 5.40315 9.30312V11.4563C5.40315 12.1266 4.87502 12.6547 4.20471 12.6547H1.54377C0.893774 12.6547 0.345337 12.1266 0.345337 11.4563V4.61094C0.345337 4.26563 0.507837 3.96094 0.792212 3.77813L5.9719 0.507812C6.2969 0.304688 6.70315 0.304688 7.00784 0.507812L12.1875 3.79844C12.4719 3.98125 12.6344 4.28594 12.6344 4.63125V11.4563C12.6547 12.1063 12.1063 12.6547 11.4563 12.6547ZM5.68752 8.10469H7.31252C7.98284 8.10469 8.51096 8.63281 8.51096 9.30312V11.4563C8.51096 11.6188 8.63284 11.7406 8.79534 11.7406H11.4563C11.6188 11.7406 11.7406 11.6188 11.7406 11.4563V4.61094C11.7406 4.59063 11.7203 4.57031 11.7203 4.55L6.52034 1.27969C6.50002 1.25938 6.47971 1.25938 6.4594 1.27969L1.30002 4.55C1.27971 4.57031 1.2594 4.59063 1.2594 4.61094V11.4563C1.2594 11.6188 1.38127 11.7406 1.54377 11.7406H4.20471C4.36721 11.7406 4.48909 11.6188 4.48909 11.4563V9.30312C4.48909 8.65312 5.01721 8.10469 5.68752 8.10469Z" fill="#130C2C" />
                        </g>
                        <defs>
                            <clipPath id="clip0_95_193_kg">
                                <rect width="13" height="13" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link> <span>/</span> <span className="text-dark fw-medium">View in Knowledge Graph</span>
                </div>

                <div className="graph-header-main">
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