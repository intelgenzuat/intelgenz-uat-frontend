import React from 'react'
import { FiHome, FiArrowRight } from 'react-icons/fi';
import { PiBuildingOfficeDuotone, PiTreeViewDuotone } from 'react-icons/pi';
import { BsShieldFillExclamation } from 'react-icons/bs';
import '../../assets/styles/view/Topcontent.scss';
import { useNavigate } from 'react-router-dom';


const Topcontent = ({ showHeliosInfo = true, children }) => {
    const navigate = useNavigate();

    return (
        < div className="top-content-wrapper flex-shrink-0" >

            {/* Breadcrumb */}
            < div className="breadcrumb-nav text-muted" >
                <FiHome className="home-icon" />
                <span onClick={() => navigate('/')} >Home</span>
                <span className="mx-2 text-black-50">/</span>
                <span className="text-dark">Emerging Threats</span>
            </div >

            {/* Top Header specific to View Page */}
            < div className="view-top-header d-flex justify-content-between align-items-center" >
                <div className="d-flex align-items-center gap-3">
                    <div className="header-icon-wrapper rounded-3 d-flex align-items-center justify-content-center">
                        <BsShieldFillExclamation />
                    </div>
                    <h2 className="mb-0 d-flex align-items-center">
                        <span className="header-title gradient-text pe-3">Emerging Threat Reports</span>
                        {/* <span className="header-subtitle ps-3 d-none d-md-inline">Stay ahead of emerging threats</span> */}
                    </h2>
                </div>
                {children}
            </div >

        </div >
    )
}

export default Topcontent