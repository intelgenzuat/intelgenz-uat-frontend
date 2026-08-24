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

    return (
        <div className="top-reports-section">
            <h5 className="section-title">
                Top Reports <i className="bi bi-question-circle"></i>
            </h5>
            <div className="top-reports-card">
                <table className="top-reports-table">
                    <thead>
                        <tr>
                            <th>Report</th>
                            <th>Severity</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id} className="report-row">
                                <td>
                                    <div className="report-title">{report.title}</div>
                                    <div className="report-date">{report.date}</div>
                                </td>
                                <td>
                                    <span
                                        className={`severity-badge severity-${report.severity.toLowerCase()}`}
                                    >
                                        {report.severity}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button
                                        className="report-view-btn"
                                        title="View Report"
                                        onClick={() => navigate('/emerging-threats')}
                                    >
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
