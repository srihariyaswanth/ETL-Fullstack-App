import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const PMEngineer = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [checklist, setChecklist] = useState({
    voltage: false,
    osCheck: false,
    antivirus: false,
    printerClean: false,
    testPrint: false,
    junkFiles: false,
    monitorCheck: false
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost:3000/assets')
      .then(res => setAssets(res.data))
      .catch(err => console.error('Error loading assets:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssetId) return alert('Please select an asset.');

    try {
      await axios.post('http://localhost:3000/pm', {
        assetId: selectedAssetId,
        engineerId: user._id,
        checklist
      });
      alert('PM Report submitted successfully!');
      setSelectedAssetId('');
      setChecklist({
        voltage: false,
        osCheck: false,
        antivirus: false,
        printerClean: false,
        testPrint: false,
        junkFiles: false,
        monitorCheck: false
      });
    } catch (err) {
      alert('Failed to submit PM report');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>Preventive Maintenance Form</h2>
          <form onSubmit={handleSubmit}>
            <label><strong>Select Asset:</strong></label><br />
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              required
              className="select-field"
            >
              <option value="">Select Asset</option>
              {assets.map(asset => (
                <option key={asset._id} value={asset._id}>{asset.assetNumber}</option>
              ))}
            </select>

            <h4><strong>Checklist:</strong></h4>
            <div className="checkbox-grid">
              {Object.entries(checklist).map(([key, value]) => (
                <label key={key} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })}
                  /> {key}
                </label>
              ))}
            </div>

            <button type="submit" className="button-primary">Submit PM</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PMEngineer