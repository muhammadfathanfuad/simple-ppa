import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          {/* Bagian 1: Nama Instansi */}
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-primary">
              SIMPEL-PPA
            </h5>
            <p>
              Dinas Pemberdayaan Perempuan dan Perlindungan Anak (DP3A) Kota
              Kendari. Berkomitmen memberikan perlindungan terbaik bagi
              perempuan dan anak.
            </p>
          </div>

          {/* Bagian 2: Link Cepat */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-primary">
              Navigasi
            </h5>
            <p>
              <a href="#beranda" className="text-white text-decoration-none">
                Beranda
              </a>
            </p>
            <p>
              <a href="#edukasi" className="text-white text-decoration-none">
                Edukasi
              </a>
            </p>
            <p>
              <a href="/cek-status" className="text-white text-decoration-none">
                Cek Status
              </a>
            </p>
          </div>

          {/* Bagian 3: Alamat & Kontak */}
          {/* Bagian 3: Alamat & Kontak */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3 text-start">
            <h5 className="text-uppercase mb-4 font-weight-bold text-primary">
              Kontak
            </h5>

            <div className="d-flex align-items-start mb-2">
              <i className="fas fa-home me-3 mt-1 text-primary"></i>
              <p className="small mb-0">Kota Kendari, Sulawesi Tenggara</p>
            </div>

            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-envelope me-3 text-primary"></i>
              <p className="small mb-0">dp3a@kendarikota.go.id</p>
            </div>

            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-phone me-3 text-primary"></i>
              <p className="small mb-0">(0401) XXX-XXX</p>
            </div>
          </div>
        </div>

        <hr className="mb-4" />

        {/* Bagian 4: Copyright */}
        <div className="row">
          <div className="col-md-12 text-center">
            <p className="mb-0 small">
              Copyright ©2026 All rights reserved by:
              <a href="#" className="text-decoration-none ms-1">
                <strong className="text-primary">Tim Magang DP3A</strong>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
