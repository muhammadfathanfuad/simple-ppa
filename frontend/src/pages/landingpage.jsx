import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";
import foto1 from "../img/foto1.png";
import edu1 from "../img/edu1.png";
import edu2 from "../img/edu2.png";
import edu3 from "../img/edu3.jpg";
import edu4 from "../img/edu4.png";
import kami from "../img/kami.png";

const Utama = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="relative font-sans text-slate-800 bg-slate-50 overscroll-x-hidden">

      {/* Custom Navbar Background for Hero separation if needed, 
          but usually handled by the main Layout. Assuming Navbar is global. */}

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 lg:pt-26 lg:pb-32 overflow-hidden scroll-mt-20" id="beranda">
        {/* Background Gradient Blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl opacity-50 animate-float" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl opacity-50" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-center lg:text-left">

            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-teal-700 bg-teal-100 rounded-full border border-teal-200">
                Layanan Pengaduan 24 Jam
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8 text-slate-900">
                Suaramu Berharga, <br />
                <span className="text-gradient">Keamananmu Utama.</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Jangan diam. Laporkan kasus kekerasan terhadap perempuan dan anak di wilayah Sulawesi Tenggara dengan aman, cepat, dan rahasia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/laporkan')}
                  className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold rounded-full shadow-lg shadow-teal-600/30 transition-all transform hover:-translate-y-1"
                >
                  <i className="bi bi-megaphone-fill mr-2"></i>
                  Lapor Sekarang
                </button>
                <button
                  onClick={() => navigate('/cek-status')}
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-lg font-bold rounded-full shadow-sm transition-all hover:shadow-md"
                >
                  <i className="bi bi-search mr-2"></i>
                  Cek Status
                </button>
              </div>
            </div>

            {/* Image Content */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-600 to-indigo-600 rounded-[3rem] rotate-3 opacity-20 blur-lg transform scale-105"></div>
                <img
                  src={foto1}
                  alt="Ilustrasi Hero"
                  className="relative w-full max-w-lg mx-auto rounded-[3rem] shadow-2xl border-4 border-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- EDUKASI SECTION --- */}
      <section className="py-20 bg-white scroll-mt-20" id="edukasi">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">Edukasi & Informasi</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Kenali jenis-jenis kekerasan agar kita bisa mencegah dan melaporkannya dengan tepat.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <EduCard
              img={edu1}
              title="Kekerasan Fisik"
              desc="Tindakan yang bertujuan melukai, menyakiti, atau menyebabkan cacat pada tubuh."
            />
            <EduCard
              img={edu2}
              title="Kekerasan Psikis"
              desc="Tindakan non-fisik yang menyerang mental, menimbulkan rasa takut atau trauma."
            />
            <EduCard
              img={edu3}
              title="Kekerasan Seksual"
              desc="Aktivitas seksual tanpa persetujuan atau terhadap anak dibawah umur."
            />
            <EduCard
              img={edu4}
              title="Penelantaran"
              desc="Pengabaian kewajiban perawatan dan hak dasar (makan, kesehatan, pendidikan)."
            />
          </div>
        </div>
      </section>

      {/* --- ALUR PELAPORAN --- */}
      <section className="py-20 bg-slate-50 scroll-mt-20" id="alur">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">Alur Pelaporan</h2>
            <p className="text-lg text-slate-600">Mudah, Cepat, dan Transparan.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard number="01" title="Isi Formulir" desc="Lengkapi data kronologi dan bukti pendukung." />
            <StepCard number="02" title="Dapat Tiket" desc="Simpan Kode Tiket untuk memantau proses." />
            <StepCard number="03" title="Penanganan" desc="Tim kami akan memverifikasi dan menindaklanjuti." />
          </div>
        </div>
      </section>

      {/* --- TENTANG KAMI --- */}
      <section className="py-20 bg-gradient-to-br from-teal-700 to-teal-900 text-white relative overflow-hidden scroll-mt-20" id="tentang">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">DP3A Kota Kendari</h2>
              <p className="text-lg text-teal-100 leading-relaxed mb-6">
                Dinas Pemberdayaan Perempuan dan Perlindungan Anak. Kami berkomitmen menciptakan lingkungan yang aman dan ramah bagi perempuan dan anak di Kota Kendari.
              </p>
              <div className="flex flex-wrap gap-4">
                <StatCard number="24/7" label="Layanan Aktif" />
                <StatCard number="100+" label="Kasus Tertangani" />
              </div>
            </div>
            <div>
              <img src={kami} alt="Tim DP3A" className="rounded-2xl shadow-2xl border-4 border-white/20 transform rotate-2 hover:rotate-0 transition duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* --- HUBUNGI KAMI --- */}
      <section className="py-20 bg-slate-100 scroll-mt-20" id="hubungi">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8">Hubungi Kami</h2>
              <div className="space-y-6">
                <ContactItem icon="bi-geo-alt-fill" title="Alamat Kantor" desc="Jl. Balai Kota No. 1, Kota Kendari" />
                <ContactItem icon="bi-telephone-fill" title="Hotline / WhatsApp" desc="+62 811-XXXX-XXXX" />
                <ContactItem icon="bi-envelope-fill" title="Email Resmi" desc="dp3a@kendarikota.go.id" />
              </div>
            </div>
            <div className="h-80 lg:h-auto bg-slate-200 rounded-3xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127267.57563143525!2d122.502964!3d-3.972201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d98f2b380000001%3A0x6d8b9f1d015c9d1c!2sKota%20Kendari%2C%20Sulawesi%20Tenggara!5e0!3m2!1sid!2sid!4v1700000000000"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Button Integration */}
      <FloatingButton />

    </div>
  );
};

/* --- SUB COMPONENTS FOR CLEANER CODE --- */

const EduCard = ({ img, title, desc }) => (
  <div className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
    <div className="h-48 overflow-hidden rounded-2xl mb-6">
      <img src={img} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
    </div>
    <h3 className="text-2xl font-bold text-teal-800 mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl shadow-md border-b-4 border-teal-500 hover:bg-teal-50 transition-colors">
    <div className="text-5xl font-bold text-slate-200 mb-4">{number}</div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center min-w-[120px]">
    <div className="text-2xl font-bold text-white">{number}</div>
    <div className="text-sm text-teal-100">{label}</div>
  </div>
);

const ContactItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl shrink-0">
      <i className={`bi ${icon}`}></i>
    </div>
    <div>
      <h4 className="font-bold text-slate-800">{title}</h4>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  </div>
);

export default Utama;
