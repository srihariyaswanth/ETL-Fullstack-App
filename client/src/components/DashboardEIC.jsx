import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const DashboardEIC = () => {
   const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !['EIC', 'Admin'].includes(user.role)) {
    return <h3 style={{ padding: '20px' }}>Access Denied: You are not authorized to view this page.</h3>;
  }
  const [pmList, setPmList] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/pm')
      .then(res => setPmList(res.data))
      .catch(err => console.error('Error loading PMs:', err));
  }, []);

  const markBillingReady = async (pmId) => {
    try {
      await axios.put(`http://localhost:3000/pm/billing/${pmId}`);
      alert('Marked as billing ready!');
      setPmList(pmList.map(pm => pm._id === pmId ? { ...pm, billingReady: true } : pm));
    } catch (err) {
      alert('Failed to mark as billing ready');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>EIC: Mark PMs for Billing</h2>
          {pmList.filter(pm => pm.approved && !pm.billingReady).length === 0 ? (
            <p>No PMs pending billing mark.</p>
          ) : (
            pmList.filter(pm => pm.approved && !pm.billingReady).map(pm => (
              <div key={pm._id} className="checkbox-item" style={{ marginBottom: '15px' }}>
                <p><strong>Asset:</strong> {pm.assetId.assetNumber}</p>
                <p><strong>Date:</strong> {pm.pmDate.split('T')[0]}</p>
                <p><strong>Checklist:</strong> {
                  Object.entries(pm.checklist).map(([k, v]) => `${k}: ${v ? '✔️' : '❌'}`).join(', ')
                }</p>
                <button className="button-primary" onClick={() => markBillingReady(pm._id)}>Mark as Billing Ready</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardEIC;