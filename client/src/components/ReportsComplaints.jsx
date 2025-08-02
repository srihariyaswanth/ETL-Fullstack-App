// src/components/ReportsComplaints.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const ReportsComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/complaints')
      .then(res => {
        setComplaints(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error('Failed to load complaints', err));
  }, []);

  useEffect(() => {
    let data = [...complaints];

    if (categoryFilter) {
      data = data.filter(c => c.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
    }

    if (statusFilter) {
      data = data.filter(c => c.status === statusFilter);
    }

    if (dateFrom) {
      data = data.filter(c => new Date(c.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      data = data.filter(c => new Date(c.date) <= new Date(dateTo));
    }

    setFiltered(data);
  }, [categoryFilter, statusFilter, dateFrom, dateTo, complaints]);

  const exportCSV = () => {
    const headers = ['Complaint ID', 'Date', 'User', 'Asset', 'Category', 'Status', 'Description'];
    const rows = filtered.map(c => [
      c.complaintId,
      c.date?.split('T')[0],
      c.userId?.username,
      c.assetId?.assetNumber,
      c.category,
      c.status,
      c.description?.replace(/[\r\n]+/g, ' ')
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(val => `"${val || ''}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'complaints_report.csv';
    link.click();
  };

  const handleCloseComplaint = async (complaintId) => {
    try {
      await axios.put(`http://localhost:3000/complaints/close/${complaintId}`, {
        closedBy: user._id
      });
      alert('Complaint closed successfully');
      const updated = complaints.map(c =>
        c._id === complaintId ? { ...c, status: 'Closed' } : c
      );
      setComplaints(updated);
    } catch (err) {
      alert('Failed to close complaint');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>Complaint Reports</h2>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <input type="text" placeholder="Category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            <button className="button-primary" onClick={exportCSV}>Export CSV</button>
          </div>

          {filtered.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <table className="pm-report-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Asset</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Description</th>
                  {['Incharge', 'Coordinator', 'Admin'].includes(user?.role) && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c._id}>
                    <td>{c.complaintId}</td>
                    <td>{c.date?.split('T')[0]}</td>
                    <td>{c.userId?.username}</td>
                    <td>{c.assetId?.assetNumber}</td>
                    <td>{c.category}</td>
                    <td>{c.status}</td>
                    <td>{c.description}</td>
                    {['Incharge', 'Coordinator', 'Admin'].includes(user?.role) && (
                      <td>
                        {c.status !== 'Closed' && (
                          <button className="button-primary" onClick={() => handleCloseComplaint(c._id)}>Close</button>
                        )}
                      </td>
                    )}
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

export default ReportsComplaints;
