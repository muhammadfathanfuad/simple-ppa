import React from 'react';

const TerlaporForm = ({ formData, handleChange }) => {
    return (
        <div className="border-t border-slate-100 pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">III. Identitas Terlapor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="namaTerlapor" value={formData.namaTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tempat/Tgl Lahir</label>
                    <input type="text" name="ttlTerlapor" value={formData.ttlTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Kendari, 01-01-1990" />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat (Desa, Kel, Kec, Kab, Kota, Prov)</label>
                    <textarea name="alamatTerlapor" value={formData.alamatTerlapor} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                    <input type="text" name="noTelpTerlapor" value={formData.noTelpTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pendidikan</label>
                    <select name="pendidikanTerlapor" value={formData.pendidikanTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="">Pilih Pendidikan</option>
                        <option value="Tidak Sekolah">Tidak Sekolah</option>
                        <option value="SD">SD</option>
                        <option value="SLTP">SLTP</option>
                        <option value="SLTA">SLTA</option>
                        <option value="D1/D2/D3">D1/D2/D3</option>
                        <option value="S1/S2/S3">S1/S2/S3</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Agama</label>
                    <select name="agamaTerlapor" value={formData.agamaTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Budha">Budha</option>
                        <option value="Konghucu">Konghucu</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan</label>
                    <input type="text" name="pekerjaanTerlapor" value={formData.pekerjaanTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status Perkawinan</label>
                    <select name="statusPerkawinanTerlapor" value={formData.statusPerkawinanTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="">Pilih Status</option>
                        <option value="Belum Kawin">Belum Kawin</option>
                        <option value="Kawin">Kawin</option>
                        <option value="Cerai Hidup">Cerai Hidup</option>
                        <option value="Cerai Mati">Cerai Mati</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Ortu/Wali</label>
                    <input type="text" name="namaOrtuWaliTerlapor" value={formData.namaOrtuWaliTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Ortu/Wali (Desa, Kel, Kec, Kab, Kota, Prov)</label>
                    <textarea name="alamatOrtuWaliTerlapor" value={formData.alamatOrtuWaliTerlapor} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan Ortu</label>
                    <input type="text" name="pekerjaanOrtuTerlapor" value={formData.pekerjaanOrtuTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Saudara</label>
                    <input type="number" name="jumlahSaudaraTerlapor" value={formData.jumlahSaudaraTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hubungan dengan Korban</label>
                    <input type="text" name="hubunganKorbanTerlapor" value={formData.hubunganKorbanTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default TerlaporForm;
