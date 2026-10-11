import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/homepage/TopReports.scss';

export default function TopReports() {
    const navigate = useNavigate();
    const reports = [
        { id: 1, title: 'Q2 Threat Intel Report', date: 'Jun 04, 2026', severity: 'Critical' },
        { id: 2, title: 'AD Security Audit', date: 'May 28, 2026', severity: 'High' },
        { id: 3, title: 'Phishing Campaign Analysis', date: 'May 15, 2026', severity: 'Medium' },
        { id: 4, title: 'Zero-Day Vulnerability Report', date: 'Apr 30, 2026', severity: 'High' },
        { id: 5, title: 'Malicious Activity Report', date: 'Apr 30, 2026', severity: 'High' },
    ];

    const criticalCount = reports.filter((r) => r.severity === 'Critical').length;
    const highCount = reports.filter((r) => r.severity === 'High').length;
    const mediumCount = reports.filter((r) => r.severity === 'Medium').length;

    return (
        <div className="top-reports-section">
            <h5 className="section-title">
                Top Reports
             
            </h5>

            <div className="top-reports-card">
                {/* Header inside card: Severity Chips & Total Badge */}
                <div className="top-reports-header">
                    <div className="severity-chips">
                        {criticalCount > 0 && (
                            <span className="summary-chip chip-critical">
                                <span className="dot" />
                                {criticalCount} Critical
                            </span>
                        )}
                        {highCount > 0 && (
                            <span className="summary-chip chip-high">
                                <span className="dot" />
                                {highCount} High
                            </span>
                        )}
                        {mediumCount > 0 && (
                            <span className="summary-chip chip-medium">
                                <span className="dot" />
                                {mediumCount} Medium
                            </span>
                        )}
                    </div>
                    {/* <div className="total-badge">{reports.length} total</div> */}
                </div>

                {/* Reports List */}
                <div className="reports-list">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="report-item"
                            onClick={() => navigate('/emerging-threats')}
                        >
                            <div className="report-item-left">
                                <div className={`report-icon-box severity-${report.severity.toLowerCase()}`}>
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <line x1="10" y1="9" x2="8" y2="9" />
                                    </svg>
                                </div>
                                <div className="report-info">
                                    <h4 className="report-name">{report.title}</h4>
                                    <span className="report-date">{report.date}</span>
                                </div>
                            </div>

                            <div className="report-item-right">
                                <span className={`severity-pill severity-${report.severity.toLowerCase()}`}>
                                    {report.severity}
                                </span>
                                <button
                                    type="button"
                                    className="action-link-btn"
                                    title="View report details"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate('/emerging-threats');
                                    }}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Action Button */}
                <button
                    type="button"
                    className="view-all-reports-btn"
                    onClick={() => navigate('/emerging-threats')}
                >
                    <span>View all reports</span>
                    <span className="arrow-icon">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
}
