import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const ReportsPM = () => {
  const [pmReports, setPmReports] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter states
  const [engineerFilter, setEngineerFilter] = useState('');
  const [assetFilter, setAssetFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/pm')
      .then(res => {
        setPmReports(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error('Failed to load PM reports', err));
  }, []);

  // Filter logic
  useEffect(() => {
    let data = [...pmReports];

    if (engineerFilter) {
      data = data.filter(pm => pm.engineerId?.username?.toLowerCase().includes(engineerFilter.toLowerCase()));
    }

    if (assetFilter) {
      data = data.filter(pm => pm.assetId?.assetNumber?.toLowerCase().includes(assetFilter.toLowerCase()));
    }

    if (startDate) {
      data = data.filter(pm => new Date(pm.pmDate) >= new Date(startDate));
    }

    if (endDate) {
      data = data.filter(pm => new Date(pm.pmDate) <= new Date(endDate));
    }

    setFiltered(data);
  }, [engineerFilter, assetFilter, startDate, endDate, pmReports]);

  // CSV Export
  const exportCSV = () => {
    const headers = ['Date', 'Asset', 'Engineer', 'Status'];
    const rows = filtered.map(pm => [
      pm.pmDate?.split('T')[0],
      pm.assetId?.assetNumber,
      pm.engineerId?.username,
      pm.billingReady
        ? 'Billing Ready'
        : pm.approved
        ? 'Approved'
        : pm.verifiedBy
        ? 'Verified'
        : 'Submitted'
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(val => `"${val || ''}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'pm_reports.csv';
    link.click();
  };

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>Preventive Maintenance Reports</h2>

          {/* Filters */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Search by Engineer" value={engineerFilter} onChange={(e) => setEngineerFilter(e.target.value)} />
            <input type="text" placeholder="Search by Asset" value={assetFilter} onChange={(e) => setAssetFilter(e.target.value)} />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <button className="button-primary" onClick={exportCSV}>Export CSV</button>
          </div>

          {filtered.length === 0 ? (
            <p>No matching reports.</p>
          ) : (
            <table className="pm-report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset</th>
                  <th>Engineer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((pm) => (
                  <tr key={pm._id}>
                    <td>{pm.pmDate?.split('T')[0]}</td>
                    <td>{pm.assetId?.assetNumber}</td>
                    <td>{pm.engineerId?.username}</td>
                    <td>
                      {pm.billingReady
                        ? 'Billing Ready'
                        : pm.approved
                        ? 'Approved'
                        : pm.verifiedBy
                        ? 'Verified'
                        : 'Submitted'}
                    </td>
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

export default ReportsPM;
