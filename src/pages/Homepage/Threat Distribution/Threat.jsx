import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CustomDotAround, CustomDotAway, CustomDotGlobal, renderRadarBackground } from '../../../Helpers/RadarHelpers';
import ThreatModal from './ThreatModal';
import './Threat.scss';
import { getRadarData } from '../../../Context/Radar';

const threatActorsData = [
  { subject: '01', A: 60, B: 110, C: 140, fullMark: 150 },
  { subject: '02', A: 0, B: 120, C: 130, fullMark: 150 },
  { subject: '03', A: 50, B: 90, C: 115, fullMark: 150 },
  { subject: '04', A: 0, B: 80, C: 0, fullMark: 150 },
  { subject: '05', A: 60, B: 0, C: 0, fullMark: 150 },
  { subject: '06', A: 0, B: 0, C: 0, fullMark: 150 },
  { subject: '07', A: 0, B: 0, C: 0, fullMark: 150 },
  { subject: '08', A: 0, B: 0, C: 0, fullMark: 150 },
  { subject: '09', A: 70, B: 110, C: 130, fullMark: 150 },
  { subject: '10', A: 50, B: 100, C: 130, fullMark: 150 },
];

// Complete threat actor dataset with cyber intelligence details
export const threatActorsList = [
  // Around You (Critical Proximity)
  {
    id: 'TA-DL-01',
    name: 'DarkLock',
    category: 'Around You',
    index: 0,
    dataKey: 'A',
    value: 60,
    focusLevel: 0, // Critical
    riskLevel: 'Critical',
    threatScore: '4.9',
    sector: 'BFSI / Core Banking',
    origin: 'Eastern Europe / Regional',
    techFocus: 'Ransomware-as-a-Service, Double Extortion, AD Exploitation',
    tactics: 'Ransomware / Data Exfiltration',
    victims: 'Tier-1 Banks, Payment Processors, Regional Retail FinTech',
    overlapAnalysis: 'Direct targeting of regional banking protocols and SWIFT interfaces.',
  },
  {
    id: 'TA-ST-03',
    name: 'Shadow Team',
    category: 'Around You',
    index: 2,
    dataKey: 'A',
    value: 50,
    focusLevel: 0, // Critical
    riskLevel: 'Critical',
    threatScore: '4.8',
    sector: 'Cloud Services & FinTech',
    origin: 'Unknown / Distributed',
    techFocus: 'Cloud API key abuse, OAuth compromise, AWS IAM privilege escalation',
    tactics: 'Credential Access / Cloud Lateral',
    victims: 'FinTech start-ups, payment gateway APIs, cloud-hosted ledgers',
    overlapAnalysis: 'Direct footprint overlap with Meridian Azure/AWS multi-cloud stack.',
  },
  {
    id: 'TA-PN-05',
    name: 'PhishNet',
    category: 'Around You',
    index: 4,
    dataKey: 'A',
    value: 60,
    focusLevel: 0, // Critical
    riskLevel: 'High',
    threatScore: '4.4',
    sector: 'Corporate Banking & HR',
    origin: 'Southeast Asia',
    techFocus: 'Adversary-in-the-Middle (AiTM) phishing, session cookie hijacking',
    tactics: 'Spear Phishing / MFA Bypass',
    victims: 'Commercial banks, corporate executive offices, wealth advisory',
    overlapAnalysis: 'Active campaign detected mimicking Meridian internal SSO portal.',
  },
  {
    id: 'TA-SB-09',
    name: 'StormBreak',
    category: 'Around You',
    index: 8,
    dataKey: 'A',
    value: 70,
    focusLevel: 1, // High
    riskLevel: 'Critical',
    threatScore: '4.7',
    sector: 'Gov & Defense BFSI',
    origin: 'East Asia',
    techFocus: 'VPN zero-days (Palo Alto, Fortinet), reverse tunneling, living-off-the-land',
    tactics: 'Edge Device Exploit / Persistence',
    victims: 'National treasuries, central banks, defense contractors',
    overlapAnalysis: 'Matching perimeter VPN appliance versions discovered in threat feed.',
  },
  {
    id: 'TA-AT-10',
    name: 'AppTrap',
    category: 'Around You',
    index: 9,
    dataKey: 'A',
    value: 50,
    focusLevel: 0, // Critical
    riskLevel: 'High',
    threatScore: '4.3',
    sector: 'Mobile Banking & Wealth',
    origin: 'South Asia',
    techFocus: 'Mobile SDK trojanization, SMS interceptors, malicious mobile apps',
    tactics: 'Supply Chain / Mobile Banking',
    victims: 'Retail banking customers, wealth management mobile users',
    overlapAnalysis: 'Consumer-facing mobile banking app package collision detected.',
  },

  // Away
  {
    id: 'TA-LZ-01',
    name: 'Lazarus Group',
    category: 'Away',
    index: 0,
    dataKey: 'B',
    value: 110,
    focusLevel: 2, // Moderate
    riskLevel: 'Critical',
    threatScore: '5.0',
    sector: 'Cryptocurrency & SWIFT',
    origin: 'East Asia',
    techFocus: 'SWIFT Alliance Access malware, smart contract exploiters, AppleJeus',
    tactics: 'State-Sponsored Cyber Heist',
    victims: 'Central banks, crypto exchanges, cross-border payment switches',
    overlapAnalysis: 'Historic targeting of Meridian SWIFT Alliance gateway vendor.',
  },
  {
    id: 'TA-28-02',
    name: 'APT28',
    category: 'Away',
    index: 1,
    dataKey: 'B',
    value: 120,
    focusLevel: 3, // Low
    riskLevel: 'Critical',
    threatScore: '4.8',
    sector: 'Defense, Gov & NATO',
    origin: 'Eastern Europe',
    techFocus: 'Microsoft Exchange CVEs, credential harvesting, GooseEgg privilege escalation',
    tactics: 'Cyber Espionage / Zero-Day',
    victims: 'Government agencies, European defense, foreign ministries',
    overlapAnalysis: 'Moderate overlap on hybrid AD and Microsoft Exchange environment.',
  },
  {
    id: 'TA-CG-03',
    name: 'Cobalt Group',
    category: 'Away',
    index: 2,
    dataKey: 'B',
    value: 90,
    focusLevel: 1, // High
    riskLevel: 'High',
    threatScore: '4.5',
    sector: 'Financial & ATM Switches',
    origin: 'Eastern Europe',
    techFocus: 'Cobalt Strike customized beacons, ATM jackpotting, card processing switch injection',
    tactics: 'ATM & Payment Switch Injection',
    victims: 'Over 100 banks across 40 countries',
    overlapAnalysis: 'Card switch vendor matches Cobalt Group standard deployment targets.',
  },
  {
    id: 'TA-TR-04',
    name: 'Turla',
    category: 'Away',
    index: 3,
    dataKey: 'B',
    value: 80,
    focusLevel: 1, // High
    riskLevel: 'High',
    threatScore: '4.4',
    sector: 'Diplomatic & Satellite',
    origin: 'Eastern Europe',
    techFocus: 'Satellite IP hijacking, Snake rootkit, watering-hole attacks',
    tactics: 'Stealth C2 / Watering Hole',
    victims: 'Embassies, international financial standard bodies, energy firms',
    overlapAnalysis: 'Low geographic overlap; active reconnaissance observed on public ASN.',
  },
  {
    id: 'TA-F7-09',
    name: 'FIN7',
    category: 'Away',
    index: 8,
    dataKey: 'B',
    value: 110,
    focusLevel: 2, // Moderate
    riskLevel: 'Critical',
    threatScore: '4.6',
    sector: 'Payment Processing & BFSI',
    origin: 'Eastern Europe / Global',
    techFocus: 'Carbanak malware, BadUSB keystroke injectors, POS memory scrapers',
    tactics: 'POS Malware / Credit Interception',
    victims: 'Heartland Payment Systems, 250+ financial institutions, hotel chains',
    overlapAnalysis: 'Payment-processing technology-family overlap with card-management estate.',
  },
  {
    id: 'TA-41-10',
    name: 'APT41',
    category: 'Away',
    index: 9,
    dataKey: 'B',
    value: 100,
    focusLevel: 2, // Moderate
    riskLevel: 'Critical',
    threatScore: '4.7',
    sector: 'Healthcare, Telecom & Tech',
    origin: 'East Asia',
    techFocus: 'Dual espionage/financial, web shells, supply chain backdoors (ShadowPad)',
    tactics: 'Supply Chain / Dual Operation',
    victims: 'Telecommunications, major software vendors, healthcare networks',
    overlapAnalysis: 'Shared third-party software supply chain risk identified.',
  },

  // Global
  {
    id: 'TA-SW-01',
    name: 'Sandworm',
    category: 'Global',
    index: 0,
    dataKey: 'C',
    value: 140,
    focusLevel: 4, // Minimal
    riskLevel: 'Critical',
    threatScore: '4.9',
    sector: 'Energy, Grid & Logistics',
    origin: 'Eastern Europe',
    techFocus: 'BlackEnergy, Industroyer2, wipers (CaddyWiper, HermeticWiper)',
    tactics: 'Critical Infra Sabotage',
    victims: 'National power grids, railway networks, government ministries',
    overlapAnalysis: 'Broad infrastructure disruption risk; no direct banking protocol overlap.',
  },
  {
    id: 'TA-KM-02',
    name: 'Kimsuky',
    category: 'Global',
    index: 1,
    dataKey: 'C',
    value: 130,
    focusLevel: 3, // Low
    riskLevel: 'Moderate',
    threatScore: '4.0',
    sector: 'Foreign Policy & Think Tanks',
    origin: 'East Asia',
    techFocus: 'BabyShark, GoldDragon, browser extension hijacking, spear phishing',
    tactics: 'Intelligence Gathering',
    victims: 'Academic institutes, policy centers, defense analysts',
    overlapAnalysis: 'Low direct relevance to core banking transactions.',
  },
  {
    id: 'TA-GB-03',
    name: 'Gh0stBins',
    category: 'Global',
    index: 2,
    dataKey: 'C',
    value: 115,
    focusLevel: 2, // Moderate
    riskLevel: 'Moderate',
    threatScore: '3.8',
    sector: 'Telecom & ISP Infrastructure',
    origin: 'Global / Multi-National',
    techFocus: 'Gh0st RAT variants, DNS tunneling, paste site C2 communication',
    tactics: 'Botnet & C2 Hosting',
    victims: 'Internet Service Providers, enterprise perimeter proxies',
    overlapAnalysis: 'ISP upstream infrastructure transit monitoring detected.',
  },
  {
    id: 'TA-CK-09',
    name: 'Charming Kitten',
    category: 'Global',
    index: 8,
    dataKey: 'C',
    value: 130,
    focusLevel: 3, // Low
    riskLevel: 'Moderate',
    threatScore: '3.7',
    sector: 'Media, NGO & Dissidents',
    origin: 'Middle East',
    techFocus: 'Hyperscrape data extraction, WhatsApp social engineering, password spraying',
    tactics: 'Account Takeover / Espionage',
    victims: 'Human rights organizations, media outlets, diplomatic missions',
    overlapAnalysis: 'Minimal overlap with financial systems; monitored for brand abuse.',
  },
  {
    id: 'TA-MP-10',
    name: 'Mustang Panda',
    category: 'Global',
    index: 9,
    dataKey: 'C',
    value: 130,
    focusLevel: 3, // Low
    riskLevel: 'Moderate',
    threatScore: '3.9',
    sector: 'Gov & Southeast Asia Diplomacy',
    origin: 'East Asia',
    techFocus: 'PlugX malware, USB spreading worms, malicious LNK attachments',
    tactics: 'Regional Espionage',
    victims: 'ASEAN member state ministries, European foreign affairs',
    overlapAnalysis: 'Regional operations in Singapore and APAC subsidiaries flagged for monitoring.',
  },
];
const clientName = "CERELYN BIOPHARMA";
const severitylabel = "high";

const RenderDot = (props) => {
  const { cx, cy, value, index, OriginalDot, category, onHover, onLeave, onClick } = props;
  if (!value) return null;
  return (
    <g
      onMouseEnter={(e) => onHover(e, category, index)}
      onMouseLeave={onLeave}
      onClick={() => onClick(category, index)}
      style={{ cursor: 'pointer' }}
    >
      <OriginalDot cx={cx} cy={cy} value={value} index={index} />
    </g>
  );
};

export default function Threat() {
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const timeoutRef = useRef(null);
  const hoveredNameRef = useRef('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState('0+');
  const [chartRadius, setChartRadius] = useState(130);
  const [hoveredActor, setHoveredActor] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  // ResizeObserver for responsive radar sizing

  const getRadarDatalist = (query = clientName, severity = severitylabel) => {
    setLoading(true);
    getRadarData({ client_name: query, severity: severity })((response) => {
      console.log("radarres", response);
      // getRadarData already passes response.data (the payload) — not the full axios response
      if (response) {
        setData(response);
      }
      setLoading(false);
    });
  };
  useEffect(() => {
    getRadarDatalist()
  }, [])
  console.log("radardata : ", data)

  useEffect(() => {
    if (!containerRef.current) return;
    const updateRadius = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const minDim = Math.min(clientWidth || 300, clientHeight || 300);
        const computedR = (minDim / 2) * 0.82;
        if (computedR > 0) {
          setChartRadius(computedR);
        }
      }
    };
    updateRadius();
    const resizeObserver = new ResizeObserver(updateRadius);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const getRadiusValue = (radiusKey, outerR) => {
    const step = outerR / 5;
    switch (radiusKey) {
      case '0+':
        return step * 1.5; // Critical proximity ring
      case '1+':
        return step * 2.5; // High ring
      case '2+':
        return step * 3.5; // Moderate ring
      case '3+':
        return step * 4.4; // Low ring
      case '4+':
        return outerR; // Minimal / Full Radar
      default:
        return step * 1.5;
    }
  };

  const activeRadius = getRadiusValue(selectedRadius, chartRadius);

  // Focus level limit based on dropdown
  const focusLevelThreshold = useMemo(() => {
    switch (selectedRadius) {
      case '0+':
        return 0; // Critical
      case '1+':
        return 1; // High
      case '2+':
        return 2; // Moderate
      case '3+':
        return 3; // Low
      case '4+':
        return 4; // Minimal / All
      default:
        return 0;
    }
  }, [selectedRadius]);

  const radiusLabel = useMemo(() => {
    switch (selectedRadius) {
      case '0+':
        return 'Critical Zone';
      case '1+':
        return 'High Risk Zone';
      case '2+':
        return 'Moderate Zone';
      case '3+':
        return 'Low Zone';
      case '4+':
        return 'Minimal / All';
      default:
        return 'Critical Zone';
    }
  }, [selectedRadius]);

  // Check if an actor is inside the shaded focus zone
  const isActorInFocus = (actor) => {
    return actor.focusLevel <= focusLevelThreshold;
  };

  const getThreatActorObj = (category, index) => {
    return threatActorsList.find((a) => a.category === category && a.index === index);
  };

  const handleHover = (e, category, index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const actorObj = getThreatActorObj(category, index);
    const name = actorObj?.name || 'Unknown Actor';
    hoveredNameRef.current = name;
    setHoveredActor(name);

    if (e && e.currentTarget && containerRef.current && popupRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const popup = popupRef.current;
      popup.style.left = `${x}px`;
      popup.style.top = `${y - 10}px`;
      popup.style.display = 'flex';
      popup.innerHTML = `<i class="bi bi-shield-shaded"></i> ${name}`;
    }
  };

  const handleLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (popupRef.current) {
        popupRef.current.style.display = 'none';
      }
      setHoveredActor(null);
    }, 120);
  };

  const handlePopupMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
    setHoveredActor(null);
  };

  const handleClick = (category, index) => {
    const actorObj = getThreatActorObj(category, index);
    if (actorObj) {
      setModalData(actorObj);
    } else {
      setModalData({
        name: hoveredNameRef.current || 'Threat Actor',
        category,
        index,
        value: 0,
      });
    }
    setShowModal(true);
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  };

  const handlePopupClick = () => {
    const actorObj = threatActorsList.find((a) => a.name === hoveredNameRef.current);
    if (actorObj) {
      setModalData(actorObj);
    } else if (hoveredNameRef.current) {
      setModalData({ name: hoveredNameRef.current, category: '', index: '', value: 0 });
    }
    setShowModal(true);
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  };

  const handleRowClick = (actor) => {
    setModalData(actor);
    setShowModal(true);
  };

  // Filtered threat actors for table
  const filteredActors = useMemo(() => {
    return threatActorsList.filter((actor) => {
      // Category filter
      if (categoryFilter === 'FOCUS') {
        if (!isActorInFocus(actor)) return false;
      } else if (categoryFilter !== 'ALL') {
        if (actor.category !== categoryFilter) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = actor.name.toLowerCase().includes(query);
        const matchesId = actor.id.toLowerCase().includes(query);
        const matchesSector = actor.sector.toLowerCase().includes(query);
        const matchesCategory = actor.category.toLowerCase().includes(query);
        const matchesRisk = actor.riskLevel.toLowerCase().includes(query);
        const matchesTactics = actor.tactics.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesSector && !matchesCategory && !matchesRisk && !matchesTactics) {
          return false;
        }
      }

      return true;
    });
  }, [categoryFilter, searchQuery, focusLevelThreshold]);

  const focusedCount = useMemo(() => {
    return threatActorsList.filter(isActorInFocus).length;
  }, [focusLevelThreshold]);

  return (
    <div className="threat-card-container">
      {/* Header Bar */}
      <div className="threat-header d-flex justify-content-end">
        <div></div>

        <div className="header-right">
          <div className="radius-control-wrapper" title="Select radar shaded focus radius">
            <label htmlFor="threat-radius-select" className="radius-control-label">
              <i className="bi bi-record-circle-fill"></i> Shaded Focus:
            </label>
            <select
              id="threat-radius-select"
              className="radius-control-select"
              value={selectedRadius}
              onChange={(e) => setSelectedRadius(e.target.value)}
            >
              <option value="0+">Critical</option>
              <option value="1+">High </option>
              <option value="2+">Moderate</option>
              <option value="3+">Low</option>
              <option value="4+">Minimal</option>
            </select>
          </div>
          <button className="expand-btn" title="Expand View">
            <i className="bi bi-arrows-angle-expand"></i>
          </button>
        </div>
      </div>

      {/* Main Split View: Left = Smaller Radar Chart, Right = Detailed Table */}
      <div className="threat-body-split">
        {/* Left: Compact Radar Chart */}
        <div className="threat-radar-col">
          <div className="radar-chart-container" ref={containerRef}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="82%" data={threatActorsData}>
                <PolarGrid gridType="circle" stroke="#e2e8f0" />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  ticks={[30, 60, 90, 120, 150]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Around You"
                  dataKey="A"
                  stroke="none"
                  fill="none"
                  dot={
                    <RenderDot
                      OriginalDot={CustomDotAround}
                      category="Around You"
                      onHover={handleHover}
                      onLeave={handleLeave}
                      onClick={handleClick}
                    />
                  }
                  activeDot={false}
                  isAnimationActive={false}
                />
                <Radar
                  name="Away"
                  dataKey="B"
                  stroke="none"
                  fill="none"
                  dot={
                    <RenderDot
                      OriginalDot={CustomDotAway}
                      category="Away"
                      onHover={handleHover}
                      onLeave={handleLeave}
                      onClick={handleClick}
                    />
                  }
                  activeDot={false}
                  isAnimationActive={false}
                />
                <Radar
                  name="Global"
                  dataKey="C"
                  stroke="none"
                  fill="none"
                  dot={
                    <RenderDot
                      OriginalDot={CustomDotGlobal}
                      category="Global"
                      onHover={handleHover}
                      onLeave={handleLeave}
                      onClick={handleClick}
                    />
                  }
                  activeDot={false}
                  isAnimationActive={false}
                />
                {/* Dynamic White Shaded Focus Ring */}
                <g>{renderRadarBackground({ radius: activeRadius, outerR: chartRadius })}</g>
              </RadarChart>
            </ResponsiveContainer>

            {/* Floating Tooltip */}
            <div
              ref={popupRef}
              className="radar-tooltip-popup"
              style={{ display: 'none' }}
              onMouseEnter={handlePopupMouseEnter}
              onMouseLeave={handlePopupMouseLeave}
              onClick={handlePopupClick}
            >
              Threat Actor
            </div>
          </div>

          {/* Mini Proximity Legend underneath radar */}
          <div className="radar-mini-legend">
            <span className="mini-legend-item">
              <span className="legend-dot dot-around"></span> Around You
            </span>
            <span className="mini-legend-item">
              <span className="legend-dot dot-away"></span> Away
            </span>
            <span className="mini-legend-item">
              <span className="legend-dot dot-global"></span> Global
            </span>
          </div>
        </div>

        {/* Right: Interactive Threat Actor Table */}
        <div className="threat-table-col">
          {/* Table Toolbar */}
          <div className="table-toolbar">
            <div className="filter-tabs">
              <button
                className={`tab-btn ${categoryFilter === 'ALL' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('ALL')}
              >
                All <span className="badge-count">{threatActorsList.length}</span>
              </button>
              <button
                className={`tab-btn focus-tab ${categoryFilter === 'FOCUS' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('FOCUS')}
                title="Filter by actors inside the shaded radar focus zone"
              >
                <i className="bi bi-bullseye"></i> Shaded Focus{' '}
                <span className="badge-count">{focusedCount}</span>
              </button>
              <button
                className={`tab-btn ${categoryFilter === 'Around You' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('Around You')}
              >
                Around You
              </button>
              <button
                className={`tab-btn ${categoryFilter === 'Away' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('Away')}
              >
                Away
              </button>
              <button
                className={`tab-btn ${categoryFilter === 'Global' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('Global')}
              >
                Global
              </button>
            </div>

          </div>

          {/* Scrollable Table View */}
          <div className="table-scroll-container">
            <table className="threat-actors-table">
              <thead>
                <tr>
                  <th>Threat Actor</th>
                  <th>Proximity</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredActors.length > 0 ? (
                  filteredActors.map((actor) => {
                    const inFocus = isActorInFocus(actor);
                    const isHovered = hoveredActor === actor.name;
                    const catClass =
                      actor.category === 'Around You'
                        ? 'around'
                        : actor.category === 'Away'
                          ? 'away'
                          : 'global';
                    const riskClass = `risk-${actor.riskLevel.toLowerCase()}`;

                    return (
                      <tr
                        key={actor.id}
                        className={`actor-row ${inFocus ? 'in-focus-zone' : ''} ${isHovered ? 'is-hovered' : ''
                          }`}
                        onClick={() => handleRowClick(actor)}
                        onMouseEnter={() => setHoveredActor(actor.name)}
                        onMouseLeave={() => setHoveredActor(null)}
                      >
                        <td>
                          <div className="actor-name-cell">
                            <div className={`actor-icon icon-${catClass}`}>
                              {actor.name.charAt(0)}
                            </div>
                            <div className="name-info">
                              <span className="name-text">{actor.name}</span>
                              <span className="id-text">{actor.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`proximity-badge badge-${catClass}`}>
                            {actor.category}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="view-action-btn"
                            title="View Threat Profile"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(actor);
                            }}
                          >
                            <i className="bi bi-arrow-right"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-row">
                      <i className="bi bi-info-circle me-1"></i> No threat actors match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Status */}
          <div className="table-footer-status">
            <div className="focus-legend-info">
              <span className="focus-dot"></span>
              <span>
                Shaded radar zone currently highlighting <strong>{radiusLabel}</strong> ({focusedCount} active threats)
              </span>
            </div>
            <span className="count-summary">
              Showing {filteredActors.length} of {threatActorsList.length} actors
            </span>
          </div>
        </div>
      </div>

      {/* Threat Actor Details Modal */}
      <ThreatModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        titlePrefix="Threat Actor:"
      />
    </div>
  );
}
