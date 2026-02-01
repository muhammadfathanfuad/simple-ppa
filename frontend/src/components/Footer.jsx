import React from 'react';

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
              Dinas Pemberdayaan Perempuan dan Perlindungan Anak (DP3A) Kota Kendari. 
              Berkomitmen memberikan perlindungan terbaik bagi perempuan dan anak.
            </p>
          </div>

          {/* Bagian 2: Link Cepat */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-primary">Navigasi</h5>
            <p><a href="#beranda" className="text-white text-decoration-none">Beranda</a></p>
            <p><a href="#edukasi" className="text-white text-decoration-none">Edukasi</a></p>
            <p><a href="/cek-status" className="text-white text-decoration-none">Cek Status</a></p>
          </div>

          {/* Bagian 3: Alamat & Kontak */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-primary">Kontak</h5>
            <p><i className="fas fa-home mr-3"></i> Kota Kendari, Sulawesi Tenggara</p>
            <p><i className="fas fa-envelope mr-3"></i> dp3a@kendarikota.go.id</p>
            <p><i className="fas fa-phone mr-3"></i> (0401) XXX-XXX</p>
          </div>

        </div>

        <hr className="mb-4" />

        {/* Bagian 4: Copyright */}
        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p>
              Copyright ©2026 All rights reserved by:
              <a href="#" className="text-decoration-none">
                <strong className="text-primary"> KKN Aksara Tech - UHO</strong>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;