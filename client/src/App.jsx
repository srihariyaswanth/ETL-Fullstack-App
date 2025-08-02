// ✅ App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardEngineer from './components/DashboardEngineer';
import PMEngineer from './components/PMEngineer';
import DashboardCoordinator from './components/DashboardCoordinator';
import DashboardIncharge from './components/DashboardIncharge';
import DashboardEIC from './components/DashboardEIC';
import ReportsPM from './components/ReportsPM';
import ReportsComplaints from './components/ReportsComplaints';
import ReportsBilling from './components/ReportsBilling';
import DashboardContractor from './components/DashboardContractor';
import ComplaintSearch from './components/ComplaintSearch';

const Dashboard = () => <h2>General Dashboard</h2>;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/engineer" element={<ProtectedRoute><DashboardEngineer /></ProtectedRoute>} />
        <Route path="/dashboard/coordinator" element={<ProtectedRoute><DashboardCoordinator /></ProtectedRoute>} />
        <Route path="/dashboard/incharge" element={<ProtectedRoute><DashboardIncharge /></ProtectedRoute>} />
        <Route path="/dashboard/pm" element={<ProtectedRoute><PMEngineer /></ProtectedRoute>} />
        <Route path="/dashboard/eic" element={<ProtectedRoute><DashboardEIC /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPM /></ProtectedRoute>} />
        <Route path="/dashboard/complaints" element={<ProtectedRoute><ReportsComplaints /></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute><ReportsBilling /></ProtectedRoute>} />
        <Route path="/dashboard/contractor" element={<ProtectedRoute><DashboardContractor /></ProtectedRoute>} />
        <Route path="/dashboard/complaint-search" element={<ProtectedRoute><ComplaintSearch /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App