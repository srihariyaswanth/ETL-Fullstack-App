import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const ComplaintSearch = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchId, setSearchId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user || !['Incharge', 'Coordinator', 'Admin'].includes(user.role)) {
    return (
      <h3 style={{ padding: '20px' }}>
        Access Denied: You are not authorized to view this page.
      </h3>
    );
  }

  const handleSearch = async () => {
    if (!searchId) return;
    setComplaint(null);
    setError('');

    try {
      const res = await axios.get(`http://localhost:3000/complaints/${searchId}`);
      setComplaint(res.data);
    } catch (err) {
      setError('Complaint not found or invalid ID');
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>Search Complaint by ID</h2>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Enter Complaint ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ padding: '8px', width: '250px' }}
            />
            <button
              className="button-primary"
              style={{ marginLeft: '10px' }}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {complaint && (
            <div style={{ lineHeight: '1.6' }}>
              <p><strong>Complaint ID:</strong> {complaint.complaintId}</p>
              <p><strong>Date:</strong> {complaint.date?.split('T')[0]}</p>
              <p><strong>Status:</strong> {complaint.status}</p>
              <p><strong>User:</strong> {complaint.userId?.username}</p>
              <p><strong>Asset Number:</strong> {complaint.assetId?.assetNumber}</p>
              <p><strong>Category:</strong> {complaint.category}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p><strong>Feedback:</strong> {complaint.feedback || 'N/A'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintSearch;
