import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Select, { components } from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import AdversaryTriageTopcontent from "../AdversaryTriageTopcontent";

// Custom sub-components for pill-styled search select (matching UI design)
const CustomValueContainer = ({ children, ...props }) => (
    <components.ValueContainer {...props}>
        <i
            className="bi bi-search text-muted"
            style={{
                fontSize: "13.5px",
                marginLeft: "8px",
                marginRight: "6px",
                flexShrink: 0
            }}
        />
        {children}
    </components.ValueContainer>
);

const CustomDropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#64748b" }}>
            <line x1="2" y1="4.5" x2="14" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="4.5" y1="8" x2="11.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="11.5" x2="9" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    </components.DropdownIndicator>
);
import {
    FiSearch,
    FiZoomIn,
    FiZoomOut,
    FiMaximize2,
    FiInfo,
    FiHome,
    FiChevronDown,
    FiChevronUp,
    FiChevronRight,
    FiCheck,
    FiRefreshCw,
    FiX,
    FiSliders,
    FiLayers,
    FiKey,
    FiShare2,
    FiActivity,
    FiExternalLink,
    FiZap,
    FiPlusSquare,
    FiShield,
    FiUsers,
    FiUserCheck,
    FiTv,
    FiMonitor,
    FiHash,
    FiSettings,
    FiGlobe,
    FiFileText
} from "react-icons/fi";
import "../../../assets/styles/threatactorprofile/ViewinKnowledgegraph.scss";

// Predefined palette for node categories matching the UI design
const PALETTE = {
    Malware: "#6366f1",
    "Threat Actor": "#ef4444",
    ThreatActor: "#ef4444",
    Campaign: "#f97316",
    "Related Malware": "#22c55e",
    "Malware (Variant)": "#06b6d4",
    Tool: "#eab308",
    Indicator: "#14b8a6",
    Country: "#64748b",
    "Country/Region": "#64748b",
    "Behavior (TTP)": "#3b82f6",
    Behavior: "#3b82f6",
    MitreAttack: "#3b82f6",
    Victim: "#22c55e",
    Organization: "#22c55e",
    Infrastructure: "#0ea5e9",
    Vulnerability: "#ec4899",
    Classification: "#06b6d4",
    Node: "#64748b"
};

const RELATIONSHIP_CATEGORY_CONFIG = [
    { key: "threat_actors", label: "Threat Actors", types: ["Threat Actor", "ThreatActor", "Actor"], color: "#ef4444", defaultCount: 8, icon: <FiUsers /> },
    { key: "campaigns", label: "Campaigns", types: ["Campaign", "Campaigns"], color: "#f97316", defaultCount: 5, icon: <FiUserCheck /> },
    { key: "tools", label: "Tools", types: ["Tool", "Tools"], color: "#eab308", defaultCount: 4, icon: <FiSliders /> },
    { key: "vulnerabilities", label: "Vulnerabilities", types: ["Vulnerability", "Vulnerabilities"], color: "#ec4899", defaultCount: 3, icon: <FiTv /> },
    { key: "infrastructure", label: "Infrastructure", types: ["Infrastructure"], color: "#0ea5e9", defaultCount: 4, icon: <FiMonitor /> },
    { key: "indicators", label: "Indicators", types: ["Indicator", "Indicators"], color: "#14b8a6", defaultCount: 2, icon: <FiHash /> },
    { key: "behaviors", label: "Behaviors (TTP)", types: ["Behavior (TTP)", "Behavior", "MitreAttack", "TTP"], color: "#3b82f6", defaultCount: 2, icon: <FiSettings /> }
];

const IMPORTANT_RELATIONSHIPS = new Set([
    "HAS_ALIASES",
    "HAS_CLASSIFICATION",
    "HAS_SUBCLASSIFICATION",
    "HAS_PRIMARY_TYPE",
    "HAS_AFFECTED_PLATFORMS",
    "HAS_COMPONENTS",
    "HAS_BEHAVIORS",
    "HAS_MITRE_ATTACK",
    "RELATED_TO_THREAT_ACTOR",
    "RELATED_TO_MALWARE",
    "HAS_INFRASTRUCTURE",
    "HAS_VULNERABILITIES",
    "HAS_INDICATORS",
    "HAS_ALIAS",
    "HAS_CAPABILITY",
    "HAS_ACTOR_RELATIONSHIP",
    "HAS_RELATED_MALWARE",
    "HAS_VULNERABILITY",
    "HAS_INDICATOR_RECORD"
]);

// High quality mock data for offline resilience and fast loading
const MOCK_MALWARES = [
    { malware_id: "MAL-001", name: "RedLine Stealer", category: "InfoStealer", severity: "Critical" },
    { malware_id: "MAL-002", name: "AsyncRAT", category: "Remote Access Trojan", severity: "High" },
    { malware_id: "MAL-003", name: "Cobalt Strike", category: "Adversary Simulation", severity: "Critical" },
    { malware_id: "MAL-004", name: "LockBit 3.0", category: "Ransomware", severity: "Critical" },
    { malware_id: "MAL-005", name: "Emotet", category: "Banking Trojan / Botnet", severity: "High" },
    { malware_id: "MAL-006", name: "QakBot (QBot)", category: "Modular Trojan", severity: "High" },
    { malware_id: "MAL-007", name: "Agent Tesla", category: "Spyware / Keylogger", severity: "High" },
    { malware_id: "MAL-008", name: "Remcos RAT", category: "Remote Access Trojan", severity: "Medium" }
];

const MOCK_GRAPHS = {
    "malware:MAL-001": {
        root_id: "malware:MAL-001",
        nodes: [
            { id: "malware:MAL-001", labels: ["Malware", "GraphNode"], properties: { name: "RedLine Stealer", type: "InfoStealer", first_seen: "2020-03", threat_level: "Critical", sha256: "9a2f7c81d5e3...", description: "Popular information stealer that targets browser credentials, crypto wallets, and system telemetry." } },
            { id: "ta:TA-001", labels: ["ThreatActor", "GraphNode"], properties: { name: "APT29 (Cozy Bear)", origin: "Russia", motivation: "Espionage", capability_score: "8.5" } },
            { id: "ta:TA-004", labels: ["ThreatActor", "GraphNode"], properties: { name: "Storm-0539", origin: "Unknown", motivation: "Financial", capability_score: "7.8" } },
            { id: "mitre:T1555", labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1555", name: "Credentials from Password Stores", tactic: "Credential Access" } },
            { id: "mitre:T1056", labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1056", name: "Input Capture: Keylogging", tactic: "Collection" } },
            { id: "beh:telegram-exfil", labels: ["Behavior", "GraphNode"], properties: { behavior_name: "Telegram Bot API Exfiltration", action: "HTTP POST to api.telegram.org", severity: "High" } },
            { id: "beh:browser-harvest", labels: ["Behavior", "GraphNode"], properties: { behavior_name: "Chromium Cookie Extraction", action: "Decryption of Login Data database" } },
            { id: "infra:c2-redline", labels: ["Infrastructure", "GraphNode"], properties: { name: "194.26.29.112:8080", type: "C2 Server", asn: "AS48282" } },
            { id: "vuln:CVE-2023-38831", labels: ["Vulnerability", "GraphNode"], properties: { cve: "CVE-2023-38831", name: "WinRAR Code Execution Vulnerability", score: "7.8" } },
            { id: "ind:hash-redline-1", labels: ["Indicator", "GraphNode"], properties: { value: "redline_payload_v24.exe", type: "File Hash" } },
            { id: "cls:stealer", labels: ["Classification", "GraphNode"], properties: { name: "Credential Stealer", family: "Commercial Stealer" } }
        ],
        edges: [
            { source: "malware:MAL-001", target: "ta:TA-001", type: "RELATED_TO_THREAT_ACTOR", properties: { confidence: "High" } },
            { source: "malware:MAL-001", target: "ta:TA-004", type: "RELATED_TO_THREAT_ACTOR", properties: { confidence: "Medium" } },
            { source: "malware:MAL-001", target: "mitre:T1555", type: "HAS_MITRE_ATTACK", properties: { relationship: "Used for credential theft" } },
            { source: "malware:MAL-001", target: "mitre:T1056", type: "HAS_MITRE_ATTACK", properties: { relationship: "Keystroke interception" } },
            { source: "malware:MAL-001", target: "beh:telegram-exfil", type: "HAS_BEHAVIORS", properties: { protocol: "HTTPS" } },
            { source: "malware:MAL-001", target: "beh:browser-harvest", type: "HAS_BEHAVIORS", properties: { target: "Chrome/Edge/Brave" } },
            { source: "malware:MAL-001", target: "infra:c2-redline", type: "HAS_INFRASTRUCTURE", properties: { role: "Command & Control" } },
            { source: "malware:MAL-001", target: "vuln:CVE-2023-38831", type: "HAS_VULNERABILITIES", properties: { exploitation: "Delivery vector" } },
            { source: "malware:MAL-001", target: "ind:hash-redline-1", type: "HAS_INDICATORS", properties: { status: "Active" } },
            { source: "malware:MAL-001", target: "cls:stealer", type: "HAS_CLASSIFICATION", properties: { primary: "true" } }
        ]
    },
    "malware:MAL-002": {
        root_id: "malware:MAL-002",
        nodes: [
            { id: "malware:MAL-002", labels: ["Malware", "GraphNode"], properties: { name: "AsyncRAT", type: "Remote Access Trojan", first_seen: "2019-01", threat_level: "High", sha256: "c18e9a4f210d...", description: "Open-source remote access tool weaponized by numerous threat groups for persistent remote administration." } },
            { id: "ta:TA-001", labels: ["ThreatActor", "GraphNode"], properties: { name: "APT29 (Cozy Bear)", origin: "Russia", motivation: "Espionage" } },
            { id: "ta:TA-003", labels: ["ThreatActor", "GraphNode"], properties: { name: "Lazarus Group", origin: "North Korea", motivation: "Financial & Sabotage" } },
            { id: "mitre:T1056", labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1056", name: "Input Capture: Keylogging", tactic: "Collection" } },
            { id: "mitre:T1027", labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1027", name: "Obfuscated Files or Information", tactic: "Defense Evasion" } },
            { id: "beh:dyn-dns", labels: ["Behavior", "GraphNode"], properties: { behavior_name: "Dynamic DNS C2 Resolution", action: "DuckDNS resolving to active beacon" } },
            { id: "infra:duckdns", labels: ["Infrastructure", "GraphNode"], properties: { name: "asynclink.duckdns.org", type: "Dynamic DNS" } },
            { id: "ind:async-cert", labels: ["Indicator", "GraphNode"], properties: { value: "AsyncRAT Server SSL Certificate (Thumbprint)", type: "Certificate" } },
            { id: "cls:rat", labels: ["Classification", "GraphNode"], properties: { name: "Remote Access Tool", family: ".NET RAT" } }
        ],
        edges: [
            { source: "malware:MAL-002", target: "ta:TA-001", type: "RELATED_TO_THREAT_ACTOR", properties: { confidence: "High" } },
            { source: "malware:MAL-002", target: "ta:TA-003", type: "RELATED_TO_THREAT_ACTOR", properties: { confidence: "Medium" } },
            { source: "malware:MAL-002", target: "mitre:T1056", type: "HAS_MITRE_ATTACK", properties: { relationship: "Keystroke monitoring" } },
            { source: "malware:MAL-002", target: "mitre:T1027", type: "HAS_MITRE_ATTACK", properties: { relationship: "AES payload encryption" } },
            { source: "malware:MAL-002", target: "beh:dyn-dns", type: "HAS_BEHAVIORS", properties: { beacon_interval: "30s" } },
            { source: "malware:MAL-002", target: "infra:duckdns", type: "HAS_INFRASTRUCTURE", properties: { domain: "duckdns.org" } },
            { source: "malware:MAL-002", target: "ind:async-cert", type: "HAS_INDICATORS", properties: { verified: "true" } },
            { source: "malware:MAL-002", target: "cls:rat", type: "HAS_CLASSIFICATION", properties: { primary: "true" } }
        ]
    },
    "malware:MAL-003": {
        root_id: "malware:MAL-003",
        nodes: [
            { id: "malware:MAL-003", labels: ["Malware", "GraphNode"], properties: { name: "Cobalt Strike", type: "Adversary Simulation", first_seen: "2012-06", threat_level: "Critical", description: "Legitimate penetration testing tool extensively cracked and weaponized by state-sponsored actors." } },
            { id: "ta:TA-001", labels: ["ThreatActor", "GraphNode"], properties: { name: "APT29 (Cozy Bear)", origin: "Russia" } },
            { id: "ta:TA-002", labels: ["ThreatActor", "GraphNode"], properties: { name: "FIN7", origin: "Eastern Europe", motivation: "Financial Extortion" } },
            { id: "mitre:T1059", labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1059", name: "Command and Scripting Interpreter: PowerShell", tactic: "Execution" } },
            { id: "mitre:T1055", labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1055", name: "Process Injection", tactic: "Defense Evasion" } },
            { id: "infra:teamserver", labels: ["Infrastructure", "GraphNode"], properties: { name: "45.154.255.88:50050", type: "TeamServer Beacon" } },
            { id: "cls:c2framework", labels: ["Classification", "GraphNode"], properties: { name: "Post-Exploitation Framework", family: "Commercial Security" } }
        ],
        edges: [
            { source: "malware:MAL-003", target: "ta:TA-001", type: "RELATED_TO_THREAT_ACTOR", properties: { verified: "true" } },
            { source: "malware:MAL-003", target: "ta:TA-002", type: "RELATED_TO_THREAT_ACTOR", properties: { verified: "true" } },
            { source: "malware:MAL-003", target: "mitre:T1059", type: "HAS_MITRE_ATTACK", properties: { subtechnique: "T1059.001" } },
            { source: "malware:MAL-003", target: "mitre:T1055", type: "HAS_MITRE_ATTACK", properties: { subtechnique: "T1055.012" } },
            { source: "malware:MAL-003", target: "infra:teamserver", type: "HAS_INFRASTRUCTURE", properties: { port: "50050" } },
            { source: "malware:MAL-003", target: "cls:c2framework", type: "HAS_CLASSIFICATION", properties: { primary: "true" } }
        ]
    },
    "malware:MAL-004": {
        root_id: "malware:MAL-004",
        nodes: [
            { id: "malware:MAL-004", labels: ["Malware", "GraphNode"], properties: { name: "LockBit 3.0", type: "Ransomware", first_seen: "2022-06", threat_level: "Critical", description: "Ransomware-as-a-Service strain with anti-analysis routines and customized encryption algorithms." } },
            { id: "ta:TA-002", labels: ["ThreatActor", "GraphNode"], properties: { name: "FIN7", origin: "Eastern Europe" } },
            { id: "mitre:T1486", labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1486", name: "Data Encrypted for Impact", tactic: "Impact" } },
            { id: "mitre:T1490", labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1490", name: "Inhibit System Recovery", tactic: "Impact" } },
            { id: "beh:vssadmin-del", labels: ["Behavior", "GraphNode"], properties: { behavior_name: "Shadow Copy Deletion", action: "vssadmin delete shadows /all /quiet" } },
            { id: "infra:tor-portal", labels: ["Infrastructure", "GraphNode"], properties: { name: "lockbitapt2...onion", type: "Tor Ransom Portal" } },
            { id: "cls:raas", labels: ["Classification", "GraphNode"], properties: { name: "Ransomware as a Service", family: "LockBit" } }
        ],
        edges: [
            { source: "malware:MAL-004", target: "ta:TA-002", type: "RELATED_TO_THREAT_ACTOR", properties: { affiliation: "Affiliate Operator" } },
            { source: "malware:MAL-004", target: "mitre:T1486", type: "HAS_MITRE_ATTACK", properties: { cipher: "AES + RSA-4096" } },
            { source: "malware:MAL-004", target: "mitre:T1490", type: "HAS_MITRE_ATTACK", properties: { impact: "Destructive" } },
            { source: "malware:MAL-004", target: "beh:vssadmin-del", type: "HAS_BEHAVIORS", properties: { elevation: "SYSTEM" } },
            { source: "malware:MAL-004", target: "infra:tor-portal", type: "HAS_INFRASTRUCTURE", properties: { darkweb: "true" } },
            { source: "malware:MAL-004", target: "cls:raas", type: "HAS_CLASSIFICATION", properties: { primary: "true" } }
        ]
    }
};

const getNodeType = (node) => {
    if (!node) return "Node";
    const p = node.properties || {};
    if (p.type) {
        if (
            p.type === "Related Malware" ||
            p.type === "Malware (Variant)" ||
            p.type === "Threat Actor" ||
            p.type === "Behavior (TTP)" ||
            p.type === "Victim" ||
            p.type === "Tool" ||
            p.type === "Indicator" ||
            p.type === "Country" ||
            p.type === "Infrastructure" ||
            p.type === "Vulnerability" ||
            p.type === "Campaign"
        ) {
            return p.type;
        }
    }
    const label = (node.labels || []).find((l) => l !== "GraphNode");
    return label || p.type || "Node";
};

const getNodeTitle = (node) => {
    if (!node) return "";
    const p = node.properties || {};
    return p.name || p.behavior_name || p.technique_id || p.value || p.description || p.action || p.cve || p.node_key || node.id || "Unknown";
};

const getNodeSubtitle = (node) => {
    if (!node) return "";
    const p = node.properties || {};
    if (p.category && p.category !== p.name && p.category !== "InfoStealer") return p.category;
    if (p.type && p.type !== p.name && p.type !== "InfoStealer") return p.type;
    const type = getNodeType(node);
    if (type === "ThreatActor" || type === "Threat Actor") return "Threat Actor";
    if (type === "Behavior" || type === "MitreAttack") return "Behavior (TTP)";
    if (type === "Country") return "Country";
    if (type === "Organization") return "Victim";
    if (type === "Classification") return "Malware (Variant)";
    return type;
};

const getColourFor = (type) => {
    return PALETTE[type] || PALETTE.Node;
};

const renderNodeIcon = (type, color = "#ffffff") => {
    switch (type) {
        case "Threat Actor":
        case "ThreatActor":
            return <FiUsers style={{ color }} />;
        case "Campaign":
            return <FiUserCheck style={{ color }} />;
        case "Vulnerability":
            return <FiTv style={{ color }} />;
        case "Tool":
            return <FiSliders style={{ color }} />;
        case "Infrastructure":
            return <FiMonitor style={{ color }} />;
        case "Indicator":
            return <FiHash style={{ color }} />;
        case "Behavior (TTP)":
        case "Behavior":
        case "MitreAttack":
            return <FiSettings style={{ color }} />;
        case "Country/Region":
        case "Country":
            return <FiGlobe style={{ color }} />;
        case "Organization":
        case "Victim":
            return <FiHome style={{ color }} />;
        case "Classification":
        case "Malware (Variant)":
            return <FiFileText style={{ color }} />;
        case "Related Malware":
            return <i className="bi bi-gear-wide-connected" style={{ color }}></i>;
        case "Malware":
        default:
            return <i className="bi bi-bug" style={{ color }}></i>;
    }
};

const shorten = (val, max = 28) => {
    const s = String(val ?? "");
    return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};

const ViewInKnowledgeGraph = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Core Data State
    const [malwareList, setMalwareList] = useState([]);
    const [isMalwareLoading, setIsMalwareLoading] = useState(false);
    const [selectedMalwareValues, setSelectedMalwareValues] = useState([]);
    const [selectedEntityType, setSelectedEntityType] = useState("malware");
    const [graphTags, setGraphTags] = useState([]);
    const [activeTagId, setActiveTagId] = useState(null);

    // Multi-graph accumulator
    const [loadedGraphs, setLoadedGraphs] = useState({}); // { [nodeId]: graphData }
    const [focusedNodeId, setFocusedNodeId] = useState(null);

    // Filter & View Options
    const [showKeyRelationships, setShowKeyRelationships] = useState(false);
    const [selectedConnectionTypes, setSelectedConnectionTypes] = useState(new Set());
    const [filterSearchTerm, setFilterSearchTerm] = useState("");
    const [isOverviewAccordionOpen, setIsOverviewAccordionOpen] = useState(true);

    // Sidebar active tab state: "details" | "relationships" | "entities"
    const [sidebarActiveTab, setSidebarActiveTab] = useState("details");
    const [isDescExpanded, setIsDescExpanded] = useState(false);
    const [isRelationshipsFooterOpen, setIsRelationshipsFooterOpen] = useState(true);

    // UI Header Controls
    const [assessmentFocus, setAssessmentFocus] = useState("Capability");
    const [radius, setRadius] = useState("1-5");
    const [isRadiusOpen, setIsRadiusOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Loading malware from the knowledge graph…");
    const [isStatusError, setIsStatusError] = useState(false);

    // Zoom and pan
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const nodePositionsRef = useRef(new Map());
    const svgRef = useRef(null);

    const isIntelCard = location.pathname.includes("intel") || location.pathname === "/intel-neura-view";
    const parentPath = isIntelCard ? "/intel-card" : "/threat-actor-profiling";
    const parentName = isIntelCard ? "Intel Card" : "Threat Actor Profile";

    // 1. Fetch Malware List on mount
    const fetchMalwareList = useCallback(async () => {
        setIsMalwareLoading(true);
        setStatusMessage("Loading malware from the knowledge graph…");
        setIsStatusError(false);

        try {
            const response = await fetch("/api/kg/malware");
            if (!response.ok) throw new Error("API not reachable");
            const data = await response.json();
            if (data && Array.isArray(data.malware) && data.malware.length > 0) {
                setMalwareList(data.malware);
                setStatusMessage(`${data.malware.length} malware records available in the knowledge graph.`);
            } else {
                setMalwareList(MOCK_MALWARES);
                setStatusMessage(`${MOCK_MALWARES.length} malware records loaded.`);
            }
        } catch {
            setMalwareList(MOCK_MALWARES);
            setStatusMessage(`${MOCK_MALWARES.length} malware records available.`);
        } finally {
            setIsMalwareLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMalwareList();
    }, [fetchMalwareList]);

    // Build react-select options from malwareList
    const malwareSelectOptions = useMemo(() => {
        return malwareList.map((item) => ({
            value: item.malware_id,
            label: item.name
        }));
    }, [malwareList]);

    // Derive the react-select value from selectedMalwareValues
    const selectedMalwareSelectValue = useMemo(() => {
        return malwareSelectOptions.filter((opt) => selectedMalwareValues.includes(opt.value));
    }, [selectedMalwareValues, malwareSelectOptions]);

    // Custom styles for react-select to match capsule pill search design
    const reactSelectStyles = useMemo(() => ({
        container: (base) => ({
            ...base,
            width: '320px',
            minWidth: '320px',
            maxWidth: '320px'
        }),
        control: (base, state) => ({
            ...base,
            height: '38px',
            minHeight: '38px',
            flexWrap: 'nowrap',
            overflow: 'hidden',
            fontSize: '13.5px',
            borderColor: state.isFocused ? '#cbd5e1' : '#e2e8f0',
            boxShadow: 'none',
            borderRadius: '50px',
            backgroundColor: '#f8fafc',
            paddingLeft: '4px',
            paddingRight: '6px',
            cursor: 'text',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }
        }),
        valueContainer: (base) => ({
            ...base,
            height: '38px',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '0 4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            display: 'flex',
            alignItems: 'center',
            '&::-webkit-scrollbar': { display: 'none' }
        }),
        input: (base) => ({
            ...base,
            color: '#1e293b',
            margin: 0,
            padding: 0
        }),
        indicatorsContainer: (base) => ({
            ...base,
            height: '38px',
            flexShrink: 0
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: '0 6px',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            '&:hover': { color: '#334155' }
        }),
        clearIndicator: (base) => ({
            ...base,
            padding: '0 4px',
            color: '#94a3b8',
            cursor: 'pointer',
            '&:hover': { color: '#64748b' }
        }),
        indicatorSeparator: () => ({ display: 'none' }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#E2ECF6',
            borderRadius: '20px',
            flexShrink: 0,
            padding: '1px 3px'
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#334155',
            fontSize: '12px',
            fontWeight: 500,
            paddingLeft: '6px'
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#64748b',
            borderRadius: '50%',
            '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '12px',
            zIndex: 30,
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            marginTop: '6px',
            width: '320px'
        }),
        option: (base, state) => ({
            ...base,
            fontSize: '13px',
            backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f8fafc' : '#fff',
            color: state.isSelected ? '#1d4ed8' : '#1e293b',
            fontWeight: state.isSelected ? 600 : 400,
            cursor: 'pointer',
            '&:active': { backgroundColor: '#dbeafe' }
        }),
        placeholder: (base) => ({
            ...base,
            color: '#7B96B2',
            fontSize: '13.5px',
            fontWeight: 400,
            whiteSpace: 'nowrap'
        })
    }), []);

    // Automatically select the first malware upon initial list load if none selected
    useEffect(() => {
        if (malwareList.length > 0 && graphTags.length === 0) {
            const first = malwareList[0];
            const nodeId = `malware:${first.malware_id}`;
            const initialTag = {
                key: nodeId,
                nodeId,
                malwareId: first.malware_id,
                name: `Malware: ${first.name}`,
                type: "Malware"
            };
            setGraphTags([initialTag]);
            setActiveTagId(nodeId);
            setSelectedMalwareValues([first.malware_id]);
            loadGraphForNode(nodeId, first.malware_id, first.name);
        }
    }, [malwareList]);

    // 2. Fetch or load graph data for a specific node
    const loadGraphForNode = async (nodeId, malwareId = "", malwareName = "") => {
        setStatusMessage("Loading knowledge graph…");
        setIsStatusError(false);

        try {
            let graphData = null;
            try {
                const res = await fetch(`/api/kg/node/${encodeURIComponent(nodeId)}`);
                if (res.ok) {
                    graphData = await res.json();
                }
            } catch {
                // fallback to mock
            }

            if (!graphData || !graphData.nodes) {
                graphData = MOCK_GRAPHS[nodeId];
                if (!graphData) {
                    const name = malwareName || nodeId.replace(/^(malware|ta|mitre|beh|infra|vuln|ind|cls):/, "");
                    const isTa = nodeId.startsWith("ta:");
                    const isMitre = nodeId.startsWith("mitre:");
                    const isBeh = nodeId.startsWith("beh:");
                    const isInfra = nodeId.startsWith("infra:");

                    graphData = {
                        root_id: nodeId,
                        nodes: [
                            { id: nodeId, labels: [isTa ? "ThreatActor" : isMitre ? "MitreAttack" : isBeh ? "Behavior" : isInfra ? "Infrastructure" : "Malware", "GraphNode"], properties: { name: name, description: `Detailed knowledge entity for ${name}` } },
                            { id: `ta:${nodeId}-actor`, labels: ["ThreatActor", "GraphNode"], properties: { name: "APT29 Cozy Bear", origin: "Russia" } },
                            { id: `mitre:${nodeId}-t1`, labels: ["MitreAttack", "GraphNode"], properties: { technique_id: "T1071", name: "Application Layer Protocol", tactic: "Command and Control" } },
                            { id: `beh:${nodeId}-persistence`, labels: ["Behavior", "GraphNode"], properties: { behavior_name: "Registry Run Key Persistence", action: "AutoRun registry execution" } },
                            { id: `infra:${nodeId}-c2`, labels: ["Infrastructure", "GraphNode"], properties: { name: "c2-gate-node.org", type: "C2 Server" } },
                            { id: `vuln:${nodeId}-v1`, labels: ["Vulnerability", "GraphNode"], properties: { cve: "CVE-2023-38831", name: "Exploit Chain" } }
                        ],
                        edges: [
                            { source: nodeId, target: `ta:${nodeId}-actor`, type: "RELATED_TO_THREAT_ACTOR", properties: { confidence: "High" } },
                            { source: nodeId, target: `mitre:${nodeId}-t1`, type: "HAS_MITRE_ATTACK", properties: { type: "C2" } },
                            { source: nodeId, target: `beh:${nodeId}-persistence`, type: "HAS_BEHAVIORS", properties: { method: "AutoRun" } },
                            { source: nodeId, target: `infra:${nodeId}-c2`, type: "HAS_INFRASTRUCTURE", properties: { port: "443" } },
                            { source: nodeId, target: `vuln:${nodeId}-v1`, type: "HAS_VULNERABILITIES", properties: { severity: "High" } }
                        ]
                    };
                }
            }

            setLoadedGraphs((prev) => ({ ...prev, [nodeId]: graphData }));
            setFocusedNodeId(nodeId);
            setStatusMessage(`Loaded knowledge graph for ${nodeId}.`);
        } catch (err) {
            setStatusMessage(err.message || "Failed to load graph", true);
            setIsStatusError(true);
        }
    };

    // 3. Merge all loaded graphs into unified knowledge base
    const unifiedGraph = useMemo(() => {
        const nodeMap = new Map();
        const edgeList = [];

        Object.values(loadedGraphs).forEach((gData) => {
            if (!gData) return;
            (gData.nodes || []).forEach((n) => {
                if (!nodeMap.has(n.id)) {
                    nodeMap.set(n.id, { ...n });
                }
            });
            (gData.edges || []).forEach((e) => {
                edgeList.push({ ...e });
            });
        });

        // Inter-relate multiple tags if more than 1 tag exists
        if (graphTags.length > 1) {
            for (let i = 0; i < graphTags.length - 1; i++) {
                const sourceId = graphTags[i].nodeId;
                const targetId = graphTags[i + 1].nodeId;
                const exists = edgeList.some(
                    (e) => (e.source === sourceId && e.target === targetId) || (e.source === targetId && e.target === sourceId)
                );
                if (!exists && nodeMap.has(sourceId) && nodeMap.has(targetId)) {
                    edgeList.push({
                        source: sourceId,
                        target: targetId,
                        type: "RELATED_TO_MALWARE",
                        properties: { relation: "Exploration Link" }
                    });
                }
            }
        }

        // Deduplicate edges
        const uniqueEdges = [];
        const edgeKeys = new Set();
        edgeList.forEach((e) => {
            const key = `${e.source}->${e.target}:${e.type}`;
            if (!edgeKeys.has(key)) {
                edgeKeys.add(key);
                uniqueEdges.push(e);
            }
        });

        return {
            nodes: Array.from(nodeMap.values()),
            edges: uniqueEdges
        };
    }, [loadedGraphs, graphTags]);

    // 4. Extract all available relationship types
    const availableRelationshipTypes = useMemo(() => {
        const set = new Set();
        unifiedGraph.edges.forEach((e) => {
            if (e.type) set.add(e.type);
        });
        return Array.from(set).sort();
    }, [unifiedGraph.edges]);

    // Initialize all checkboxes to true whenever new types are discovered
    useEffect(() => {
        if (availableRelationshipTypes.length > 0) {
            setSelectedConnectionTypes((prev) => {
                const next = new Set(prev);
                let changed = false;
                availableRelationshipTypes.forEach((t) => {
                    if (!next.has(t) && prev.size === 0) {
                        next.add(t);
                        changed = true;
                    }
                });
                return changed ? next : prev.size === 0 ? new Set(availableRelationshipTypes) : prev;
            });
        }
    }, [availableRelationshipTypes]);

    // 5. SCOPE: Show ONLY the active node and its directly related nodes
    const filteredGraph = useMemo(() => {
        const activeTypes = selectedConnectionTypes;
        const centerId = activeTagId || focusedNodeId || (graphTags[0] ? graphTags[0].nodeId : null);

        if (!centerId) {
            return { nodes: [], edges: [], centerId: null };
        }

        // Get direct edges connecting to the active center node
        let directEdges = unifiedGraph.edges.filter(
            (edge) => (edge.source === centerId || edge.target === centerId) && activeTypes.has(edge.type)
        );

        if (showKeyRelationships) {
            const important = directEdges.filter((e) => IMPORTANT_RELATIONSHIPS.has(e.type));
            if (important.length > 0) {
                directEdges = important;
            } else {
                directEdges = directEdges.slice(0, 8);
            }
        }

        // Build set of visible node IDs: the center node + its 1-hop connected neighbors
        const visibleNodeIds = new Set([centerId]);
        directEdges.forEach((edge) => {
            visibleNodeIds.add(edge.source);
            visibleNodeIds.add(edge.target);
        });

        // Also include any edges between these visible neighbors if relationship is enabled
        const visibleEdges = unifiedGraph.edges.filter(
            (edge) =>
                visibleNodeIds.has(edge.source) &&
                visibleNodeIds.has(edge.target) &&
                activeTypes.has(edge.type)
        );

        const visibleNodes = unifiedGraph.nodes.filter((n) => visibleNodeIds.has(n.id));

        return { nodes: visibleNodes, edges: visibleEdges, centerId };
    }, [unifiedGraph, selectedConnectionTypes, showKeyRelationships, activeTagId, focusedNodeId, graphTags]);

    // 6. Clean Radial Star Layout matching UI Design
    const [animatedNodes, setAnimatedNodes] = useState([]);

    useEffect(() => {
        const width = 1100;
        const height = 650;
        const centerId = filteredGraph.centerId;

        const otherNodes = filteredGraph.nodes.filter((n) => n.id !== centerId);
        const centerNodeObj = filteredGraph.nodes.find((n) => n.id === centerId);

        const totalOthers = otherNodes.length;
        const radiusDist = totalOthers > 8 ? 255 : 220;

        const nodes = [];
        if (centerNodeObj) {
            nodes.push({
                ...centerNodeObj,
                x: width / 2,
                y: height / 2 - 10,
                isCenter: true
            });
        }

        otherNodes.forEach((node, index) => {
            // Clockwise radial distribution starting from top (-PI/2)
            const angle = (index / Math.max(1, totalOthers)) * 2 * Math.PI - Math.PI / 2;
            const x = width / 2 + Math.cos(angle) * radiusDist;
            const y = height / 2 - 10 + Math.sin(angle) * radiusDist;
            nodes.push({
                ...node,
                x,
                y,
                isCenter: false
            });
        });

        nodes.forEach((n) => {
            nodePositionsRef.current.set(n.id, { x: n.x, y: n.y });
        });

        setAnimatedNodes(nodes);
    }, [filteredGraph]);

    // Handle react-select multi onChange
    const handleMalwareSelectChange = (selectedOptions) => {
        const newValues = (selectedOptions || []).map((opt) => opt.value);
        const prevValues = selectedMalwareValues;
        setSelectedMalwareValues(newValues);

        // Find newly added items
        const added = newValues.filter((v) => !prevValues.includes(v));
        // Find removed items
        const removed = prevValues.filter((v) => !newValues.includes(v));

        // Add graph tags for newly selected items
        added.forEach((malId) => {
            const item = malwareList.find((m) => m.malware_id === malId);
            const name = item ? item.name : malId;
            const nodeId = `malware:${malId}`;

            const existingTag = graphTags.find((t) => t.nodeId === nodeId);
            if (!existingTag) {
                const newTag = {
                    key: nodeId,
                    nodeId,
                    malwareId: malId,
                    name: `Malware: ${name}`,
                    type: "Malware"
                };
                setGraphTags((prev) => [...prev, newTag]);
            }

            setActiveTagId(nodeId);
            setFocusedNodeId(nodeId);
            loadGraphForNode(nodeId, malId, name);
        });

        // Remove graph tags for deselected items
        removed.forEach((malId) => {
            const nodeId = `malware:${malId}`;
            handleRemoveTag(nodeId);
        });

        // If something was added, focus on the last added
        if (added.length > 0) {
            const lastAdded = added[added.length - 1];
            setActiveTagId(`malware:${lastAdded}`);
            setFocusedNodeId(`malware:${lastAdded}`);
        }
    };

    // Remove tag chip
    const handleRemoveTag = (tagKey, e) => {
        if (e) e.stopPropagation();
        const updatedTags = graphTags.filter((t) => t.key !== tagKey);
        setGraphTags(updatedTags);

        // Also remove from selectedMalwareValues if it's a malware tag
        const removedTag = graphTags.find((t) => t.key === tagKey);
        if (removedTag && removedTag.malwareId) {
            setSelectedMalwareValues((prev) => prev.filter((v) => v !== removedTag.malwareId));
        }

        if (tagKey === activeTagId) {
            const nextTag = updatedTags[updatedTags.length - 1];
            if (nextTag) {
                setActiveTagId(nextTag.key);
                setFocusedNodeId(nextTag.nodeId);
            } else {
                setActiveTagId(null);
                setFocusedNodeId(null);
            }
        }
    };

    // ON CLICK ON ANY NODE IN GRAPH: make a new chip, animate, and show related nodes only
    const handleNodeClick = (nodeId) => {
        setFocusedNodeId(nodeId);
        setActiveTagId(nodeId);

        const node = unifiedGraph.nodes.find((n) => n.id === nodeId);
        if (!node) return;

        const type = getNodeType(node);
        const title = getNodeTitle(node);

        // Check if chip already exists for this node
        const existingTag = graphTags.find((t) => t.nodeId === nodeId);
        if (!existingTag) {
            const newTag = {
                key: nodeId,
                nodeId,
                name: `${type}: ${shorten(title, 20)}`,
                type: type,
                malwareId: type === "Malware" ? nodeId.replace("malware:", "") : null
            };
            setGraphTags((prev) => [...prev, newTag]);
        }

        // If malware, update multi-select values
        if (type === "Malware") {
            const malId = nodeId.replace("malware:", "");
            setSelectedMalwareValues((prev) => prev.includes(malId) ? prev : [...prev, malId]);
        }

        // Load subgraph if not already loaded
        if (!loadedGraphs[nodeId]) {
            loadGraphForNode(nodeId, "", title);
        }
    };

    // Connection filter checkboxes
    const toggleConnectionType = (type) => {
        setSelectedConnectionTypes((prev) => {
            const next = new Set(prev);
            if (next.has(type)) {
                next.delete(type);
            } else {
                next.add(type);
            }
            return next;
        });
    };

    const handleSelectAllConnections = () => {
        setSelectedConnectionTypes(new Set(availableRelationshipTypes));
    };

    const handleUnselectAllConnections = () => {
        setSelectedConnectionTypes(new Set());
    };

    // Focused Node Details
    const focusedNode = useMemo(() => {
        if (!focusedNodeId) return animatedNodes[0] || null;
        return unifiedGraph.nodes.find((n) => n.id === focusedNodeId) || null;
    }, [focusedNodeId, unifiedGraph.nodes, animatedNodes]);

    const connectedEdgesForFocused = useMemo(() => {
        if (!focusedNode) return [];
        return filteredGraph.edges.filter(
            (e) => e.source === focusedNode.id || e.target === focusedNode.id
        );
    }, [focusedNode, filteredGraph.edges]);

    const focusedNodeDetails = useMemo(() => {
        if (!focusedNode) return null;
        const type = getNodeType(focusedNode);
        const title = getNodeTitle(focusedNode);
        const props = focusedNode.properties || {};

        // Find connected actors
        const connectedActors = filteredGraph.edges
            .filter((e) => e.source === focusedNode.id || e.target === focusedNode.id)
            .map((e) => (e.source === focusedNode.id ? e.target : e.source))
            .map((id) => unifiedGraph.nodes.find((n) => n.id === id))
            .filter((n) => n && getNodeType(n) === "ThreatActor")
            .map((n) => getNodeTitle(n));

        const actorsDisplay = connectedActors.length > 0
            ? connectedActors.join(", ")
            : (props.associated_actors || (type === "Malware" ? "Storm-0539, APT29" : "APT29"));

        const category = props.type || props.category || props.family || (type === "Malware" ? "InfoStealer" : type);
        const variants = props.variants || (type === "Malware" ? "RedLine v24, RedLine v26" : props.variant || "Standard Variant");
        const platforms = props.platforms || props.platform || "Windows";
        const firstSeen = props.first_seen || props.firstSeen || "2020";
        const lastSeen = props.last_seen || props.lastSeen || "2025";
        const description = props.description || (
            type === "Malware"
                ? `${title} is an information-stealing malware that targets credentials, cookies, and other sensitive data from compromised systems. It is often delivered through malicious loaders and distributed via underground markets.`
                : type === "ThreatActor"
                ? `${title} is an advanced persistent threat group focused on high-profile espionage, credential theft, and financial extortion operations globally.`
                : type === "MitreAttack"
                ? `Enterprise ATT&CK technique ${title} covering adversary collection, execution, and credential exfiltration vectors.`
                : `Knowledge entity detailing ${title} and associated intelligence indicators.`
        );

        return {
            type,
            title,
            category,
            variants,
            platforms,
            actorsDisplay,
            firstSeen,
            lastSeen,
            description,
            nodeColor: getColourFor(type)
        };
    }, [focusedNode, filteredGraph.edges, unifiedGraph.nodes]);

    const connectedEntities = useMemo(() => {
        if (!focusedNode) return [];
        return filteredGraph.edges
            .filter((e) => e.source === focusedNode.id || e.target === focusedNode.id)
            .map((e) => {
                const isSource = e.source === focusedNode.id;
                const targetId = isSource ? e.target : e.source;
                const targetNode = unifiedGraph.nodes.find((n) => n.id === targetId);
                return {
                    edge: e,
                    targetId,
                    targetNode,
                    relationType: e.type,
                    isOutgoing: isSource
                };
            })
            .filter((item) => item.targetNode);
    }, [focusedNode, filteredGraph.edges, unifiedGraph.nodes]);

    // Breakdown count of selected entity relationships
    const selectedEntityCategoryCounts = useMemo(() => {
        if (!focusedNode) {
            return RELATIONSHIP_CATEGORY_CONFIG.map((cat) => ({
                ...cat,
                count: cat.defaultCount
            }));
        }

        const connectedEdges = (unifiedGraph.edges || []).filter(
            (e) => e.source === focusedNode.id || e.target === focusedNode.id
        );

        const connectedNodes = connectedEdges
            .map((e) => {
                const targetId = e.source === focusedNode.id ? e.target : e.source;
                return unifiedGraph.nodes.find((n) => n.id === targetId);
            })
            .filter(Boolean);

        const counts = RELATIONSHIP_CATEGORY_CONFIG.map((cat) => {
            const matches = connectedNodes.filter((node) => {
                const type = getNodeType(node);
                return cat.types.includes(type) || (node.labels && node.labels.some((l) => cat.types.includes(l)));
            });
            return {
                ...cat,
                count: matches.length > 0 ? matches.length : cat.defaultCount
            };
        });

        const activeCategories = counts.filter((c) => c.count > 0);
        return activeCategories.length > 0
            ? activeCategories
            : RELATIONSHIP_CATEGORY_CONFIG.map((cat) => ({
                  ...cat,
                  count: cat.defaultCount
              }));
    }, [focusedNode, unifiedGraph]);

    const totalSelectedRelationshipsCount = useMemo(() => {
        return selectedEntityCategoryCounts.reduce((acc, curr) => acc + (curr.count || 0), 0);
    }, [selectedEntityCategoryCounts]);

    // Zoom Controls
    const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.2));
    const handleZoomOut = () => setZoomLevel((z) => Math.max(0.4, z - 0.2));
    const handleResetZoom = () => {
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
    };

    // Drag canvas handling
    const handleMouseDownCanvas = (e) => {
        if (e.target.closest(".node-group")) return;
        setIsDraggingCanvas(true);
        setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    };

    const handleMouseMoveCanvas = (e) => {
        if (isDraggingCanvas) {
            setPanOffset({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUpCanvas = () => {
        setIsDraggingCanvas(false);
    };

    // Sync body class for global CSS targeting (e.g. hide floating chat btn)


    const filteredConnectionTypes = useMemo(() => {
        if (!filterSearchTerm) return availableRelationshipTypes;
        return availableRelationshipTypes.filter((t) =>
            t.toLowerCase().includes(filterSearchTerm.toLowerCase())
        );
    }, [availableRelationshipTypes, filterSearchTerm]);

    return (
        <div className="threat-page threat-actor-kg-page">
            {/* Header Section */}
            <div className="graph-header">
                {/* Breadcrumb + Heading Group */}
                <AdversaryTriageTopcontent title="Neura View">
                    {/* Malware Select Row */}
                    <div className="picker-row d-flex align-items-center gap-3 flex-wrap mb-0">
                        <div className="picker-group entity-picker-group" style={{ flex: '0 0 200px', width: '200px', minWidth: '200px', maxWidth: '200px' }}>
                            <div className="select-wrapper" style={{ width: '100%', minWidth: 'unset', maxWidth: 'unset' }}>
                                <select
                                    className="form-select entity-dropdown-select rounded-pill"
                                    value={selectedEntityType}
                                    onChange={(e) => setSelectedEntityType(e.target.value)}
                                >
                                    <option value="malware">Malware</option>
                                    <option value="threatactor">Threat Actor</option>
                                    <option value="campaign">Campaign</option>
                                </select>
                            </div>
                        </div>

                        <div className="picker-group">
                            <div className="search-wrapper position-relative m-0">
                                <Select
                                    inputId="malware-select"
                                    isMulti
                                    options={malwareSelectOptions}
                                    value={selectedMalwareSelectValue}
                                    onChange={handleMalwareSelectChange}
                                    isDisabled={isMalwareLoading}
                                    isLoading={isMalwareLoading}
                                    placeholder={
                                        isMalwareLoading
                                            ? "Loading…"
                                            : selectedEntityType === "threatactor"
                                                ? "Search Threat Actor to add"
                                                : selectedEntityType === "malware"
                                                    ? "Search Malware to add"
                                                    : "Search Campaign to add"
                                    }
                                    closeMenuOnSelect={false}
                                    isClearable
                                    isSearchable
                                    styles={reactSelectStyles}
                                    components={{
                                        ValueContainer: CustomValueContainer,
                                        DropdownIndicator: CustomDropdownIndicator,
                                        IndicatorSeparator: () => null
                                    }}
                                    noOptionsMessage={() => "No results found"}
                                    className="malware-react-select"
                                    classNamePrefix="malware-rs"
                                />
                            </div>
                        </div>
                    </div>
                </AdversaryTriageTopcontent>

                {/* ================= ENTITY QUERY & MALWARE SELECTOR SECTION ================= */}
                <div className="view-controls-card shadow-sm mt-3">
                    <div className="view-controls-section entity-query-section-white d-flex flex-column align-items-stretch gap-3">
                        {/* Threat Actors / Entities Section with Accordion */}
                        {(() => {
                            const MAX_HEADER_CHIPS = 3;
                            const headerChips = graphTags.slice(0, MAX_HEADER_CHIPS);
                            const remainingChips = graphTags.slice(MAX_HEADER_CHIPS);

                            return (
                                <div className="threat-actors-section w-100">
                                    <div
                                        className="d-flex align-items-center justify-content-between cursor-pointer user-select-none"
                                        onClick={() => {
                                            if (remainingChips.length > 0) {
                                                setIsOverviewAccordionOpen(!isOverviewAccordionOpen);
                                            }
                                        }}
                                        style={{ cursor: remainingChips.length > 0 ? "pointer" : "default" }}
                                    >
                                        <div className="d-flex align-items-center flex-wrap gap-2">
                                            <span className="section-title">SELECTED ENTITIES :</span>
                                            <span className="selected-badge">{graphTags.length} Selected</span>

                                            {/* Header Entity Chips */}
                                            {headerChips.length > 0 && (
                                                <div className="selected-chips-container ms-2" aria-label="Selected entity chips" onClick={(e) => e.stopPropagation()}>
                                                    {headerChips.map((tag) => {
                                                        const chipColor = getColourFor(tag.type || "Malware");
                                                        return (
                                                            <div
                                                                key={tag.key}
                                                                className={`malware-chip ${tag.key === activeTagId ? "active" : ""}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveTagId(tag.key);
                                                                    setFocusedNodeId(tag.nodeId);
                                                                }}
                                                            >
                                                                <span className="chip-indicator" style={{ backgroundColor: chipColor }} />
                                                                <span className="chip-text">{tag.name}</span>
                                                                <button
                                                                    type="button"
                                                                    className="chip-close-btn"
                                                                    title={`Remove ${tag.name}`}
                                                                    onClick={(e) => handleRemoveTag(tag.key, e)}
                                                                >
                                                                    <FiX />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {remainingChips.length > 0 && (
                                            <div
                                                className="accordion-toggle-icon d-flex align-items-center text-muted"
                                                style={{ fontSize: "16px", cursor: "pointer" }}
                                                title={isOverviewAccordionOpen ? "Collapse remaining entities" : `Show ${remainingChips.length} more entities`}
                                            >
                                                <span className="badge rounded-pill bg-light text-dark border me-1" style={{ fontSize: "11px", fontWeight: 600 }}>
                                                    +{remainingChips.length} more
                                                </span>
                                                <i className={`bi ${isOverviewAccordionOpen ? "bi-dash" : "bi-plus"}`}></i>
                                            </div>
                                        )}
                                    </div>

                                    {isOverviewAccordionOpen && remainingChips.length > 0 && (
                                        <div className="accordion-content mt-3">
                                            {/* Remaining Entity Chips */}
                                            <div className="selected-chips-container" aria-label="Remaining entity chips">
                                                {remainingChips.map((tag) => {
                                                    const chipColor = getColourFor(tag.type || "Malware");
                                                    return (
                                                        <div
                                                            key={tag.key}
                                                            className={`malware-chip ${tag.key === activeTagId ? "active" : ""}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveTagId(tag.key);
                                                                setFocusedNodeId(tag.nodeId);
                                                            }}
                                                        >
                                                            <span className="chip-indicator" style={{ backgroundColor: chipColor }} />
                                                            <span className="chip-text">{tag.name}</span>
                                                            <button
                                                                type="button"
                                                                className="chip-close-btn"
                                                                title={`Remove ${tag.name}`}
                                                                onClick={(e) => handleRemoveTag(tag.key, e)}
                                                            >
                                                                <FiX />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* ================= GRAPH CANVAS & DETAILS WORKSPACE ================= */}
            <div className="graph-workspace-layout">
                <div className="graph-main-content-row">
                    {/* SVG Graph Canvas */}
                    <div
                        className="graph-canvas-container"
                    onMouseDown={handleMouseDownCanvas}
                    onMouseMove={handleMouseMoveCanvas}
                    onMouseUp={handleMouseUpCanvas}
                >
                    {/* Floating Zoom & Fit Controls */}
                    <div className="graph-floating-controls">
                        <button
                            className="tool-icon-btn"
                            title="Zoom Out"
                            type="button"
                            onClick={handleZoomOut}
                        >
                            <FiZoomOut />
                        </button>
                        <button
                            className="tool-icon-btn"
                            title="Zoom In"
                            type="button"
                            onClick={handleZoomIn}
                        >
                            <FiZoomIn />
                        </button>
                        <div className="control-divider" />
                        <button
                            className="tool-icon-btn"
                            title="Reset View / Fit to Screen"
                            type="button"
                            onClick={handleResetZoom}
                        >
                            <FiMaximize2 />
                        </button>
                    </div>

                    {/* Graph SVG Rendering with smooth CSS transitions */}
                    <svg
                        ref={svgRef}
                        className="interactive-kg-svg"
                        viewBox="0 0 1100 650"
                        style={{
                            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                            transformOrigin: "center center",
                            transition: isDraggingCanvas ? "none" : "transform 0.2s ease-out"
                        }}
                    >
                        <defs>
                            <pattern id="kgDotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" opacity="0.65" />
                            </pattern>
                            <radialGradient id="centerNodeGlow" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.38" />
                                <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.14" />
                                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id="centerNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4f46e5" />
                                <stop offset="100%" stopColor="#7c3aed" />
                            </linearGradient>

                            {/* Colored Arrow Markers for each entity type */}
                            {Object.entries(PALETTE).map(([type, color]) => (
                                <marker
                                    key={`arrow-${type}`}
                                    id={`arrow-${type.replace(/[^a-zA-Z0-9]/g, "_")}`}
                                    viewBox="0 -5 10 10"
                                    refX="28"
                                    refY="0"
                                    markerWidth="6"
                                    markerHeight="6"
                                    orient="auto"
                                >
                                    <path d="M0,-4.5L9,0L0,4.5" fill={color} />
                                </marker>
                            ))}
                            <marker
                                id="kg-arrow-default"
                                viewBox="0 -5 10 10"
                                refX="28"
                                refY="0"
                                markerWidth="6"
                                markerHeight="6"
                                orient="auto"
                            >
                                <path d="M0,-4.5L9,0L0,4.5" fill="#94a3b8" />
                            </marker>
                        </defs>

                        {/* Dot Grid Background */}
                        <rect width="100%" height="100%" fill="url(#kgDotGrid)" />

                        {/* Edge Lines & Relationship Labels */}
                        <g className="edges-layer">
                            {filteredGraph.edges.map((edge, idx) => {
                                const source = animatedNodes.find((n) => n.id === edge.source);
                                const target = animatedNodes.find((n) => n.id === edge.target);
                                if (!source || !target) return null;

                                const nonCenter = target.isCenter ? source : target;
                                const targetType = getNodeType(nonCenter);
                                const edgeColor = getColourFor(targetType) || "#94a3b8";
                                const markerId = `arrow-${targetType.replace(/[^a-zA-Z0-9]/g, "_")}`;

                                const isFocused =
                                    focusedNode && (focusedNode.id === edge.source || focusedNode.id === edge.target);

                                // Smooth curved bezier path geometry
                                const dx = target.x - source.x;
                                const dy = target.y - source.y;
                                const dist = Math.max(1, Math.hypot(dx, dy));
                                const nx = -dy / dist;
                                const ny = dx / dist;

                                // Gentle curvature offset
                                const curvature = 24;
                                const midX = (source.x + target.x) / 2;
                                const midY = (source.y + target.y) / 2;
                                const ctrlX = midX + nx * curvature;
                                const ctrlY = midY + ny * curvature;

                                // Apex coordinate on the curve for the badge pill
                                const labelX = (source.x + 2 * ctrlX + target.x) / 4;
                                const labelY = (source.y + 2 * ctrlY + target.y) / 4;
                                const pathD = `M ${source.x} ${source.y} Q ${ctrlX} ${ctrlY} ${target.x} ${target.y}`;

                                const labelText = edge.type.replace(/_/g, " ");
                                const badgeWidth = labelText.length * 6.6 + 18;

                                return (
                                    <g key={`edge-${edge.source}-${edge.target}-${edge.type}-${idx}`} className="edge-group">
                                        <path
                                            d={pathD}
                                            fill="none"
                                            stroke={edgeColor}
                                            strokeWidth={isFocused ? "2.2" : "1.8"}
                                            className={`svg-edge-line ${isFocused ? "focused-edge" : ""}`}
                                            markerEnd={`url(#${markerId})`}
                                        />
                                        <rect
                                            x={labelX - badgeWidth / 2}
                                            y={labelY - 10}
                                            width={badgeWidth}
                                            height={20}
                                            rx={10}
                                            className="edge-label-bg"
                                        />
                                        <text
                                            x={labelX}
                                            y={labelY + 3.5}
                                            className={`svg-edge-text ${isFocused ? "focused-text" : ""}`}
                                        >
                                            {labelText}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>

                        {/* Node Elements */}
                        <g className="nodes-layer">
                            {animatedNodes.map((node) => {
                                const type = getNodeType(node);
                                const title = getNodeTitle(node);
                                const subtitle = getNodeSubtitle(node);
                                const isFocused = (activeTagId === node.id) || (focusedNode && focusedNode.id === node.id);
                                const isCenter = node.isCenter || node.id === filteredGraph.centerId;
                                const nodeColor = getColourFor(type);

                                if (isCenter) {
                                    return (
                                        <g
                                            key={node.id}
                                            className={`node-group center-node-group ${isFocused ? "focused" : ""}`}
                                            transform={`translate(${node.x}, ${node.y})`}
                                            onClick={() => handleNodeClick(node.id)}
                                        >
                                            <circle r="76" fill="url(#centerNodeGlow)" />
                                            <circle
                                                r="60"
                                                className="center-node-main-circle"
                                                fill="url(#centerNodeGrad)"
                                                stroke="#ffffff"
                                                strokeWidth="3.5"
                                            />

                                            <foreignObject x="-54" y="-54" width="108" height="108" style={{ pointerEvents: "none" }}>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "100%",
                                                    height: "100%",
                                                    padding: "6px 8px",
                                                    textAlign: "center",
                                                    boxSizing: "border-box"
                                                }}>
                                                    <div style={{ color: "#ffffff", fontSize: "20px", lineHeight: "1", marginBottom: "4px" }}>
                                                        <i className="bi bi-bug"></i>
                                                    </div>
                                                    <div style={{
                                                        color: "#ffffff",
                                                        fontSize: "12.5px",
                                                        fontWeight: "700",
                                                        lineHeight: "1.2",
                                                        maxWidth: "96px",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap"
                                                    }}>
                                                        {title}
                                                    </div>
                                                    <div style={{
                                                        color: "rgba(255, 255, 255, 0.85)",
                                                        fontSize: "10.5px",
                                                        fontWeight: "500",
                                                        lineHeight: "1.2",
                                                        marginTop: "2px",
                                                        maxWidth: "96px",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap"
                                                    }}>
                                                        {subtitle || "Malware"}
                                                    </div>
                                                </div>
                                            </foreignObject>
                                        </g>
                                    );
                                }

                                return (
                                    <g
                                        key={node.id}
                                        className={`node-group outer-node-group ${isFocused ? "focused" : ""}`}
                                        transform={`translate(${node.x}, ${node.y})`}
                                        onClick={() => handleNodeClick(node.id)}
                                    >
                                        <circle r="30" fill={nodeColor} opacity="0.18" />

                                        {isFocused && (
                                            <circle
                                                r="35"
                                                className="node-focus-ring"
                                                fill="none"
                                                stroke={nodeColor}
                                                strokeWidth="2"
                                                strokeDasharray="4 3"
                                            />
                                        )}

                                        <circle
                                            r="23"
                                            className="svg-outer-node-circle"
                                            fill={nodeColor}
                                            stroke="#ffffff"
                                            strokeWidth="2.5"
                                        />

                                        <foreignObject x="-13" y="-13" width="26" height="26" style={{ pointerEvents: "none" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", color: "#ffffff", fontSize: "14px" }}>
                                                {renderNodeIcon(type, "#ffffff")}
                                            </div>
                                        </foreignObject>

                                        <text
                                            className="svg-outer-node-title"
                                            y="40"
                                            textAnchor="middle"
                                        >
                                            {shorten(title, 22)}
                                        </text>
                                        <text
                                            className="svg-outer-node-subtitle"
                                            y="54"
                                            textAnchor="middle"
                                        >
                                            {shorten(subtitle, 20)}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    </svg>

                    </div>

                {/* ================= RIGHT DETAIL & RELATIONSHIPS PANEL ================= */}
                <div className="kg-details-sidebar">
                    {/* Top Tab Switcher */}
                    <div className="kg-sidebar-tabs">
                        <button
                            type="button"
                            className={`kg-sidebar-tab-btn ${sidebarActiveTab === "details" ? "active" : ""}`}
                            onClick={() => setSidebarActiveTab("details")}
                        >
                            Details
                        </button>
                        <button
                            type="button"
                            className={`kg-sidebar-tab-btn ${sidebarActiveTab === "relationships" ? "active" : ""}`}
                            onClick={() => setSidebarActiveTab("relationships")}
                        >
                            Relationships
                        </button>
                    </div>

                    <div className="details-scrollable-body">
                        {/* 1. DETAILS TAB */}
                        {sidebarActiveTab === "details" && (
                            <div className="sidebar-tab-content details-tab-pane">
                                {focusedNodeDetails ? (
                                    <>
                                        {/* Entity Header Profile */}
                                        <div className="entity-profile-card">
                                            <div
                                                className="entity-avatar-box"
                                                style={{ backgroundColor: focusedNodeDetails.nodeColor }}
                                            >
                                                {focusedNodeDetails.type === "Malware" ? (
                                                    <i className="bi bi-bug"></i>
                                                ) : focusedNodeDetails.type === "ThreatActor" ? (
                                                    <FiShield />
                                                ) : focusedNodeDetails.type === "MitreAttack" ? (
                                                    <FiActivity />
                                                ) : (
                                                    <i className="bi bi-diagram-3"></i>
                                                )}
                                            </div>
                                            <div className="entity-title-info">
                                                <h4 className="entity-main-title">{focusedNodeDetails.title}</h4>
                                                <div className="entity-subtitle">
                                                    <span>{focusedNodeDetails.category}</span>
                                                    <FiExternalLink className="ext-link-icon" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="section-divider" />

                                        {/* Key Attributes Section */}
                                        <div className="attributes-section">
                                            <div className="section-header-title">
                                                <FiZap className="section-icon-zap" />
                                                <span>Key Attributes</span>
                                            </div>

                                            <div className="attributes-list">
                                                <div className="attribute-row">
                                                    <span className="attr-label">Type</span>
                                                    <span className="attr-value">
                                                        <span className="badge-type-purple">{focusedNodeDetails.type}</span>
                                                    </span>
                                                </div>
                                                <div className="attribute-row">
                                                    <span className="attr-label">Category</span>
                                                    <span className="attr-value">
                                                        <span className="badge-category-gray">{focusedNodeDetails.category}</span>
                                                    </span>
                                                </div>
                                                <div className="attribute-row">
                                                    <span className="attr-label">Variants</span>
                                                    <span className="attr-value text-dark">{focusedNodeDetails.variants}</span>
                                                </div>
                                                <div className="attribute-row">
                                                    <span className="attr-label">Platforms</span>
                                                    <span className="attr-value d-flex align-items-center gap-1">
                                                        <i className="bi bi-windows text-info" style={{ fontSize: "13px" }}></i>
                                                        <span>{focusedNodeDetails.platforms}</span>
                                                    </span>
                                                </div>
                                                <div className="attribute-row">
                                                    <span className="attr-label">Associated Actors</span>
                                                    <span className="attr-value">
                                                        <span className="associated-actors-text">{focusedNodeDetails.actorsDisplay}</span>
                                                    </span>
                                                </div>
                                                <div className="attribute-row">
                                                    <span className="attr-label">First Seen</span>
                                                    <span className="attr-value text-dark">{focusedNodeDetails.firstSeen}</span>
                                                </div>
                                                <div className="attribute-row">
                                                    <span className="attr-label">Last Seen</span>
                                                    <span className="attr-value text-dark">{focusedNodeDetails.lastSeen}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="section-divider" />

                                        {/* Description Section */}
                                        <div className="description-section">
                                            <div className="section-header-title">
                                                <FiActivity className="section-icon-desc" />
                                                <span>Description</span>
                                            </div>
                                            <p className={`description-text ${isDescExpanded ? "expanded" : "clamped"}`}>
                                                {focusedNodeDetails.description}
                                            </p>
                                            <button
                                                type="button"
                                                className="show-more-toggle-btn"
                                                onClick={() => setIsDescExpanded(!isDescExpanded)}
                                            >
                                                {isDescExpanded ? "Show less" : "Show more"}
                                            </button>
                                        </div>

                                        {/* Action Footer Buttons */}
                                        <div className="sidebar-action-footer">
                                            <button
                                                type="button"
                                                className="btn-intel-action primary"
                                                onClick={() => navigate(parentPath)}
                                            >
                                                <FiShare2 className="btn-icon" />
                                                <span>View in Intel Card</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-intel-action secondary"
                                                onClick={() => {
                                                    alert(`Added ${focusedNodeDetails.title} to investigation.`);
                                                }}
                                            >
                                                <FiPlusSquare className="btn-icon" />
                                                <span>Add to Investigation</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="empty-details text-center text-muted p-4">
                                        <FiInfo style={{ fontSize: "28px", opacity: 0.5, marginBottom: "8px" }} />
                                        <p className="small mb-0">Select a node in the graph to inspect details.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. RELATIONSHIPS TAB */}
                        {sidebarActiveTab === "relationships" && (
                            <div className="sidebar-tab-content relationships-tab-pane">
                              

                                {/* Relationship Filters Section */}
                                <div className="details-section relationships-filter-section">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <h5 className="section-heading mb-0" style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a' }}>Filter Graph Relationships</h5>
                                        <span className="filters-count-badge" style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: '#eff6ff', color: '#1d4ed8', fontWeight: '600' }}>
                                            {selectedConnectionTypes.size} of {availableRelationshipTypes.length}
                                        </span>
                                    </div>

                                    <p className="filters-subtext mb-2 text-muted" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                        Toggle relationship types to display in the graph:
                                    </p>

                                    <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                                        <div className="d-flex align-items-center gap-1">
                                            <button
                                                type="button"
                                                className="btn-filter-pill"
                                                onClick={handleSelectAllConnections}
                                                disabled={availableRelationshipTypes.length === 0}
                                            >
                                                Select all
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-filter-pill"
                                                onClick={handleUnselectAllConnections}
                                                disabled={availableRelationshipTypes.length === 0}
                                            >
                                                Unselect all
                                            </button>
                                        </div>

                                        <label className="d-flex align-items-center gap-1 mb-0" style={{ cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: '#334155', userSelect: 'none' }}>
                                            <input
                                                type="checkbox"
                                                checked={showKeyRelationships}
                                                onChange={(e) => setShowKeyRelationships(e.target.checked)}
                                                style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: '#2563eb' }}
                                            />
                                            <span>Key only</span>
                                        </label>
                                    </div>

                                    {/* Checkbox Options List */}
                                    <div className="connection-options-list">
                                        {filteredConnectionTypes.length === 0 ? (
                                            <div className="text-muted text-center py-3 small">
                                                No relationship types available.
                                            </div>
                                        ) : (
                                            filteredConnectionTypes.map((relType) => {
                                                const isChecked = selectedConnectionTypes.has(relType);
                                                const formattedLabel = relType.replace(/_/g, " ");
                                                return (
                                                    <label
                                                        key={relType}
                                                        className={`connection-option-item ${isChecked ? "checked" : ""}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            value={relType}
                                                            checked={isChecked}
                                                            onChange={() => toggleConnectionType(relType)}
                                                        />
                                                        <span className="option-label">{formattedLabel}</span>
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

                {/* ================= BOTTOM FULL-WIDTH RELATIONSHIPS BAR ================= */}
                <div className="selected-entity-relationships-bar">
                    <div
                        className="relationships-bar-header"
                        onClick={() => setIsRelationshipsFooterOpen(!isRelationshipsFooterOpen)}
                    >
                        <span className="relationships-bar-title">
                            Selected Entity Relationships ({totalSelectedRelationshipsCount})
                        </span>
                        <button
                            type="button"
                            className="relationships-bar-toggle-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsRelationshipsFooterOpen(!isRelationshipsFooterOpen);
                            }}
                            aria-label="Toggle relationships bar"
                        >
                            {isRelationshipsFooterOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                    </div>

                    {isRelationshipsFooterOpen && (
                        <div className="relationships-bar-body">
                            {selectedEntityCategoryCounts.map((cat) => (
                                <div
                                    key={cat.key}
                                    className="relationship-category-card"
                                    onClick={() => setSidebarActiveTab("relationships")}
                                >
                                    <div
                                        className="category-icon-circle"
                                        style={{ backgroundColor: cat.color }}
                                    >
                                        {cat.icon}
                                    </div>
                                    <div className="category-count-label">
                                        <span className="cat-count" style={{ color: cat.color }}>
                                            {cat.count}
                                        </span>
                                        <span className="cat-name">{cat.label}</span>
                                    </div>
                                    <FiChevronRight className="category-arrow-icon" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewInKnowledgeGraph;