import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import EmergingThreatHeader from './EmergingThreatHeader';
import EmergingThreatFooter from './EmergingThreatFooter';
import logo from '../../../assets/images/logo.png';
import gradientImg from '../../../assets/images/gradient.png';
import '../../../assets/styles/ReportPage/EmergingThreatReportpage.scss';
import { getThreatPulseDetailedReport } from '../../../Context/Threatpulse';
import Loader from '../../../components/helper/Loader';

const GRADIENT_GROUPS = [
    // Original (soft pink/lavender)
    ['#e2e7f7', '#faebf0', '#f6d2d9'],
    // Mint → Cyan → Lavender
    ['#CCFFEB', '#A6FCF6', '#C4B5F1'],
    // Warm sunset (peach → coral → rose)
    ['#E0A8EA', '#F9BFA0', '#FFEEAC'],
    // // Ocean breeze (sky → teal → deep blue)
    ['#FCCCCC', '#B6D7FB'],
    // // Golden hour (cream → amber → warm orange)
    ['#FFD8C2', '#D3FFED', '#FFCFE7'],
    // Northern lights (green → teal → purple)
    ['#FCE1E2', '#F6E5AB', '#C3F6F4'],
    ['#C6FEF8', '#E9B4', '#FFC3C4'],
];

export default function EmergingThreatReportpage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDetailedReport = (reportId, clientName) => {
        if (!reportId) return;
        setLoading(true);
        try {
            getThreatPulseDetailedReport({
                id: reportId,
                client_name: clientName || 'Meridian Financial Group',
            })((response) => {
                console.log(response, "detailed report res");
                if (response) {
                    setReportData(response?.data || response);
                }
                setLoading(false);
            });
        } catch (error) {
            console.error("Error calling getThreatPulseDetailedReport API:", error);
            setLoading(false);
        }
    };
    console.log(reportData, "DetailedreportData");

    useEffect(() => {
        const reportId = id || location.state?.report_id || location.state?.data?.report_id || location.state?.data?.id;
        const clientName = location.state?.client_name || location.state?.data?.client_name || 'Meridian Financial Group';
        fetchDetailedReport(reportId, clientName);
    }, [id, location.state]);

    // Pick a random gradient group once per mount
    const heroGradient = useMemo(() => {
        const group = GRADIENT_GROUPS[Math.floor(Math.random() * GRADIENT_GROUPS.length)];
        return `linear-gradient(to right, ${group[0]} 0%, ${group[1]} 50%, ${group[2]} 100%)`;
    }, []);

    const sections = useMemo(() => {
        return reportData?.sections || reportData?.data?.sections || reportData?.report?.sections || [];
    }, [reportData]);

    const impactSection = useMemo(() => {
        return sections?.find(s => s.type === 'impact_overview') || sections?.[0];
    }, [sections]);

    const title = reportData?.report?.title || reportData?.title || "Analysis of Ongoing Ousaban Attacks Targeting the Iberian Peninsula";
    const subtitle = reportData?.report?.subtitle || reportData?.subtitle || "Inside Ousaban's Geofenced Campaign Targeting Banking Users in Spain and Portugal";
    const rawAuthor = reportData?.report?.author || reportData?.author || "Unknown";
    const author = rawAuthor.toLowerCase().startsWith('by ') ? rawAuthor : `By ${rawAuthor}`;

    const date = useMemo(() => {
        if (reportData?.report?.activity_period?.start && reportData?.report?.activity_period?.end) {
            return `${reportData.report.activity_period.start} - ${reportData.report.activity_period.end}`;
        }
        if (reportData?.report?.activity_period?.start) {
            return reportData.report.activity_period.start;
        }
        return reportData?.publish_date || reportData?.date || "02/ March/ 2026";
    }, [reportData]);

    const affectedPlatform = useMemo(() => {
        if (impactSection?.affected_platforms && impactSection.affected_platforms.length > 0) {
            return impactSection.affected_platforms.join(', ');
        }
        return impactSection?.affected_platform || reportData?.affected_platform || "All Platforms";
    }, [impactSection, reportData]);

    const impactedUsers = useMemo(() => {
        if (impactSection?.impacted_users && impactSection.impacted_users.length > 0) {
            return impactSection.impacted_users.join(', ');
        }
        return reportData?.impacted_users || "Not Specified";
    }, [impactSection, reportData]);

    const impactedOverview = useMemo(() => {
        return impactSection?.impact || impactSection?.impact_overview || reportData?.impacted || "The stolen information can be used for future attacks";
    }, [impactSection, reportData]);

    const severity = useMemo(() => {
        return impactSection?.severity || reportData?.severity || "Not rated";
    }, [impactSection, reportData]);

    const affectedRegions = useMemo(() => {
        if (impactSection?.affected_regions && impactSection.affected_regions.length > 0) {
            return impactSection.affected_regions.join(', ');
        }
        return reportData?.affected_regions?.join(', ') || null;
    }, [impactSection, reportData]);

    const affectedCountries = useMemo(() => {
        if (impactSection?.affected_countries && impactSection.affected_countries.length > 0) {
            return impactSection.affected_countries.join(', ');
        }
        return reportData?.affected_countries?.join(', ') || null;
    }, [impactSection, reportData]);

    const affectedSectors = useMemo(() => {
        if (impactSection?.affected_sectors && impactSection.affected_sectors.length > 0) {
            return impactSection.affected_sectors.join(', ');
        }
        return reportData?.affected_sectors?.join(', ') || null;
    }, [impactSection, reportData]);

    const narrativeSections = useMemo(() => {
        return sections?.filter(s => s.type === 'narrative' || (s.content && s.title && s.type !== 'impact_overview')) || [];
    }, [sections]);

    const allReferences = useMemo(() => {
        const rootRefs = reportData?.references || reportData?.sources || [];
        const secRefs = narrativeSections.flatMap(s => s.references || []);
        return [...rootRefs, ...secRefs];
    }, [reportData, narrativeSections]);

    return (
        <div className="emerging-threat-page-container">
            {/* Custom Header */}
            <EmergingThreatHeader />

            {loading ? (
                <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1" style={{ minHeight: '60vh' }}>
                    <Loader text="Loading" />
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <section className="report-hero-section" style={{ background: heroGradient }}>
                        {/* Background Waves */}
                        <div className="hero-waves-container">
                            <img src={gradientImg} alt="Wave Background" className="hero-wave-img" />
                        </div>

                        {/* Large watermark logo on the right side */}
                        <div className="hero-watermark"></div>

                        <div className="hero-text-content">
                            <button
                                type="button"
                                className="hero-back-btn"
                                onClick={() => navigate(-1)}
                                title="Go back"
                            >
                                <FiArrowLeft className="back-icon" />
                                <span>Back</span>
                            </button>
                            <h1 className="hero-title">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="hero-subtitle">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Main Content Area */}
                    <section className="report-content-section">
                        <div className="content-max-width">
                            {/* Author & Date Row */}
                            <div className="author-date-row">
                                <p className="author-name">{author}</p>
                                <p className="publish-date">{date}</p>
                            </div>

                            {/* Metadata Pills */}
                            <div className="metadata-pills-container">
                                <div className="meta-pill">
                                    <div className="icon-circle-white">
                                        <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 18.2456V16.5869H23.4766V18.2456H0ZM3.23224 15.4811C2.67363 15.4811 2.20081 15.2876 1.81378 14.9006C1.42675 14.5136 1.23324 14.0407 1.23324 13.4821V1.999C1.23324 1.44039 1.42675 0.96757 1.81378 0.580542C2.20081 0.193514 2.67363 0 3.23224 0H20.2443C20.8029 0 21.2758 0.193514 21.6628 0.580542C22.0498 0.96757 22.2433 1.44039 22.2433 1.999V13.4821C22.2433 14.0407 22.0498 14.5136 21.6628 14.9006C21.2758 15.2876 20.8029 15.4811 20.2443 15.4811H3.23224ZM3.23224 13.8224H20.2443C20.3295 13.8224 20.4074 13.787 20.4782 13.7163C20.5492 13.6453 20.5846 13.5673 20.5846 13.4821V1.999C20.5846 1.91385 20.5492 1.8359 20.4782 1.76513C20.4074 1.69417 20.3295 1.65869 20.2443 1.65869H3.23224C3.14709 1.65869 3.06913 1.69417 2.99836 1.76513C2.92741 1.8359 2.89193 1.91385 2.89193 1.999V13.4821C2.92741 13.5673 2.92741 13.6453 2.99836 13.7163C3.06913 13.787 3.14709 13.8224 3.23224 13.8224Z" fill="#E9004A" />
                                        </svg>
                                    </div>
                                    <p className="pill-text">
                                        <span className="pill-label">Affected Platform: </span>
                                        {affectedPlatform}
                                    </p>
                                </div>

                                <div className="meta-pill">
                                    <div className="icon-circle-white">
                                        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.75 8.75C10.9591 8.75 12.75 6.95914 12.75 4.75C12.75 2.54086 10.9591 0.75 8.75 0.75C6.54086 0.75 4.75 2.54086 4.75 4.75C4.75 6.95914 6.54086 8.75 8.75 8.75Z" stroke="#E9004A" strokeWidth="1.5" />
                                            <path d="M16.748 16.75C16.7493 16.586 16.75 16.4193 16.75 16.25C16.75 13.765 13.168 11.75 8.75 11.75C4.332 11.75 0.75 13.765 0.75 16.25C0.75 18.735 0.75 20.75 8.75 20.75C10.981 20.75 12.59 20.593 13.75 20.313" stroke="#E9004A" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                    <p className="pill-text">
                                        <span className="pill-label">Impacted Users: </span>
                                        {impactedUsers}
                                    </p>
                                </div>

                                <div className="meta-pill">
                                    <div className="icon-circle-white">
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11 0C8.82441 0 6.69767 0.645139 4.88873 1.85383C3.07979 3.06253 1.66989 4.78049 0.83733 6.79048C0.00476613 8.80047 -0.213071 11.0122 0.211367 13.146C0.635804 15.2798 1.68345 17.2398 3.22183 18.7782C4.76021 20.3166 6.72022 21.3642 8.85401 21.7886C10.9878 22.2131 13.1995 21.9952 15.2095 21.1627C17.2195 20.3301 18.9375 18.9202 20.1462 17.1113C21.3549 15.3023 22 13.1756 22 11C21.9969 8.08356 20.837 5.28746 18.7748 3.22523C16.7125 1.16299 13.9164 0.00307981 11 0ZM20.3077 11C20.3086 12.1941 20.0788 13.3771 19.6308 14.484L14.9029 11.5764C14.7019 11.4524 14.477 11.372 14.2429 11.3406L11.8292 11.0148C11.4966 10.9714 11.1587 11.0272 10.8576 11.1751C10.5566 11.323 10.3059 11.5564 10.1369 11.8462H9.21462L8.8127 11.0148C8.70158 10.7833 8.53897 10.5803 8.3373 10.4214C8.13564 10.2624 7.90028 10.1517 7.64924 10.0978L6.80308 9.91481L7.6302 8.46154H9.3976C9.6836 8.46098 9.96482 8.38822 10.2152 8.25L11.5109 7.535C11.6247 7.47155 11.7311 7.39563 11.8282 7.30865L14.6744 4.73423C14.9598 4.47849 15.1495 4.13312 15.2121 3.7551C15.2748 3.37707 15.2068 2.98896 15.2068 2.98896L14.9812 2.58606C16.5738 3.34125 17.9197 4.53263 18.8625 6.02192C19.8053 7.51122 20.3064 9.23736 20.3077 11ZM12.6193 1.83404L13.5385 3.47981L10.6922 6.05423L9.3976 6.76923H7.6302C7.33271 6.76879 7.04037 6.84678 6.78263 6.99533C6.52489 7.14389 6.31086 7.35775 6.16212 7.61538L5.23875 9.22625L4.1652 6.36625L5.32231 3.63C6.34652 2.83863 7.52473 2.26991 8.78147 1.96028C10.0382 1.65065 11.3458 1.60693 12.6204 1.83192L12.6193 1.83404ZM1.69231 11C1.6909 9.61656 1.99955 8.25039 2.59558 7.00192L3.79501 10.2036C3.89496 10.4686 4.05986 10.7044 4.2746 10.8892C4.48933 11.074 4.74702 11.2019 5.02404 11.2613L7.29068 11.7488L7.69366 12.5865C7.83351 12.8714 8.05025 13.1116 8.31939 13.2798C8.58853 13.448 8.89935 13.5376 9.21674 13.5385H9.37327L8.60856 15.2551C8.47382 15.5574 8.43067 15.8925 8.48443 16.219C8.5382 16.5456 8.68653 16.8492 8.91106 17.0923L8.92587 17.1071L11 19.2437L10.7948 20.3013C8.36405 20.2448 6.05165 19.2405 4.35106 17.5027C2.65046 15.765 1.69635 13.4314 1.69231 11ZM12.5421 20.1787L12.6616 19.5641C12.7108 19.3031 12.6981 19.0341 12.6246 18.7788C12.5511 18.5235 12.4189 18.289 12.2386 18.0939C12.2334 18.0893 12.2284 18.0843 12.2238 18.0791L10.1539 15.9437L11.6029 12.6923L14.0165 13.0181L18.8523 15.9923C18.1517 17.0926 17.2281 18.0336 16.1412 18.7547C15.0543 19.4758 13.8282 19.9609 12.5421 20.1787Z" fill="#E9004A" />
                                        </svg>
                                    </div>
                                    <p className="pill-text">
                                        <span className="pill-label">Impacted: </span>
                                        {impactedOverview}
                                    </p>
                                </div>

                                <div className="meta-pill">
                                    <div className="icon-circle-white">
                                        <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.8103 10.7021V6.24292C9.8103 6.00639 9.90426 5.77954 10.0715 5.61229C10.2388 5.44504 10.4656 5.35107 10.7021 5.35107C10.9387 5.35107 11.1655 5.44504 11.3328 5.61229C11.5 5.77954 11.594 6.00639 11.594 6.24292V10.7021C11.594 10.9387 11.5 11.1655 11.3328 11.3328C11.1655 11.5 10.9387 11.594 10.7021 11.594C10.4656 11.594 10.2388 11.5 10.0715 11.3328C9.90426 11.1655 9.8103 10.9387 9.8103 10.7021ZM10.7021 16.0532C10.9667 16.0532 11.2254 15.9748 11.4454 15.8278C11.6654 15.6808 11.8368 15.4718 11.9381 15.2274C12.0393 14.9829 12.0658 14.714 12.0142 14.4545C11.9626 14.195 11.8352 13.9566 11.6481 13.7695C11.461 13.5824 11.2226 13.455 10.9631 13.4034C10.7036 13.3518 10.4347 13.3783 10.1902 13.4795C9.94576 13.5808 9.73683 13.7522 9.58983 13.9722C9.44284 14.1922 9.36438 14.4509 9.36438 14.7155C9.36438 15.0703 9.50532 15.4105 9.7562 15.6614C10.0071 15.9123 10.3473 16.0532 10.7021 16.0532ZM21.4043 1.78369V8.02661C21.4043 13.9039 18.5593 17.4657 16.1725 19.4188C13.6018 21.5214 11.0444 22.2359 10.9329 22.2649C10.7796 22.3066 10.618 22.3066 10.4647 22.2649C10.3532 22.2359 7.79919 21.5214 5.2251 19.4188C2.84499 17.4657 0 13.9039 0 8.02661V1.78369C0 1.31063 0.187924 0.856938 0.522431 0.522431C0.856938 0.187924 1.31063 0 1.78369 0H19.6206C20.0937 0 20.5474 0.187924 20.8819 0.522431C21.2164 0.856938 21.4043 1.31063 21.4043 1.78369ZM19.6206 1.78369H1.78369V8.02661C1.78369 12.1848 3.32435 15.5527 6.3622 18.0387C7.65566 19.0965 9.12454 19.9195 10.7021 20.4701C12.3007 19.9097 13.7879 19.0719 15.0956 17.9952C18.0978 15.5137 19.6206 12.1592 19.6206 8.02661V1.78369Z" fill="url(#paint0_linear_286_177)" fillOpacity="0.78" />
                                            <defs>
                                                <linearGradient id="paint0_linear_286_177" x1="10.7021" y1="0" x2="10.7021" y2="22.2962" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#E9004A" />
                                                    <stop offset="1" stopColor="#E9004A" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <p className="pill-text">
                                        <span className="pill-label">Severity Level: </span>
                                        {severity}
                                    </p>
                                </div>

                                <div className="meta-pill">
                                    <div className="icon-circle-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E9004A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                                            <line x1="8" y1="2" x2="8" y2="18"></line>
                                            <line x1="16" y1="6" x2="16" y2="22"></line>
                                        </svg>
                                    </div>
                                    <p className="pill-text">
                                        <span className="pill-label">Affected Regions: </span>
                                        {affectedRegions}
                                    </p>
                                </div>

                                <div className="meta-pill">
                                    <div className="icon-circle-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E9004A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                            <line x1="4" y1="22" x2="4" y2="15"></line>
                                        </svg>
                                    </div>
                                    <p className="pill-text">
                                        <span className="pill-label">Affected Countries: </span>
                                        {affectedCountries}
                                    </p>
                                </div>

                                <div className="meta-pill">
                                    <div className="icon-circle-white">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E9004A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                        </svg>
                                    </div>
                                    <p className="pill-text">
                                        <span className="pill-label">Affected Sectors: </span>
                                        {affectedSectors}
                                    </p>
                                </div>
                            </div>

                            {/* Report Narrative Content */}
                            <div className="report-narrative article">
                                {narrativeSections.map((sec, idx) => {
                                    const secTitle = (sec.title === 'Actor introduction' || sec.title?.toLowerCase().includes('actor')) && reportData?.actor?.name
                                        ? `About ${reportData.actor.name}`
                                        : sec.title;

                                    return (
                                        <section key={idx}>
                                            <h2>{secTitle}</h2>
                                            {Array.isArray(sec.content) ? (
                                                sec.content.map((para, pIdx) => (
                                                    <p key={pIdx}>{para}</p>
                                                ))
                                            ) : (
                                                <p>{sec.content}</p>
                                            )}
                                            {sec.references && sec.references.length > 0 && (
                                                <div className="citations">
                                                    {sec.references.map((ref, rIdx) => (
                                                        <a key={rIdx} href={ref.url || `#${ref}`} target="_blank" rel="noopener noreferrer">
                                                            [{typeof ref === 'string' ? ref : (ref.title || rIdx + 1)}]
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </section>
                                    );
                                })}

                                {allReferences.length > 0 && (
                                    <section>
                                        <h2>Sources</h2>
                                        <div>
                                            {allReferences.map((ref, rIdx) => (
                                                <p key={rIdx}>
                                                    [{rIdx + 1}] {typeof ref === 'string' ? ref : (ref.url ? <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title || ref.url}</a> : ref.title || JSON.stringify(ref))}
                                                </p>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Custom Footer */}
            <EmergingThreatFooter />
        </div>
    );
}
