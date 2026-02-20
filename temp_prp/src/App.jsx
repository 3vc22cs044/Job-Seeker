import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Assessments from './pages/Assessments';
import { Practice, Resources, Profile } from './pages/Placeholders_temp';
import TestPage from './pages/TestPage';
import ShipPage from './pages/ShipPage';
import ProofPage from './pages/ProofPage';
import NetflixLanding from './pages/NetflixLanding';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Routes */}
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/prp" element={<DashboardLayout />}>
          <Route path="07-test" element={<TestPage />} />
          <Route path="08-ship" element={<ShipPage />} />
          <Route path="proof" element={<ProofPage />} />
        </Route>

        <Route path="/netflix" element={<NetflixLanding />} />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
