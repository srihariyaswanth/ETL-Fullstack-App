// // src/components/DashboardContractor.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Sidebar from './Sidebar';
// import '../styles/Dashboard.css';


// const DashboardContractor = () => {
//   const [pmList, setPmList] = useState([]);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const user = JSON.parse(localStorage.getItem('user'));
//    if (!user || !['ContractCell', 'Admin'].includes(user.role)) {
//     return <h3 style={{ padding: '20px' }}>Access Denied: You are not authorized to view this page.</h3>;
//   }
//   useEffect(() => {
//     axios.get('http://localhost:3000/pm/billing')
//       .then(res => {
//         const incomplete = res.data.filter(pm => !pm.completed);
//         setPmList(incomplete);
//       })
//       .catch(err => console.error('Failed to fetch PMs', err));
//   }, []);


// const markCompleted = async (pmId) => {
//  if (!['ContractManager', 'ContractCell'].includes(user.role)) {

//     alert('You are not authorized to complete PMs.');
//     return;
//   }

//   try {
//     await axios.put(`http://localhost:3000/pm/complete/${pmId}`, {
//       completedBy: user._id
//     });
//     alert('Marked as Completed');
//     setPmList(pmList.filter(pm => pm._id !== pmId));
//   } catch (err) {
//     alert('Failed to complete PM');
//     console.error(err);
//   }
// };

//   return (
//     <div className="dashboard-page">
//       <Sidebar onToggle={setIsCollapsed} />
//       <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
//         <div className="dashboard-card">
//           <h2>Contractor: Complete Maintenance Tasks</h2>

//           {pmList.length === 0 ? (
//             <p>No tasks pending completion.</p>
//           ) : (
//             pmList.map(pm => (
//               <div key={pm._id} className="checkbox-item" style={{ marginBottom: '15px' }}>
//                 <p><strong>Date:</strong> {pm.pmDate.split('T')[0]}</p>
//                 <p><strong>Asset:</strong> {pm.assetId?.assetNumber}</p>
//                 <p><strong>Engineer:</strong> {pm.engineerId?.username}</p>
//                <p><strong>Contract Period:</strong> 
//   {pm.contractStartDate?.split('T')[0]} to {pm.contractEndDate?.split('T')[0]}
// </p>
//                 <button className="button-primary" onClick={() => markCompleted(pm._id)}>
//                   Mark as Completed
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// console.log("DashboardContractor loaded");

// export default DashboardContractor;
// src/components/DashboardContractor.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../styles/Dashboard.css';

const DashboardContractor = () => {
  const [pmList, setPmList] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !['ContractCell', 'Admin'].includes(user.role)) {
    return <h3 style={{ padding: '20px' }}>Access Denied: You are not authorized to view this page.</h3>;
  }

  useEffect(() => {
    axios.get('http://localhost:3000/pm/billing')
      .then(res => {
        const incomplete = res.data.filter(pm => !pm.completed);
        setPmList(incomplete);
      })
      .catch(err => console.error('Failed to fetch PMs', err));
  }, []);

  const markCompleted = async (pmId) => {
    if (!['ContractManager', 'ContractCell'].includes(user.role)) {
      alert('You are not authorized to complete PMs.');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/pm/complete/${pmId}`, {
        completedBy: user._id
      });
      alert('Marked as Completed');
      setPmList(pmList.filter(pm => pm._id !== pmId));
    } catch (err) {
      alert('Failed to complete PM');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-page">
      <Sidebar onToggle={setIsCollapsed} />
      <div className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-card">
          <h2>Contractor: Complete Maintenance Tasks</h2>

          {pmList.length === 0 ? (
            <p>No tasks pending completion.</p>
          ) : (
            pmList.map(pm => (
              <div
                key={pm._id}
                className="checkbox-item"
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  backgroundColor: '#1e1e1e',
                  borderRadius: '8px',
                  border: '1px solid #333',
                  color: '#f0f0f0'
                }}
              >
                <p><strong>Date:</strong> {pm.pmDate?.split('T')[0]}</p>
                <p><strong>Asset:</strong> {pm.assetId?.assetNumber}</p>
                <p><strong>Engineer:</strong> {pm.engineerId?.username}</p>
               <p style={{ marginBottom: '10px' }}>
  <strong>Contract Period:</strong>{' '}
  {pm.contractStartDate?.split('T')[0]} {' to '} {pm.contractEndDate?.split('T')[0]}
</p>

                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <button className="button-primary" onClick={() => markCompleted(pm._id)}>
                    Mark as Completed
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardContractor;
