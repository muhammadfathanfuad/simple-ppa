import React, { useState, useEffect } from 'react';
import logo from '../img/dp3a.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda'); // State untuk link aktif

  useEffect(() => {
    // Fungsi untuk mengamati seksi mana yang sedang terlihat di layar
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -70% 0px', // Aktifkan saat seksi berada di tengah layar
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Ambil semua elemen <section> yang punya ID
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="custom-navbar shadow-sm sticky-top">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        <a className="brand-container" href="/">
          <img src={logo} alt="Logo DP3A" className="navbar-logo"/>
          <span className="brand-text">SIMPEL-PPA</span>
        </a>

        <button className="mobile-menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span></span><span></span><span></span>
          </div>
        </button>

        <ul className={`nav-list ${isOpen ? "nav-list-mobile" : ""}`}>
          {/* Tambahkan logika class active berdasarkan state activeSection */}
          <li>
            <a href="#beranda" 
               className={`nav-link-custom ${activeSection === 'beranda' ? 'active' : ''}`}
               onClick={() => setIsOpen(false)}>Beranda</a>
          </li>
          <li>
            <a href="#edukasi" 
               className={`nav-link-custom ${activeSection === 'edukasi' ? 'active' : ''}`}
               onClick={() => setIsOpen(false)}>Edukasi</a>
          </li>
          <li>
            <a href="#tentang" 
               className={`nav-link-custom ${activeSection === 'tentang' ? 'active' : ''}`}
               onClick={() => setIsOpen(false)}>Tentang Kami</a>
          </li>
          <li>
            <a href="#hubungi" 
               className={`nav-link-custom ${activeSection === 'hubungi' ? 'active' : ''}`}
               onClick={() => setIsOpen(false)}>Hubungi Kami</a>
          </li>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;