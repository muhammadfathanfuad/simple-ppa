import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Utama from './pages/landingpage';
import Formulir from './pages/Formulir'; // Import file formulir yang baru dibuat
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Halaman Utama / Landing Page */}
        <Route path="/" element={<Utama />} />
        
        {/* Halaman Formulir Pelaporan */}
        <Route path="/laporkan" element={<Formulir />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;