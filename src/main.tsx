import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ClinicalTrials from './pages/ClinicalTrials.tsx';
import Wallet from './pages/Wallet.tsx';
import './index.css';
import UploadHealthData from './pages/UploadHealthData.tsx';
import ManageRequests from './pages/ManageRequests.tsx';
import Marketplace from './pages/Marketplace.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clinical-trials" element={<ClinicalTrials />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/manage-requests" element={<ManageRequests />} />

          <Route path="/upload-health-data" element={<UploadHealthData/>}/>

        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);