import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { Home, blogsnewslist } from '../Routes/Routes';
import { RxDashboard } from "react-icons/rx";
import { HiOutlineNewspaper } from "react-icons/hi2";
import '../components/sidebars/Intelcardsidebar.scss';

const AdminSidebar = ({ collapsed }) => {
    const location = useLocation();

    return (
        <Sidebar collapsed={collapsed} className="intelcard-sidebar shadow-sm" style={{ borderRight: '1px solid #e0e0e0', width: collapsed ? '80px' : '270px' }} backgroundColor="#ffffff">
            <Menu
                className="sidebar-nav px-3"
                menuItemStyles={{
                    button: {
                        padding: '8px',
                        backgroundColor: 'transparent',
                        '&:hover': {
                            backgroundColor: 'transparent',
                        },
                    },
                }}
            >
                <MenuItem
                    component={<Link to={Home} />}
                    className={`nav-item threat-actor-item mb-2 ${location.pathname === Home ? 'active' : ''}`}
                    icon={
                        <div className="icon-wrapper d-flex align-items-center justify-content-center" style={{ color: '#e91e63' }}>
                            <RxDashboard size={18} />
                        </div>
                    }
                >
                    <span className="nav-label">Dashboard</span>
                </MenuItem>
                <MenuItem
                    component={<Link to={blogsnewslist} />}
                    className={`nav-item malware-item mb-2 ${location.pathname === blogsnewslist ? 'active' : ''}`}
                    icon={
                        <div className="icon-wrapper d-flex align-items-center justify-content-center" style={{ color: '#5200ff' }}>
                            <HiOutlineNewspaper size={18} />
                        </div>
                    }
                >
                    <span className="nav-label">Blogs and News</span>
                </MenuItem>
            </Menu>
        </Sidebar>
    );
};

export default AdminSidebar;
