import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { PiBuildingOfficeDuotone, PiTreeViewDuotone } from 'react-icons/pi';
import './HeliosInfoSection.scss';

const HeliosInfoSection = () => {
    return (
        <div className="helios-info-section d-flex justify-content-between align-items-center flex-wrap">
            <div className="d-flex align-items-center text-secondary flex-wrap">
                <div className="helios-logo-wrapper text-white d-flex align-items-center justify-content-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.8573 0C5.7291 0 4.64715 0.437238 3.84941 1.21553L0 4.97102V6.69004C0 7.90453 0.53472 8.99716 1.387 9.75609C0.53472 10.515 0 11.6077 0 12.8221V14.5412L3.84941 18.2967C4.64715 19.075 5.7291 19.5122 6.8573 19.5122C8.10215 19.5122 9.2221 18.9905 10 18.159C10.7779 18.9905 11.8979 19.5122 13.1427 19.5122C14.2709 19.5122 15.3528 19.075 16.1506 18.2967L20 14.5412V12.8221C20 11.6077 19.4653 10.515 18.613 9.75609C19.4653 8.99716 20 7.90453 20 6.69004V4.97102L16.1506 1.21553C15.3528 0.437238 14.2709 0 13.1427 0C11.8979 0 10.7779 0.521676 10 1.35317C9.2221 0.521676 8.10215 0 6.8573 0ZM12.8794 9.75609C12.8315 9.71341 12.7844 9.66955 12.7383 9.62458L10 6.95307L7.2617 9.62458C7.2156 9.66955 7.16855 9.71341 7.1206 9.75609C7.16855 9.79877 7.2156 9.84263 7.2617 9.8876L10 12.5591L12.7383 9.8876C12.7844 9.84263 12.8315 9.79877 12.8794 9.75609ZM11.1111 14.5412V15.3621C11.1111 16.4568 12.0207 17.3442 13.1427 17.3442C13.6815 17.3442 14.1983 17.1354 14.5793 16.7637L17.7778 13.6431V12.8221C17.7778 11.7275 16.8682 10.8401 15.7462 10.8401C15.2074 10.8401 14.6906 11.0489 14.3097 11.4206L11.1111 14.5412ZM8.8889 14.5412L5.69035 11.4206C5.30935 11.0489 4.79262 10.8401 4.25381 10.8401C3.13179 10.8401 2.22222 11.7275 2.22222 12.8221V13.6431L5.42075 16.7637C5.80175 17.1354 6.3185 17.3442 6.8573 17.3442C7.9793 17.3442 8.8889 16.4568 8.8889 15.3621V14.5412ZM8.8889 4.15006V4.97102L5.69035 8.09155C5.30935 8.46326 4.79262 8.67209 4.25381 8.67209C3.13179 8.67209 2.22222 7.78468 2.22222 6.69004V5.86907L5.42075 2.74854C5.80175 2.37684 6.3185 2.16802 6.8573 2.16802C7.9793 2.16802 8.8889 3.05541 8.8889 4.15006ZM14.3097 8.09155L11.1111 4.97102V4.15006C11.1111 3.05541 12.0207 2.16802 13.1427 2.16802C13.6815 2.16802 14.1983 2.37684 14.5793 2.74854L17.7778 5.86907V6.69004C17.7778 7.78468 16.8682 8.67209 15.7462 8.67209C15.2074 8.67209 14.6906 8.46326 14.3097 8.09155Z" fill="white" />
                    </svg>
                </div>
                <strong className="helios-label ms-2 me-3">HELIOS AI :</strong>

                <span className="helios-detail-item d-flex align-items-center gap-2 flex-nowrap"><PiBuildingOfficeDuotone className="item-icon" /> FinTech</span>
                <span className="vertical-divider mx-3 border-start"></span>

                <span className="helios-detail-item d-flex align-items-center gap-2 flex-nowrap"><PiBuildingOfficeDuotone className="item-icon" /> B2B AI SaaS</span>
                <span className="vertical-divider mx-3 border-start"></span>

                <span className="helios-detail-item d-flex align-items-center gap-2 flex-nowrap"><i className="bi bi-globe item-icon"></i> US-based</span>
                <span className="vertical-divider mx-3 border-start"></span>

                <span className="helios-detail-item d-flex align-items-center gap-2 flex-nowrap"><PiTreeViewDuotone className="item-icon" /> Reviewed by: Security Admin</span>
            </div>
            <a href="#" className="more-details-link text-decoration-none d-flex align-items-center gap-1 flex-shrink-0 ms-auto">
                <FiArrowRight style={{ strokeWidth: '3px' }} /> More Details
            </a>
        </div>
    );
};

export default HeliosInfoSection;
