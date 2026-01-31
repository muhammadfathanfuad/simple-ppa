import React, { useState } from 'react'; // Tambahkan useState
import logo from '../img/dp3a.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State untuk toggle menu mobile

  return (
    <nav className="custom-navbar shadow-sm sticky-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Logo & Nama Instansi - Dibungkus dalam satu container */}
        <a className="brand-container" href="/">
          <img src={logo} alt="Logo DP3A" className="navbar-logo"/>
          <span className="brand-text">SIMPEL-PPA</span>
        </a>

        {/* Hamburger Menu (Hanya muncul di Mobile) */}
        <button className="mobile-menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <span className={isOpen ? "fas fa-times" : "fas fa-bars"}></span>
          {/* Jika tidak pakai FontAwesome, gunakan garis sederhana: */}
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Menu Navigasi */}
        <ul className={`nav-list ${isOpen ? "nav-list-mobile" : ""}`}>
          <li><a href="#beranda" className="nav-link-custom active" onClick={() => setIsOpen(false)}>Beranda</a></li>
          <li><a href="#edukasi" className="nav-link-custom" onClick={() => setIsOpen(false)}>Edukasi</a></li>
          <li><a href="#tentang" className="nav-link-custom" onClick={() => setIsOpen(false)}>Tentang Kami</a></li>
          <li><a href="#hubungi" className="nav-link-custom" onClick={() => setIsOpen(false)}>Hubungi Kami</a></li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;