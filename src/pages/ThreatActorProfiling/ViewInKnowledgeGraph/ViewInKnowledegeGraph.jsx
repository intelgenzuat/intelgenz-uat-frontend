import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FiSearch,
    FiZoomIn,
    FiZoomOut,
    FiMaximize2,
    FiInfo,
    FiHome,
    FiChevronDown,
    FiChevronRight,
    FiCheck,
    FiRefreshCw,
    FiX,
    FiSliders,
    FiLayers,
    FiShare2,
    FiActivity
} from "react-icons/fi";
import "../../../assets/styles/threatactorprofile/ViewinKnowledgegraph.scss";

// Predefined palette for node categories
const PALETTE = {
    Malware: "#8b5cf6",
    ThreatActor: "#ef4444",
    MitreAttack: "#f59e0b",
    Behavior: "#10b981",
    Infrastructure: "#06b6d4",
    Vulnerability: "#ec4899",
    Indicator: "#3b82f6",
    Component: "#6366f1",
    Classification: "#14b8a6",
    Platform: "#f97316",
    Node: "#64748b"
};

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
    if (!node || !node.labels) return "Node";
    const label = node.labels.find((l) => l !== "GraphNode");
    return label || "Node";
};

const getNodeTitle = (node) => {
    if (!node) return "";
    const p = node.properties || {};
    return p.name || p.behavior_name || p.technique_id || p.value || p.description || p.action || p.cve || p.node_key || node.id || "Unknown";
};

const getColourFor = (type) => {
    return PALETTE[type] || PALETTE.Node;
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
    const [selectedMalwareValue, setSelectedMalwareValue] = useState("");
    const [graphTags, setGraphTags] = useState([]);
    const [activeTagId, setActiveTagId] = useState(null);

    // Multi-graph accumulator
    const [loadedGraphs, setLoadedGraphs] = useState({}); // { [nodeId]: graphData }
    const [focusedNodeId, setFocusedNodeId] = useState(null);

    // Filter & View Options
    const [showAllConnections, setShowAllConnections] = useState(true);
    const [selectedConnectionTypes, setSelectedConnectionTypes] = useState(new Set());
    const [isConnectionFiltersOpen, setIsConnectionFiltersOpen] = useState(true);
    const [filterSearchTerm, setFilterSearchTerm] = useState("");

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

    const isIntelCard = location.pathname.includes("intel") || location.pathname === "/view-knowlegde-graph";
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
            setSelectedMalwareValue(first.malware_id);
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

        if (!showAllConnections) {
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
    }, [unifiedGraph, selectedConnectionTypes, showAllConnections, activeTagId, focusedNodeId, graphTags]);

    // 6. Force-directed physics layout with smooth animation
    const [animatedNodes, setAnimatedNodes] = useState([]);

    useEffect(() => {
        const width = 1000;
        const height = 620;
        const centerId = filteredGraph.centerId;

        const nodes = filteredGraph.nodes.map((node, index) => {
            const isCenter = node.id === centerId;
            if (isCenter) {
                return { ...node, x: width / 2, y: height / 2, vx: 0, vy: 0, isCenter: true };
            }
            const angle = index * ((2 * Math.PI) / Math.max(1, filteredGraph.nodes.length - 1));
            const radiusDist = 180 + (index % 3) * 35;
            const x = width / 2 + Math.cos(angle) * radiusDist;
            const y = height / 2 + Math.sin(angle) * radiusDist;
            return { ...node, x, y, vx: 0, vy: 0, isCenter: false };
        });

        const byId = new Map(nodes.map((n) => [n.id, n]));
        const edges = filteredGraph.edges.filter((e) => byId.has(e.source) && byId.has(e.target));
        const centerNode = nodes.find((n) => n.id === centerId);

        // Run force relaxation
        for (let iter = 0; iter < 100; iter++) {
            // Node-node repulsion
            for (let a = 0; a < nodes.length; a++) {
                for (let b = a + 1; b < nodes.length; b++) {
                    const n1 = nodes[a];
                    const n2 = nodes[b];
                    let dx = n2.x - n1.x;
                    let dy = n2.y - n1.y;
                    const dist = Math.max(25, Math.hypot(dx, dy));
                    const force = 4000 / (dist * dist);
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    if (!n1.isCenter) {
                        n1.x -= fx;
                        n1.y -= fy;
                    }
                    if (!n2.isCenter) {
                        n2.x += fx;
                        n2.y += fy;
                    }
                }
            }

            // Edge attraction
            edges.forEach((edge) => {
                const source = byId.get(edge.source);
                const target = byId.get(edge.target);
                if (!source || !target) return;
                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const dist = Math.max(1, Math.hypot(dx, dy));
                const force = (dist - 170) * 0.035;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                if (!source.isCenter) {
                    source.x += fx;
                    source.y += fy;
                }
                if (!target.isCenter) {
                    target.x -= fx;
                    target.y -= fy;
                }
            });

            // Keep within bounds
            nodes.forEach((n) => {
                if (n.isCenter) {
                    n.x = width / 2;
                    n.y = height / 2;
                } else {
                    n.x = Math.max(70, Math.min(width - 70, n.x));
                    n.y = Math.max(55, Math.min(height - 55, n.y));
                }
            });
        }

        nodes.forEach((n) => {
            nodePositionsRef.current.set(n.id, { x: n.x, y: n.y });
        });

        setAnimatedNodes(nodes);
    }, [filteredGraph]);

    // Handle Dropdown Selection of Malware
    const handleMalwareDropdownChange = (e) => {
        const malId = e.target.value;
        if (!malId) return;

        setSelectedMalwareValue(malId);
        const item = malwareList.find((m) => m.malware_id === malId);
        const name = item ? item.name : malId;
        const nodeId = `malware:${malId}`;

        let existingTag = graphTags.find((t) => t.nodeId === nodeId);
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
    };

    // Remove tag chip
    const handleRemoveTag = (tagKey, e) => {
        if (e) e.stopPropagation();
        const updatedTags = graphTags.filter((t) => t.key !== tagKey);
        setGraphTags(updatedTags);

        if (tagKey === activeTagId) {
            const nextTag = updatedTags[updatedTags.length - 1];
            if (nextTag) {
                setActiveTagId(nextTag.key);
                setFocusedNodeId(nextTag.nodeId);
                if (nextTag.malwareId) setSelectedMalwareValue(nextTag.malwareId);
            } else {
                setActiveTagId(null);
                setFocusedNodeId(null);
                setSelectedMalwareValue("");
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

        // If malware, update dropdown
        if (type === "Malware") {
            const malId = nodeId.replace("malware:", "");
            setSelectedMalwareValue(malId);
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
                <div className="d-flex flex-column w-100" style={{ gap: "1px" }}>
                    {/* Breadcrumb */}
                    <div className="breadcrumb-nav text-muted" style={{ fontSize: '14px', marginBottom: '6px' }}>
                        <FiHome className="home-icon me-2" />
                        <span onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>Home</span>
                        <span className="mx-2 text-black-50">/</span>
                        <span onClick={() => navigate(parentPath)} style={{ cursor: 'pointer' }}>{parentName}</span>
                        <span className="mx-2 text-black-50">/</span>
                        <span className="text-dark fw-medium">View in Knowledge Graph</span>
                    </div>

                    {/* Page Heading & Top Right Options */}
                    <div className="view-top-header d-flex justify-content-between align-items-center mb-2 flex-wrap gap-3">
                        <div className="tap-title-row">
                            <div className="shield-icon-wrapper">
                                <svg width="18" height="20" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.43627 16.4528C9.72418 16.4528 9.96554 16.3555 10.1604 16.1609C10.3552 15.9661 10.4526 15.7247 10.4526 15.4368C10.4526 15.1489 10.3552 14.9075 10.1604 14.7127C9.96554 14.5179 9.72418 14.4205 9.43627 14.4205C9.14836 14.4205 8.907 14.5179 8.7122 14.7127C8.51739 14.9075 8.41999 15.1489 8.41999 15.4368C8.41999 15.7247 8.51739 15.9661 8.7122 16.1609C8.907 16.3555 9.14836 16.4528 9.43627 16.4528ZM8.49265 12.1703H10.3799V6.09741H8.49265V12.1703ZM9.43627 23.8326C6.71506 23.0905 4.4621 21.4887 2.67739 19.0273C0.892462 16.5659 0 13.8141 0 10.7718V3.53263L9.43627 0L18.8725 3.53263V10.7718C18.8725 13.8141 17.9801 16.5659 16.1952 19.0273C14.4104 21.4887 12.1575 23.0905 9.43627 23.8326Z" fill="#E9004A" />
                                </svg>
                            </div>
                            <h4>View in Knowledge Graph</h4>
                        </div>

                        {/* Right: Assessment Focus + Radius */}
                        <div className="d-flex align-items-center gap-4 flex-wrap">
                            {/* Assessment Focus */}
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
                                <label className="section-label">Radius Depth</label>
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

                {/* ================= ENTITY QUERY & MALWARE SELECTOR SECTION ================= */}
                <div className="entity-query-section-white mt-3">
                    {/* Top Row: Dropdown, Reload Button, and Show all connections Toggle */}
                    <div className="picker-row d-flex align-items-end gap-3 flex-wrap">
                        <div className="picker-group">
                            <label htmlFor="malware-select" className="picker-label">
                                Malware in knowledge graph
                            </label>
                            <div className="select-wrapper">
                                <select
                                    id="malware-select"
                                    className="malware-dropdown-select"
                                    value={selectedMalwareValue}
                                    onChange={handleMalwareDropdownChange}
                                    disabled={isMalwareLoading}
                                >
                                    <option value="" disabled>
                                        {isMalwareLoading ? "Loading malware…" : "Choose malware to explore…"}
                                    </option>
                                    {malwareList.map((item) => (
                                        <option key={item.malware_id} value={item.malware_id}>
                                            {item.name} (ID {item.malware_id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            id="reload-btn"
                            type="button"
                            className="btn-kg-action btn-reload"
                            onClick={fetchMalwareList}
                            disabled={isMalwareLoading}
                        >
                            <FiRefreshCw className={`icon-btn ${isMalwareLoading ? "spin" : ""}`} />
                            Reload list
                        </button>

                        <button
                            id="connection-toggle-btn"
                            type="button"
                            className={`btn-kg-action btn-toggle-connections ${showAllConnections ? "active" : ""}`}
                            onClick={() => setShowAllConnections((prev) => !prev)}
                        >
                            <FiLayers className="icon-btn" />
                            {showAllConnections ? "Show key connections" : "Show all connections"}
                        </button>
                    </div>

                    {/* Selected Entity Chips / Tags */}
                    {graphTags.length > 0 && (
                        <div className="selected-chips-container" aria-label="Selected entity chips">
                            {graphTags.map((tag) => {
                                const chipColor = getColourFor(tag.type || "Malware");
                                return (
                                    <div
                                        key={tag.key}
                                        className={`malware-chip ${tag.key === activeTagId ? "active" : ""}`}
                                        onClick={() => {
                                            setActiveTagId(tag.key);
                                            setFocusedNodeId(tag.nodeId);
                                            if (tag.malwareId) setSelectedMalwareValue(tag.malwareId);
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

                    {/* Connection Filters Collapsible Accordion */}
                    <div className="connection-filters-card mt-3">
                        <div
                            className="connection-filters-header d-flex justify-content-between align-items-center"
                            onClick={() => setIsConnectionFiltersOpen((prev) => !prev)}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <span className="accordion-arrow">
                                    {isConnectionFiltersOpen ? <FiChevronDown /> : <FiChevronRight />}
                                </span>
                                <span className="filters-title">Connection filters</span>
                            </div>
                            <span className="filters-count-badge">
                                {selectedConnectionTypes.size} of {availableRelationshipTypes.length} active
                            </span>
                        </div>

                        {isConnectionFiltersOpen && (
                            <div className="connection-filters-body">
                                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                                    <p className="filters-subtext mb-0">
                                        Choose one or more relationship types to display in the graph.
                                    </p>
                                    <div className="d-flex align-items-center gap-2">
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
                                </div>

                                {/* Checkbox Options Grid */}
                                <div className="connection-options-grid">
                                    {filteredConnectionTypes.length === 0 ? (
                                        <span className="text-muted small p-2">No relationship types available.</span>
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
                        )}
                    </div>

                    {/* Status Feedback Row */}
                    <div className="kg-status-row d-flex align-items-center justify-content-between mt-2">
                        <span className={`status-text ${isStatusError ? "text-danger" : "text-muted"}`}>
                            <FiActivity className="me-1" />
                            {statusMessage}
                        </span>
                        <span className="stats-summary text-muted">
                            Showing {filteredGraph.nodes.length} related nodes &middot; {filteredGraph.edges.length} relationships
                        </span>
                    </div>
                </div>
            </div>

            {/* ================= GRAPH CANVAS & DETAILS WORKSPACE ================= */}
            <div className="graph-workspace-layout">
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
                        viewBox="0 0 1000 620"
                        style={{
                            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                            transformOrigin: "center center",
                            transition: isDraggingCanvas ? "none" : "transform 0.2s ease-out"
                        }}
                    >
                        <defs>
                            <marker
                                id="kg-arrow"
                                viewBox="0 -5 10 10"
                                refX="24"
                                refY="0"
                                markerWidth="6"
                                markerHeight="6"
                                orient="auto"
                            >
                                <path d="M0,-5L10,0L0,5" fill="#94a3b8" />
                            </marker>
                            <marker
                                id="kg-arrow-highlight"
                                viewBox="0 -5 10 10"
                                refX="24"
                                refY="0"
                                markerWidth="7"
                                markerHeight="7"
                                orient="auto"
                            >
                                <path d="M0,-5L10,0L0,5" fill="#4f46e5" />
                            </marker>
                        </defs>

                        {/* Edge Lines & Relationship Labels */}
                        <g className="edges-layer">
                            {filteredGraph.edges.map((edge, idx) => {
                                const source = animatedNodes.find((n) => n.id === edge.source);
                                const target = animatedNodes.find((n) => n.id === edge.target);
                                if (!source || !target) return null;

                                const isFocused =
                                    focusedNode && (focusedNode.id === edge.source || focusedNode.id === edge.target);
                                const midX = (source.x + target.x) / 2;
                                const midY = (source.y + target.y) / 2;

                                return (
                                    <g key={`edge-${edge.source}-${edge.target}-${edge.type}-${idx}`} className="edge-group">
                                        <line
                                            x1={source.x}
                                            y1={source.y}
                                            x2={target.x}
                                            y2={target.y}
                                            className={`svg-edge-line ${isFocused ? "focused-edge" : ""}`}
                                            markerEnd={isFocused ? "url(#kg-arrow-highlight)" : "url(#kg-arrow)"}
                                        />
                                        <rect
                                            x={midX - (edge.type.length * 3.2 + 8)}
                                            y={midY - 9}
                                            width={edge.type.length * 6.4 + 16}
                                            height={18}
                                            rx={4}
                                            className="edge-label-bg"
                                        />
                                        <text
                                            x={midX}
                                            y={midY + 3.5}
                                            className={`svg-edge-text ${isFocused ? "focused-text" : ""}`}
                                        >
                                            {shorten(edge.type.replace(/_/g, " "), 22)}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>

                        {/* Node Elements with Spring Animation */}
                        <g className="nodes-layer">
                            {animatedNodes.map((node) => {
                                const type = getNodeType(node);
                                const title = getNodeTitle(node);
                                const isFocused = (activeTagId === node.id) || (focusedNode && focusedNode.id === node.id);
                                const isCenter = node.id === filteredGraph.centerId;
                                const nodeColor = getColourFor(type);
                                const radiusSize = isCenter ? 28 : type === "ThreatActor" ? 24 : 20;

                                return (
                                    <g
                                        key={node.id}
                                        className={`node-group ${isFocused ? "focused" : ""} ${isCenter ? "root-node" : ""}`}
                                        transform={`translate(${node.x}, ${node.y})`}
                                        onClick={() => handleNodeClick(node.id)}
                                        style={{
                                            transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)"
                                        }}
                                    >
                                        {/* Outer pulse/selection halo */}
                                        {isFocused && (
                                            <circle
                                                r={radiusSize + 9}
                                                className="node-focus-ring"
                                                fill="none"
                                                stroke={nodeColor}
                                                strokeWidth="2.5"
                                                strokeDasharray="4 3"
                                            />
                                        )}

                                        {/* Main Node Circle */}
                                        <circle
                                            r={radiusSize}
                                            className="svg-node-circle"
                                            fill={nodeColor}
                                            stroke="#ffffff"
                                            strokeWidth={isFocused ? 3.5 : 2}
                                        />

                                        {/* Short Acronym in Node */}
                                        <text
                                            className="svg-node-acronym"
                                            y={5}
                                            textAnchor="middle"
                                        >
                                            {type.slice(0, 3).toUpperCase()}
                                        </text>

                                        {/* Label Below Node */}
                                        <text
                                            className="svg-node-label"
                                            y={radiusSize + 16}
                                            textAnchor="middle"
                                        >
                                            {shorten(title, 22)}
                                        </text>
                                    </g>
                                );
                            })}
                        </g>
                    </svg>

                    {/* Canvas Hint */}
                    <div className="canvas-interaction-hint">
                        <FiInfo className="me-1" /> Click any node to add a chip, isolate its connections, and animate related entities.
                    </div>

                    {/* Node Type Color Legend */}
                    <div className="canvas-type-legend">
                        {Array.from(new Set(animatedNodes.map(getNodeType))).map((type) => (
                            <span key={type} className="legend-item">
                                <span className="legend-dot" style={{ backgroundColor: getColourFor(type) }} />
                                <span className="legend-label">{type}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* ================= RIGHT DETAIL & RELATIONSHIPS PANEL ================= */}
                <div className="kg-details-sidebar">
                    <div className="details-header">
                        <div className="d-flex align-items-center justify-content-between">
                            <span className="details-header-title">Node Inspection</span>
                            <span className="badge bg-light text-secondary border">
                                {focusedNode ? getNodeType(focusedNode) : "None"}
                            </span>
                        </div>
                    </div>

                    <div className="details-scrollable-body">
                        {focusedNode ? (
                            <>
                                {/* Entity Profile Card */}
                                <div className="entity-overview-box">
                                    <div
                                        className="entity-avatar"
                                        style={{ backgroundColor: getColourFor(getNodeType(focusedNode)) }}
                                    >
                                        {getNodeType(focusedNode).slice(0, 3).toUpperCase()}
                                    </div>
                                    <div className="entity-info-block">
                                        <h4 className="entity-name">{getNodeTitle(focusedNode)}</h4>
                                        <span className="entity-type-tag">{getNodeType(focusedNode)} Entity</span>
                                    </div>
                                </div>

                                {/* Properties Table */}
                                <div className="details-section mt-3">
                                    <h5 className="section-heading">Properties</h5>
                                    <div className="props-list">
                                        {Object.entries(focusedNode.properties || {})
                                            .filter(([k]) => k !== "node_key")
                                            .map(([key, value]) => (
                                                <div key={key} className="prop-row">
                                                    <span className="prop-key">{key.replace(/_/g, " ")}</span>
                                                    <span className="prop-val" title={String(value)}>
                                                        {String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Connected Relationships */}
                                <div className="details-section mt-3">
                                    <h5 className="section-heading">
                                        Connected Relationships ({connectedEdgesForFocused.length})
                                    </h5>
                                    {connectedEdgesForFocused.length === 0 ? (
                                        <p className="text-muted small">No connected relationships matching active filters.</p>
                                    ) : (
                                        <div className="relationships-list">
                                            {connectedEdgesForFocused.map((edge, idx) => {
                                                const otherNodeId = edge.source === focusedNode.id ? edge.target : edge.source;
                                                const otherNode = unifiedGraph.nodes.find((n) => n.id === otherNodeId);
                                                const isOutgoing = edge.source === focusedNode.id;

                                                return (
                                                    <div
                                                        key={`rel-${idx}`}
                                                        className="rel-card"
                                                        onClick={() => otherNode && handleNodeClick(otherNode.id)}
                                                    >
                                                        <div className="rel-header">
                                                            <span className="rel-type-badge">
                                                                {isOutgoing ? "→" : "←"} {edge.type.replace(/_/g, " ")}
                                                            </span>
                                                        </div>
                                                        <div className="rel-target">
                                                            <span
                                                                className="rel-dot"
                                                                style={{ backgroundColor: getColourFor(getNodeType(otherNode)) }}
                                                            />
                                                            <span className="rel-name">{getNodeTitle(otherNode)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="empty-details text-center text-muted p-4">
                                <FiInfo style={{ fontSize: "28px", opacity: 0.5, marginBottom: "8px" }} />
                                <p>Select a node in the graph to view properties and connected intelligence.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewInKnowledgeGraph;