import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const FullComplaintForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(!!id);
    const [formType, setFormType] = useState('Anak'); // 'Anak' or 'Perempuan'

    // Form Stats
    const [formData, setFormData] = useState({
        noRegistrasi: '',
        tanggal: new Date().toISOString().split('T')[0],

        // Pelapor
        namaPelapor: '',
        jkPelapor: 'Laki-laki',
        ttlPelapor: '',
        alamatPelapor: '',
        noTelpPelapor: '',
        pekerjaanPelapor: '',
        hubunganKorban: '',

        // Korban
        namaKorban: '',
        jkKorban: 'Perempuan',
        ttlKorban: '',
        alamatKorban: '',
        noTelpKorban: '',
        pekerjaanKorban: '',
        pendidikanKorban: '',
        statusPerkawinanKorban: '', // For Women
        disabilitasKorban: false,
        jenisDisabilitasKorban: '',

        // Kasus
        gambaranKasus: '',
        kategoriKasus: 'Fisik', // Fisik, Psikis, Seksual, Penelantaran, Lainnya
    });

    useEffect(() => {
        if (id) {
            fetchReportData(id);
        }
    }, [id]);

    const fetchReportData = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/laporan/detail/${reportId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    noRegistrasi: data.kodeLaporan || '',
                    tanggal: data.dibuatPada ? data.dibuatPada.split('T')[0] : prev.tanggal,

                    // Pelapor
                    namaPelapor: data.pelapor?.nama || '',
                    jkPelapor: data.pelapor?.jenisKelamin || 'Laki-laki',
                    ttlPelapor: data.pelapor?.tempatTanggalLahir || '',
                    alamatPelapor: data.pelapor?.alamat || '',
                    noTelpPelapor: data.pelapor?.nomorWhatsapp || '',
                    pekerjaanPelapor: data.pelapor?.pekerjaan || '',
                    hubunganKorban: data.pelapor?.hubunganDenganKorban || '',

                    // Korban
                    namaKorban: data.korban?.namaLengkap || '',
                    jkKorban: data.korban?.jenisKelamin || 'Perempuan',
                    ttlKorban: data.korban?.tempatTanggalLahir || '',
                    alamatKorban: data.korban?.alamatDomisili || '', // Note: Check schema if it's alamatDomisili or alamat
                    noTelpKorban: data.korban?.nomorTelepon || '',
                    pekerjaanKorban: data.korban?.pekerjaan || '', // Check if schema has this
                    pendidikanKorban: data.korban?.pendidikan || '', // Check if schema has this
                    statusPerkawinanKorban: data.korban?.statusPerkawinan || '',
                    disabilitasKorban: data.korban?.disabilitas || false,
                    jenisDisabilitasKorban: data.korban?.jenisDisabilitas || '',

                    // Kasus
                    gambaranKasus: data.kronologiSingkat || '',
                    kategoriKasus: data.jenisKasus?.namaJenisKasus || 'Fisik', // Fallback
                }));
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`FORMULIR REGISTRASI ${formType.toUpperCase()}`, 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`No. Registrasi: ${formData.noRegistrasi}`, 14, 30);
        doc.text(`Tanggal: ${formData.tanggal}`, 14, 35);

        // Section 1: Identitas Pelapor
        doc.setFont('helvetica', 'bold');
        doc.text('I. IDENTITAS PELAPOR', 14, 45);

        const pelaporData = [
            ['Nama', formData.namaPelapor],
            ['Jenis Kelamin', formData.jkPelapor],
            ['Tempat/Tgl Lahir', formData.ttlPelapor],
            ['Alamat', formData.alamatPelapor],
            ['No. Telepon', formData.noTelpPelapor],
            ['Pekerjaan', formData.pekerjaanPelapor],
            ['Hubungan dgn Korban', formData.hubunganKorban],
        ];

        doc.autoTable({
            startY: 48,
            body: pelaporData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 1 },
            columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } },
        });

        // Section 2: Identitas Korban
        let finalY = doc.lastAutoTable.finalY + 10;
        doc.setFont('helvetica', 'bold');
        doc.text('II. IDENTITAS KORBAN', 14, finalY);

        const korbanData = [
            ['Nama', formData.namaKorban],
            ['Jenis Kelamin', formData.jkKorban],
            ['Tempat/Tgl Lahir', formData.ttlKorban],
            ['Alamat', formData.alamatKorban],
            ['No. Telepon', formData.noTelpKorban],
            ['Pekerjaan', formData.pekerjaanKorban],
            ['Pendidikan', formData.pendidikanKorban],
            ['Disabilitas', formData.disabilitasKorban ? `Ya (${formData.jenisDisabilitasKorban})` : 'Tidak'],
        ];

        if (formType === 'Perempuan') {
            korbanData.push(['Status Perkawinan', formData.statusPerkawinanKorban]);
        }

        doc.autoTable({
            startY: finalY + 3,
            body: korbanData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 1 },
            columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } },
        });

        // Section 3: Gambaran Kasus
        finalY = doc.lastAutoTable.finalY + 10;
        doc.setFont('helvetica', 'bold');
        doc.text('III. GAMBARAN KASUS', 14, finalY);

        doc.setFont('helvetica', 'normal');
        doc.text(`Kategori: ${formData.kategoriKasus}`, 14, finalY + 5);

        const splitText = doc.splitTextToSize(formData.gambaranKasus, 180);
        doc.text(splitText, 14, finalY + 10);

        // Signature
        const pageHeight = doc.internal.pageSize.height;
        doc.text('Kendari, ' + new Date().toLocaleDateString('id-ID'), 140, pageHeight - 40);
        doc.text('Penerima Laporan,', 140, pageHeight - 35);
        doc.text('( ..................................... )', 140, pageHeight - 15);

        doc.save(`Formulir_Registrasi_${formType}_${formData.noRegistrasi || 'Draft'}.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Formulir Lengkap</h2>
                    <p className="text-slate-500 text-sm">Isi data lengkap untuk registrasi kasus fisik</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/admin/laporan')}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium"
                    >
                        Kembali
                    </button>
                    <button
                        onClick={generatePDF}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                        <i className="bi bi-file-pdf"></i> Download PDF
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                {/* Form Type Selector */}
                <div className="mb-6 flex gap-4 border-b border-slate-100 pb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="formType"
                            value="Anak"
                            checked={formType === 'Anak'}
                            onChange={(e) => setFormType(e.target.value)}
                            className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className="font-medium text-slate-700">Formulir Anak</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="formType"
                            value="Perempuan"
                            checked={formType === 'Perempuan'}
                            onChange={(e) => setFormType(e.target.value)}
                            className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className="font-medium text-slate-700">Formulir Perempuan</span>
                    </label>
                </div>

                <form className="space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">No. Registrasi</label>
                            <input
                                type="text"
                                name="noRegistrasi"
                                value={formData.noRegistrasi}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                                placeholder="Contoh: 001/REG/2026"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                            <input
                                type="date"
                                name="tanggal"
                                value={formData.tanggal}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                            />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">I. Identitas Pelapor</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                <input type="text" name="namaPelapor" value={formData.namaPelapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                                <select name="jkPelapor" value={formData.jkPelapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tempat/Tgl Lahir</label>
                                <input type="text" name="ttlPelapor" value={formData.ttlPelapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Kendari, 01-01-1990" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                                <input type="text" name="noTelpPelapor" value={formData.noTelpPelapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                                <textarea name="alamatPelapor" value={formData.alamatPelapor} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan</label>
                                <input type="text" name="pekerjaanPelapor" value={formData.pekerjaanPelapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hubungan dengan Korban</label>
                                <input type="text" name="hubunganKorban" value={formData.hubunganKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">II. Identitas Korban</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                <input type="text" name="namaKorban" value={formData.namaKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                                <select name="jkKorban" value={formData.jkKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                    <option value="Perempuan">Perempuan</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tempat/Tgl Lahir</label>
                                <input type="text" name="ttlKorban" value={formData.ttlKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Kendari, 01-01-2010" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pendidikan</label>
                                <input type="text" name="pendidikanKorban" value={formData.pendidikanKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                                <textarea name="alamatKorban" value={formData.alamatKorban} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                            </div>

                            {formType === 'Perempuan' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status Perkawinan</label>
                                    <select name="statusPerkawinanKorban" value={formData.statusPerkawinanKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                        <option value="">Pilih Status</option>
                                        <option value="Belum Kawin">Belum Kawin</option>
                                        <option value="Kawin">Kawin</option>
                                        <option value="Cerai Hidup">Cerai Hidup</option>
                                        <option value="Cerai Mati">Cerai Mati</option>
                                    </select>
                                </div>
                            )}

                            <div className="col-span-2 flex items-center gap-4 mt-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="disabilitasKorban"
                                        checked={formData.disabilitasKorban}
                                        onChange={handleChange}
                                        className="rounded text-teal-600 focus:ring-teal-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Penyandang Disabilitas?</span>
                                </label>
                                {formData.disabilitasKorban && (
                                    <input
                                        type="text"
                                        name="jenisDisabilitasKorban"
                                        value={formData.jenisDisabilitasKorban}
                                        onChange={handleChange}
                                        placeholder="Sebutkan jenis disabilitas..."
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">III. Gambaran Kasus</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Kasus</label>
                                <select name="kategoriKasus" value={formData.kategoriKasus} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                    <option value="Fisik">Kekerasan Fisik</option>
                                    <option value="Psikis">Kekerasan Psikis</option>
                                    <option value="Seksual">Kekerasan Seksual</option>
                                    <option value="Penelantaran">Penelantaran</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Uraian Singkat Kejadian</label>
                                <textarea name="gambaranKasus" value={formData.gambaranKasus} onChange={handleChange} rows="5" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FullComplaintForm;
