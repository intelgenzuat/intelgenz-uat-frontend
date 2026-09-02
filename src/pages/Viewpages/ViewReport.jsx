import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { PiWarningDiamondLight } from 'react-icons/pi';
import '../../assets/styles/view/ViewReport.scss'
import { LiaDownloadSolid } from 'react-icons/lia';
import FloatingChatButtons from '../../components/Buttons/FloatingChatButtons';
import IntelegenzChatSidebar from '../../components/IntelegenzChatSidebar';
import VoiceChatSidebar from '../../components/VoiceChatSidebar';

const overviewData = [
  { id: 1, label: "Published Date", value: "03 July 2025" },
  { id: 2, label: "Threat Summary", value: "A new report highlights how artificial intelligence is transforming both malware development and antivirus defenses. Malware authors are leveraging new frameworks, languages, and obfuscation methods, while defenders use AI to automate malware unpacking, string deobfuscation, and code analysis. Recent samples across Linux, Android, and ransomware families exemplify this ongoing arms race. The adoption of AI by both sides is increasing the sophistication and speed of cyber threats and defenses." },
  { id: 3, label: "Threat Type", value: "Malware" },
  { id: 4, label: "Threat Group Name", value: "Unknown" },
  { id: 5, label: "Malware Name", value: "Linux/Ladvix.E, Linux/Promitei.B, Adware/SpyLoan!Android, Linux/Filecoder.BR!tr" },
  { id: 6, label: "Target Sector", value: "Target Sector Enterprise environments, FinTech, Government, Healthcare, IT, Manufacturing, Telecom" },
  { id: 7, label: "Target Region", value: "Global" },
  { id: 8, label: "Severity Level", value: "High", badge: true },
  { id: 9, label: "Affected Platforms", value: "Linux, Android" },
  { id: 10, label: "Targeted Sector Elaborated", value: "Technology & Telecom, Finance (cryptocurrency mining, fraud), Government & Enterprises" },
  { id: 11, label: "Impacted Users", value: "Unknown" },
  {
    id: 12, label: "Infection Chain", value: (
      <ul className="mb-0 ps-3">
        <li>Malware authors develop new malware using advanced frameworks (Flutter, Rust, Delphi) and pack or obfuscate the payload.</li>
        <li>Malware is delivered to and executed on the target system (Linux or Android).</li>
        <li>Packing/unpacking routines attempt to conceal the actual malicious payload.</li>
        <li>Upon execution, the malware performs intended actions (e.g., ransomware encryption, spyware</li>
      </ul>
    )
  },
  {
    id: 13, label: "Technical Details", value: (
      <div className="position-relative">
        <div className="text-center w-100 position-absolute dot-wrapper">
          <span className="text-danger detail-dot">●</span>
        </div>
        <span>Widespread packing/obfuscation. AI tools can automate unpacking but struggle with complex packers/new frameworks (Flutter, Rust). Delphi malware yields readable code. Linux/Ladvix.E showed obfuscation; Android/SpyLoan used Flutter. AI de-obfuscators revealed hardcoded path </span>
        <span className="badge bg-danger-subtle text-danger detail-badge">/etc/cron.hourly/0</span>
      </div>
    )
  },
  {
    id: 14, label: "TTP Details (MITRE)", value: (
      <>
        - Defense Evasion (T1027: Obfuscated Files/Information)<br />
        - Execution (T1059: Command and Scripting Interpreter)<br />
        - Credential Access (T1412: Access Sensitive Data in Local Storage)<br />
        - Impact (T1486: Data Encrypted for Impact)
      </>
    )
  },
  { id: 15, label: "Kill Chain Mapping", value: "Delivery → Exploitation → Installation → Command and Control → Actions on Objectives" },
  { id: 16, label: "CVE IDs", value: "03 July 2025" },
  {
    id: 17, label: "IOCs", value: (
      <>
        <h6 className="ioc-hash-title">SHA256 Hashes:</h6>
        <p className="ioc-hash-content">
          943e1539d07eaffa4799661812c54bb67ea3f97c5609067688d70c87ab2f0ba4<br />
          cc7ab872ed9c25d4346b4c58c5ef8ea48c2d7b256f20fe2f0912572208df5c1a<br />
          c65298b6cd5a1769c747a0c7fb589ffa12fdf832b64787283953eaa57b65bc1c<br />
          c08a752138a6f0b332dfec981f20ec414ad367b7384389e0c59466b8e10655ec<br />
          File Path: /etc/cron.hourly/0
        </p>
      </>
    )
  },
  {
    id: 18, label: "Detection & Mitigation", value: (
      <div className="detection-list">
        <div className="item">- Use AI-assisted malware analysis (unpacking, de-obfuscation).</div>
        <div className="item d-flex align-items-center gap-2">
          - Monitor for unexpected cron jobs <span className="badge bg-danger-subtle text-danger px-2 py-1">(e.g., /etc/cron.hourly/0).</span>
        </div>
        <div className="item">- Block and quarantine files matching known hashes.</div>
        <div className="item">- Watch for malware in uncommon frameworks (Flutter, Rust, Delphi).</div>
        <div className="item">- Apply least-privilege, app whitelisting.</div>
        <div className="item">- Keep AV/EDR updated.</div>
        <div className="item">- Use TI feeds for packed executables & obfuscated scripts.</div>
      </div>
    )
  },
  { id: 19, label: "Toolkits Used", value: "Unknown" },
  {
    id: 20, label: "Analyst Comments", value: (
      <div className="analyst-comments">
        The report highlights the evolving malware-arms race. AI gives defenders temporary advantages in unpacking/<br />
        reversing obfuscation, but attackers rapidly adopt complex frameworks. Monitoring unique IoCs like<br />
        <span className="badge bg-danger-subtle text-danger px-2 mt-2 mb-1 me-1">/etc/cron.hourly/0</span> and file hashes is critical.
      </div>
    )
  }
];

export default function ViewReport() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customized'); // Assuming we want to show active state on sidebar
  const [activeChatMode, setActiveChatMode] = useState('voice'); // 'voice' | 'text' | null

  useEffect(() => {
    if (activeTab === 'all') {
      navigate('/emerging-threats', { state: { tab: 'all' } });
    }
  }, [activeTab, navigate]);

  return (
    <div className="view-report-container container-fluid p-0 d-flex flex-column h-100 overflow-hidden">
      {/* Main Layout Wrapper */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Dashboard Main Content Wrapper */}
        <div className="d-flex flex-column flex-grow-1 overflow-y-auto report-content-wrapper p-3 p-md-4">

          {/* Top Header Section Card */}
          <div className="report-header mb-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-link text-decoration-none back-btn d-flex align-items-center gap-2 shadow-none border-0 p-0"
              >
                <FiArrowLeft /> Back
              </button>

              {/* Action Buttons */}
              <div className="action-buttons d-flex align-items-center gap-3">
                <button className="refresh-btn" title="Refresh">
                  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.26667 12.0282C4.53589 12.0282 3.85117 11.89 3.2125 11.6137C2.57383 11.3373 2.01694 10.9616 1.54183 10.4863C1.06661 10.0112 0.690833 9.45433 0.4145 8.81567C0.138167 8.177 0 7.49228 0 6.7615H0.866667C0.866667 7.97261 1.29722 9.00872 2.15833 9.86983C3.01944 10.7309 4.05556 11.1615 5.26667 11.1615C6.47778 11.1615 7.51389 10.7309 8.375 9.86983C9.23611 9.00872 9.66667 7.97261 9.66667 6.7615C9.66667 5.55039 9.23611 4.51428 8.375 3.65317C7.51389 2.79206 6.47561 2.3615 5.26017 2.3615H5.08967L5.96533 3.23717L5.34617 3.8435L3.43083 1.92183L5.359 0L5.97817 0.606333L5.073 1.49483H5.26667C5.99744 1.49483 6.68217 1.633 7.32083 1.90933C7.9595 2.18567 8.51639 2.56144 8.9915 3.03667C9.46672 3.51178 9.8425 4.06867 10.1188 4.70733C10.3952 5.346 10.5333 6.03072 10.5333 6.7615C10.5333 7.49228 10.3952 8.177 10.1188 8.81567C9.8425 9.45433 9.46672 10.0112 8.9915 10.4863C8.51639 10.9616 7.9595 11.3373 7.32083 11.6137C6.68217 11.89 5.99744 12.0282 5.26667 12.0282Z" fill="currentColor" />
                  </svg>
                </button>
                <button className="btn download-btn shadow-sm">
                  <LiaDownloadSolid className="me-2" /> Download Report
                </button>
              </div>
            </div>

            {/* Header Content Wrapper */}
            <div className="report-hero-content">
              <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
                <h1 className="hero-title mb-0">
                  Malware Name: <span className="hero-title-highlight">Linux/Ladvix.E, Linux...</span>
                </h1>
                <span className="badge severity-pill-hero">
                  <PiWarningDiamondLight className="me-1" /> High
                </span>
              </div>
              <p className="hero-subtitle mb-0">
                A new report highlights how artificial intelligence is transforming both malware development an...
              </p>
            </div>
          </div>

          {/* Bottom Area (Table and Chat Container) */}
          <div className="d-flex flex-column flex-grow-1 overflow-hidden report-details-section">
            <div className="d-flex flex-grow-1 gap-3 gap-md-4 overflow-hidden">
              {/* Plain Text Overview Report Container */}
              <div className="report-details-container bg-white d-flex flex-column w-100 overflow-hidden">
                <div className="overflow-y-auto flex-grow-1 custom-scrollbar p-4 p-md-5 report-plain-text-view">
                  
                  {/* Author Byline & Date Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4 report-byline">
                    <span className="byline-author">BY AUGUSTINE JOSEPH</span>
                    <span className="byline-date">JULY 01, 2026</span>
                  </div>

                  {/* Plain Text Key Metadata */}
                  <div className="report-plain-meta d-flex flex-column gap-2 mb-4">
                      <div className="meta-line">
                        <span className="meta-label">AFFECTED PLATFORMS:</span>
                        <span className="meta-value">MICROSOFT WINDOWS, LINUX, ANDROID</span>
                      </div>
                    <div className="meta-line">
                      <span className="meta-label">IMPACTED USERS:</span>
                      <span className="meta-value">MICROSOFT WINDOWS</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-label">IMPACT:</span>
                      <span className="meta-value">THE STOLEN INFORMATION CAN BE USED FOR FUTURE ATTACKS</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-label">SEVERITY LEVEL:</span>
                      <span className="meta-value">HIGH</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-label">THREAT TYPE:</span>
                      <span className="meta-value">MALWARE</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-label">THREAT GROUP NAME:</span>
                      <span className="meta-value">UNKNOWN</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-label">MALWARE NAME:</span>
                      <span className="meta-value">LINUX/LADVIX.E, LINUX/PROMITEI.B, ADWARE/SPYLOAN!ANDROID, LINUX/FILECODER.BR!TR</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-label">TARGET SECTOR:</span>
                      <span className="meta-value">ENTERPRISE ENVIRONMENTS, FINTECH, GOVERNMENT, HEALTHCARE, IT, MANUFACTURING, TELECOM</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-label">TARGET REGION:</span>
                      <span className="meta-value">GLOBAL</span>
                    </div>
                    <div className="meta-line">
                      <span className="meta-label">TARGETED SECTOR ELABORATED:</span>
                      <span className="meta-value">TECHNOLOGY & TELECOM, FINANCE (CRYPTOCURRENCY MINING, FRAUD), GOVERNMENT & ENTERPRISES</span>
                    </div>
                  </div>

                  {/* Narrative Text Paragraphs */}
                  <div className="report-plain-narrative mb-4">
                    <p className="narrative-paragraph mb-3">
                      IN MAY 2026, FORTIGUARD LABS IDENTIFIED AN ATTACK TARGETING USERS IN SPAIN AND PORTUGAL INVOLVING THE BANKING TROJAN OUSABAN. THIS MALWARE HAS BEEN ACTIVE IN BRAZIL AND IS SPREAD THROUGH AN MSI DOWNLOADER. THE MALICIOUS PAYLOAD INVOLVES A DLL FILE THAT IS RUN VIA DLL SIDE-LOADING OR PROCESS INJECTION.
                    </p>
                    <p className="narrative-paragraph mb-3">
                      A NEW REPORT HIGHLIGHTS HOW ARTIFICIAL INTELLIGENCE IS TRANSFORMING BOTH MALWARE DEVELOPMENT AND ANTIVIRUS DEFENSES. MALWARE AUTHORS ARE LEVERAGING NEW FRAMEWORKS, LANGUAGES, AND OBFUSCATION METHODS, WHILE DEFENDERS USE AI TO AUTOMATE MALWARE UNPACKING, STRING DEOBFUSCATION, AND CODE ANALYSIS. RECENT SAMPLES ACROSS LINUX, ANDROID, AND RANSOMWARE FAMILIES EXEMPLIFY THIS ONGOING ARMS RACE. THE ADOPTION OF AI BY BOTH SIDES IS INCREASING THE SOPHISTICATION AND SPEED OF CYBER THREATS AND DEFENSES.
                    </p>
                  </div>

                  {/* Deep Intelligence Sections in Plain Text */}
                  <div className="report-plain-sections d-flex flex-column gap-4">
                    
                    {/* Infection Chain */}
                    <div className="section-block">
                      <div className="section-label mb-2">INFECTION CHAIN:</div>
                      <ul className="section-list mb-0 ps-3">
                        <li>MALWARE AUTHORS DEVELOP NEW MALWARE USING ADVANCED FRAMEWORKS (FLUTTER, RUST, DELPHI) AND PACK OR OBFUSCATE THE PAYLOAD.</li>
                        <li>MALWARE IS DELIVERED TO AND EXECUTED ON THE TARGET SYSTEM (LINUX OR ANDROID).</li>
                        <li>PACKING/UNPACKING ROUTINES ATTEMPT TO CONCEAL THE ACTUAL MALICIOUS PAYLOAD.</li>
                        <li>UPON EXECUTION, THE MALWARE PERFORMS INTENDED ACTIONS (E.G., RANSOMWARE ENCRYPTION, SPYWARE).</li>
                      </ul>
                    </div>

                    {/* Technical Details */}
                    <div className="section-block">
                      <div className="section-label mb-2">TECHNICAL DETAILS:</div>
                      <p className="section-text mb-0">
                        WIDESPREAD PACKING/OBFUSCATION. AI TOOLS CAN AUTOMATE UNPACKING BUT STRUGGLE WITH COMPLEX PACKERS/NEW FRAMEWORKS (FLUTTER, RUST). DELPHI MALWARE YIELDS READABLE CODE. LINUX/LADVIX.E SHOWED OBFUSCATION; ANDROID/SPYLOAN USED FLUTTER. AI DE-OBFUSCATORS REVEALED HARDCODED PATH <span className="badge bg-danger-subtle text-danger px-2 py-1">/etc/cron.hourly/0</span>
                      </p>
                    </div>

                    {/* TTP Details */}
                    <div className="section-block">
                      <div className="section-label mb-2">TTP DETAILS (MITRE):</div>
                      <div className="section-text">
                        <div>- DEFENSE EVASION (T1027: OBFUSCATED FILES/INFORMATION)</div>
                        <div>- EXECUTION (T1059: COMMAND AND SCRIPTING INTERPRETER)</div>
                        <div>- CREDENTIAL ACCESS (T1412: ACCESS SENSITIVE DATA IN LOCAL STORAGE)</div>
                        <div>- IMPACT (T1486: DATA ENCRYPTED FOR IMPACT)</div>
                      </div>
                    </div>

                    {/* Kill Chain Mapping */}
                    <div className="section-block">
                      <div className="section-label mb-1">KILL CHAIN MAPPING:</div>
                      <div className="section-text">
                        DELIVERY → EXPLOITATION → INSTALLATION → COMMAND AND CONTROL → ACTIONS ON OBJECTIVES
                      </div>
                    </div>

                    {/* CVE IDs */}
                    <div className="section-block">
                      <div className="section-label mb-1">CVE IDS:</div>
                      <div className="section-text">CVE-2025-4128, CVE-2025-3912</div>
                    </div>

                    {/* IOCs */}
                    <div className="section-block">
                      <div className="section-label mb-2">IOCS:</div>
                      <div className="section-text">
                        <div className="fw-bold mb-1">SHA256 HASHES:</div>
                        <div className="font-monospace text-break" style={{ fontSize: '13px', lineHeight: '1.7' }}>
                          943e1539d07eaffa4799661812c54bb67ea3f97c5609067688d70c87ab2f0ba4<br />
                          cc7ab872ed9c25d4346b4c58c5ef8ea48c2d7b256f20fe2f0912572208df5c1a<br />
                          c65298b6cd5a1769c747a0c7fb589ffa12fdf832b64787283953eaa57b65bc1c<br />
                          c08a752138a6f0b332dfec981f20ec414ad367b7384389e0c59466b8e10655ec
                        </div>
                        <div className="mt-1">FILE PATH: /etc/cron.hourly/0</div>
                      </div>
                    </div>

                    {/* Detection & Mitigation */}
                    <div className="section-block">
                      <div className="section-label mb-2">DETECTION & MITIGATION:</div>
                      <div className="section-text">
                        <div>- USE AI-ASSISTED MALWARE ANALYSIS (UNPACKING, DE-OBFUSCATION).</div>
                        <div>- MONITOR FOR UNEXPECTED CRON JOBS (E.G., /etc/cron.hourly/0).</div>
                        <div>- BLOCK AND QUARANTINE FILES MATCHING KNOWN HASHES.</div>
                        <div>- WATCH FOR MALWARE IN UNCOMMON FRAMEWORKS (FLUTTER, RUST, DELPHI).</div>
                        <div>- APPLY LEAST-PRIVILEGE, APP WHITELISTING.</div>
                        <div>- KEEP AV/EDR UPDATED.</div>
                        <div>- USE TI FEEDS FOR PACKED EXECUTABLES & OBFUSCATED SCRIPTS.</div>
                      </div>
                    </div>

                    {/* Toolkits Used */}
                    <div className="section-block">
                      <div className="section-label mb-1">TOOLKITS USED:</div>
                      <div className="section-text">UNKNOWN</div>
                    </div>

                    {/* Analyst Comments */}
                    <div className="section-block">
                      <div className="section-label mb-2">ANALYST COMMENTS:</div>
                      <div className="section-text">
                        THE REPORT HIGHLIGHTS THE EVOLVING MALWARE-ARMS RACE. AI GIVES DEFENDERS TEMPORARY ADVANTAGES IN UNPACKING/REVERSING OBFUSCATION, BUT ATTACKERS RAPIDLY ADOPT COMPLEX FRAMEWORKS. MONITORING UNIQUE IOCS LIKE /etc/cron.hourly/0 AND FILE HASHES IS CRITICAL.
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* Embedded Chat Sidebars */}
              {activeChatMode === 'text' && (
                <IntelegenzChatSidebar
                  onClose={() => setActiveChatMode(null)}
                  onEnableVoiceChat={() => setActiveChatMode('voice')}
                />
              )}
              {activeChatMode === 'voice' && (
                <VoiceChatSidebar
                  onClose={() => setActiveChatMode(null)}
                />
              )}

            </div>

          </div>



        </div>

        {/* Floating Chat Button (Bottom-Right) */}
        <FloatingChatButtons
          activeChatMode={activeChatMode}
          onIntelgenzOpen={() => setActiveChatMode('text')}
        />
      </div>

      {/* Custom Footer (Full Width at Bottom) */}
      <div className="report-footer">
        <div className="d-flex align-items-center gap-2">
          <div className="brand-subtext d-flex flex-column">
            <span>AI-Driven Cyber Intelligence</span>
          </div>
        </div>

        <div className="footer-links">
          <a href="#">Data Usage <i className="bi bi-box-arrow-up-right"></i></a>
          <a href="#">Privacy <i className="bi bi-box-arrow-up-right"></i></a>
          <a href="#">Support <i className="bi bi-box-arrow-up-right"></i></a>
        </div>

        <div className="copyright">
          &copy; 2024 Threai all rights reserved
        </div>
      </div>

    </div>
  );
}
