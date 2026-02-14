import React from 'react';

const KasusForm = ({ formData, handleChange, jenisKasusList, bentukKekerasanList }) => {
    return (
        <div className="border-t border-slate-100 pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">IV. Formulir Identifikasi Kasus</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kasus Kekerasan</label>
                        <select name="kategoriKasus" value={formData.kategoriKasus} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                            <option value="">Pilih Jenis Kasus</option>
                            {jenisKasusList.map((item) => (
                                <option key={item.idJenisKasus} value={item.idJenisKasus}>{item.namaJenisKasus}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bentuk Kekerasan</label>
                        <select name="bentukKekerasan" value={formData.bentukKekerasan} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                            <option value="">Pilih Bentuk Kekerasan</option>
                            {bentukKekerasanList.map((item) => (
                                <option key={item.idBentukKekerasan} value={item.idBentukKekerasan}>{item.namaBentukKekerasan}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Kejadian</label>
                        <input type="date" name="tanggalKejadian" value={formData.tanggalKejadian} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Waktu Kejadian</label>
                        <input type="time" name="waktuKejadian" value={formData.waktuKejadian} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tempat Kejadian</label>
                        <input type="text" name="tempatKejadian" value={formData.tempatKejadian} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Keinginan/Harapan Korban</label>
                    <textarea name="harapanKorban" value={formData.harapanKorban} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Layanan yang Dibutuhkan</label>
                        <select name="layananDibutuhkan" value={formData.layananDibutuhkan} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                            <option value="">Pilih Layanan</option>
                            <option value="Konseling">Konseling</option>
                            <option value="Mediasi">Mediasi</option>
                            <option value="Medis">Medis</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kedatangan Korban</label>
                        <select name="caraDatang" value={formData.caraDatang} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                            <option value="">Pilih Cara Datang</option>
                            <option value="Sendiri">Sendiri</option>
                            <option value="Bersama orang lain">Bersama orang lain</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Informasi/Pelimpahan/Rujukan Dari</label>
                    <input type="text" name="rujukanDari" value={formData.rujukanDari} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kronologi Singkat</label>
                    <textarea name="gambaranKasus" value={formData.gambaranKasus} onChange={handleChange} rows="5" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                </div>
            </div>
        </div>
    );
};

export default KasusForm;
