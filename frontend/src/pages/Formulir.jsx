import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Formulir = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Memastikan saat halaman terbuka langsung scroll ke atas
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleFinalSubmit = () => {
    // Logika pengiriman data ke backend bisa diletakkan di sini
    alert("Laporan Berhasil Dikirim ke DP3A Kendari!");
    navigate('/'); // Kembali ke Beranda
    window.scrollTo(0, 0);
  };

  // Helper untuk merender grup radio agar seragam & ringkas
  const renderRadioGroup = (label, name, options, hasOther = false, columnSize = "col-md-6") => (
    <div className={columnSize}>
      <label className="form-label">{label}</label>
      <div className="row row-cols-2 row-cols-md-2">
        {options.map((opt) => (
          <div className="col form-check mb-2" key={`${name}-${opt}`}>
            <input className="form-check-input" type="radio" name={name} id={`${name}-${opt}`} />
            <label className="radio-label ms-2" htmlFor={`${name}-${opt}`}>{opt}</label>
          </div>
        ))}
      </div>
      {hasOther && <input type="text" className="form-control-custom input-lainnya" placeholder="Lainnya..." />}
    </div>
  );

  return (
    <div className="container py-5">
      {/* Judul Utama 64px */}
      <h1 className="form-main-title text-center">Formulir Pelaporan</h1>

      {/* Stepper Bar */}
      <div className="stepper-wrapper col-lg-8 mx-auto">
        {['Identitas', 'Detail Kejadian', 'Konfirmasi'].map((label, i) => (
          <div className={`step-item ${step >= i + 1 ? 'active' : ''}`} key={label}>
            <div className="step-number">{i + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="form-container col-lg-10 mx-auto shadow-lg">
        
        {/* --- STEP 1: IDENTITAS (KORBAN & PELAPOR) --- */}
        {step === 1 && (
          <div className="step-content">
            <h2 className="form-section-title text-center">Identitas Korban</h2>
            <div className="row g-4 mb-5">
              <div className="col-12">
                <label className="form-label">Nama Lengkap Korban</label>
                <input type="text" className="form-control-custom" placeholder="Jane Doe" />
              </div>
              <div className="col-md-6">
                <label className="form-label">NIK Korban</label>
                <input type="text" className="form-control-custom" placeholder="747XXXXXXXXXXXXX" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nomor WhatsApp</label>
                <input type="text" className="form-control-custom" placeholder="08XXXXXXXXXX" />
              </div>
              {renderRadioGroup("Jenis Kelamin", "jk_korban", ['Perempuan', 'Laki-laki'])}
              {renderRadioGroup("Status Kewarganegaraan", "wn_korban", ['WNI', 'WNA'])}
              {renderRadioGroup("Pendidikan", "edu_korban", ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2/S3'])}
              {renderRadioGroup("Pekerjaan", "job_korban", ['Guru', 'Buruh', 'Karyawan', 'Tani', 'IRT'], true)}
              {renderRadioGroup("Agama Korban", "agama_korban", ['Islam', 'Katolik', 'Budha', 'Kristen', 'Hindu', 'Konghuchu'], true, "col-12")}
            </div>

            <hr className="my-5 border-white opacity-25" />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="form-section-title mb-0">Identitas Pelapor</h2>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="anonim" />
                <label className="form-check-label text-white ms-2" htmlFor="anonim" style={{fontSize: '18px'}}>Anonimkan Identitas?</label>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">Status Pelapor</label>
                <select className="form-control-custom">
                  <option>Korban Langsung</option>
                  <option>Keluarga</option>
                  <option>Saksi Mata</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Nama Lengkap Pelapor</label>
                <input type="text" className="form-control-custom" placeholder="Nama Anda" />
              </div>
              {renderRadioGroup("Jenis Kelamin Pelapor", "jk_pelapor", ['Perempuan', 'Laki-laki'])}
              {renderRadioGroup("Pendidikan Pelapor", "edu_pelapor", ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2/S3'])}
              {renderRadioGroup("Pekerjaan Pelapor", "job_pelapor", ['Guru', 'Buruh', 'Karyawan', 'Tani', 'IRT'], true)}
              {renderRadioGroup("Agama Pelapor", "agama_pelapor", ['Islam', 'Katolik', 'Budha', 'Kristen', 'Hindu', 'Konghuchu'], true, "col-12")}

              <div className="col-12 text-end mt-5">
                <button className="btn btn-light px-5 py-3 rounded-pill fw-bold" 
                        style={{ fontSize: '24px', color: '#09637e' }}
                        onClick={() => setStep(2)}>
                  Berikutnya <i className="bi bi-play-fill ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: DETAIL KEJADIAN --- */}
        {step === 2 && (
          <div className="step-content">
            <h2 className="form-section-title text-center">Detail Kejadian</h2>
            <div className="row g-4">
              {renderRadioGroup("Jenis Kasus Kekerasan", "jenis_kasus", ['KDRT', 'Anak', 'ABH', 'Perempuan', 'TPPO'], true, "col-12")}
              {renderRadioGroup("Bentuk Kekerasan", "bentuk_kekerasan", ['Fisik', 'Psikis', 'Seksual', 'Penelantaran Rumah Tangga'], true, "col-12")}
              
              <div className="col-md-6">
                <label className="form-label">Tanggal & Waktu Kejadian</label>
                <input type="datetime-local" className="form-control-custom" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Tempat (Kecamatan) Kejadian</label>
                <select className="form-control-custom">
                  <option value="">Pilih Kecamatan...</option>
                  <option>Baruga</option><option>Puuwatu</option><option>Kadia</option><option>Wua-Wua</option>
                  <option>Mandonga</option><option>Kendari Barat</option><option>Poasia</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Lokasi Lengkap Kejadian</label>
                <input type="text" className="form-control-custom" placeholder="Nama Jalan atau Landmark" />
              </div>

              {renderRadioGroup("Layanan yang Dibutuhkan", "layanan_req", ['Konseling', 'Shelter', 'Hukum', 'Medis'], true, "col-12")}

              <div className="col-12">
                <label className="form-label">Kronologi Kejadian</label>
                <textarea className="form-control-custom" rows="5" placeholder="Ceritakan detail kejadian..."></textarea>
              </div>

              <div className="col-12 d-flex justify-content-between mt-5">
                <button className="btn btn-outline-light px-5 py-3 rounded-pill fw-bold"
                        style={{ fontSize: '24px' }} onClick={() => setStep(1)}>
                  <i className="bi bi-arrow-left"></i> Kembali
                </button>
                <button className="btn btn-light px-5 py-3 rounded-pill fw-bold" 
                        style={{ fontSize: '24px', color: '#09637e' }} onClick={() => setStep(3)}>
                  Berikutnya <i className="bi bi-play-fill"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: UNGGAH BUKTI & KONFIRMASI --- */}
        {step === 3 && (
          <div className="step-content">
            <div className="row g-4">
                <div className="col-12">
                    <label className="form-label mb-1">Upload File/Foto Bukti Kekerasan</label>
                    <span className="form-sub-label text-white d-block mb-3">dapat berupa foto, screenshot, atau dokumen pendukung</span>
                    <input type="file" className="form-control-custom" accept="image/*" />
                </div>
                <div className="col-12 mt-4">
                    <label className="form-label mb-1">Upload Video Bukti Kekerasan</label>
                    <span className="form-sub-label text-white">*Jika ada</span>
                    <input type="file" className="form-control-custom" accept="video/*" />
                </div>

                <div className="col-12 mt-5">
                    <h3 className="form-section-title mb-2">Pernyataan Kebenaran</h3>
                    <div className="pernyataan-box d-flex gap-3 align-items-start">
                    <input type="checkbox" className="form-check-input" id="pernyataan" style={{width: '30px', height: '30px'}} />
                    <label className="radio-label" htmlFor="pernyataan" style={{fontSize: '20px'}}>
                        Saya menyatakan bahwa data yang saya kirimkan adalah benar dan dapat dipertanggungjawabkan.
                    </label>
                    </div>
                </div>

                <div className="col-12 text-center mt-5 pt-4">
                    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4">
                    <button className="btn btn-outline-light px-5 py-3 rounded-pill fw-bold"
                            style={{ fontSize: '24px' }} onClick={() => setStep(2)}>
                        <i className="bi bi-arrow-left"></i> Kembali
                    </button>
                    <button className="btn-buat-laporan shadow-lg" onClick={handleFinalSubmit}>
                        <i className="bi bi-megaphone-fill"></i> Buat Laporan
                    </button>
                    </div>
                </div>
                </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Formulir;