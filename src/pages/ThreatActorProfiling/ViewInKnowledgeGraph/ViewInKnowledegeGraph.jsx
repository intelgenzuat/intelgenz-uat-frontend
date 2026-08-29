import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FiSearch,
    FiZoomIn,
    FiZoomOut,
    FiMaximize2,
    FiInfo,
    FiHome,
    FiChevronDown,
    FiCheck,
} from "react-icons/fi";
import "../../../assets/styles/threatactorprofile/ViewinKnowledgegraph.scss";

const ThreatActorGraph = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");
    const [assessmentFocus, setAssessmentFocus] = useState("Capability");
    const [filters, setFilters] = useState({
        ta: true,
        mal: true,
        cam: true,
    });
    const [radius, setRadius] = useState("1-5");
    const [isRadiusOpen, setIsRadiusOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState("ta-main");

    const isIntelCard = location.pathname.includes("intel") || location.pathname === "/view-knowlegde-graph";
    const parentPath = isIntelCard ? "/intel-card" : "/threat-actor-profiling";
    const parentName = isIntelCard ? "Intel Card" : "Threat Actor Profile";

    const toggleFilter = (key) => {
        setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="threat-page">
            {/* Header Section */}
            <div className="graph-header">
                {/* Breadcrumb + Heading Group */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '12px', alignSelf: 'stretch' }}>

                    {/* Breadcrumb */}
                    <div className="breadcrumb-nav text-muted" style={{ fontSize: '14px' }}>
                        <FiHome className="home-icon me-2" />
                        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                        <span className="mx-2 text-black-50">/</span>
                        <span onClick={() => navigate(parentPath)} style={{ cursor: 'pointer' }}>{parentName}</span>
                        <span className="mx-2 text-black-50">/</span>
                        <span className="text-dark fw-medium">View in Knowledge Graph</span>
                    </div>

                    {/* Page Heading - matching IntelTopcontent style */}
                    <div className="view-top-header d-flex justify-content-between align-items-center mb-3">
                        {/* Left: Icon + Title */}
                        <div className="d-flex align-items-center gap-3">
                            <div className="header-icon-wrapper rounded-3 d-flex align-items-center justify-content-center subtle text-danger" style={{ width: '36px', height: '36px' }}>
                                <svg width="15" height="26" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.43627 16.4528C9.72418 16.4528 9.96554 16.3555 10.1604 16.1609C10.3552 15.9661 10.4526 15.7247 10.4526 15.4368C10.4526 15.1489 10.3552 14.9075 10.1604 14.7127C9.96554 14.5179 9.72418 14.4205 9.43627 14.4205C9.14836 14.4205 8.907 14.5179 8.7122 14.7127C8.51739 14.9075 8.41999 15.1489 8.41999 15.4368C8.41999 15.7247 8.51739 15.9661 8.7122 16.1609C8.907 16.3555 9.14836 16.4528 9.43627 16.4528ZM8.49265 12.1703H10.3799V6.09741H8.49265V12.1703ZM9.43627 23.8326C6.71506 23.0905 4.4621 21.4887 2.67739 19.0273C0.892462 16.5659 0 13.8141 0 10.7718V3.53263L9.43627 0L18.8725 3.53263V10.7718C18.8725 13.8141 17.9801 16.5659 16.1952 19.0273C14.4104 21.4887 12.1575 23.0905 9.43627 23.8326Z" fill="#E9004A" />
                                </svg>
                            </div>
                            <h2 className="mb-0 d-flex align-items-center">
                                <span className="header pe-3" style={{ fontSize: '24px', fontWeight: '500', color: '1A1B1E' }}>View in Knowledge Graph</span>
                            </h2>
                        </div>

                        {/* Right: Assessment Focus + Radius */}
                        <div className="d-flex align-items-center gap-4">
                            {/* Assessment Focus Section */}
                            <div className="assessment-focus-section">
                                <label className="section-label">Assessment Focus</label>
                                <div className="intelcard-view-checkboxes d-flex align-items-center gap-3">
                                    {["Capability", "Intent", "Opportunity"].map((focus) => (
                                        <label
                                            key={focus}
                                            className="intelcard-checkbox-item d-flex align-items-center gap-2 mb-0"
                                            htmlFor={`focus-${focus}`}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`focus-${focus}`}
                                                className="intelcard-custom-checkbox"
                                                checked={assessmentFocus === focus}
                                                onChange={() => setAssessmentFocus(focus)}
                                            />
                                            <span className="intelcard-checkbox-label">{focus}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Radius Section */}
                            <div className="radius-section">
                                <label className="section-label">Radius</label>
                                <div className="radius-control-wrapper">
                                    <button
                                        className="radius-select-btn"
                                        type="button"
                                        onClick={() => setIsRadiusOpen(!isRadiusOpen)}
                                    >
                                        <span>{radius}</span>
                                        <FiChevronDown className="chevron-icon" />
                                    </button>
                                    {isRadiusOpen && (
                                        <div className="radius-dropdown-menu">
                                            {["1-3", "1-5", "1-8", "1-10"].map((item) => (
                                                <div
                                                    key={item}
                                                    className={`radius-dropdown-item ${radius === item ? "selected" : ""}`}
                                                    onClick={() => {
                                                        setRadius(item);
                                                        setIsRadiusOpen(false);
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Top Controls: Entity Query */}
                <div className="graph-header-controls">
                    {/* Entity Query Section */}
                    <div className="entity-query-section">
                        <label className="section-label">Entity Query</label>

                        <div className="search-bar-wrapper">
                            <div className="search-box">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter Threat Actor Name / Mal"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filter Badges & Checkboxes */}
                        <div className="filters-row">
                            {/* TA Filter */}
                            <div className="filter-group">
                                <span className="entity-badge badge-ta">TA</span>
                                <label
                                    className={`custom-checkbox-label ${filters.ta ? "checked" : ""}`}
                                    onClick={() => toggleFilter("ta")}
                                >
                                    <span className="custom-checkbox cb-ta">
                                        {filters.ta && <FiCheck className="check-icon" />}
                                    </span>
                                    <span className="cb-text">TA</span>
                                </label>
                            </div>

                            {/* MAL Filter */}
                            <div className="filter-group">
                                <span className="entity-badge badge-mal">MAL</span>
                                <label
                                    className={`custom-checkbox-label ${filters.mal ? "checked" : ""}`}
                                    onClick={() => toggleFilter("mal")}
                                >
                                    <span className="custom-checkbox cb-mal">
                                        {filters.mal && <FiCheck className="check-icon" />}
                                    </span>
                                    <span className="cb-text">MAL</span>
                                </label>
                            </div>

                            {/* CAM Filter */}
                            <div className="filter-group">
                                <span className="entity-badge badge-cam">CAM</span>
                                <label
                                    className={`custom-checkbox-label ${filters.cam ? "checked" : ""}`}
                                    onClick={() => toggleFilter("cam")}
                                >
                                    <span className="custom-checkbox cb-cam">
                                        {filters.cam && <FiCheck className="check-icon" />}
                                    </span>
                                    <span className="cb-text">CAM</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= GRAPH CANVAS ================= */}
            <div className="graph-container">
                {/* Floating Top-Right Controls */}
                <div className="graph-floating-controls">
                    <button className="tool-icon-btn" title="Zoom Out" type="button">
                        <FiZoomOut />
                    </button>

                    <button className="tool-icon-btn" title="Zoom In" type="button">
                        <FiZoomIn />
                    </button>

                    <div className="control-divider" />

                    <button className="tool-icon-btn" title="Fit to Screen / Maximize" type="button">
                        <FiMaximize2 />
                    </button>
                </div>

                {/* SVG Connection Lines */}
                <svg className="connections" viewBox="0 0 1000 600" preserveAspectRatio="none">
                    {/* Top TA to Middle TA */}
                    <line
                        x1="500"
                        y1="165"
                        x2="500"
                        y2="270"
                        className="connection-line"
                    />

                    {/* Middle TA to Bottom-Left CAM */}
                    <line
                        x1="500"
                        y1="270"
                        x2="405"
                        y2="395"
                        className="connection-line"
                    />

                    {/* Middle TA to Bottom-Right Mal */}
                    <line
                        x1="500"
                        y1="270"
                        x2="600"
                        y2="395"
                        className="connection-line"
                    />
                </svg>

                {/* Top Node TA */}
                <div
                    className={`graph-node node-top-ta ${selectedNode === "ta-top" ? "selected" : ""}`}
                    onClick={() => setSelectedNode("ta-top")}
                >
                    <span>TA</span>
                </div>

                {/* Middle Node TA */}
                <div
                    className={`graph-node node-main-ta ${selectedNode === "ta-main" ? "selected" : ""}`}
                    onClick={() => setSelectedNode("ta-main")}
                >
                    <span>TA</span>
                </div>

                {/* Left Node CAM */}
                <div
                    className={`graph-node node-cam ${selectedNode === "cam" ? "selected" : ""}`}
                    onClick={() => setSelectedNode("cam")}
                >
                    <span>CAM</span>
                </div>

                {/* Right Node Mal */}
                <div
                    className={`graph-node node-mal ${selectedNode === "mal" ? "selected" : ""}`}
                    onClick={() => setSelectedNode("mal")}
                >
                    <span>Mal</span>
                </div>

                {/* Floating Selection Details Card */}
                <div className="selection-card">
                    <div className="selection-header">
                        <span className="selection-title">Selection Details</span>
                        <FiInfo className="info-icon" />
                    </div>

                    <div className="selection-body">
                        <div className="entity-header-row">
                            <div className="entity-icon-box">
                                <span>TA</span>
                            </div>
                            <div className="entity-title-info">
                                <h4 className="entity-name">APT-29 (Cozy Bear)</h4>
                                <span className="entity-type">Threat Actor Group</span>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <span className="stat-label">CAPABILITY SCORE</span>
                                <span className="stat-value text-red">High (8.5)</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-label">INTENT FOCUS</span>
                                <span className="stat-value text-dark">Espionage</span>
                            </div>
                        </div>

                        <button className="view-dossier-btn" type="button">
                            View Full Dossier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreatActorGraph;