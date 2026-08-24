import React from 'react';
import './Filter.scss';
import { PiMaskHappyLight, PiShieldWarning } from "react-icons/pi";
import { TbWorld } from "react-icons/tb";

export default function Filter() {
  return (
    <div className="filter-component p-3 w-100">
      <div className="row g-0 align-items-center">

        {/* Threat Actor Name Input (Left) */}
        <div className="col-md-4 border-end pe-4 filter-section">
          <div className="d-flex align-items-center mb-1 text-dark gap-2">
            <PiShieldWarning className="text-secondary" style={{ strokeWidth: '0.4px' }} />
            <span style={{ fontSize: '14.4px' }}>Name</span>
          </div>
          <input
            type="text"
            className="form-control border-0 bg-transparent px-0 shadow-none text-muted"
            placeholder="Enter threat actor/malware name"
            style={{ fontSize: '14.4px', outline: 'none' }}
          />
        </div>

        {/* Region Dropdown (Center) */}
        <div className="col-md-4 border-end px-4 filter-section">
          <div className="d-flex justify-content-between align-items-end">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-1 text-dark gap-2">
                <TbWorld className="text-secondary" />
                <span style={{ fontSize: '14.4px' }}>Region</span>
              </div>
              <input
                type="text"
                className="form-control border-0 bg-transparent px-0 shadow-none text-muted"
                placeholder="Enter or choose"
                style={{ fontSize: '14.4px', outline: 'none' }}
              />
            </div>
            <button className="btn btn-outline-light text-dark d-flex align-items-center gap-2 border rounded-pill px-3 py-1 flex-shrink-0" style={{ fontSize: '13.6px' }}>
              Choose <i className="bi bi-caret-down-fill" style={{ fontSize: '9.6px' }}></i>
            </button>
          </div>
        </div>

        {/* Threat Actor Name Dropdown (Right) */}
        <div className="col-md-4 px-4 filter-section">
          <div className="d-flex justify-content-between align-items-end">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center mb-1 text-dark gap-2">
                <PiMaskHappyLight className="text-secondary" />
                <span style={{ fontSize: '14.4px' }}>industry</span>
              </div>
              <input
                type="text"
                className="form-control border-0 bg-transparent px-0 shadow-none text-muted"
                placeholder="Enter or choose"
                style={{ fontSize: '14.4px', outline: 'none' }}
              />
            </div>
            <button className="btn btn-outline-light text-dark d-flex align-items-center gap-2 border rounded-pill px-3 py-1 flex-shrink-0" style={{ fontSize: '13.6px' }}>
              Choose <i className="bi bi-caret-down-fill" style={{ fontSize: '9.6px' }}></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
