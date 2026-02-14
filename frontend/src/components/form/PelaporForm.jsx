import React from 'react';

const PelaporForm = ({ formData, handleChange }) => {
    return (
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
    );
};

export default PelaporForm;
