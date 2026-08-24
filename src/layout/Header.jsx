import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { SiGooglehome } from 'react-icons/si';
import { Dropdown } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdLockReset, MdLogout } from 'react-icons/md';
import LogOutSweetAlert from '../common/sweetalert/logoutSweetAlert';


const Header = ({ toggleSidebar, showHamburger }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [isSwal, setIsSwal] = useState({
    show: false,
    id: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  const logoutUser = () => {
    localStorage.removeItem("is_logged");
    navigate("/login");
  }

  const items = [
    // {
    //   key: '1',
    //   label: (
    //     <div className='profile-link'
    //       onClick={() => navigate('/profile', {
    //         state: {}
    //       })}
    //     >
    //       <RxAvatar className='profile-change-icons' />
    //       Profile
    //     </div>
    //   ),
    // },
    // {
    //   key: '2',
    //   label: (
    //     <Link className="profile-link text-decoration-none d-flex align-items-center gap-1" rel="noopener noreferrer" to='/profile'>
    //       <MdLockReset className='profile-change-icons' />
    //       Reset Password
    //     </Link>
    //   ),
    // },
    {
      key: '3',
      label: (
        <div onClick={() => { setIsSwal({ ...isSwal, show: true }) }} className='profile-link  d-flex align-items-center gap-1'>
          <MdLogout className='profile-change-icons' />
          Logout
        </div>
      ),
    },
  ];

  return (
    <>
      <nav className="top-navbar d-flex justify-content-between align-items-center">
        <div className="brand-logo d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            height={50}
            width={150}
            style={{
              objectFit: "contain",
              filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none',
              mixBlendMode: theme === 'dark' ? 'screen' : 'normal'
            }}
          />
          {showHamburger && (
            <button onClick={toggleSidebar} className="btn btn-link text-dark ms-3 p-0">
              <i className="bi bi-list fs-2"></i>
            </button>
          )}
        </div>
        <div className="d-flex align-items-center gap-3">
          <button className={`nav-icon-btn ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1.73563 13.1667C1.25354 13.1667 0.84375 12.9979 0.50625 12.6604C0.16875 12.3229 0 11.9131 0 11.431V6.39583C0 6.15431 0.0452082 5.92861 0.135625 5.71875C0.226042 5.50889 0.355556 5.31951 0.524167 5.15062L5.37188 0.490416C5.54493 0.322638 5.73618 0.198958 5.94563 0.119375C6.15507 0.0397913 6.36764 0 6.58333 0C6.79861 0 7.01118 0.039305 7.22104 0.117916C7.4309 0.196527 7.61951 0.320694 7.78688 0.490416L8.69063 1.37333L2.89583 7.04333V10.2708H10.2708V7.04333L7.37021 4.21312L9.50646 2.11063L12.6346 5.15062C12.8024 5.3184 12.933 5.50736 13.0265 5.7175C13.1199 5.92778 13.1667 6.15389 13.1667 6.39583V11.431C13.1667 11.9131 12.9972 12.3229 12.6581 12.6604C12.3191 12.9979 11.9074 13.1667 11.4231 13.1667H1.73563Z" fill="currentColor" />
            </svg>
          </button>
          <button className='nav-icon-btn'>
            <i className="bi bi-grid-3x3-gap"></i>
          </button>
          <button className="nav-icon-btn" onClick={toggleTheme}>
            <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`}></i>
          </button>
          <button className="nav-icon-btn"><i className="bi bi-question-circle"></i></button>
          <button className="nav-icon-btn"><i className="bi bi-bell"></i></button>
          <Dropdown
            menu={{
              items: [

                ...items,
              ],
            }}
            placement="bottomRight"
            arrow
            className="user-profile-details"
          >
            <div className="user-profile-btn ms-2">
              <div className="avatar-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                  alt="User"
                  className="avatar"
                />
                <div className="status-dot">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                </div>
              </div>
              <div className="user-info d-none d-md-flex">
                <span className="greeting">Welcome back</span>
                <span className="name">John Blackwell</span>
              </div>
              <i className="bi bi-chevron-down text-muted ms-3 d-none d-md-block"></i>
            </div>
          </Dropdown>
        </div>
      </nav>
      <LogOutSweetAlert logoutUser={logoutUser} isSwal={isSwal} setIsSwal={setIsSwal} />
    </>
  );
}
export default Header;