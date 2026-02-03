import React from "react";
import { useNavigate } from "react-router-dom";
import foto1 from "../img/foto1.png";
import edu1 from "../img/edu1.png";
import edu2 from "../img/edu2.png"; // Pastikan formatnya .jpg sesuai file kamu
import edu3 from "../img/edu3.jpg"; // Pastikan formatnya .jpg sesuai file kamu
import edu4 from "../img/edu4.png"; // Pastikan formatnya .jpg sesuai file kamu
import kami from "../img/kami.png";

const Utama = () => {
  const navigate = useNavigate();
  return (
    <>
      {" "}
      {/* Tambahkan pembuka Fragment di sini */}
      <section id="beranda" className="hero-section">
        <div className="container-fluid ps-lg-5 pe-lg-0 px-4">
          <div className="row align-items-center">
            {/* Sisi Teks */}
            <div className="col-lg-6 ps-lg-5 order-2 order-lg-1 max-w mx-auto">
              <h1 className="hero-title">
                Suaramu Berharga, <br />
                <span className="text-highlight">Keamananmu Utama.</span>
              </h1>

              <p className="hero-description">
                Jangan biarkan kekerasan berlanjut. Laporkan kasus kekerasan
                terhadap perempuan dan anak di wilayah Sulawesi Tenggara dengan
                aman, cepat, dan rahasia.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <button 
                  className="btn-hero btn-lapor shadow"
                  onClick={() => navigate('/laporkan')}
                >
                  <i className="bi bi-megaphone-fill me-2"></i> Buat Laporan
                </button>

                <button className="btn-hero btn-status shadow-sm">
                  <i className="bi bi-file-earmark-text me-2"></i> Status
                  Laporan
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
              <img
                src={edu1}
                alt="Kekerasan Fisik"
                className="edu-image mb-4 mb-lg-0"
              />
            </div>
            <div className="col-lg-6 offset-lg-1">
              <h3 className="edu-item-title">Kekerasan Fisik</h3>
              <p className="edu-subtitle">
                Tindakan yang bertujuan melukai, menyakiti, atau menyebabkan
                cacat pada tubuh korban.
              </p>
              <ul className="edu-description">
                <li>Tindakan Langsung: Memukul, menampar, menendang.</li>
                <li>
                  Penggunaan Alat: Melukai dengan benda tajam atau tumpul.
                </li>
                <li>Pembatasan Fisik: Mengunci korban di dalam ruangan.</li>
              </ul>
            </div>
          </div>

          {/* Item Edukasi 2 */}
          <div className="row align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <h3 className="edu-item-title">Kekerasan Psikis (Emosional)</h3>
              <p className="edu-subtitle">
                Tindakan non-fisik yang menyerang mental, harga diri, dan
                menimbulkan rasa takut atau trauma.
              </p>
              <ul>
                <li>
                  Intimidasi: Mengancam akan membunuh, menyakiti orang terdekat,
                  atau merusak barang milik korban.
                </li>
                <li>
                  Penghinaan: Melontarkan kata-kata kasar, merendahkan martabat,
                  atau mempermalukan korban di depan umum.
                </li>
                <li>
                  Kontrol Berlebih: Melarang korban berinteraksi dengan
                  keluarga/teman, mengisolasi korban, atau membatasi ruang gerak
                  secara berlebihan.
                </li>
                <li>
                  Teror Mental: Melakukan penguntitan (stalking) atau
                  mengirimkan pesan ancaman secara terus-menerus.
                </li>
              </ul>
            </div>
            <div className="col-lg-5 offset-lg-1 order-1 order-lg-2">
              <img
                src={edu2}
                alt="Kekerasan Psikis"
                className="edu-image mb-4 mb-lg-0"
              />
            </div>
          </div>

          {/* Item Edukasi 3 */}
          <div className="row align-items-center mb-5 pb-5">
            <div className="col-lg-5">
              <img
                src={edu3}
                alt="Kekerasan Fisik"
                className="edu-image mb-4 mb-lg-0"
              />
            </div>
            <div className="col-lg-6 offset-lg-1">
              <h3 className="edu-item-title">Kekerasan Seksual</h3>
              <p className="edu-subtitle">
                Segala bentuk aktivitas seksual yang dilakukan tanpa persetujuan
                (paksaan) atau terhadap anak yang belum mampu memberikan
                persetujuan
              </p>
              <ul className="edu-description">
                <li>
                  Pelecehan Fisik: Sentuhan, rabaan, atau ciuman pada bagian
                  tubuh sensitif tanpa izin.
                </li>
                <li>
                  Pelecehan Non-Fisik: Komentar cabul, siulan (catcalling), atau
                  menunjukkan materi pornografi secara sengaja.
                </li>
                <li>
                  Pemaksaan Seksual: Perkosaan, pemaksaan hubungan seksual dalam
                  rumah tangga (marital rape), atau eksploitasi seksual.
                </li>
                <li>
                  Kekerasan Berbasis Gender Online (KBGO): Menyebarkan konten
                  pribadi bermuatan asusila tanpa izin untuk mengancam korban.
                </li>
              </ul>
            </div>
          </div>

          {/* Item Edukasi 4 */}
          <div className="row align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <h3 className="edu-item-title">Penelantaran</h3>
              <p className="edu-subtitle">
                Pengabaian kewajiban untuk memberikan perawatan, perlindungan,
                dan pemenuhan hak dasar bagi mereka yang berada di bawah
                tanggung jawab (istri/anak).
              </p>
              <ul>
                <li>
                  Kebutuhan Dasar: Tidak memberikan makanan yang layak, pakaian,
                  atau tempat tinggal yang aman.
                </li>
                <li>
                  Kesehatan: Membiarkan korban sakit tanpa dibawa ke fasilitas
                  medis atau menghalangi pengobatan.
                </li>
                <li>
                  Pendidikan: Sengaja tidak menyekolahkan anak atau menghambat
                  akses anak untuk belajar.
                </li>
                <li>
                  Ekonomi (Eksploitasi): Memaksa anak bekerja di bawah umur atau
                  tidak memberikan nafkah lahir bagi istri/anak tanpa alasan
                  yang sah.
                </li>
              </ul>
            </div>
            <div className="col-lg-5 offset-lg-1 order-1 order-lg-2">
              <img
                src={edu4}
                alt="Kekerasan Psikis"
                className="edu-image mb-4 mb-lg-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tambahkan ini di bawah penutup seksi edukasi */}
      <section id="alur" className="alur-section">
        <div className="container">
          {/* Judul Seksi */}
          <h2 className="edu-main-title text-center mb-5">
            Alur Pelaporan <br /> (Step-by-Step)
          </h2>

          <div className="row g-4 justify-content-center">
            {/* Step 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="step-card">
                <span className="">Step 1</span>
                <h3 className="step-title">Isi Formulir</h3>
                <p className="step-text">
                  Masukkan detail kejadian dan lokasi dengan lengkap.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="step-card">
                <span className="">Step 2</span>
                <h3 className="step-title">Dapatkan ID Laporan</h3>
                <p className="step-text">
                  Simpan kode unik untuk memantau status laporan Anda.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="step-card">
                <span className="">Step 3</span>
                <h3 className="step-title">Verifikasi & Tindakan</h3>
                <p className="step-text">
                  Tim kami akan memverifikasi laporan dan memberikan pendampingan jika diperlukan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    <section id="tentang" className="tentang-section">
      <div className="container">
        <div className="row align-items-start">
          
          {/* Kolom Kiri: Judul Utama */}
          <div className="col-lg-7">
            <h2 className="tentang-title">
              Dinas Pemberdayaan <br />
              <span className="text-highlight">Perempuan dan Anak</span>
            </h2>
            <h3 className="tentang-location">Kota Kendari</h3>
          </div>

          {/* Kolom Kanan: Deskripsi Singkat */}
          <div className="col-lg-5">
            <p className="tentang-subtext">
              Unsur pelaksana urusan pemerintahan di bidang pemberdayaan perempuan 
              dan perlindungan anak yang berkedudukan di bawah dan bertanggung jawab 
              kepada Wali Kota Kendari.
            </p>
          </div>

        </div>

        {/* Baris Foto Tim */}
        <div className="row">
          <div className="col-12">
            <img 
              src={kami} 
              alt="Tim DP3A Kota Kendari" 
              className="tentang-image" 
            />
          </div>
        </div>
      </div>
    </section>

    <section id="hubungi" className="hubungi-section">
      <div className="container">
        <h2 className="hubungi-title text-center text-lg-start">
          Hubungi <span className="text-highlight">Kami</span>
        </h2>

        <div className="row mt-5">
          {/* Kolom Kiri: Informasi Kontak */}
          <div className="col-lg-6">
            <div className="contact-card">
              <i className="bi bi-geo-alt-fill"></i>
              <div className="contact-text">
                <h4>Alamat Kantor</h4>
                <p>Jl. Balai Kota No. 1, Kota Kendari, Sulawesi Tenggara</p>
              </div>
            </div>

            <div className="contact-card">
              <i className="bi bi-telephone-fill"></i>
              <div className="contact-text">
                <h4>Telepon / WhatsApp</h4>
                <p>+62 811-XXXX-XXXX (Pengaduan 24 Jam)</p>
              </div>
            </div>

            <div className="contact-card">
              <i className="bi bi-envelope-at-fill"></i>
              <div className="contact-text">
                <h4>Email Resmi</h4>
                <p>dp3a@kendarikota.go.id</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Maps atau Ilustrasi */}
          <div className="col-lg-6 mt-4 mt-lg-0">
            <div className="ratio ratio-16x9 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              {/* Kamu bisa ganti src ini dengan link embed Google Maps DP3A Kendari */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127267.57563143525!2d122.502964!3d-3.972201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d98f2b380000001%3A0x6d8b9f1d015c9d1c!2sKota%20Kendari%2C%20Sulawesi%20Tenggara!5e0!3m2!1sid!2sid!4v1700000000000" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
    </> /* Penutup Fragment */
  );
};

export default Utama;
