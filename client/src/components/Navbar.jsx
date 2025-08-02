import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

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
    if (saved === 'dark') {
      document.body.classList.add('dark');
    }
  }, []);

  return (
    <nav style={{
      display: 'flex',
      backgroundColor: '#004080',
      padding: '10px 20px',
      color: 'white',
      gap: '20px'
    }}>
      <span style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Home</span>
      <span onClick={() => navigate('/dashboard/engineer')}>Complaints</span>
      <span onClick={() => navigate('/dashboard/pm')}>Preventive Maintenance</span>
      <span onClick={() => navigate('/dashboard/reports')}>Reports</span>

      <span style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={toggleDarkMode}>🌓 Theme</span>
      <span style={{ cursor: 'pointer' }} onClick={logout}>Logout</span>
    </nav>
  );
};

export default Navbar;
