// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Sidebar from './Sidebar';
// import '../styles/Dashboard.css';



// const DashboardEngineer = () => {
//   const [assets, setAssets] = useState([]);
//   const [selectedAssetId, setSelectedAssetId] = useState('');
//   const [assetDetails, setAssetDetails] = useState({});
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const user = JSON.parse(localStorage.getItem('user'));
 

// if (!user || !['Engineer', 'Admin'].includes(user.role)) {
//   return <h3 style={{ padding: '20px' }}>Access Denied: You are not authorized to view this page.</h3>;
// }
//   useEffect(() => {
//     axios.get('http://localhost:3000/assets')
//       .then(res => setAssets(res.data))
//       .catch(err => console.error('Error loading assets:', err));
//   }, []);

//   const handleAssetSelect = (assetId) => {
//     const asset = assets.find(a => a._id === assetId);
//     setSelectedAssetId(assetId);
//     setAssetDetails(asset || {});
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedAssetId || !description || !category) {
//       alert('All fields marked * are required.');
//       return;
//     }

//     try {
//       await axios.post('http://localhost:3000/complaints', {
//         userId: user._id,
//         assetId: selectedAssetId,
//         description,
//         category,
//       });
//       alert('Complaint submitted successfully!');
//       setSelectedAssetId('');
//       setAssetDetails({});
//       setDescription('');
//       setCategory('');
//     } catch (err) {
//       alert('Error submitting complaint');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="dashboard-page">
//       <Sidebar onToggle={setIsCollapsed} />
//       <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
//         <div className="dashboard-card">
//           <h2>Complaints : Complaint Registration</h2>
//           <form onSubmit={handleSubmit}>
//             <table style={{ width: '100%', borderSpacing: '10px' }}>
//               <tbody>
//                 <tr>
//                   <td><strong>Compl. Dt:</strong></td>
//                   <td><input type="date" value={new Date().toISOString().split('T')[0]} readOnly /></td>
//                   <td><strong>ETL Asset Number:</strong></td>
//                   <td>
//                     <select required value={selectedAssetId} onChange={(e) => handleAssetSelect(e.target.value)}>
//                       <option value="">Select Asset</option>
//                       {assets.map(asset => (
//                         <option key={asset._id} value={asset._id}>{asset.assetNumber}</option>
//                       ))}
//                     </select>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><strong>BOQ Item:</strong></td>
//                   <td><input type="text" value={assetDetails.boqItem || ''} readOnly /></td>
//                   <td><strong>BOQ Item Text:</strong></td>
//                   <td><input type="text" value={assetDetails.equipmentType || ''} readOnly /></td>
//                 </tr>
//                 <tr>
//                   <td><strong>Equip_Type:</strong></td>
//                   <td><input type="text" value={assetDetails.equipmentType || ''} readOnly /></td>
//                   <td><strong>Section:</strong></td>
//                   <td><input type="text" value={assetDetails.department || ''} readOnly /></td>
//                 </tr>
//                 <tr>
//                   <td><strong>Max Phone:</strong></td>
//                   <td><input type="text" value="null" readOnly /></td>
//                   <td><strong>Location:</strong></td>
//                   <td><input type="text" value={assetDetails.location || ''} readOnly /></td>
//                 </tr>
//                 <tr>
//                   <td><strong>Complaint Category: *</strong></td>
//                   <td colSpan="3">
//                     <select required value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%' }}>
//                       <option value="">[Select Complaint Category]</option>
//                       <option value="Hardware">Hardware</option>
//                       <option value="Software">Software</option>
//                       <option value="Network">Network</option>
//                       <option value="Monitor">Monitor</option>
//                     </select>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td><strong>Complaint Description: *</strong></td>
//                   <td colSpan="3">
//                     <textarea
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       required
//                       placeholder="[Select]"
//                       rows="3"
//                       style={{ width: '100%' }}
//                     />
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//             <br />
//             <button type="submit" className="button-primary">Submit</button>
//             <button type="reset" className="button-primary" style={{ marginLeft: '10px', backgroundColor: '#888' }} onClick={() => {
//               setSelectedAssetId('');
//               setAssetDetails({});
//               setDescription('');
//               setCategory('');
//             }}>Reset</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardEngineer;
import React from 'react';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const DashboardEngineer = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !['Engineer', 'Admin'].includes(user.role)) {
    return (
      <h3 style={{ padding: '20px' }}>
        Access Denied: You are not authorized to view this page.
      </h3>
    );
  }

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Engineer Dashboard</h2>
          <p>You are allowed to perform Preventive Maintenance only.</p>
          {/* You can link to PMEngineer here if needed */}
        </div>
      </div>
    </div>
  );
};

export default DashboardEngineer;
