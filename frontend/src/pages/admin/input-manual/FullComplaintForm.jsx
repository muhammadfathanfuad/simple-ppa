import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PelaporForm from '../../../components/form/PelaporForm';
import KorbanForm from '../../../components/form/KorbanForm';
import TerlaporForm from '../../../components/form/TerlaporForm';
import KasusForm from '../../../components/form/KasusForm';
import TraffickingForm from '../../../components/form/TraffickingForm';
import { generateSuratPermohonan, generateFormulirPenerimaan, generateFormulirIdentifikasi } from '../../../utils/pdfGenerator';
import useComplaintForm from '../../../hooks/useComplaintForm';

const FullComplaintForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Use Custom Hook
    const {
        formData,
        loading,
        jenisKasusList,
        bentukKekerasanList,
        formType,
        setFormType,
        handleChange,
        handleSubmit
    } = useComplaintForm(id);

    const [showPrintMenu, setShowPrintMenu] = useState(false);
    const printMenuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (printMenuRef.current && !printMenuRef.current.contains(event.target)) {
                setShowPrintMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    {id && (
                        <div className="relative" ref={printMenuRef}>
                            <button
                                onClick={() => setShowPrintMenu(!showPrintMenu)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <i className="bi bi-printer"></i> Cetak Surat <i className="bi bi-chevron-down"></i>
                            </button>

                            {showPrintMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden transform transition-all duration-200 origin-top-right">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                generateSuratPermohonan(formData, jenisKasusList);
                                                setShowPrintMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors border-b border-slate-50"
                                        >
                                            <i className="bi bi-envelope-paper text-lg text-slate-400"></i>
                                            <span>Surat Permohonan</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                generateFormulirPenerimaan(formData);
                                                setShowPrintMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                                        >
                                            <span>Formulir Penerimaan</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                generateFormulirIdentifikasi(formData, jenisKasusList, bentukKekerasanList);
                                                setShowPrintMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                                        >
                                            <i className="bi bi-file-earmark-person text-lg text-slate-400"></i>
                                            <span>Formulir Identifikasi Kasus</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading ? 'Menyimpan...' : (
                            <>
                                <i className="bi bi-save"></i> Simpan
                            </>
                        )}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Klien</label>
                            <input type="text" name="namaKlien" value={formData.namaKlien} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Klien</label>
                            <input type="text" name="alamatKlien" value={formData.alamatKlien} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Penerima Pengaduan</label>
                            <input type="text" name="penerimaPengaduan" value={formData.penerimaPengaduan} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>

                    <PelaporForm formData={formData} handleChange={handleChange} />

                    <KorbanForm formData={formData} handleChange={handleChange} formType={formType} />

                    <TerlaporForm formData={formData} handleChange={handleChange} />

                    <KasusForm
                        formData={formData}
                        handleChange={handleChange}
                        jenisKasusList={jenisKasusList}
                        bentukKekerasanList={bentukKekerasanList}
                    />

                    <TraffickingForm formData={formData} handleChange={handleChange} />
                </form>
            </div>
        </div>
    );
};

export default FullComplaintForm;
