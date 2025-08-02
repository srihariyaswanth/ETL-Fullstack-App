import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';


const DashboardCoordinator = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !['Coordinator', 'Admin'].includes(user.role)) {
    return <h3 style={{ padding: '20px' }}>Access Denied: You are not authorized to view this page.</h3>;
  }

  const [pmList, setPmList] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3000/pm')
      .then(res => setPmList(res.data))
      .catch(err => console.error('Failed to load PMs:', err));
  }, []);

  const handleVerify = async (pmId) => {
    try {
      await axios.put(`http://localhost:3000/pm/verify/${pmId}`, {
        verifiedBy: user._id
      });
      alert('PM verified');
      setPmList(pmList.map(pm => pm._id === pmId ? { ...pm, verifiedBy: user._id } : pm));
    } catch (err) {
      alert('Verification failed');
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>Coordinator: Verify Preventive Maintenance</h2>
          {pmList.filter(pm => !pm.verifiedBy).length === 0 ? (
            <p>No pending PMs to verify.</p>
          ) : (
            pmList.filter(pm => !pm.verifiedBy).map(pm => (
              <div key={pm._id} className="checkbox-item" style={{ marginBottom: '15px' }}>
                <p><strong>Asset:</strong> {pm.assetId.assetNumber}</p>
                <p><strong>Date:</strong> {pm.pmDate.split('T')[0]}</p>
                <p><strong>Engineer:</strong> {pm.engineerId.username}</p>
                <p><strong>Checklist:</strong> {
                  Object.entries(pm.checklist).map(([k, v]) => `${k}: ${v ? '✔️' : '❌'}`).join(', ')
                }</p>
                <button className="button-primary" onClick={() => handleVerify(pm._id)}>Mark as Verified</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCoordinator;
