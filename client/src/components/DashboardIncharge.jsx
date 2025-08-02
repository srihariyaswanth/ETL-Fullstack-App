import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const DashboardIncharge = () => {
  const [pmList, setPmList] = useState([]);
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [assetDetails, setAssetDetails] = useState({});
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost:3000/pm')
      .then(res => setPmList(res.data))
      .catch(err => console.error('Error loading PMs:', err));

    axios.get('http://localhost:3000/assets')
      .then(res => setAssets(res.data))
      .catch(err => console.error('Error loading assets:', err));
  }, []);

  const handleApprove = async (pmId) => {
    try {
      await axios.put(`http://localhost:3000/pm/approve/${pmId}`, {
        approvedBy: user._id
      });
      alert('PM approved');
      setPmList(pmList.map(pm => pm._id === pmId ? { ...pm, approvedBy: user._id, approved: true } : pm));
    } catch (err) {
      alert('Approval failed');
      console.error(err);
    }
  };

  const handleAssetSelect = (assetId) => {
    const asset = assets.find(a => a._id === assetId);
    setSelectedAssetId(assetId);
    setAssetDetails(asset || {});
  };

  // const handleComplaintSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!selectedAssetId || !description || !category) {
  //     alert('All fields marked * are required.');
  //     return;
  //   }
  //   try {
  //     await axios.post('http://localhost:3000/complaints', {
  //       userId: user._id,
  //       assetId: selectedAssetId,
  //       description,
  //       category,
  //     });
  //     alert('Complaint submitted successfully!');
  //     setSelectedAssetId('');
  //     setAssetDetails({});
  //     setDescription('');
  //     setCategory('');
  //   } catch (err) {
  //     alert('Error submitting complaint');
  //     console.error(err);
  //   }
  // };
  const handleComplaintSubmit = async (e) => {
  e.preventDefault();
  if (!selectedAssetId || !description || !category) {
    alert('All fields marked * are required.');
    return;
  }
  try {
    const res = await axios.post('http://localhost:3000/complaints', {
      userId: user._id,
      assetId: selectedAssetId,
      description,
      category,
    });
    alert(`Complaint submitted successfully! ID: ${res.data.complaintId}`);
    // reset fields
  } catch (err) {
    alert('Error submitting complaint');
    console.error(err);
  }
};

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>Incharge: Approve Verified PMs</h2>
          {pmList.filter(pm => pm.verifiedBy && !pm.approved).length === 0 ? (
            <p>No PMs pending approval.</p>
          ) : (
            pmList.filter(pm => pm.verifiedBy && !pm.approved).map(pm => (
              <div key={pm._id} className="checkbox-item" style={{ marginBottom: '15px' }}>
                <p><strong>Asset:</strong> {pm.assetId.assetNumber}</p>
                <p><strong>Date:</strong> {pm.pmDate.split('T')[0]}</p>
                <p><strong>Checklist:</strong> {
                  Object.entries(pm.checklist).map(([k, v]) => `${k}: ${v ? '✔️' : '❌'}`).join(', ')
                }</p>
                <button className="button-primary" onClick={() => handleApprove(pm._id)}>Approve</button>
              </div>
            ))
          )}

          <hr style={{ margin: '30px 0' }} />
          <h2>Incharge: Submit Complaint</h2>
          <form onSubmit={handleComplaintSubmit}>
            <table style={{ width: '100%', borderSpacing: '10px' }}>
              <tbody>
                <tr>
                  <td><strong>Compl. Dt:</strong></td>
                  <td><input type="date" value={new Date().toISOString().split('T')[0]} readOnly /></td>
                  <td><strong>ETL Asset Number:</strong></td>
                  <td>
                    <select required value={selectedAssetId} onChange={(e) => handleAssetSelect(e.target.value)}>
                      <option value="">Select Asset</option>
                      {assets.map(asset => (
                        <option key={asset._id} value={asset._id}>{asset.assetNumber}</option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><strong>BOQ Item:</strong></td>
                  <td><input type="text" value={assetDetails.boqItem || ''} readOnly /></td>
                  <td><strong>BOQ Item Text:</strong></td>
                  <td><input type="text" value={assetDetails.equipmentType || ''} readOnly /></td>
                </tr>
                <tr>
                  <td><strong>Equip_Type:</strong></td>
                  <td><input type="text" value={assetDetails.equipmentType || ''} readOnly /></td>
                  <td><strong>Section:</strong></td>
                  <td><input type="text" value={assetDetails.department || ''} readOnly /></td>
                </tr>
                <tr>
                  <td><strong>Max Phone:</strong></td>
                  <td><input type="text" value="null" readOnly /></td>
                  <td><strong>Location:</strong></td>
                  <td><input type="text" value={assetDetails.location || ''} readOnly /></td>
                </tr>
                <tr>
                  <td><strong>Complaint Category: *</strong></td>
                  <td colSpan="3">
                    <select required value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%' }}>
                      <option value="">[Select Complaint Category]</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Software">Software</option>
                      <option value="Network">Network</option>
                      <option value="Monitor">Monitor</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td><strong>Complaint Description: *</strong></td>
                  <td colSpan="3">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      placeholder="[Select]"
                      rows="3"
                      style={{ width: '100%' }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <button type="submit" className="button-primary">Submit</button>
            <button type="reset" className="button-primary" style={{ marginLeft: '10px', backgroundColor: '#888' }} onClick={() => {
              setSelectedAssetId('');
              setAssetDetails({});
              setDescription('');
              setCategory('');
            }}>Reset</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardIncharge;
