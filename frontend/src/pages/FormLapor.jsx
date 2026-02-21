import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { findKecamatanByLocation, findNearestKecamatan } from '../utils/geometry';
import Swal from 'sweetalert2';

const FormLapor = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState(null);

    const [kecamatanList, setKecamatanList] = useState([]);
    const [jenisKasusList, setJenisKasusList] = useState([]);
    const [files, setFiles] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        namaPelapor: '',
        noHpPelapor: '',
        hubungan: 'Korban Langsung',
        namaKorban: '',
        noHpKorban: '',
        alamatKorban: '',
        tanggal: new Date().toISOString().split('T')[0],
        waktu: '12:00',
        lokasi: '',
        koordinat: null, // {lat, lng}
        idKecamatan: '',
        jenisKelaminKorban: '',
        kategori: '', // This will hold idJenisKasus
        kronologi: ''
    });

    useEffect(() => {
        // Fetch Master Data
        const fetchData = async () => {
            try {
                const [kecRes, kasusRes] = await Promise.all([
                    fetch('http://localhost:5000/api/laporan/master/kecamatan'),
                    fetch('http://localhost:5000/api/laporan/master/jenis-kasus')
                ]);

                if (kecRes.ok) {
                    const kecData = await kecRes.json();
                    setKecamatanList(kecData);
                }
                if (kasusRes.ok) {
                    const kasusData = await kasusRes.json();
                    setJenisKasusList(kasusData);
                }
            } catch (err) {
                console.error("Error fetching master data:", err);
            }
        };
        fetchData();
    }, []);

    const getIconForKasus = (nama) => {
        const lower = nama.toLowerCase();
        if (lower.includes('fisik')) return 'bi-bandaid';
        if (lower.includes('psikis')) return 'bi-heartbreak';
        if (lower.includes('seksual')) return 'bi-shield-exclamation';
        if (lower.includes('elantaran')) return 'bi-house-slash';
        return 'bi-three-dots';
    };

    // Replacement for static categories
    const categories = jenisKasusList.map(item => ({
        id: item.idJenisKasus.toString(),
        label: item.namaJenisKasus,
        icon: getIconForKasus(item.namaJenisKasus)
    }));

    const getSafetyTips = (catId) => {
        switch (catId) {
            case '1': // Fisik
                return [
                    "Menjauhlah dari pelaku segera.",
                    "Obati luka di fasilitas kesehatan dan minta visum.",
                    "Simpan bukti foto luka atau barang yang rusak.",
                    "Hubungi orang terpercaya untuk tempat berlindung sementara."
                ];
            case '3': // Seksual
                return [
                    "Jangan mandi atau mencuci pakaian yang dikenakan saat kejadian (untuk bukti DNA).",
                    "Segera cari pemeriksaan medis.",
                    "Cari dukungan psikologis dari ahli atau lembaga.",
                    "Anda tidak bersalah, jangan menyalahkan diri sendiri."
                ];
            default: // Umum
                return [
                    "Pastikan Anda berada di tempat yang aman.",
                    "Simpan nomor darurat di panggilan cepat (speed dial).",
                    "Jangan ragu untuk berteriak atau meminta tolong tetangga.",
                    "Screenshot bukti percakapan jika ada ancaman digital."
                ];
        }
    };

    // Use useCallback to prevent function recreation on every render
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        // Create a new object with the updated value
        const updatedData = { [name]: value };

        // Update form state
        setFormData(prev => {
            const newFormData = { ...prev, ...updatedData };

            // If the relationship is 'Korban Langsung' and we're updating the reporter fields,
            // also update the victim fields
            if (prev.hubungan === 'Korban Langsung') {
                if (name === 'namaPelapor') {
                    newFormData.namaKorban = value;
                }
                if (name === 'noHpPelapor') {
                    newFormData.noHpKorban = value;
                }
            }

            return newFormData;
        });
    }, []);

    // Use useCallback for the hubungan change handler
    const handleHubunganChange = useCallback((e) => {
        const value = e.target.value;
        setFormData(prev => {
            const newFormData = { ...prev, hubungan: value };

            if (value !== 'Korban Langsung') {
                newFormData.namaKorban = '';
                newFormData.noHpKorban = '';
            } else {
                newFormData.namaKorban = prev.namaPelapor;
                newFormData.noHpKorban = prev.noHpPelapor;
            }

            return newFormData;
        });
    }, []);



    const handleLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                let foundKecamatan = findKecamatanByLocation(latitude, longitude, kecamatanList);
                let isNearest = false;

                if (!foundKecamatan) {
                    // Fallback: Check nearest within 500m
                    const nearest = findNearestKecamatan(latitude, longitude, kecamatanList, 500);
                    if (nearest) {
                        foundKecamatan = nearest;
                        isNearest = true;
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    lokasi: `Lokasi Terkini (Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)})`,
                    koordinat: { lat: latitude, lng: longitude },
                    idKecamatan: foundKecamatan ? String(foundKecamatan.idKecamatan) : prev.idKecamatan
                }));

                if (foundKecamatan) {
                    if (isNearest) {
                        Swal.fire('Info Lokasi', `Lokasi Anda terdeteksi di dekat Kecamatan ${foundKecamatan.namaKecamatan}. Sistem telah memilihnya untuk Anda.`, 'info');
                    } else {
                        Swal.fire('Info Lokasi', `Lokasi terdeteksi di Kecamatan ${foundKecamatan.namaKecamatan}`, 'success');
                    }
                } else {
                    Swal.fire('Info Lokasi', `Lokasi Anda (${latitude.toFixed(5)}, ${longitude.toFixed(5)}) berada di luar wilayah deteksi otomatis database. Silakan pilih Kecamatan secara manual.`, 'warning');
                }

            }, () => {
                Swal.fire('Gagal', 'Gagal mengambil lokasi. Pastikan GPS aktif dan izin diberikan.', 'error');
            });
        } else {
            Swal.fire('Error', 'Browser tidak mendukung Geolocation.', 'error');
        }
    }, [kecamatanList]);

    const handleNext = useCallback((e) => {
        if (e) e.preventDefault();
        setStep(prev => prev + 1);
    }, []);

    const handleBack = useCallback((e) => {
        if (e) e.preventDefault();
        setStep(prev => prev - 1);
    }, []);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();

        // Construct Payload Object
        const payload = {
            pelapor: {
                namaPelapor: formData.namaPelapor,
                noTelpPelapor: formData.noHpPelapor,
                alamatPelapor: 'Alamat Pelapor',
                tanggalLahir: null
            },
            korban: {
                namaKorban: formData.namaKorban || formData.namaPelapor,
                alamatKorban: formData.alamatKorban || '',
                nikKorban: '',
                jenisKelamin: formData.jenisKelaminKorban || null,
                tanggalLahir: null
            },
            laporan: {
                idKecamatan: formData.idKecamatan,
                idJenisKasus: formData.kategori,
                idBentukKekerasan: '1',
                lokasiLengkapKejadian: formData.lokasi,
                tanggalKejadian: formData.tanggal,
                waktuKejadian: formData.waktu,
                kronologiKejadian: formData.kronologi,
                latitude: formData.koordinat ? formData.koordinat.lat : null,
                longitude: formData.koordinat ? formData.koordinat.lng : null
            }
        };

        // Validation
        if (!payload.laporan.idJenisKasus) {
            Swal.fire('Peringatan', 'Harap pilih jenis kekerasan.', 'warning');
            setLoading(false);
            return;
        }
        if (!payload.laporan.idKecamatan) {
            Swal.fire('Peringatan', 'Harap pilih kecamatan.', 'warning');
            setLoading(false);
            return;
        }
        if (!payload.laporan.kronologiKejadian) {
            Swal.fire('Peringatan', 'Harap isi kronologi kejadian.', 'warning');
            setLoading(false);
            return;
        }

        // Append JSON string
        data.append('data', JSON.stringify(payload));

        // Files
        files.forEach(file => {
            data.append('bukti', file);
        });

        try {
            const response = await fetch('http://localhost:5000/api/laporan/submit', {
                method: 'POST',
                body: data
            });

            const result = await response.json();

            if (response.ok) {
                setTicket(result.nomor_tiket);
                setStep(4);
            } else {
                Swal.fire('Gagal', result.message || 'Gagal mengirim laporan', 'error');
            }
        } catch (error) {
            console.error("Error submit:", error);
            Swal.fire('Error', 'Terjadi kesalahan koneksi', 'error');
        } finally {
            setLoading(false);
        }
    }, [formData, files]);

    // --- STEPS ---

    const Step1_Identity = () => (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800">Siapa yang melapor?</h3>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Saya melapor sebagai</label>
                <select
                    name="hubungan"
                    value={formData.hubungan}
                    onChange={handleHubunganChange}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 transition"
                >
                    <option value="Korban Langsung">Korban (Saya Sendiri)</option>
                    <option value="Keluarga">Keluarga / Kerabat</option>
                    <option value="Saksi">Saksi</option>
                    <option value="Lainnya">Lainnya</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap (Samaran Boleh)</label>
                <input
                    type="text"
                    name="namaPelapor"
                    value={formData.namaPelapor}
                    onChange={handleChange}
                    placeholder="Contoh: Bunga"
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nomor WhatsApp (Agar bisa dihubungi)</label>
                <input
                    type="tel"
                    name="noHpPelapor"
                    value={formData.noHpPelapor}
                    onChange={handleChange}
                    placeholder="08xxxxxxxx"
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
                />
            </div>

            {formData.hubungan !== 'Korban Langsung' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-4">Data Korban</h4>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="namaKorban"
                            value={formData.namaKorban}
                            onChange={handleChange}
                            placeholder="Nama Korban"
                            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-teal-500 outline-none"
                        />
                        <select
                            name="jenisKelaminKorban"
                            value={formData.jenisKelaminKorban}
                            onChange={handleChange}
                            className={`w-full p-3 rounded-lg border border-slate-200 focus:ring-teal-500 outline-none bg-white ${!formData.jenisKelaminKorban ? 'text-slate-400' : 'text-slate-900'}`}
                        >
                            <option value="" disabled>Pilih Jenis Kelamin Korban</option>
                            <option value="Laki-laki" className="text-slate-900">Laki-laki</option>
                            <option value="Perempuan" className="text-slate-900">Perempuan</option>
                        </select>
                        <input
                            type="tel"
                            name="noHpKorban"
                            value={formData.noHpKorban}
                            onChange={handleChange}
                            placeholder="Nomor HP Korban (Opsional)"
                            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-teal-500 outline-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const Step2_Incident = () => (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800">Apa yang terjadi?</h3>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Jenis Kekerasan</label>
                <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, kategori: cat.id }))}
                            className={`p-4 rounded-xl border text-left transition-all ${formData.kategori === cat.id ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-200' : 'bg-white border-slate-100 hover:bg-slate-50'}`}
                        >
                            <i className={`bi ${cat.icon} text-2xl ${formData.kategori === cat.id ? 'text-teal-600' : 'text-slate-400'} mb-2 block`}></i>
                            <span className={`font-semibold ${formData.kategori === cat.id ? 'text-teal-800' : 'text-slate-600'}`}>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal</label>
                    <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-teal-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Waktu (Perkiraan)</label>
                    <input
                        type="time"
                        name="waktu"
                        value={formData.waktu}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-teal-500 outline-none"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kecamatan</label>
                <select
                    name="idKecamatan"
                    value={formData.idKecamatan}
                    onChange={handleChange}
                    className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-teal-500 transition"
                >
                    <option value="">Pilih Kecamatan</option>
                    {kecamatanList.map(kec => (
                        <option key={kec.idKecamatan} value={kec.idKecamatan}>{kec.namaKecamatan}</option>
                    ))}
                </select>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">Lokasi Kejadian</label>
                    <button
                        type="button"
                        onClick={handleLocation}
                        className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1"
                    >
                        <i className="bi bi-geo-alt-fill"></i> Ambil Lokasi Saya
                    </button>
                </div>
                <input
                    type="text"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleChange}
                    placeholder="Nama Jalan / Gedung / Patokan"
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bukti Pendukung (Foto/Dokumen)</label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
            </div>
        </div>
    );

    const Step3_Chronology = () => (
        <div className="space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold text-slate-800">Ceritakan Sedikit</h3>
            <p className="text-slate-500 text-sm">Ceritakan secara singkat apa yang dialami. Detail lengkap bisa menyusul saat konseling.</p>

            <textarea
                name="kronologi"
                value={formData.kronologi}
                onChange={handleChange}
                rows="6"
                placeholder="Saya mengalami..."
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none transition resize-none"
            ></textarea>
        </div>
    );

    const Step4_Success = () => (
        <div className="text-center animate-fade-in py-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="bi bi-check-lg text-5xl text-green-600"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Laporan Diterima</h2>
            <p className="text-slate-600 mb-8">Terima kasih sudah berani melapor. Laporan Anda sedang kami verifikasi.</p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 max-w-sm mx-auto">
                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wide">Tiket Laporan Anda</p>
                <div className="text-3xl font-mono font-bold text-slate-800 bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-4 select-all">
                    {ticket}
                </div>
                <p className="text-xs text-rose-500 font-bold">*Mohon simpan kode tiket ini untuk mengecek status.</p>
            </div>

            <div className="space-y-6 text-left max-w-lg mx-auto bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-800 flex items-center gap-2">
                    <i className="bi bi-info-circle-fill"></i> Langkah Selanjutnya
                </h4>
                <ul className="space-y-3 text-sm text-blue-900">
                    <li className="flex gap-2">
                        <i className="bi bi-1-circle text-blue-500"></i>
                        <span>Admin kami akan memverifikasi laporan Anda.</span>
                    </li>
                    <li className="flex gap-2">
                        <i className="bi bi-2-circle text-blue-500"></i>
                        <span>Jika valid, kami akan menghubungi nomor WhatsApp Anda untuk penjadwalan.</span>
                    </li>
                    <li className="flex gap-2">
                        <i className="bi bi-3-circle text-blue-500"></i>
                        <span>Anda bisa datang ke kantor DP3A setelah mendapat konfirmasi.</span>
                    </li>
                </ul>
            </div>

            <div className="mt-8 text-left max-w-lg mx-auto">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <i className="bi bi-shield-check text-teal-600"></i> Tips Pencegahan & Keamanan
                </h4>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <ul className="space-y-2 text-sm text-slate-600">
                        {getSafetyTips(formData.kategori).map((tip, idx) => (
                            <li key={idx} className="flex gap-3">
                                <i className="bi bi-check2 text-teal-500 shrink-0"></i>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 flex gap-4 justify-center">
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-300 transition"
                >
                    Kembali ke Beranda
                </button>
                <button
                    onClick={() => window.open(`https://wa.me/?text=Saya%20baru%20saja%20melapor%20di%20DP3A%20dengan%20tiket%20${ticket}`, '_blank')}
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition shadow-lg shadow-green-600/30"
                >
                    <i className="bi bi-whatsapp mr-2"></i> Simpan di WA
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Progress Bar (Hidden on Success Step) */}
                {step < 4 && (
                    <div className="flex items-center justify-between mb-8 px-8 max-w-xl mx-auto">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center w-full last:w-auto">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 z-10 ${step >= s ? 'bg-teal-600 text-white shadow-lg scale-110' : 'bg-slate-200 text-slate-400'}`}>
                                    {s}
                                </div>
                                {s < 3 && (
                                    <div className="flex-1 h-1 bg-slate-200 -ml-2 -mr-2">
                                        <div className={`h-full bg-teal-600 transition-all duration-500 ${step > s ? 'w-full' : 'w-0'}`}></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 relative overflow-hidden">
                    {step < 4 ? (
                        <form onSubmit={handleSubmit}>
                            {step === 1 && Step1_Identity()}
                            {step === 2 && Step2_Incident()}
                            {step === 3 && Step3_Chronology()}

                            {/* Navigation Buttons (Hidden on Success Step) */}
                            <div className="flex gap-4 mt-10 pt-6 border-t border-slate-100">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition"
                                    >
                                        Kembali
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/30 transition transform active:scale-95"
                                    >
                                        Lanjut
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/30 transition transform active:scale-95 flex justify-center items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                                Mengirim...
                                            </>
                                        ) : 'Kirim Laporan'}
                                    </button>
                                )}
                            </div>
                        </form>
                    ) : (
                        <Step4_Success />
                    )}
                </div>

                {step < 4 && (
                    <p className="text-center text-slate-400 text-sm mt-6">
                        <i className="bi bi-shield-lock-fill mr-1"></i> Data Anda dijamin kerahasiaannya.
                    </p>
                )}
            </div>
        </div>
    );
};

export default FormLapor;
