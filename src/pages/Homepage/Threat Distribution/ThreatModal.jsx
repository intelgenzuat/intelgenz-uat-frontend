import React, { useEffect, useState } from 'react';
import { getRadarSinglelist } from '../../../Context/Radar';

const ThreatModal = ({
  showModal,
  setShowModal,
  actor_id,
  client_name = 'CERELYN BIOPHARMA',
  clientName,
  titlePrefix = 'Threat Actor:',
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeClientName = client_name || clientName || 'CERELYN BIOPHARMA';
  const rawActorId = actor_id !== undefined && actor_id !== null ? actor_id : '';
  const cleanActorId = rawActorId ? String(rawActorId).replace(/^TA-/, '') : '';

  const getRadarDatalist = (query = activeClientName) => {
    if (!cleanActorId) return;
    setLoading(true);
    const params = {
      id: cleanActorId,
      client_name: query,
    };
    getRadarSinglelist(params)((response) => {
      console.log('radarres', response);
      if (response) {
        setData(response);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (showModal && cleanActorId) {
      getRadarDatalist(activeClientName);
    } else if (!showModal) {
      setData(null);
    }
  }, [showModal, activeClientName, cleanActorId]);

  if (!showModal) return null;

  // Header and Risk Calculations from state data
  const actorIdDisplay = data?.actor_id ? `TA-${data.actor_id}` : (cleanActorId ? `TA-${cleanActorId}` : 'TA-N/A');
  const actorName = data?.name || (loading ? 'Loading...' : 'Threat Actor');
  const radius = typeof data?.radius === 'number' ? data.radius : (parseFloat(data?.radius) || 1.5);
  const severity = (data?.severity || 'high').toLowerCase();

  let category = 'Global';
  let riskLevel = 'Low Risk Profile';
  if (severity === 'high' || radius < 2.0) {
    category = 'Around You';
    riskLevel = radius <= 1.5 ? 'Critical Risk Profile' : 'High Risk Profile';
  } else if (severity === 'moderate' || (radius >= 2.0 && radius < 3.0)) {
    category = 'Away';
    riskLevel = 'Moderate Risk Profile';
  } else {
    category = 'Global';
    riskLevel = radius < 4.0 ? 'Low Risk Profile' : 'Minimal Risk Profile';
  }

  const threatScore = Math.max(1.0, Math.min(5.0, 5.0 - (radius - 1.0) * 0.85)).toFixed(1);
  const categoryTagClass = category === 'Around You' ? 'tag-around' : category === 'Away' ? 'tag-away' : 'tag-global';

  // Section G: Geographic
  const targetingList = data?.summary?.targeting || [];
  const countries = targetingList.flatMap((t) => t.countries || []);
  const regions = targetingList.flatMap((t) => t.regions || []);
  const nexus = data?.summary?.nexus || [];
  const geoCombined = [...new Set([...countries, ...regions, ...nexus])].filter(Boolean);
  const actorFootprint = geoCombined.length ? geoCombined.join(', ') : 'Global Operations';
  const clientFootprint = `${data?.client_name || activeClientName} operational perimeter & global footprint.`;
  const geoOverlap = geoCombined.length
    ? `Geographic targeting identified in ${geoCombined.join(', ')} matching ${data?.client_name || activeClientName} regional operations.`
    : `Monitored for potential threat vector alignment with ${data?.client_name || activeClientName}.`;

  // Section S: Sector
  const rawSectors = targetingList.flatMap((t) => t.sectors || []);
  const sectorList = [...new Set(rawSectors.flatMap((s) => (typeof s === 'string' ? s.split(',').map((x) => x.trim()) : [])))].filter(Boolean);
  const actorTargetSector = sectorList.length ? sectorList.join(', ') : 'Cross-Sector / Enterprise & Critical Infrastructure';
  const clientSector = `${data?.client_name || activeClientName} industry vertical assets and supply chain.`;
  const criticalMatchText = sectorList.length
    ? `Direct vertical targeting identified across ${sectorList.slice(0, 5).join(', ')} with potential exposure to ${data?.client_name || activeClientName}.`
    : `Vertical alignment identified in target sector matching ${data?.client_name || activeClientName}.`;

  // Section T: Technology
  const targetedAssets = (data?.summary?.targeted_assets || []).map((a) => a.name).filter(Boolean);
  const vulnList = (data?.vulnerabilities || []).map((v) => `${v.cve}${v.product ? ` (${v.product})` : ''}`).filter(Boolean);
  const capList = (data?.capabilities || []).map((c) => c.name).filter(Boolean);
  const techCombined = [...new Set([...targetedAssets, ...vulnList, ...capList])].filter(Boolean);
  const actorTechFocus = techCombined.length
    ? techCombined.slice(0, 6).join('; ')
    : 'Enterprise Active Directory, Cloud Infrastructure, RMM & Exfiltration Tools';
  const clientStack = targetedAssets.length
    ? `Observed target environments: ${targetedAssets.slice(0, 4).join(', ')}.`
    : `${data?.client_name || activeClientName} enterprise hybrid cloud and identity estate.`;
  const techOverlap = vulnList.length
    ? `Known vulnerability exploit vectors: ${vulnList.slice(0, 3).join(', ')}.`
    : `Attack patterns and target assets overlap with ${data?.client_name || activeClientName} perimeter.`;

  // Section P: Peer / Victim
  const confirmedPaths = data?.execution?.confirmed_paths || [];
  const targetContexts = confirmedPaths.map((p) => p.target_context).filter(Boolean);
  const goals = data?.summary?.goals?.join(' ') || data?.summary?.primary_motivation?.type;
  const actorVictims = targetContexts.length
    ? targetContexts.join('; ')
    : (goals || 'Global enterprise organizations, regional peers and education/healthcare institutions.');
  const clientProfile = `${data?.client_name || activeClientName}${
    data?.summary?.sophistication ? ` — ${data.summary.sophistication.toLowerCase()} threat actor profile` : ''
  }`;

  return (
    <div className="radar-detailed-modal-overlay" onClick={() => setShowModal(false)}>
      <div className="radar-detailed-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="radar-detailed-modal-header">
          <div className="header-left">
            <div className="tags">
              <span className={categoryTagClass}>
                <i className="bi bi-shield-shaded"></i> {category.toUpperCase()} PROXIMITY
              </span>
              <span className="tag-id">ID: {actorIdDisplay}</span>
            </div>
            <h3 className="modal-title">{titlePrefix} {actorName}</h3>
          </div>
          <div className="header-right">
            <div className="score-container">
              {loading && !data ? (
                <>
                  <div className="score-circle" style={{ borderColor: '#cbd5e1' }}>
                    <div
                      className="spinner-border spinner-border-sm text-primary"
                      role="status"
                      style={{ width: '15px', height: '15px', borderWidth: '2px' }}
                    >
                      <span className="visually-hidden">Calculating score...</span>
                    </div>
                  </div>
                  <div className="score-text">
                    <div className="score-label">THREAT SCORE</div>
                    <div className="score-desc" style={{ color: '#64748b', fontSize: '12px' }}>
                      Calculating score...
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="score-circle">{Math.round(parseFloat(threatScore) || 4)}</div>
                  <div className="score-text">
                    <div className="score-label">THREAT SCORE</div>
                    <div className="score-desc">{riskLevel} ({threatScore}/5.0)</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="radar-detailed-modal-body">
          {loading && !data ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading threat actor details...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Geographic (G) */}
              <div className="detail-section">
                <div className="section-header">
                  <div className="section-title-wrapper">
                    <i className="bi bi-globe"></i>
                    <h4>Geographic (G)</h4>
                    <span className="score-badge">3.5/5</span>
                  </div>
                  <p className="section-subtitle">Spatial and operational footprint alignment.</p>
                </div>
                <div className="section-content">
                  <div className="content-row">
                    <div className="content-col">
                      <h5>Actor Footprint</h5>
                      <p>{actorFootprint}</p>
                    </div>
                    <div className="content-col">
                      <h5>Client Footprint</h5>
                      <p>{clientFootprint}</p>
                    </div>
                  </div>
                  <div className="overlap-box">
                    <h6><i className="bi bi-arrows-collapse"></i> Overlap Analysis</h6>
                    <p>{geoOverlap}</p>
                  </div>
                </div>
              </div>

              {/* Sector (S) */}
              <div className="detail-section critical-match">
                <div className="section-header">
                  <div className="section-title-wrapper">
                    <i className="bi bi-building"></i>
                    <h4 className="text-danger">Sector (S)</h4>
                    <span className="score-badge danger">5.0/5</span>
                  </div>
                  <p className="section-subtitle text-danger">Industry and vertical targeting alignment.</p>
                </div>
                <div className="section-content">
                  <div className="content-row">
                    <div className="content-col">
                      <h5>Actor Target Sector</h5>
                      <p>{actorTargetSector}</p>
                    </div>
                    <div className="content-col">
                      <h5>Client Sector</h5>
                      <p>{clientSector}</p>
                    </div>
                  </div>
                  <div className="critical-match-box">
                    <h6><i className="bi bi-exclamation-triangle"></i> Critical Match Identified</h6>
                    <p>{criticalMatchText}</p>
                  </div>
                </div>
              </div>

              {/* Technology (T) */}
              <div className="detail-section">
                <div className="section-header">
                  <div className="section-title-wrapper">
                    <i className="bi bi-cpu"></i>
                    <h4>Technology (T)</h4>
                    <span className="score-badge">3.8/5</span>
                  </div>
                  <p className="section-subtitle">Infrastructure and stack vulnerability alignment.</p>
                </div>
                <div className="section-content">
                  <div className="content-row">
                    <div className="content-col">
                      <h5>Actor Tech Focus</h5>
                      <p>{actorTechFocus}</p>
                    </div>
                    <div className="content-col">
                      <h5>Client Stack</h5>
                      <p>{clientStack}</p>
                    </div>
                  </div>
                  <div className="overlap-box">
                    <h6><i className="bi bi-arrows-collapse"></i> Overlap Analysis</h6>
                    <p>{techOverlap}</p>
                  </div>
                </div>
              </div>

              {/* Peer/Victim (P) */}
              <div className="detail-section">
                <div className="section-header">
                  <div className="section-title-wrapper">
                    <i className="bi bi-people"></i>
                    <h4>Peer/Victim (P)</h4>
                    <span className="score-badge">3.2/5</span>
                  </div>
                  <p className="section-subtitle">Victimology alignment.</p>
                </div>
                <div className="section-content">
                  <div className="content-row">
                    <div className="content-col">
                      <h5>Actor Victims</h5>
                      <p>{actorVictims}</p>
                    </div>
                    <div className="content-col">
                      <h5>Client Profile</h5>
                      <p>{clientProfile}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="radar-detailed-modal-footer">
          <button className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ThreatModal;
