import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Tambahkan ini
import logo from '../img/dp3a.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const location = useLocation(); // Mengambil info URL saat ini

  useEffect(() => {
    // Observer hanya berjalan jika kita di halaman utama (path '/')
    if (location.pathname !== '/') return;

    const observerOptions = { root: null, rootMargin: '0px 0px -70% 0px', threshold: 0 };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location]);

  // Helper untuk menentukan apakah link aktif
  const isActive = (id) => location.pathname === '/' && activeSection === id;

  return (
    <nav className="custom-navbar shadow-sm sticky-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Link Logo menggunakan Link to agar pindah halaman dengan mulus */}
        <Link className="brand-container" to="/">
          <img src={logo} alt="Logo DP3A" className="navbar-logo"/>
          <span className="brand-text">SIMPEL-PPA</span>
        </Link>

        <button className="mobile-menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span><span></span><span></span>
          </div>
        </button>

        <ul className={`nav-list ${isOpen ? "nav-list-mobile" : ""}`}>
          {/* Ubah href menjadi absolute path (/#id) agar bisa diakses dari halaman manapun */}
          <li>
            <a href="/#beranda" 
               className={`nav-link-custom ${isActive('beranda') ? 'active' : ''}`}
               onClick={() => setIsOpen(false)}>Beranda</a>
          </li>
          <li>
            <a href="/#edukasi" 
               className={`nav-link-custom ${isActive('edukasi') ? 'active' : ''}`}
               onClick={() => setIsOpen(false)}>Edukasi</a>
          </li>
          <li>
            <a href="/#tentang" 
               className={`nav-link-custom ${isActive('tentang') ? 'active' : ''}`}
               onClick={() => setIsOpen(false)}>Tentang Kami</a>
          </li>
          <li>
            <a href="/#hubungi" 
               className={`nav-link-custom ${isActive('hubungi') ? 'active' : ''}`}
               onClick={() => setIsOpen(false)}>Hubungi Kami</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;