import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CustomDotAround, CustomDotAway, CustomDotGlobal, renderRadarBackground } from '../../../Helpers/RadarHelpers';
import ThreatModal from './ThreatModal';
import './Threat.scss';
import { getRadarData } from '../../../Context/Radar';

// Deterministic hash helper for consistent jitter and angle calculation
const getDeterministicHash = (str) => {
  if (!str) return 0;
  const s = String(str);
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const RenderDot = (props) => {
  const { cx, cy, value, index, OriginalDot, category, onHover, onLeave, onClick, hoveredActor, payload } = props;
  if (!value) return null;
  const actor = payload?.actor;
  const isHovered = Boolean(hoveredActor && actor && hoveredActor === actor.name);
  return (
    <g
      onMouseEnter={(e) => onHover(e, category, index, actor)}
      onMouseLeave={onLeave}
      onClick={() => onClick(category, index, actor)}
      style={{
        cursor: 'pointer',
        transform: isHovered ? 'scale(1.35)' : undefined,
        transformOrigin: `${cx}px ${cy}px`,
        transition: 'transform 0.15s ease',
      }}
    >
      <OriginalDot cx={cx} cy={cy} value={value} index={index} isHovered={isHovered} />
    </g>
  );
};

export default function Threat() {
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const timeoutRef = useRef(null);
  const hoveredNameRef = useRef('');
  const [showModal, setShowModal] = useState(false);
  const [selectedActorId, setSelectedActorId] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState('0+');
  const [selectedSeverity, setSelectedSeverity] = useState('Critical');
  const [clientName, setClientName] = useState('CERELYN BIOPHARMA');
  const [chartRadius, setChartRadius] = useState(130);
  const [hoveredActor, setHoveredActor] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Radar data from API
  const getRadarDatalist = (query = clientName) => {
    setLoading(true);
    const params = { client_name: query };
    getRadarData(params)((response) => {
      console.log('radarres', response);
      if (response) {
        setData(response);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    getRadarDatalist(clientName);
  }, []);

  // ResizeObserver for responsive radar sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const updateRadius = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const minDim = Math.min(clientWidth || 360, clientHeight || 360);
        const computedR = (minDim / 2) * 0.88;
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

  // Map raw API items to rich Threat Actor objects
  const allActorsList = useMemo(() => {
    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      return [];
    }
    const cName = data.client_name || clientName || 'Client';

    return data.items.map((item, index) => {
      const sev = (item.severity || '').toLowerCase();
      const rad = typeof item.radius === 'number' ? item.radius : parseFloat(item.radius) || 3.0;

      let category = 'Global';
      let focusLevel = 3;
      let riskLevel = 'Low';

      if (sev === 'high' || rad < 2.0) {
        category = 'Around You';
        focusLevel = rad <= 1.5 ? 0 : 1;
        riskLevel = rad <= 1.5 ? 'Critical' : 'High';
      } else if (sev === 'moderate' || (rad >= 2.0 && rad < 3.0)) {
        category = 'Away';
        focusLevel = 2;
        riskLevel = 'Moderate';
      } else if (sev === 'low' || (rad >= 3.0 && rad < 4.0)) {
        category = 'Global';
        focusLevel = 3;
        riskLevel = 'Low';
      } else {
        category = 'Global';
        focusLevel = 4;
        riskLevel = 'Minimal';
      }

      // Threat Score calculated from radius (range 1.0 -> 5.0)
      const calculatedScore = Math.max(1.0, Math.min(5.0, 5.0 - (rad - 1.0) * 0.85)).toFixed(1);

      return {
        id: item.actor_id ? `TA-${item.actor_id}` : `TA-${index + 1}`,
        actor_id: item.actor_id,
        name: item.name || `Actor_${item.actor_id || index + 1}`,
        radius: rad,
        severity: sev || 'low',
        category: category,
        focusLevel: focusLevel,
        riskLevel: riskLevel,
        threatScore: calculatedScore,
        sector: item.sector || 'BFSI, Healthcare & Critical Infrastructure',
        origin: item.origin || 'Global Threat Feeds & Sensor Grid',
        techFocus: item.techFocus || 'Ransomware-as-a-Service, Credential Theft, Edge Exploitation',
        tactics: item.tactics || 'Initial Access, Persistence & Exfiltration',
        victims: item.victims || `${cName} & Global Sector Peers`,
        overlapAnalysis: item.overlapAnalysis || `Detected threat vectors matching ${cName} perimeter defense telemetry.`,
      };
    });
  }, [data, clientName]);

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
        return 4; // All
      default:
        return 0;
    }
  }, [selectedRadius]);

  const radiusLabel = useMemo(() => {
    switch (selectedSeverity) {
      case 'Critical':
        return 'Critical Zone';
      case 'High':
        return 'High Risk Zone';
      case 'Moderate':
        return 'Moderate Zone';
      case 'Low':
        return 'Low Zone';
      case 'All':
        return 'All Zones';
      default:
        return `${selectedSeverity} Zone`;
    }
  }, [selectedSeverity]);

  const getRadiusValue = (radiusKey, outerR) => {
    const step = outerR / 5;
    switch (radiusKey) {
      case '0+':
        return step * 1.5;
      case '1+':
        return step * 2.5;
      case '2+':
        return step * 3.5;
      case '3+':
        return step * 4.4;
      case '4+':
        return outerR;
      default:
        return step * 1.5;
    }
  };

  const activeRadius = getRadiusValue(selectedRadius, chartRadius);

  const isActorInFocus = (actor) => {
    return actor.focusLevel <= focusLevelThreshold;
  };

  // Filtered threat actors for table & radar chart
  const filteredActors = useMemo(() => {
    return allActorsList.filter((actor) => {
      const target = (selectedSeverity || 'Critical').toLowerCase();
      if (target === 'all') {
        return true;
      }
      if (target === 'critical') {
        return (
          actor.riskLevel === 'Critical' ||
          actor.focusLevel === 0 ||
          actor.radius <= 1.5 ||
          (actor.severity === 'high' && actor.radius <= 1.5)
        );
      }
      if (target === 'high') {
        return (
          actor.severity === 'high' ||
          actor.category === 'Around You' ||
          actor.radius < 2.0
        );
      }
      if (target === 'moderate') {
        return (
          actor.severity === 'moderate' ||
          actor.category === 'Away' ||
          (actor.radius >= 2.0 && actor.radius < 3.0)
        );
      }
      if (target === 'low') {
        return (
          actor.severity === 'low' ||
          (actor.radius >= 3.0 && actor.radius < 4.0)
        );
      }
      return true;
    });
  }, [allActorsList, selectedSeverity]);

  // Selected sample of actors to plot on the radar chart - ONLY matching the selected filter
  const itemsForRadar = useMemo(() => {
    if (!filteredActors || filteredActors.length === 0) return [];
    return filteredActors;
  }, [filteredActors]);

  // Generate Recharts polar dataset with shattered, perfectly balanced distribution
  const radarChartData = useMemo(() => {
    if (!itemsForRadar || itemsForRadar.length === 0) {
      return Array.from({ length: 24 }, (_, i) => ({
        subject: String(i + 1).padStart(2, '0'),
        A: 0,
        B: 0,
        C: 0,
        fullMark: 150,
        actor: null,
      }));
    }

    // Group items by category to ensure balanced angular scattering
    const aroundItems = [];
    const awayItems = [];
    const globalItems = [];

    itemsForRadar.forEach((item) => {
      if (item.category === 'Around You') {
        aroundItems.push(item);
      } else if (item.category === 'Away') {
        awayItems.push(item);
      } else {
        globalItems.push(item);
      }
    });

    // Golden Angle dispersion constant
    const GOLDEN_ANGLE = 137.507764;
    const itemsWithAngles = [];

    const assignAngles = (group, baseOffset, category) => {
      const count = group.length;
      if (count === 0) return;

      group.forEach((item, idx) => {
        const hash = getDeterministicHash(item.id || item.name || `item-${idx}`);
        // Micro-jitter to add organic dispersion
        const microJitter = ((hash % 1000) / 1000 - 0.5) * (count > 20 ? 12 : 24);
        const angle = (baseOffset + idx * GOLDEN_ANGLE + microJitter + 3600) % 360;

        // Calculate scaled radius value per zone with subtle radial depth jitter
        const rad = typeof item.radius === 'number' ? item.radius : parseFloat(item.radius) || 3.0;
        const radialJitter = ((hash % 100) / 100 - 0.5) * 6; // ±3px

        let scaledVal = 30;
        if (category === 'Around You') {
          // Inner zone: ~22 to 46
          const norm = Math.max(0, Math.min(1, (rad - 1.0) / 0.8));
          scaledVal = Math.max(20, Math.min(48, 24 + norm * 20 + radialJitter));
        } else if (category === 'Away') {
          // Mid zone: ~58 to 88
          const norm = Math.max(0, Math.min(1, (rad - 2.0) / 0.9));
          scaledVal = Math.max(54, Math.min(90, 60 + norm * 26 + radialJitter));
        } else {
          // Outer global zone: ~98 to 145
          const norm = Math.max(0, Math.min(1, (rad - 3.0) / 2.0));
          scaledVal = Math.max(96, Math.min(146, 100 + norm * 42 + radialJitter));
        }

        itemsWithAngles.push({
          item,
          angle,
          scaledVal,
          category,
        });
      });
    };

    assignAngles(aroundItems, 18, 'Around You');
    assignAngles(awayItems, 74, 'Away');
    assignAngles(globalItems, 142, 'Global');

    // Sort all items by angle ascending so they map evenly around polar coordinates
    itemsWithAngles.sort((a, b) => a.angle - b.angle);

    const totalSlots = Math.max(24, itemsWithAngles.length);

    // If items count is less than minimum spokes (24), distribute across fixed circular spokes
    if (itemsWithAngles.length < totalSlots) {
      const slots = Array.from({ length: totalSlots }, (_, i) => ({
        subject: String(i + 1).padStart(2, '0'),
        A: 0,
        B: 0,
        C: 0,
        fullMark: 150,
        actor: null,
      }));

      itemsWithAngles.forEach((entry) => {
        const slotIndex = Math.floor((entry.angle / 360) * totalSlots) % totalSlots;
        let targetIndex = slotIndex;
        while (slots[targetIndex].actor !== null) {
          targetIndex = (targetIndex + 1) % totalSlots;
        }
        slots[targetIndex] = {
          subject: String(targetIndex + 1).padStart(2, '0'),
          A: entry.category === 'Around You' ? entry.scaledVal : 0,
          B: entry.category === 'Away' ? entry.scaledVal : 0,
          C: entry.category === 'Global' ? entry.scaledVal : 0,
          fullMark: 150,
          actor: entry.item,
        };
      });

      return slots;
    }

    // When we have enough items, each item occupies its own shattered spoke
    return itemsWithAngles.map((entry, index) => ({
      subject: String(index + 1).padStart(2, '0'),
      A: entry.category === 'Around You' ? entry.scaledVal : 0,
      B: entry.category === 'Away' ? entry.scaledVal : 0,
      C: entry.category === 'Global' ? entry.scaledVal : 0,
      fullMark: 150,
      actor: entry.item,
    }));
  }, [itemsForRadar]);

  const handleHover = (e, category, index, payloadActor) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const actorObj = payloadActor || radarChartData[index]?.actor;
    if (!actorObj) return;
    const name = actorObj?.name || hoveredNameRef.current || 'Threat Actor';
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

  const handleClick = (category, index, payloadActor) => {
    const actorObj = payloadActor || radarChartData[index]?.actor;
    if (actorObj) {
      setSelectedActorId(actorObj.actor_id || actorObj.id);
    } else {
      setSelectedActorId(null);
    }
    setShowModal(true);
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  };

  const handlePopupClick = () => {
    const actorObj = allActorsList.find((a) => a.name === hoveredNameRef.current);
    if (actorObj) {
      setSelectedActorId(actorObj.actor_id || actorObj.id);
    } else {
      setSelectedActorId(null);
    }
    setShowModal(true);
    if (popupRef.current) {
      popupRef.current.style.display = 'none';
    }
  };

  const handleRowClick = (actor) => {
    setSelectedActorId(actor?.actor_id || actor?.id);
    setShowModal(true);
  };

  const handleSeverityChange = (e) => {
    const newSeverity = e.target.value;
    setSelectedSeverity(newSeverity);

    const val = newSeverity.toLowerCase();
    if (val === 'critical') {
      setSelectedRadius('0+');
    } else if (val === 'high') {
      setSelectedRadius('1+');
    } else if (val === 'moderate') {
      setSelectedRadius('2+');
    } else if (val === 'low') {
      setSelectedRadius('3+');
    } else if (val === 'all') {
      setSelectedRadius('4+');
    }
  };

  const focusedCount = useMemo(() => {
    return filteredActors.filter(isActorInFocus).length;
  }, [filteredActors, focusLevelThreshold]);

  return (
    <div className="threat-card-container">
      {/* Header Bar */}
      <div className="threat-header">
        <div className="header-left">
          <span className="chart-title">
            <i className="bi bi-shield-check"></i> {data?.client_name || clientName}
          </span>
          <span className="threat-stats-pill">
            <span className="stats-count">{data?.total_items || allActorsList.length}</span> Total Threats
          </span>
        </div>

        <div className="header-right">
          <div className="radius-control-wrapper" title="Filter by threat severity and proximity">
            <label htmlFor="threat-severity-select" className="radius-control-label">
              <i className="bi bi-funnel-fill"></i> Filter:
            </label>
            <select
              id="threat-severity-select"
              className="radius-control-select"
              value={selectedSeverity}
              onChange={handleSeverityChange}
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
              <option value="All">All</option>
            </select>
          </div>
          <button className="expand-btn" title="Expand View" onClick={() => getRadarDatalist(clientName)}>
            <i className={`bi ${loading ? 'bi-arrow-repeat spin' : 'bi-arrows-angle-expand'}`}></i>
          </button>
        </div>
      </div>

      {/* Main Split View: Left = Radar Chart, Right = Interactive Table */}
      <div className="threat-body-split">
        {/* Left: Compact Radar Chart */}
        <div className="threat-radar-col">
          <div className="radar-chart-container" ref={containerRef}>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart cx="50%" cy="50%" outerRadius="88%" data={radarChartData}>
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
                      hoveredActor={hoveredActor}
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
                      hoveredActor={hoveredActor}
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
                      hoveredActor={hoveredActor}
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
          {/* <div className="radar-mini-legend">
            <span className="mini-legend-item">
              <span className="legend-dot dot-around"></span> Around You
            </span>
            <span className="mini-legend-item">
              <span className="legend-dot dot-away"></span> Away
            </span>
            <span className="mini-legend-item">
              <span className="legend-dot dot-global"></span> Global
            </span>
          </div> */}
        </div>

        {/* Right: Interactive Threat Actor Table */}
        <div className="threat-table-col">
          {/* Scrollable Table View */}
          <div className="table-scroll-container">
            <table className="threat-actors-table">
              <thead>
                <tr>
                  <th>Threat Actor</th>
                  <th>Severity</th>
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
                    const rawRiskLevel = actor.riskLevel || 'Low';
                    const severityLabel =
                      selectedSeverity !== 'All'
                        ? selectedSeverity
                        : rawRiskLevel === 'Minimal' ? 'All' : rawRiskLevel;
                    const sevClass = severityLabel.toLowerCase();

                    return (
                      <tr
                        key={actor.id}
                        className={`actor-row ${inFocus ? 'in-focus-zone' : ''} ${
                          isHovered ? 'is-hovered' : ''
                        }`}
                        onClick={() => handleRowClick(actor)}
                        onMouseEnter={() => setHoveredActor(actor.name)}
                        onMouseLeave={() => setHoveredActor(null)}
                      >
                        <td>
                          <div className="actor-name-cell">
                            <div className={`actor-icon icon-${catClass}`}>
                              {actor.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="name-info">
                              <span className="name-text">{actor.name}</span>
                              <span className="id-text">{actor.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`proximity-badge badge-${sevClass}`}>
                            {severityLabel}
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
                      <i className="bi bi-info-circle me-1"></i> {loading ? 'Loading threat data...' : 'No threat actors match the current filter.'}
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
                Highlighted: <strong>{radiusLabel}</strong> ({focusedCount} active threats)
              </span>
            </div>
            <span className="count-summary">
              Showing {filteredActors.length} of {allActorsList.length} actors
            </span>
          </div>
        </div>
      </div>

      {/* Threat Actor Details Modal */}
      <ThreatModal
        showModal={showModal}
        setShowModal={setShowModal}
        actor_id={selectedActorId}
        client_name={data?.client_name || clientName}
        titlePrefix="Threat Actor:"
      />
    </div>
  );
}

