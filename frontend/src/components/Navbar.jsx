import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo & Nama Instansi */}
        <a className="navbar-brand fw-bold text-primary" href="/">
          SIMPLE-PPA
        </a>

        {/* Tombol Menu Mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link mx-2" href="#beranda">Beranda</a>
            </li>
            <li className="nav-item">
              <a className="nav-link mx-2" href="#tentang">Tentang</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;