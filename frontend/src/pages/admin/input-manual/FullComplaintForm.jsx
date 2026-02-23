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
        kecamatanList,
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
        <div className="max-w-6xl mx-auto pb-12">
            {/* Sticky Header Actions */}
            <div className="sticky top-0 z-20 bg-white shadow-sm border border-t-0 border-slate-200 rounded-b-2xl px-4 sm:px-6 py-4 sm:py-3 mb-8 md:mb-14 flex flex-col sm:flex-row justify-between items-start sm:items-center -mt-4 md:-mt-8 gap-3 sm:gap-0 w-full transition-all">
                <div className="w-full sm:w-auto">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Formulir Lengkap</h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Isi data lengkap untuk registrasi kasus fisik</p>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                    <button
                        onClick={() => navigate('/admin/laporan')}
                        className="flex-auto sm:flex-none justify-center px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-medium flex items-center"
                    >
                        <i className="bi bi-arrow-left sm:hidden mr-1"></i>
                        <span className="hidden sm:inline">Kembali</span>
                        <span className="sm:hidden">Kembali</span>
                    </button>
                    {id && (
                        <div className="relative flex-auto sm:flex-none" ref={printMenuRef}>
                            <button
                                onClick={() => setShowPrintMenu(!showPrintMenu)}
                                className="w-full justify-center px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
                            >
                                <i className="bi bi-printer"></i> Cetak <span className="hidden sm:inline">Surat</span> <i className="bi bi-chevron-down ml-auto sm:ml-0"></i>
                            </button>

                            {showPrintMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-[60] overflow-hidden transform transition-all duration-200 origin-top-right">
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
                                            <i className="bi bi-file-earmark-check text-lg text-slate-400"></i>
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
                        className="flex-auto sm:flex-none justify-center px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
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

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Sidebar Navigation */}
                <div className="lg:w-1/4 hidden lg:block sticky top-[100px]">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <h4 className="font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">Navigasi Formulir</h4>
                        <ul className="space-y-1 text-sm font-medium">
                            <li>
                                <a href="#data-umum" className="text-slate-600 hover:text-teal-600 hover:bg-slate-50 px-2 py-1.5 rounded block transition-colors">Data Umum</a>
                            </li>
                            <li>
                                <a href="#identitas-pelapor" className="text-slate-600 hover:text-teal-600 hover:bg-slate-50 px-2 py-1.5 rounded block transition-colors">I. Identitas Pelapor</a>
                            </li>
                            <li>
                                <a href="#identitas-korban" className="text-slate-600 hover:text-teal-600 hover:bg-slate-50 px-2 py-1.5 rounded block transition-colors">II. Identitas Korban</a>
                            </li>
                            <li>
                                <a href="#identitas-terlapor" className="text-slate-600 hover:text-teal-600 hover:bg-slate-50 px-2 py-1.5 rounded block transition-colors">III. Identitas Terlapor</a>
                            </li>
                            <li>
                                <a href="#identitas-kasus" className="text-slate-600 hover:text-teal-600 hover:bg-slate-50 px-2 py-1.5 rounded block transition-colors">IV. Identitas Kasus</a>
                            </li>
                            <li>
                                <a href="#trafficking" className="text-slate-600 hover:text-teal-600 hover:bg-slate-50 px-2 py-1.5 rounded block transition-colors">V. Indikator Trafficking</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Form Content */}
                <div className="lg:w-3/4 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
                        <div id="data-umum" className="scroll-mt-[100px]">
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
                        </div>

                        <PelaporForm formData={formData} handleChange={handleChange} />

                        <KorbanForm formData={formData} handleChange={handleChange} formType={formType} />

                        <TerlaporForm formData={formData} handleChange={handleChange} />

                        <KasusForm
                            formData={formData}
                            handleChange={handleChange}
                            jenisKasusList={jenisKasusList}
                            bentukKekerasanList={bentukKekerasanList}
                            kecamatanList={kecamatanList}
                        />

                        <TraffickingForm formData={formData} handleChange={handleChange} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FullComplaintForm;
