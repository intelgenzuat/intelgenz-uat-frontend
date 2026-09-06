import React from 'react';

const ThreatModal = ({ showModal, setShowModal, modalData, titlePrefix = 'Threat Actor:' }) => {
  if (!showModal || !modalData) return null;

  const threatScore = modalData.threatScore || modalData.score || '4.5';
  const riskLevel = modalData.riskLevel || 'High Risk Profile';
  const actorId = modalData.id || `AG-2938-${modalData.name?.substring(0, 3).toUpperCase() || 'FIN'}`;
  const category = modalData.category || 'Global';
  const sector = modalData.sector || 'Payment processing / financial services';
  const actorFootprint = modalData.origin || modalData.actorFootprint || 'United States & Global Operations';
  const clientFootprint = modalData.clientFootprint || 'HQ London, UK; operations in UK, Ireland, Germany, Singapore and India (Pune).';
  const overlapAnalysis = modalData.overlapAnalysis || "Monitored for potential threat vector alignment with Meridian's regional footprint.";
  const techFocus = modalData.techFocus || 'Credit/debit card processing networks; corporate payment systems.';
  const clientStack = modalData.clientStack || 'AD hybrid -> Microsoft Entra ID, Azure primary, AWS secondary; F5 BIG-IP; Palo Alto GlobalProtect; Citrix VDI, Temenos T24, Finastra, Murex; SWIFT, Alliance Access.';
  const victims = modalData.victims || 'Heartland Payment Systems; more than 250 affected financial institutions.';
  const clientProfile = modalData.clientProfile || 'Tier-2 universal bank + wealth management; retail/commercial banking, lending, cards.';

  const categoryTagClass = category === 'Around You' ? 'tag-around' : category === 'Away' ? 'tag-away' : 'tag-global';

  return (
    <div className="radar-detailed-modal-overlay" onClick={() => setShowModal(false)}>
      <div className="radar-detailed-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="radar-detailed-modal-header">
          <div className="header-left">
            <div className="tags">
              <span className={categoryTagClass}><i className="bi bi-shield-shaded"></i> {category.toUpperCase()} PROXIMITY</span>
              <span className="tag-id">ID: {actorId}</span>
            </div>
            <h3 className="modal-title">{titlePrefix} {modalData?.name}</h3>
          </div>
          <div className="header-right">
            <div className="score-container">
              <div className="score-circle">{Math.round(parseFloat(threatScore) || 4)}</div>
              <div className="score-text">
                <div className="score-label">THREAT SCORE</div>
                <div className="score-desc">{riskLevel} ({threatScore}/5.0)</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="radar-detailed-modal-body">
          {/* Geographic */}
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
                <p>{overlapAnalysis}</p>
              </div>
            </div>
          </div>

          {/* Sector */}
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
                  <p>{sector}</p>
                </div>
                <div className="content-col">
                  <h5>Client Sector</h5>
                  <p>BFSI / Financial Services, Tier-2 universal bank + wealth management.</p>
                </div>
              </div>
              <div className="critical-match-box">
                <h6><i className="bi bi-exclamation-triangle"></i> Critical Match Identified</h6>
                <p>Vertical alignment identified in target sector ({sector}).</p>
              </div>
            </div>
          </div>

          {/* Technology */}
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
                  <p>{techFocus}</p>
                </div>
                <div className="content-col">
                  <h5>Client Stack</h5>
                  <p>{clientStack}</p>
                </div>
              </div>
              <div className="overlap-box">
                <h6><i className="bi bi-arrows-collapse"></i> Overlap Analysis</h6>
                <p>Payment-processing and infrastructure family overlap with Meridian estate.</p>
              </div>
            </div>
          </div>

          {/* Peer/Victim */}
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
                  <p>{victims}</p>
                </div>
                <div className="content-col">
                  <h5>Client Profile</h5>
                  <p>{clientProfile}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="radar-detailed-modal-footer">
          <button className="btn-cancel" onClick={() => setShowModal(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ThreatModal;
