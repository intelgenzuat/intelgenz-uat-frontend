import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/styles/Intelcard/intelcardThreatActorDetailNew.scss';
import { getTheatreIntelCardDetailedView } from '../../Context/Intelcard';

export default function IntelcardThreatActorDetailNew() {
  const { id } = useParams();
  const [threatData, setThreatData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getThreatActorDetailedViewData = (actorId = id) => {
    setLoading(true);
    getTheatreIntelCardDetailedView({ id: actorId })((response) => {
      console.log("threatDetail", response);
      if (response) {
        setThreatData(response);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    if (id) {
      getThreatActorDetailedViewData(id);
    } else {
      getThreatActorDetailedViewData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5 vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const summary = threatData?.summary || {};
  const targeting = summary?.targeting?.[0] || {};
  const targetChips = [
    ...(targeting?.countries || []),
    ...(targeting?.regions || []),
    ...(targeting?.sectors || [])
  ];

  const executionSteps = threatData?.execution?.confirmed_paths?.[0]?.steps || [];

  return (
    <div className="intelcard-threat-actor-detail-new-container">
      {/* PAGE 1 */}
      <section className="page">
        <header className="hero">
          <div className="top">
            <div className="brand">Threat Actor Intelligence</div>
            <div>
              Profile {threatData?.actor_id ? String(threatData.actor_id).padStart(2, '0') : '01'} / {summary?.last_seen?.date?.slice(0, 4) || new Date().getFullYear()}
            </div>
          </div>
          <div className="heroGrid">
            <div>
              <h1>{threatData?.name || 'Unknown Actor'}</h1>
              <div className="aliases">
                {threatData?.aliases?.length > 0 ? threatData.aliases.join(' · ') : 'None documented'}
              </div>
              <div className="badges">
                <span className="badge status">
                  Status {summary?.status ? summary.status.toLowerCase() : 'unknown'}
                </span>
                <span className="badge">
                  {summary?.classification?.replace(/_/g, ' ') || summary?.actor_types?.[0]?.replace(/_/g, ' ') || 'Intrusion set'}
                </span>
              </div>
            </div>
            <p>
              {threatData?.description?.split('. ')?.[0] ? `${threatData.description.split('. ')[0]}.` : 'No summary description available.'}
            </p>
          </div>
        </header>

        <div className="title">
          <b>1</b>Summary
        </div>
        <div className="grid4">
          <div className="card">
            <div className="label">Nexus</div>
            <div className="value">
              {summary?.nexus?.length > 0
                ? summary.nexus.map(n => n.country_or_region || n.country || n.name || n).join(', ')
                : 'Unknown nexus'}
            </div>
          </div>
          <div className="card">
            <div className="label">Actor type</div>
            <div className="value">
              {summary?.actor_types?.length > 0
                ? summary.actor_types.map(t => t.replace(/_/g, ' ').toLowerCase()).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
                : 'Unknown'}
            </div>
          </div>
          <div className="card">
            <div className="label">Role</div>
            <div className="value">
              {summary?.roles?.length > 0
                ? summary.roles.map(r => r.replace(/_/g, ' ').toLowerCase()).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
                : 'Unknown'}
            </div>
          </div>
          <div className="card">
            <div className="label">Primary motivation</div>
            <div className="value">
              {summary?.primary_motivation?.type
                ? summary.primary_motivation.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
                : 'Unknown'}
            </div>
          </div>
          <div className="card">
            <div className="label">Goal</div>
            <div className="value" title={summary?.goals?.join('; ') || ''}>
              {summary?.goals?.[0] || 'Unknown'}
            </div>
          </div>
          <div className="card">
            <div className="label">Resource level</div>
            <div className="value">
              {summary?.resource_level ? summary.resource_level.replace(/_/g, ' ') : 'Unknown'}
            </div>
          </div>
          <div className="card">
            <div className="label">Sophistication</div>
            <div className="value">
              {summary?.sophistication ? summary.sophistication.replace(/_/g, ' ') : 'Unknown'}
            </div>
          </div>
          <div className="card">
            <div className="label">Observed activity</div>
            <div className="value">
              {summary?.first_seen?.date || 'Unknown'} · {summary?.last_seen?.date || 'Present'}
            </div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: '2.3mm' }}>
          <div className="card">
            <div className="label">Targeting profile</div>
            <div className="chips" style={{ marginTop: '1.4mm' }}>
              {targetChips.length > 0 ? (
                targetChips.map((chip, idx) => (
                  <span key={idx} className="chip">{chip}</span>
                ))
              ) : (
                <span className="chip">Global</span>
              )}
            </div>
          </div>
          <div className="card">
            <div className="label">Targeted technology / Assets</div>
            <div className="chips" style={{ marginTop: '1.4mm' }}>
              {summary?.targeted_assets?.length > 0 ? (
                summary.targeted_assets.map((asset, idx) => (
                  <span key={idx} className="chip blue" title={asset.environment || ''}>
                    {asset.name || asset.environment}
                  </span>
                ))
              ) : (
                <span className="chip blue">General systems</span>
              )}
            </div>
          </div>
        </div>

        <div className="title">
          <b>2</b>Description
        </div>
        <div className="desc">
          {threatData?.description ? (
            threatData.description.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))
          ) : (
            <p>No detailed description available.</p>
          )}
        </div>

        <div className="title">
          <b>3</b>Activity timeline
        </div>
        <div className="timeline">
          {threatData?.activity_timeline?.length > 0 ? (
            threatData.activity_timeline.map((event, idx) => (
              <div key={idx} className="event">
                <div className="date">{event.date || event.precision || 'Event'}</div>
                <p>{event.event || event.event_type || 'Activity logged.'}</p>
              </div>
            ))
          ) : (
            <div className="event">
              <div className="date">N/A</div>
              <p>No timeline activities documented.</p>
            </div>
          )}
        </div>

        <div className="title">
          <b>4</b>Diamond model
        </div>
        <div className="diamond-wrap">
          <svg viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="edge" x1="0" x2="1">
                <stop stopColor="#f4ab45" />
                <stop offset="0.5" stopColor="#20b8cb" />
                <stop offset="1" stopColor="#7c78d5" />
              </linearGradient>
            </defs>
            <path d="M500 55 L805 215 L500 375 L195 215 Z" fill="none" stroke="url(#edge)" strokeWidth="4" />
            <path d="M500 55 L500 375 M195 215 L805 215" stroke="#bfd0dc" strokeWidth="2" strokeDasharray="9 10" />
            <circle cx="500" cy="55" r="9" fill="#f4ab45" />
            <circle cx="805" cy="215" r="9" fill="#20b8cb" />
            <circle cx="500" cy="375" r="9" fill="#ef6a72" />
            <circle cx="195" cy="215" r="9" fill="#7c78d5" />
          </svg>
          <div className="diamond-node adversary">
            <strong>ADVERSARY</strong>
            <small>
              {threatData?.name || 'Unknown'} · {summary?.actor_types?.join(', ') || 'Threat Actor'} · {summary?.nexus?.length > 0 ? summary.nexus.map(n => n.country_or_region || n).join(', ') : 'Unknown nexus'}
            </small>
          </div>
          <div className="diamond-node infra">
            <strong>INFRASTRUCTURE</strong>
            <small>
              {threatData?.infrastructure?.length > 0
                ? threatData.infrastructure.slice(0, 4).map(i => i.value).join(' · ')
                : 'No infrastructure documented'}
            </small>
          </div>
          <div className="diamond-node victim">
            <strong>VICTIM</strong>
            <small>
              {targetChips.length > 0 ? targetChips.slice(0, 4).join(', ') : 'Global organizations'} · {summary?.targeted_assets?.[0]?.environment || 'Target environments'}
            </small>
          </div>
          <div className="diamond-node capability">
            <strong>CAPABILITY</strong>
            <small>
              {threatData?.ttps?.length > 0
                ? threatData.ttps.slice(0, 4).map(t => t.technique).join(' · ')
                : threatData?.capabilities?.length > 0
                  ? threatData.capabilities.join(' · ')
                  : 'Tactics and Techniques'}
            </small>
          </div>
          <div className="center">
            {summary?.last_seen?.date?.slice(0, 7) || 'Active'}
            <br />
            operation
          </div>
        </div>

        <footer className="foot">
          <span>{threatData?.name || 'Threat Actor'} · Threat actor profile</span>
          <span>01 / 02</span>
        </footer>
      </section>

      {/* PAGE 2 */}
      <section className="page">
        <header className="pagehead">
          <div>
            <div className="over">Operational profile</div>
            <h2>Execution &amp; observables</h2>
          </div>
          <div className="label">{threatData?.name || 'Threat Actor'} / 02</div>
        </header>

        <div className="title" style={{ marginTop: 0 }}>
          <b>5</b>Execution path
        </div>
        <div className="steps">
          {executionSteps.length > 0 ? (
            executionSteps.map((step, idx) => (
              <div key={idx} className={`step ${idx === executionSteps.length - 1 ? 'full warning' : ''}`}>
                <div className="num">{step.step || idx + 1}</div>
                <div>
                  <strong>{step.title || step.action}</strong>
                  {step.action && step.action !== step.title && <p className="mb-1">{step.action}</p>}
                  <span className="meta">
                    {[
                      step.categories?.length > 0 ? `Category: ${step.categories.join(', ')}` : null,
                      step.infrastructure?.length > 0 ? `Infrastructure: ${step.infrastructure.join(' · ')}` : null,
                      step.artifacts?.length > 0 ? `Artifacts: ${step.artifacts.join(' · ')}` : null,
                      step.tools?.length > 0 ? `Tools: ${step.tools.join(' · ')}` : null
                    ].filter(Boolean).join(' | ')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="step">
              <div className="num">1</div>
              <div><strong>No confirmed execution paths documented.</strong></div>
            </div>
          )}
        </div>

        <div className="grid2">
          <div>
            <div className="title">
              <b>6</b>Infrastructure
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '43%' }}>Infrastructure</th>
                  <th style={{ width: '20%' }}>Role</th>
                  <th>Communication</th>
                </tr>
              </thead>
              <tbody>
                {threatData?.infrastructure?.length > 0 ? (
                  threatData.infrastructure.map((infra, idx) => (
                    <tr key={idx}>
                      <td><code>{infra.value}</code></td>
                      <td>{infra.role || infra.type || '-'}</td>
                      <td>{[infra.protocol, infra.service, infra.port ? `Port ${infra.port}` : null].filter(Boolean).join(' · ') || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No infrastructure documented</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div>
            <div className="title">
              <b>7</b>Targeted Assets &amp; Capabilities
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Asset / Capability</th>
                  <th>Environment / Purpose</th>
                </tr>
              </thead>
              <tbody>
                {summary?.targeted_assets?.length > 0 ? (
                  summary.targeted_assets.map((asset, idx) => (
                    <tr key={idx}>
                      <td><strong>{asset.name}</strong></td>
                      <td>{asset.environment || '-'}</td>
                    </tr>
                  ))
                ) : threatData?.capabilities?.length > 0 ? (
                  threatData.capabilities.map((cap, idx) => (
                    <tr key={idx}>
                      <td><strong>{cap.name || cap}</strong></td>
                      <td>{cap.purpose || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">No assets documented</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="title">
          <b>8</b>MITRE ATT&amp;CK TTPs
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Tactic</th>
              <th style={{ width: '15%' }}>ID</th>
              <th style={{ width: '30%' }}>Technique</th>
              <th>Operational use</th>
            </tr>
          </thead>
          <tbody>
            {threatData?.ttps?.length > 0 ? (
              threatData.ttps.map((ttp, idx) => (
                <tr key={idx}>
                  <td>{ttp.tactic || '-'}</td>
                  <td className="tid">{ttp.technique_id || '-'}</td>
                  <td><strong>{ttp.technique || '-'}</strong></td>
                  <td>{ttp.procedure || ttp.technique || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No TTPs documented</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="title">
          <b>9</b>Indicators of compromise
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: '18%' }}>Type</th>
              <th style={{ width: '35%' }}>Value</th>
              <th style={{ width: '28%' }}>Role</th>
              <th>Activity window</th>
            </tr>
          </thead>
          <tbody>
            {threatData?.iocs?.length > 0 ? (
              threatData.iocs.map((ioc, idx) => (
                <tr key={idx}>
                  <td><span className="tag">{ioc.type || 'Indicator'}</span></td>
                  <td><code>{ioc.value}</code></td>
                  <td>{ioc.role || ioc.context || '-'}</td>
                  <td>{[ioc.first_seen, ioc.last_seen].filter(Boolean).join(' · ') || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No IOCs documented</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="callout">
          <strong>Analytic note:</strong> {summary?.last_seen?.raw_value ? `The actor ${summary.last_seen.raw_value}.` : `The actor's last observed activity was on ${summary?.last_seen?.date || 'unknown date'}.`}
        </div>

        <footer className="foot">
          <span>{threatData?.name || 'Threat Actor'} · Threat actor profile</span>
          <span>02 / 02</span>
        </footer>
      </section>
    </div>
  );
}
