import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CustomDotCritical, CustomDotHigh, CustomDotAway, renderRadarBackground } from '../../../Helpers/RadarHelpers';
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

// Fixed 24 radial lines (15° apart) so background grid line count never changes
const RADAR_POLAR_ANGLES = Array.from({ length: 24 }, (_, i) => i * 15);

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
      <OriginalDot cx={cx} cy={cy} value={value} index={index} isHovered={isHovered} actor={actor} payload={payload} />
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
  const [clientName, setClientName] = useState('HALDEN INDUSTRIAL SYSTEMS');
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
  console.log(data,"radar")

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

  // Map raw API items using the original severity field from the API.
  // Only Critical, High, and Moderate are included — Low and Minimal are excluded.
  const allActorsList = useMemo(() => {
    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      return [];
    }
    const cName = data.client_name || clientName || 'Client';

    return data.items
      .filter((item) => {
        // Use the raw API severity to decide inclusion — skip low / minimal
        const sev = (item.severity || '').toLowerCase();
        return ['critical', 'high', 'moderate'].includes(sev);
      })
      .map((item, index) => {
        // Use the original API severity directly — no radius-based re-mapping
        const sev = (item.severity || '').toLowerCase();
        const rad = typeof item.radius === 'number' ? item.radius : parseFloat(item.radius) || 2.0;

        let category = 'Moderate';
        let focusLevel = 2;
        let riskLevel = 'Moderate';

        if (sev === 'critical') {
          category = 'Critical';
          focusLevel = 0;
          riskLevel = 'Critical';
        } else if (sev === 'high') {
          category = 'High';
          focusLevel = 1;
          riskLevel = 'High';
        }

        // Threat Score calculated from radius (range 1.0 -> 5.0)
        const calculatedScore = Math.max(1.0, Math.min(5.0, 5.0 - (rad - 1.0) * 0.85)).toFixed(1);

        return {
          id: item.actor_id ? `TA-${item.actor_id}` : `TA-${index + 1}`,
          actor_id: item.actor_id,
          name: item.name || `Actor_${item.actor_id || index + 1}`,
          radius: rad,
          severity: sev,           // original API value
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
      default:
        return `${selectedSeverity} Zone`;
    }
  }, [selectedSeverity]);

  const getRadiusValue = (radiusKey, outerR) => {
    const step = outerR / 3;
    switch (radiusKey) {
      case '0+':
        return step * 1;
      case '1+':
        return step * 2;
      case '2+':
        return outerR;
      default:
        return step * 1;
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
      if (target === 'critical') {
        return actor.severity === 'critical' || actor.riskLevel === 'Critical';
      }
      if (target === 'high') {
        return actor.severity === 'high' || actor.riskLevel === 'High';
      }
      if (target === 'moderate') {
        return actor.severity === 'moderate' || actor.riskLevel === 'Moderate';
      }
      return true;
    });
  }, [allActorsList, selectedSeverity]);

  // Selected sample of actors to plot on the radar chart - ONLY matching the selected filter
  const itemsForRadar = useMemo(() => {
    if (!filteredActors || filteredActors.length === 0) return [];
    return filteredActors;
  }, [filteredActors]);

  // Generate Recharts polar dataset with shattered, perfectly balanced distribution for Critical, High, and Moderate
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
    const criticalItems = [];
    const highItems = [];
    const moderateItems = [];

    itemsForRadar.forEach((item) => {
      if (item.category === 'Critical' || item.severity === 'critical') {
        criticalItems.push(item);
      } else if (item.category === 'High' || item.severity === 'high') {
        highItems.push(item);
      } else {
        moderateItems.push(item);
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
        const rad = typeof item.radius === 'number' ? item.radius : parseFloat(item.radius) || 2.0;
        const radialJitter = ((hash % 100) / 100 - 0.5) * 6; // ±3px

        let scaledVal = 30;
        if (category === 'Critical') {
          // Inner zone: ~20 to 45 (Grid circle at 50)
          const norm = Math.max(0, Math.min(1, (rad - 0.5) / 0.8));
          scaledVal = Math.max(20, Math.min(46, 22 + norm * 20 + radialJitter));
        } else if (category === 'High') {
          // Mid zone: ~65 to 92 (Grid circle at 100)
          const norm = Math.max(0, Math.min(1, (rad - 1.2) / 0.9));
          scaledVal = Math.max(62, Math.min(94, 68 + norm * 22 + radialJitter));
        } else {
          // Outer zone: ~110 to 144 (Grid circle at 150)
          const norm = Math.max(0, Math.min(1, (rad - 2.2) / 1.5));
          scaledVal = Math.max(108, Math.min(145, 114 + norm * 26 + radialJitter));
        }

        itemsWithAngles.push({
          item,
          angle,
          scaledVal,
          category,
        });
      });
    };

    assignAngles(criticalItems, 18, 'Critical');
    assignAngles(highItems, 74, 'High');
    assignAngles(moderateItems, 142, 'Moderate');

    // Sort all items by angle ascending so they map evenly around polar coordinates
    itemsWithAngles.sort((a, b) => a.angle - b.angle);

    // Map ALL threat actors so all items (e.g. 115 moderate actors) are visible on the radar
    return itemsWithAngles.map((entry, index) => ({
      subject: String(index + 1).padStart(2, '0'),
      A: entry.category === 'Critical' ? entry.scaledVal : 0,
      B: entry.category === 'High' ? entry.scaledVal : 0,
      C: entry.category === 'Moderate' ? entry.scaledVal : 0,
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
    }
  };

  const focusedCount = useMemo(() => {
    return filteredActors.filter(isActorInFocus).length;
  }, [filteredActors, focusLevelThreshold]);

  return (
    <div className="threat-card-container">
      {/* Main Split View: Left = Radar Chart, Right = Interactive Table */}
      <div className="threat-body-split">
        {/* Left: Compact Radar Chart */}
        <div className="threat-radar-col">
          <div className="radar-header-right">
            <div className="radius-control-wrapper" title="Filter by threat severity">
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
              </select>
            </div>
          </div>
          <div className="radar-chart-container" ref={containerRef}>
            <ResponsiveContainer width="100%" height={420}>
              <RadarChart cx="50%" cy="50%" outerRadius="88%" data={radarChartData}>
                <PolarGrid gridType="circle" stroke="#e2e8f0" polarAngles={RADAR_POLAR_ANGLES} />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 150]}
                  ticks={[50, 100, 150]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Critical"
                  dataKey="A"
                  stroke="none"
                  fill="none"
                  dot={
                    <RenderDot
                      OriginalDot={CustomDotCritical}
                      category="Critical"
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
                  name="High"
                  dataKey="B"
                  stroke="none"
                  fill="none"
                  dot={
                    <RenderDot
                      OriginalDot={CustomDotHigh}
                      category="High"
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
                  name="Moderate"
                  dataKey="C"
                  stroke="none"
                  fill="none"
                  dot={
                    <RenderDot
                      OriginalDot={CustomDotAway}
                      category="Moderate"
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
                    const sevClass = (actor.severity || 'moderate').toLowerCase();
                    const severityLabel =
                      actor.riskLevel ||
                      (actor.severity ? actor.severity.charAt(0).toUpperCase() + actor.severity.slice(1) : 'Moderate');

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
                            <div className={`actor-icon icon-${sevClass}`}>
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

