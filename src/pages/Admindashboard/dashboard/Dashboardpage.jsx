import React from 'react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { BsBuilding, BsEnvelopePaper, BsShieldCheck, BsArrowUpRight } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';

const chartData = [
  { name: 'Jan', value: 100 },
  { name: 'Feb', value: 200 },
  { name: 'Mar', value: 350 },
  { name: 'Apr', value: 450 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 650 },
  { name: 'Jul', value: 750 },
];

const Dashboardpage = () => {
  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
  
      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {/* Total Companies */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted fw-semibold mb-1" style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>TOTAL COMPANIES</p>
                <h3 className="fw-bold mb-3" style={{ fontSize: '28px' }}>1,284</h3>
                <p className="mb-0 text-success" style={{ fontSize: '13px', fontWeight: '500' }}>
                  <BsArrowUpRight className="me-1" strokeWidth={1} />
                  +12% <span className="text-muted fw-normal">this month</span>
                </p>
              </div>
              <div className="p-2 rounded bg-primary bg-opacity-10 text-primary">
                <BsBuilding size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted fw-semibold mb-1" style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>ACTIVE USERS</p>
                <h3 className="fw-bold mb-3" style={{ fontSize: '28px' }}>8,432</h3>
                <p className="mb-0 text-success" style={{ fontSize: '13px', fontWeight: '500' }}>
                  <BsArrowUpRight className="me-1" strokeWidth={1} />
                  +5% <span className="text-muted fw-normal">this month</span>
                </p>
              </div>
              <div className="p-2 rounded bg-primary bg-opacity-10 text-primary" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
                <FiUsers size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Enquiries */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted fw-semibold mb-1" style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>PENDING ENQUIRIES</p>
                <h3 className="fw-bold mb-3" style={{ fontSize: '28px' }}>42</h3>
                <p className="mb-0 text-danger" style={{ fontSize: '13px', fontWeight: '500' }}>
                  <span className="me-1 border border-danger rounded-circle d-inline-block" style={{ width: '12px', height: '12px', borderWidth: '2px !important' }}></span>
                  Needs attention
                </p>
              </div>
              <div className="p-2 rounded text-danger" style={{ backgroundColor: '#ffe4e6' }}>
                <BsEnvelopePaper size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <p className="text-muted fw-semibold mb-1" style={{ fontSize: '11px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>SYSTEM HEALTH</p>
                <h3 className="fw-bold mb-3" style={{ fontSize: '28px' }}>99.9%</h3>
                <p className="mb-0" style={{ fontSize: '13px', fontWeight: '500', color: '#16a34a' }}>
                  <BsShieldCheck className="me-1" />
                  All systems operational
                </p>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                <BsShieldCheck size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="row g-3 mb-4">
        {/* Chart */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ fontSize: '17px' }}>Company Growth</h5>
              <select className="form-select form-select-sm w-auto fw-semibold text-muted shadow-none border-light-subtle">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div style={{ height: '280px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <Tooltip cursor={{ stroke: '#f0f0f0', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fill="url(#growthGradient)" dot={false} activeDot={{ r: 6, fill: '#4f46e5' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
            <h5 className="fw-bold mb-4" style={{ fontSize: '17px' }}>User Distribution</h5>
            <div className="d-flex justify-content-center align-items-center mb-4 position-relative" style={{ height: '220px' }}>
              {/* Pseudo-chart graphic representing the frame in the screenshot */}
              <div className="position-absolute" style={{ 
                width: '160px', 
                height: '160px', 
                border: '14px solid #e0e7ff', 
                borderRadius: '16px',
                borderLeftColor: '#4338ca',
                borderBottomColor: '#4338ca',
                borderTopColor: '#e0e7ff',
                borderRightColor: '#e0e7ff',
                transform: 'rotate(-45deg)',
                boxShadow: 'inset 0 0 0 4px #fff'
               }}></div>
               <div className="text-center z-1 bg-white p-3 px-4 rounded">
                  <h3 className="fw-bold mb-0" style={{ fontSize: '28px', color: '#0f172a' }}>8.4k</h3>
                  <small className="text-muted fw-semibold" style={{ fontSize: '12px' }}>Total Users</small>
               </div>
               {/* Green decorative tape */}
               <div className="position-absolute z-2" style={{
                  top: '15%',
                  left: '35%',
                  width: '45px',
                  height: '12px',
                  backgroundColor: '#166534',
                  transform: 'rotate(45deg)',
                  borderRadius: '2px'
               }}></div>
            </div>
            
            <div className="mt-auto">
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <div className="d-flex align-items-center">
                  <span className="rounded-circle d-inline-block me-3" style={{ width: '10px', height: '10px', backgroundColor: '#4338ca' }}></span>
                  <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>Enterprise</span>
                </div>
                <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>65%</span>
              </div>
              <div className="d-flex justify-content-between mb-3 align-items-center">
                <div className="d-flex align-items-center">
                  <span className="rounded-circle d-inline-block me-3" style={{ width: '10px', height: '10px', backgroundColor: '#15803d' }}></span>
                  <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>Business</span>
                </div>
                <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>25%</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <span className="rounded-circle d-inline-block me-3" style={{ width: '10px', height: '10px', backgroundColor: '#e0e7ff' }}></span>
                  <span className="text-muted fw-medium" style={{ fontSize: '14px' }}>Startup</span>
                </div>
                <span className="fw-semibold text-dark" style={{ fontSize: '14px' }}>10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Row */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0" style={{ fontSize: '17px' }}>Recent Notification Enquiries</h5>
          <button className="btn btn-sm fw-semibold px-3 py-1" style={{ backgroundColor: '#e0e7ff', color: '#4338ca', fontSize: '13px' }}>View All</button>
        </div>
        <div className="table-responsive">
          <table className="table table-borderless align-middle mb-0">
            <thead>
              <tr className="border-bottom">
                <th className="fw-semibold py-3 text-muted" style={{ fontSize: '13px' }}>Company Name</th>
                <th className="fw-semibold py-3 text-muted" style={{ fontSize: '13px' }}>Type</th>
                <th className="fw-semibold py-3 text-muted" style={{ fontSize: '13px' }}>Date</th>
                <th className="fw-semibold py-3 text-muted" style={{ fontSize: '13px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 fw-medium text-dark" style={{ fontSize: '14px' }}>Acme Corp</td>
                <td className="py-3 text-muted" style={{ fontSize: '14px' }}>Support</td>
                <td className="py-3 text-muted" style={{ fontSize: '14px' }}>Oct 24, 2023</td>
                <td className="py-3">
                  <span className="badge rounded-pill fw-medium" style={{ backgroundColor: '#ffe4e6', color: '#e11d48', fontSize: '12px', padding: '6px 12px' }}>Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboardpage;
