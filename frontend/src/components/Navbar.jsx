import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../img/dp3a.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Logika: Navbar solid jika di-scroll ATAU bukan di homepage
  const shouldShowSolidBg = (scrolled || !isHomePage);
  // Teks putih jika background solid ATAU menu mobile sedang terbuka
  const isTextWhite = shouldShowSolidBg || isOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Observer untuk section aktif
  useEffect(() => {
    if (location.pathname !== '/') return;
    const observerOptions = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0 };
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

  const navLinks = [
    { name: 'Beranda', id: 'beranda', path: '/#beranda' },
    { name: 'Edukasi', id: 'edukasi', path: '/#edukasi' },
    { name: 'Tentang Kami', id: 'tentang', path: '/#tentang' },
    { name: 'Hubungi Kami', id: 'hubungi', path: '/#hubungi' },
  ];

  const handleNavClick = (e, id) => {
    setIsOpen(false);
    if (location.pathname === '/' && id) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Optional: Update URL without jumping
        window.history.pushState(null, '', `/#${id}`);
      }
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${shouldShowSolidBg ? 'bg-teal-700 shadow-lg py-4' : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">

        {/* Brand */}
        <Link className="flex items-center gap-3 group relative z-[60]" to="/">
          <img src={logo} alt="Logo" className="h-10 lg:h-12 w-auto transition transform group-hover:scale-110" />
          <span className={`text-2xl font-bold tracking-tight ${isTextWhite ? 'text-white' : 'text-slate-800'}`}>
            <span className={isTextWhite ? 'text-white' : 'text-teal-700'}>SIMPEL</span>-PPA
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-3xl focus:outline-none relative z-[60]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'} ${isTextWhite ? 'text-white' : 'text-slate-800'} transition-all duration-300`}></i>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-8">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.path}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`text-lg font-medium transition-colors duration-300 cursor-pointer ${location.pathname === '/' && activeSection === link.id
                  ? (isTextWhite ? 'text-teal-200' : 'text-teal-600')
                  : (isTextWhite ? 'text-white hover:text-teal-200' : 'text-slate-600 hover:text-teal-600')
                  }`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Overlay - Perbaikan Animasi Slide & Opacity */}
        <div className={`fixed inset-0 bg-teal-800 z-[50] flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          }`}>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.path}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-2xl font-bold text-white hover:text-teal-200 transition transform active:scale-90"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;