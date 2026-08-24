import React from 'react'
import { FiHome } from 'react-icons/fi';
import { BsShieldFillExclamation } from 'react-icons/bs';
import '../../assets/styles/view/Topcontent.scss';
import { useNavigate, useLocation } from 'react-router-dom';

const IntelTopcontent = ({ showHeliosInfo = true, children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isMalware = location.pathname === '/intel-card-malware';
    const activeBreadcrumb = isMalware ? 'Malware' : 'Threat Actor';

    return (
        <div className="top-content-wrapper flex-shrink-0">
            {/* Breadcrumb */}
            <div className="breadcrumb-nav text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
                <FiHome className="home-icon me-2" />
                <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
                <span className="mx-2 text-black-50">/</span>
                <span onClick={() => navigate('/intel-card')} style={{ cursor: 'pointer' }}>Intel Card</span>
                <span className="mx-2 text-black-50">/</span>
                <span className="text-dark fw-medium">{activeBreadcrumb}</span>
            </div>

            {/* Top Header specific to View Page */}
            <div className="view-top-header d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <div className="header-icon-wrapper rounded-3 d-flex align-items-center justify-content-center subtle text-danger" style={{ width: '36px', height: '36px' }}>
                        <svg width="15" height="26" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.43627 16.4528C9.72418 16.4528 9.96554 16.3555 10.1604 16.1609C10.3552 15.9661 10.4526 15.7247 10.4526 15.4368C10.4526 15.1489 10.3552 14.9075 10.1604 14.7127C9.96554 14.5179 9.72418 14.4205 9.43627 14.4205C9.14836 14.4205 8.907 14.5179 8.7122 14.7127C8.51739 14.9075 8.41999 15.1489 8.41999 15.4368C8.41999 15.7247 8.51739 15.9661 8.7122 16.1609C8.907 16.3555 9.14836 16.4528 9.43627 16.4528ZM8.49265 12.1703H10.3799V6.09741H8.49265V12.1703ZM9.43627 23.8326C6.71506 23.0905 4.4621 21.4887 2.67739 19.0273C0.892462 16.5659 0 13.8141 0 10.7718V3.53263L9.43627 0L18.8725 3.53263V10.7718C18.8725 13.8141 17.9801 16.5659 16.1952 19.0273C14.4104 21.4887 12.1575 23.0905 9.43627 23.8326Z" fill="#E9004A" />
                        </svg>

                    </div>
                    <h2 className="mb-0 d-flex align-items-center">
                        <span className="header  pe-3" style={{ fontSize: '24px', fontWeight: '500', color: '1A1B1E' }}>Intel Card Dashboard</span>
                    </h2>
                </div>
                {children}
            </div>
        </div>
    )
}

export default IntelTopcontent