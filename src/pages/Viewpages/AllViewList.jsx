import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/view/AllViewList.scss';
import { FiArrowRight } from 'react-icons/fi';
import { MdFilterList } from 'react-icons/md';

const listData = [
  {
    id: 1,
    malwareName: "Koske",
    targetSector: "Enterprise environments, FinTech, Government, Healthcare, IT, Manufacturing, Telecom",
    targetRegion: "Global",
    severity: "High",
    type: "Malware",
    group: "Linux/Ladvix.E, Linux/Promitei.B, Adware/SpyLoan!Android, Linux/Filecoder.BR!tr",
    title: "A new report highlights how artificial intelligence is transforming both malware development and anti..."
  },
  {
    id: 2,
    malwareName: "NordDragonScan",
    targetSector: "Critical Infrastructure, Government, IT, Telecom",
    targetRegion: "Global, Europe, North America",
    severity: "High",
    type: "Malware",
    group: "No specific threat group identified",
    title: "A new infostealer malware, NordDragonScan, is actively targeting Windows users by leveraging m..."
  },
  {
    id: 3,
    malwareName: "RondoDox",
    targetSector: "Any Organization",
    targetRegion: "Colombia",
    severity: "High",
    type: "Malware",
    group: "No specific threat group identified",
    title: "RondoDox is a newly identified botnet targeting Linux-based embedded systems through the exp..."
  },
  {
    id: 4,
    malwareName: "DCRAT",
    targetSector: "Education, FinTech, Healthcare, IT, SMB",
    targetRegion: "Middle East",
    severity: "High",
    type: "Malware",
    group: "No specific threat group identified",
    title: "A sophisticated phishing campaign is targeting Colombian entities using emails impersonating th..."
  },
  {
    id: 5,
    malwareName: "winos 4.0, HoldingHands RAT (Gh0stBins), Gh0stCringe",
    targetSector: "Critical Infrastructure",
    targetRegion: "Taiwan",
    severity: "High",
    type: "Malware",
    group: "Gh0stBins",
    title: "A new variant of the Havoc backdoor has been observed in a long-term attack against critical nat..."
  },
  {
    id: 6,
    malwareName: "FormBook",
    targetSector: "E-Commerce, FinTech, SMB",
    targetRegion: "Global",
    severity: "High",
    type: "Threat Group and Malware",
    group: "No specific threat group identified",
    title: "A critical phishing campaign is targeting Windows users with malicious Excel attachments that expl..."
  },
  {
    id: 7,
    malwareName: "FormBook",
    targetSector: "E-Commerce, FinTech, SMB",
    targetRegion: "Global",
    severity: "High",
    type: "Threat Group and Malware",
    group: "No specific threat group identified",
    title: "A critical phishing campaign is targeting Windows users with malicious Excel attachments that expl..."
  }
];

const severityColor = (level) => {
  if (level === 'High') return { bg: '#ef4444', text: '#fff' };
  if (level === 'Medium') return { bg: '#f59e0b', text: '#fff' };
  return { bg: '#22c55e', text: '#fff' };
};

export default function AllViewList({ selectedType }) {
  const navigate = useNavigate();

  const filteredList = listData.filter(item => {
    if (!selectedType || selectedType === 'All') return true;
    const lowerType = selectedType.toLowerCase();
    const itemType = (item.type || '').toLowerCase();
    const itemTitle = (item.title || '').toLowerCase();
    const itemGroup = (item.group || '').toLowerCase();

    if (lowerType === 'threat actor') {
      return itemType.includes('threat group') || (!itemGroup.includes('no specific threat group') && itemGroup !== '');
    }
    if (lowerType === 'malware') {
      return itemType.includes('malware');
    }
    if (lowerType === 'campaign') {
      return itemTitle.includes('campaign') || itemTitle.includes('targeting') || itemTitle.includes('phishing');
    }
    if (lowerType === 'situation') {
      return itemTitle.includes('highlights') || itemTitle.includes('identified') || itemTitle.includes('compromise');
    }
    if (lowerType === 'trends') {
      return itemTitle.includes('actively') || itemTitle.includes('new');
    }
    return true;
  });

  return (
    <div className="all-view-list bg-white rounded-3 shadow-sm border w-100">
      <div className="table-responsive-container">
        <table className="table table-bordered mb-0 align-middle" style={{ minWidth: '2070px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 3 }}>
            <tr>
              <th className="py-3 px-4 text-nowrap" style={{ color: '#0f172a', width: '120px', backgroundColor: '#eeeeeeff' }}>
                <MdFilterList className="me-2 filter-icon" style={{ color: '#6d28d9', fontSize: '19.2px', marginTop: '-2px' }} /> Date
              </th>
              <th className="py-3 px-4" style={{ color: '#0f172a', width: '650px', backgroundColor: '#f8fafc' }}>
                <MdFilterList className="me-2 filter-icon" style={{ color: '#6d28d9', fontSize: '19.2px', marginTop: '-2px' }} /> Title
              </th>
              <th className="py-3 px-4 text-nowrap" style={{ color: '#0f172a', width: '220px', backgroundColor: '#f8fafc' }}>
                <MdFilterList className="me-2 filter-icon" style={{ color: '#6d28d9', fontSize: '19.2px', marginTop: '-2px' }} /> Threat Type
              </th>
              <th className="py-3 px-4 text-nowrap" style={{ color: '#0f172a', width: '500px', backgroundColor: '#f8fafc' }}>
                <MdFilterList className="me-2 filter-icon" style={{ color: '#6d28d9', fontSize: '19.2px', marginTop: '-2px' }} /> Threat Group Name
              </th>
              <th className="py-3 px-4 text-nowrap" style={{ color: '#0f172a', width: '200px', backgroundColor: '#f8fafc' }}>
                <MdFilterList className="me-2 filter-icon" style={{ color: '#6d28d9', fontSize: '19.2px', marginTop: '-2px' }} /> Malware Name
              </th>
              <th className="py-3 px-4 text-nowrap" style={{ color: '#0f172a', width: '500px', backgroundColor: '#f8fafc' }}>
                <MdFilterList className="me-2 filter-icon" style={{ color: '#6d28d9', fontSize: '19.2px', marginTop: '-2px' }} /> Target Sector
              </th>
              <th className="py-3 px-4 text-nowrap" style={{ color: '#0f172a', width: '200px', backgroundColor: '#f8fafc' }}>
                <MdFilterList className="me-2 filter-icon" style={{ color: '#6d28d9', fontSize: '19.2px', marginTop: '-2px' }} /> Target Region
              </th>
              <th className="py-3 px-4 text-nowrap" style={{ color: '#0f172a', width: '110px', backgroundColor: '#f8fafc' }}>
                Severity
              </th>
              <th className="py-3 px-4 text-nowrap" style={{ color: '#0f172a', width: '260px', backgroundColor: '#f8fafc', position: 'sticky', right: 0, zIndex: 2, boxShadow: '-3px 0 6px rgba(0,0,0,0.08)' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-5 text-muted fw-medium" style={{ fontSize: '15px' }}>
                  No reports found for "{selectedType}"
                </td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr key={item.id}>
                <td className="px-4 py-3 text-center" style={{ background: "#eeeeeeff" }}>
                  <div className="d-inline-flex flex-column align-items-center justify-content-center bg-white border rounded" style={{ width: '60px', height: '64px', borderColor: '#e2e8f0' }}>
                    <span className="mb-0" style={{ fontSize: '10.4px', fontWeight: '700', color: '#64748b', letterSpacing: '0.5px' }}>JUL</span>
                    <span style={{ fontSize: '20.8px', fontWeight: '800', color: '#e11d48', lineHeight: '1' }}>03</span>
                    <span style={{ fontSize: '10.4px', fontWeight: '600', color: '#94a3b8' }}>2025</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="mb-0 text-dark" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    {item.title}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="badge rounded-pill text-dark px-3 py-2 border border-1" style={{ backgroundColor: '#fff', fontSize: '12px', borderColor: '#cfd8dc' }}>
                    {item.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="mb-0 text-dark" style={{ fontSize: '13.6px', lineHeight: '1.5' }}>
                    {item.group}
                  </p>
                </td>
                <td className="px-4 py-3">
                    <p className="mb-0" style={{ fontSize: '13.6px', color: '#1e293b' }}>
                    {item.malwareName}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="mb-0 text-dark" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                    {item.targetSector}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="badge rounded-pill text-dark px-3 py-2 border border-1" style={{ backgroundColor: '#fff', fontSize: '12px', borderColor: '#cfd8dc' }}>
                    {item.targetRegion}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: severityColor(item.severity).bg, color: severityColor(item.severity).text, fontSize: '12px', fontWeight: '700' }}>
                    {item.severity}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ position: 'sticky', right: 0, backgroundColor: '#fff', zIndex: 1, boxShadow: '-3px 0 6px rgba(0,0,0,0.08)' }}>
                  <button
                    onClick={() => navigate('/emerging-threat-report')}
                    className="btn rounded-pill d-flex justify-content-center align-items-center w-100 py-2 view-report-btn"
                    style={{ backgroundColor: '#5200ff', color: '#fff', fontSize: '13.6px', whiteSpace: 'nowrap' }}>
                    <FiArrowRight className="me-2" style={{ fontSize: '16px' }} /> View Report
                  </button>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
