import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const ReportsBilling = () => {
  const [billingReports, setBillingReports] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
if (!user || !['Incharge', 'ContractManager', 'Admin'].includes(user.role)) {
  return <h3 style={{ padding: '20px' }}>Access Denied: You are not authorized to view this page.</h3>;
}
  useEffect(() => {
    axios.get('http://localhost:3000/pm/billing')
      .then(res => setBillingReports(res.data))
      .catch(err => console.error('Failed to fetch billing reports', err));
  }, []);

  const exportCSV = () => {
    const headers = ['Date', 'Asset', 'Engineer'];
    const rows = billingReports.map(r => [
      r.pmDate?.split('T')[0],
      r.assetId?.assetNumber,
      r.engineerId?.username
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(val => `"${val || ''}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'billing_summary.csv';
    link.click();
  };

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>Billing Summary</h2>
          <button className="button-primary" onClick={exportCSV} style={{ marginBottom: '15px' }}>
            Export CSV
          </button>

          {billingReports.length === 0 ? (
            <p>No PMs marked for billing.</p>
          ) : (
            <table className="pm-report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset</th>
                  <th>Engineer</th>
                </tr>
              </thead>
              <tbody>
                {billingReports.map((r, i) => (
                  <tr key={i}>
                    <td>{r.pmDate?.split('T')[0]}</td>
                    <td>{r.assetId?.assetNumber}</td>
                    <td>{r.engineerId?.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsBilling;
