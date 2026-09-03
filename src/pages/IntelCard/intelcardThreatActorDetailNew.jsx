import React from 'react';
import '../../assets/styles/Intelcard/intelcardThreatActorDetailNew.scss';

export default function IntelcardThreatActorDetailNew() {
  return (
    <div className="intelcard-threat-actor-detail-new-container">
      {/* PAGE 1 */}
      <section className="page">
        <header className="hero">
          <div className="top">
            <div className="brand">Threat Actor Intelligence</div>
            <div>Profile 01 / 2026</div>
          </div>
          <div className="heroGrid">
            <div>
              <h1>BRONZE BUTLER</h1>
              <div className="aliases">
                Stalker Panda · Stalker Taurus · Swirl Typhoon · TELLURIUM · TEMP.Tick
              </div>
              <div className="badges">
                <span className="badge status">Status unknown</span>
                <span className="badge">Intrusion set</span>
              </div>
            </div>
            <p>
              A long-running, advanced espionage actor focused on strategic information collection from Japanese organizations.
            </p>
          </div>
        </header>

        <div className="title">
          <b>1</b>Summary
        </div>
        <div className="grid4">
          <div className="card">
            <div className="label">Nexus</div>
            <div className="value">Suspected China state nexus</div>
          </div>
          <div className="card">
            <div className="label">Actor type</div>
            <div className="value">State-aligned espionage</div>
          </div>
          <div className="card">
            <div className="label">Role</div>
            <div className="value">Operator</div>
          </div>
          <div className="card">
            <div className="label">Primary motivation</div>
            <div className="value">Espionage</div>
          </div>
          <div className="card">
            <div className="label">Goal</div>
            <div className="value">Strategic information theft</div>
          </div>
          <div className="card">
            <div className="label">Resource level</div>
            <div className="value">Organization</div>
          </div>
          <div className="card">
            <div className="label">Sophistication</div>
            <div className="value">Advanced</div>
          </div>
          <div className="card">
            <div className="label">Observed activity</div>
            <div className="value">2008 · mid-2025</div>
          </div>
        </div>

        <div className="grid2" style={{ marginTop: '2.3mm' }}>
          <div className="card">
            <div className="label">Targeting profile</div>
            <div className="chips" style={{ marginTop: '1.4mm' }}>
              <span className="chip">Japan</span>
              <span className="chip">APAC</span>
              <span className="chip">Government</span>
              <span className="chip">Manufacturing</span>
              <span className="chip">Biotechnology</span>
            </div>
          </div>
          <div className="card">
            <div className="label">Targeted technology</div>
            <div className="chips" style={{ marginTop: '1.4mm' }}>
              <span className="chip blue">Windows</span>
              <span className="chip blue">LANSCOPE Endpoint Manager</span>
            </div>
          </div>
        </div>

        <div className="title">
          <b>2</b>Description
        </div>
        <div className="desc">
          <p>
            BRONZE BUTLER is a long-running cyber-espionage intrusion set with a suspected Chinese state nexus. Active
            since at least 2008, the group has primarily targeted Japanese organizations in government, biotechnology,
            electronics manufacturing, and related strategic industries.
          </p>
          <p>
            The actor seeks confidential, classified, and strategically valuable information. Its operations combine custom
            malware, credential-access tooling, native Windows utilities, remote desktop access, archiving software, and
            external transfer services.
          </p>
          <p>
            In mid-2025, BRONZE BUTLER exploited CVE-2025-61932, a zero-day vulnerability in Motex LANSCOPE Endpoint
            Manager, to execute commands with SYSTEM privileges. The operation used Gokcpdoor and, on some systems, Havoc
            delivered through OAED Loader.
          </p>
          <p>
            Post-compromise activity included Active Directory discovery with goddi, manual access through Remote Desktop,
            collection and archiving with 7-Zip, and access to file-transfer services potentially used for exfiltration.
          </p>
        </div>

        <div className="title">
          <b>3</b>Activity timeline
        </div>
        <div className="timeline">
          <div className="event">
            <div className="date">2008</div>
            <p>The earliest documented BRONZE BUTLER activity began.</p>
          </div>
          <div className="event">
            <div className="date">Mid-2025</div>
            <p>The actor exploited a LANSCOPE Endpoint Manager zero-day during an espionage operation.</p>
          </div>
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
            <small>BRONZE BUTLER · advanced state-aligned espionage operator · suspected China nexus</small>
          </div>
          <div className="diamond-node infra">
            <strong>INFRASTRUCTURE</strong>
            <small>Two TCP C2 nodes · file.io · LimeWire · Piping Server</small>
          </div>
          <div className="diamond-node victim">
            <strong>VICTIM</strong>
            <small>Japanese government, manufacturing and biotechnology organizations · Windows and LANSCOPE environments</small>
          </div>
          <div className="diamond-node capability">
            <strong>CAPABILITY</strong>
            <small>CVE-2025-61932 · Gokcpdoor · Havoc · OAED Loader · goddi · 7-Zip · Remote Desktop</small>
          </div>
          <div className="center">
            Mid-2025
            <br />
            operation
          </div>
        </div>

        <footer className="foot">
          <span>BRONZE BUTLER · Threat actor profile</span>
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
          <div className="label">BRONZE BUTLER / 02</div>
        </header>

        <div className="title" style={{ marginTop: 0 }}>
          <b>5</b>Execution path
        </div>
        <div className="steps">
          <div className="step">
            <div className="num">1</div>
            <div>
              <strong>Initial access</strong> — Exploits CVE-2025-61932 in Motex LANSCOPE Endpoint Manager to execute commands with SYSTEM privileges.
              <span className="meta">Target: internet-facing enterprise management software</span>
            </div>
          </div>
          <div className="step">
            <div className="num">2</div>
            <div>
              <strong>Backdoor deployment</strong> — Deploys Gokcpdoor or Havoc through OAED Loader to establish command-and-control access.
              <span className="meta">Capability: encrypted tunneling and C2</span>
            </div>
          </div>
          <div className="step">
            <div className="num">3</div>
            <div>
              <strong>Discovery and movement</strong> — Uses goddi to obtain Active Directory information and Remote Desktop for manual post-compromise activity.
            </div>
          </div>
          <div className="step">
            <div className="num">4</div>
            <div>
              <strong>Collection</strong> — Archives collected files with 7-Zip in preparation for removal from the environment.
            </div>
          </div>
          <div className="step full warning">
            <div className="num">5</div>
            <div>
              <strong>Potential exfiltration</strong> — Accesses file.io, LimeWire, and Piping Server through web browsers. These services may support data transfer, but their precise order in the confirmed sequence is not established.
              <span className="meta">External services: file.io · LimeWire · Piping Server</span>
            </div>
          </div>
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
                <tr>
                  <td><code>38[.]54[.]56[.]57</code></td>
                  <td>C2</td>
                  <td>TCP · Gokcpdoor</td>
                </tr>
                <tr>
                  <td><code>38[.]54[.]88[.]172</code></td>
                  <td>C2</td>
                  <td>TCP · Havoc</td>
                </tr>
                <tr>
                  <td><code>file.io</code></td>
                  <td>Transfer service</td>
                  <td>HTTPS</td>
                </tr>
                <tr>
                  <td>LimeWire</td>
                  <td>Transfer service</td>
                  <td>HTTPS</td>
                </tr>
                <tr>
                  <td>Piping Server</td>
                  <td>Transfer service</td>
                  <td>HTTPS</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div className="title">
              <b>7</b>Capability set
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '34%' }}>Capability</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Gokcpdoor</strong></td>
                  <td>Backdoor and encrypted tunnel</td>
                </tr>
                <tr>
                  <td><strong>Havoc / OAED Loader</strong></td>
                  <td>C2 and payload delivery</td>
                </tr>
                <tr>
                  <td><strong>goddi</strong></td>
                  <td>Active Directory discovery</td>
                </tr>
                <tr>
                  <td><strong>Remote Desktop</strong></td>
                  <td>Manual remote operations</td>
                </tr>
                <tr>
                  <td><strong>7-Zip</strong></td>
                  <td>Archive collected information</td>
                </tr>
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
              <th style={{ width: '16%' }}>Tactic</th>
              <th style={{ width: '14%' }}>ID</th>
              <th style={{ width: '35%' }}>Technique</th>
              <th>Operational use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Initial Access</td>
              <td className="tid">T1566.001</td>
              <td><strong>Spearphishing Attachment</strong></td>
              <td>Uses malicious attachments as a historical access method.</td>
            </tr>
            <tr>
              <td>Execution</td>
              <td className="tid">T1059.001</td>
              <td><strong>PowerShell</strong></td>
              <td>Executes commands and scripts through PowerShell.</td>
            </tr>
            <tr>
              <td>Credential Access</td>
              <td className="tid">T1003.001</td>
              <td><strong>LSASS Memory</strong></td>
              <td>Targets credentials held in LSASS memory.</td>
            </tr>
            <tr>
              <td>Discovery</td>
              <td className="tid">T1018</td>
              <td><strong>Remote System Discovery</strong></td>
              <td>Identifies systems within compromised networks.</td>
            </tr>
            <tr>
              <td>Persistence</td>
              <td className="tid">T1053.002</td>
              <td><strong>At</strong></td>
              <td>Uses the At utility for scheduled execution.</td>
            </tr>
            <tr>
              <td>Persistence</td>
              <td className="tid">T1053.005</td>
              <td><strong>Scheduled Task</strong></td>
              <td>Creates scheduled tasks for continued execution.</td>
            </tr>
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
            <tr>
              <td><span className="tag">IP address</span></td>
              <td><code>38[.]54[.]56[.]57</code></td>
              <td>Gokcpdoor command and control</td>
              <td>2025</td>
            </tr>
            <tr>
              <td><span className="tag">IP address</span></td>
              <td><code>38[.]54[.]88[.]172</code></td>
              <td>Havoc command and control</td>
              <td>2025</td>
            </tr>
          </tbody>
        </table>

        <div className="callout">
          <strong>Analytic note:</strong> The actor’s current activity state is not established.
          “Unknown” is therefore more accurate than forcing an active or inactive classification from a mid-2025
          last-observed date.
        </div>

        <footer className="foot">
          <span>BRONZE BUTLER · Threat actor profile</span>
          <span>02 / 02</span>
        </footer>
      </section>
    </div>
  );
}
