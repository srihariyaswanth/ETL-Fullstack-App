import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.body.classList.add('dark');
  }, []);

  const handleToggle = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onToggle(newState);
  };

 const menuItems = [
  { label: 'Home', path: '/dashboard' },
  { label: 'Complaints', path: '/dashboard/engineer' },
  { label: 'Preventive Maintenance', path: '/dashboard/pm' },
  { label: 'PM Reports', path: '/dashboard/reports' },
  { label: 'Complaint Reports', path: '/dashboard/complaints' },
  { label: 'Billing Summary', path: '/dashboard/billing' },
  { label: 'Complete Tasks', path: '/dashboard/contractor' },
  { label: 'Search Complaint', path: '/dashboard/complaint-search' }

];


  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="hamburger" onClick={handleToggle}>☰</button>
        {!collapsed && <h2 className="sidebar-title">ETL</h2>}
      </div>

      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.path} className={location.pathname === item.path ? 'active' : ''} onClick={() => navigate(item.path)}>
            {!collapsed && item.label}
          </li>
        ))}
      </ul>

      <div className="sidebar-bottom">
        <button className="sidebar-btn" onClick={toggleDarkMode}>🌓 {!collapsed && 'Theme'}</button>
        <button className="sidebar-btn logout" onClick={logout}>{!collapsed && 'Logout'}</button>
      </div>
    </div>
  );
};

export default Sidebar;