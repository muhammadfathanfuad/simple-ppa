import React from 'react';
import foto1 from '../img/foto1.png';
import edu1 from '../img/edu1.png';
import edu2 from '../img/edu2.jpg'; // Pastikan formatnya .jpg sesuai file kamu

const Utama = () => {
  return (
    <> {/* Tambahkan pembuka Fragment di sini */}
      <section id="beranda" className="hero-section">
        <div className="container-fluid ps-lg-5 pe-lg-0 px-4"> 
          <div className="row align-items-center">
            
            {/* Sisi Teks */}
            <div className="col-lg-6 ps-lg-5 order-2 order-lg-1"> 
              <h1 className="hero-title">
                Suaramu Berharga, <br />
                <span className="text-highlight">Keamananmu Utama.</span>
              </h1>
              
              <p className="hero-description">
                Jangan biarkan kekerasan berlanjut. Laporkan kasus kekerasan 
                terhadap perempuan dan anak di wilayah Sulawesi Tenggara 
                dengan aman, cepat, dan rahasia.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <button className="btn-hero btn-lapor shadow">
                  <i className="bi bi-megaphone-fill me-2"></i> Buat Laporan
                </button>

                <button className="btn-hero btn-status shadow-sm">
                  <i className="bi bi-file-earmark-text me-2"></i> Status Laporan
                </button>
              </div>
            </div>

            {/* Sisi Foto */}
            <div className="col-lg-6 pe-0 order-1 order-lg-2 mb-4 mb-lg-0">
              <img 
                src={foto1} 
                alt="Ilustrasi Perlindungan" 
                className="hero-image-full shadow-lg"
              />
            </div>

          </div>
        </div>
      </section>

      <section id="edukasi" className="edu-section">
        <div className="container">
          
          <h2 className="edu-main-title text-center text-lg-start">
            Edukasi: Apa Saja yang <br /> Bisa Dilaporkan?
          </h2>

          {/* Item Edukasi 1 */}
          <div className="row align-items-center mb-5 pb-5">
            <div className="col-lg-5">
              <img src={edu1} alt="Kekerasan Fisik" className="edu-image mb-4 mb-lg-0" />
            </div>
            <div className="col-lg-6 offset-lg-1">
              <h3 className="edu-item-title">Kekerasan Fisik</h3>
              <p className="edu-subtitle">Tindakan yang bertujuan melukai, menyakiti, atau menyebabkan cacat pada tubuh korban.</p>
              <ul className="edu-description">
                <li>Tindakan Langsung: Memukul, menampar, menendang.</li>
                <li>Penggunaan Alat: Melukai dengan benda tajam atau tumpul.</li>
                <li>Pembatasan Fisik: Mengunci korban di dalam ruangan.</li>
              </ul>
            </div>
          </div>

          {/* Item Edukasi 2 */}
          <div className="row align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <h3 className="edu-item-title">Kekerasan Psikis (Emosional)</h3>
              <p className="edu-subtitle">Tindakan non-fisik yang menyerang mental, harga diri, dan menimbulkan rasa takut atau trauma.</p>
              <ul>
                <li>Intimidasi: Mengancam akan membunuh, menyakiti orang terdekat, atau merusak barang milik korban.</li>
                <li>Penghinaan: Melontarkan kata-kata kasar, merendahkan martabat, atau mempermalukan korban di depan umum.</li>
                <li>Kontrol Berlebih: Melarang korban berinteraksi dengan keluarga/teman, mengisolasi korban, atau membatasi ruang gerak secara berlebihan.</li>
                <li>Teror Mental: Melakukan penguntitan (stalking) atau mengirimkan pesan ancaman secara terus-menerus.</li>
              </ul>
            </div>
            <div className="col-lg-5 offset-lg-1 order-1 order-lg-2">
              <img src={edu2} alt="Kekerasan Psikis" className="edu-image mb-4 mb-lg-0" />
            </div>
          </div>

        </div>
      </section>

      <section id="tentang" className="edu-section" style={{minHeight: '100vh'}}>
        <div className="container"><h2>Tentang Kami</h2></div>
      </section>

      <section id="hubungi" className="edu-section" style={{minHeight: '100vh'}}>
        <div className="container"><h2>Hubungi Kami</h2></div>
      </section>
    </> /* Penutup Fragment */
  );
};

export default Utama;