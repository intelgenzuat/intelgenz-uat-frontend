import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dropdown } from 'antd';
import './MenuOptionsHeader.scss';

const menuOptions = [
    {
        key: 'emerging-threat-dashboard',
        title: 'Emerging Threat Dashboard',
        subtitle: 'Stay ahead of emerging threats & active feeds',
        path: '/emerging-threats',
        iconClass: 'bi bi-radar',
        gradientClass: 'gradient-threat-dashboard',
    },
    {
        key: 'Intelcard',
        title: 'Intelcard',
        subtitle: 'Threat entity relationships & visual graph',
        path: '/intel-card',
        iconClass: 'bi bi-diagram-3-fill',
        gradientClass: 'gradient-knowledge-graph',
    },
    {
        key: 'Defense Convergence',
        title: 'Defense Convergence',
        subtitle: 'Adversary tactics, techniques & mitigation matrix',
        path: '/mitigation-ttp-view',
        iconClass: 'bi bi-shield-check',
        gradientClass: 'gradient-ttp-mitigation',
    },
    {
        key: 'Adversary Triage',
        title: 'Adversary Triage',
        subtitle: 'Adversary triage, attribution & threat actors',
        path: '/threat-actor-profiling',
        iconClass: 'bi bi-person-badge-fill',
        gradientClass: 'gradient-actor-profiling',
    },
];

const MenuOptionsHeader = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleItemClick = (path) => {
        setOpen(false);
        navigate(path);
    };

    const dropdownMenu = (
        <div className="menu-options-dropdown-container">

            <div className="menu-options-grid">
                {menuOptions.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.key}
                            className={`menu-option-card ${isActive ? 'active' : ''}`}
                            onClick={() => handleItemClick(item.path)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleItemClick(item.path);
                                }
                            }}
                        >
                            <div className={`menu-icon-box ${item.gradientClass}`}>
                                <i className={item.iconClass}></i>
                            </div>
                            <div className="menu-text-content">
                                <span className="option-title">{item.title}</span>
                                <p className="option-subtitle mb-0">{item.subtitle}</p>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <Dropdown
            open={open}
            onOpenChange={(visible) => setOpen(visible)}
            dropdownRender={() => dropdownMenu}
            trigger={['click']}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            overlayClassName="menu-options-header-dropdown-overlay"
        >
            <button
                className={`nav-icon-btn ${open ? 'active' : ''}`}
                type="button"
                title="Threat Intelligence Options"
                aria-label="Threat Intelligence Options"
            >
                <i className="bi bi-grid-3x3-gap"></i>
            </button>
        </Dropdown>
    );
};

export default MenuOptionsHeader;
