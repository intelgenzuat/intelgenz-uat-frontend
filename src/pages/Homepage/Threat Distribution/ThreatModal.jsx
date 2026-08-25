import React from 'react';

const ThreatModal = ({ showModal, setShowModal, modalData, titlePrefix }) => {
  if (!showModal) return null;

  return (
    <div className="radar-detailed-modal-overlay" onClick={() => setShowModal(false)}>
      <div className="radar-detailed-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="radar-detailed-modal-header">
          <div className="header-left">
            <div className="tags">
              <span className="tag-global"><i className="bi bi-globe"></i> GLOBAL PROXIMITY</span>
              <span className="tag-id">ID: AG-2938-FIN</span>
            </div>
            <h3 className="modal-title">{titlePrefix} {modalData?.name}</h3>
          </div>
          <div className="header-right">
            <div className="score-container">
              <div className="score-circle">4</div>
              <div className="score-text">
                <div className="score-label">THREAT SCORE</div>
                <div className="score-desc">High Risk Profile</div>
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
                  <p>United States.</p>
                </div>
                <div className="content-col">
                  <h5>Client Footprint</h5>
                  <p>HQ London, UK; operations in UK, Ireland, Germany, Singapore and India (Pune).</p>
                </div>
              </div>
              <div className="overlap-box">
                <h6><i className="bi bi-arrows-collapse"></i> Overlap Analysis</h6>
                <p>No target-country or broader-region overlap with Meridian's Europe/APAC footprint.</p>
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
                  <p>Payment processing / financial services.</p>
                </div>
                <div className="content-col">
                  <h5>Client Sector</h5>
                  <p>BFSI / Financial Services, Tier-2 universal bank + wealth management.</p>
                </div>
              </div>
              <div className="critical-match-box">
                <h6><i className="bi bi-exclamation-triangle"></i> Critical Match Identified</h6>
                <p>Same payments/financial-services vertical.</p>
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="detail-section">
            <div className="section-header">
              <div className="section-title-wrapper">
                <i className="bi bi-cpu"></i>
                <h4>Technology (T)</h4>
                <span className="score-badge">3.4/5</span>
              </div>
              <p className="section-subtitle">Infrastructure and stack vulnerability alignment.</p>
            </div>
            <div className="section-content">
              <div className="content-row">
                <div className="content-col">
                  <h5>Actor Tech Focus</h5>
                  <p>Credit/debit card processing networks; corporate payment systems.</p>
                </div>
                <div className="content-col">
                  <h5>Client Stack</h5>
                  <p>AD hybrid -{">"} Microsoft Entra ID, Azure primary, AWS secondary; F5 BIG-IP; Palo Alto GlobalProtect; Citrix VDI, Temenos T24, Finastra, Murex; SWIFT, Alliance Access.</p>
                </div>
              </div>
              <div className="overlap-box">
                <h6><i className="bi bi-arrows-collapse"></i> Overlap Analysis</h6>
                <p>Payment-processing technology-family overlap with Meridian's payment switch/card-management estate. No exact product/version match.</p>
              </div>
            </div>
          </div>

          {/* Peer/Victim */}
          <div className="detail-section">
            <div className="section-header">
              <div className="section-title-wrapper">
                <i className="bi bi-people"></i>
                <h4>Peer/Victim (P)</h4>
                <span className="score-badge">3.0/5</span>
              </div>
              <p className="section-subtitle">Victimology alignment.</p>
            </div>
            <div className="section-content">
              <div className="content-row">
                <div className="content-col">
                  <h5>Actor Victims</h5>
                  <p>Heartland Payment Systems; more than 250 affected financial institutions.</p>
                </div>
                <div className="content-col">
                  <h5>Client Profile</h5>
                  <p>Tier-2 universal bank + wealth management; retail/commercial banking, lending, cards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="radar-detailed-modal-footer">
          <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
          {/* <button className="btn-export"><i className="bi bi-download"></i> Export Report</button> */}
        </div>
      </div>
    </div>
  );
};

export default ThreatModal;
