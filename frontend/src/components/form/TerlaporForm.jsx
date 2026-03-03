import React from 'react';

const TerlaporForm = ({ formData, handleChange, hubunganKorbanList }) => {
    return (
        <div id="identitas-terlapor" className="border-t border-slate-100 pt-4 scroll-mt-[100px]">
            <h3 className="text-lg font-bold text-slate-800 mb-4 sticky top-[100px] bg-white z-10 py-2 border-b border-slate-100 shadow-sm px-2 -mx-2 rounded">III. Identitas Terlapor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="namaTerlapor" value={formData.namaTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Umur</label>
                    <input type="text" name="umurTerlapor" value={formData.umurTerlapor || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Contoh: 30 Tahun" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                    <select name="jkTerlapor" value={formData.jkTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kewarganegaraan</label>
                    <select name="kewarganegaraanTerlapor" value={formData.kewarganegaraanTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="WNI">WNI</option>
                        <option value="WNA">WNA</option>
                    </select>
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
                        <option value="Perguruan Tinggi">Perguruan Tinggi</option>
                        <option value="PAUD/TK">PAUD/TK</option>
                        <option value="Tidak Dikenal">Tidak Dikenal</option>
                        <option value="Lainnya">Lainnya</option>
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
                    <select name="statusPerkawinanTerlapor" value={formData.statusPerkawinanTerlapor || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="">Pilih Status</option>
                        <option value="Belum Kawin">Belum Kawin</option>
                        <option value="Kawin">Kawin</option>
                        <option value="Cerai Hidup">Cerai Hidup</option>
                        <option value="Cerai Mati">Cerai Mati</option>
                    </select>
                </div>
                {['Kawin', 'Cerai Hidup', 'Cerai Mati'].includes(formData.statusPerkawinanTerlapor) && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Anak</label>
                        <input type="number" name="jumlahAnakTerlapor" value={formData.jumlahAnakTerlapor || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                    </div>
                )}
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
                    <select
                        name="hubunganKorbanTerlapor"
                        value={formData.hubunganKorbanTerlapor || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                        <option value="">Pilih Hubungan</option>
                        {hubunganKorbanList?.map((item) => (
                            <option key={item.idHubungan} value={item.namaHubungan}>{item.namaHubungan}</option>
                        ))}
                        <option value="Lainnya">Lainnya</option>
                    </select>
                    {formData.hubunganKorbanTerlapor === 'Lainnya' && (
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sebutkan Hubungan Lainnya</label>
                            <input
                                type="text"
                                name="hubunganKorbanTerlaporLainnya"
                                value={formData.hubunganKorbanTerlaporLainnya || ''}
                                onChange={handleChange}
                                placeholder="Masukkan hubungan lainnya..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TerlaporForm;
