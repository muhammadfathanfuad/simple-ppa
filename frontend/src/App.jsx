import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Utama from './pages/landingpage';
import FormLapor from './pages/FormLapor';
import CheckStatus from './pages/CheckStatus'; // Updated import
import Login from './pages/Login';
import Footer from './components/Footer';

// ... imports
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ReportList from './pages/admin/ReportList';
import FullComplaintForm from './pages/admin/FullComplaintForm';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Navbar & Footer */}
        <Route path="/" element={<><Navbar /><Utama /><Footer /></>} />
        <Route path="/laporkan" element={<><Navbar /><FormLapor /><Footer /></>} />
        <Route path="/cek-status" element={<><Navbar /><CheckStatus /><Footer /></>} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="laporan" element={<ReportList />} />
          <Route path="laporan/baru" element={<FullComplaintForm />} />
          <Route path="laporan/:id/lengkap" element={<FullComplaintForm />} />
          <Route path="pengaturan" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;