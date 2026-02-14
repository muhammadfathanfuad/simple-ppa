import React from 'react';

const KorbanForm = ({ formData, handleChange, formType }) => {
    return (
        <div className="border-t border-slate-100 pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4">II. Identitas Korban</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input type="text" name="namaKorban" value={formData.namaKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIK</label>
                    <input type="text" name="nikKorban" value={formData.nikKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                    <select name="jkKorban" value={formData.jkKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="Perempuan">Perempuan</option>
                        <option value="Laki-laki">Laki-laki</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kewarganegaraan</label>
                    <select name="kewarganegaraanKorban" value={formData.kewarganegaraanKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                        <option value="WNI">WNI</option>
                        <option value="WNA">WNA</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tempat/Tgl Lahir</label>
                    <input type="text" name="ttlKorban" value={formData.ttlKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Kendari, 01-01-2010" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Agama</label>
                    <select name="agamaKorban" value={formData.agamaKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                    <input type="text" name="noTelpKorban" value={formData.noTelpKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pendidikan</label>
                    <input type="text" name="pendidikanKorban" value={formData.pendidikanKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan</label>
                    <input type="text" name="pekerjaanKorban" value={formData.pekerjaanKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Anak</label>
                    <input type="number" name="jumlahAnakKorban" value={formData.jumlahAnakKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                    <textarea name="alamatKorban" value={formData.alamatKorban} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                </div>

                <div className="col-span-2 border-t border-slate-50 mt-2 pt-4">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Data Orang Tua / Wali</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                            <input type="text" name="namaOrtuWali" value={formData.namaOrtuWali} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Kewarganegaraan Ortu</label>
                            <select name="kewarganegaraanOrtuWali" value={formData.kewarganegaraanOrtuWali} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg">
                                <option value="WNI">WNI</option>
                                <option value="WNA">WNA</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Ortu / Wali (Desa, Kec, Kab/Kota)</label>
                            <textarea name="alamatOrtuWali" value={formData.alamatOrtuWali} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Termasuk Desa, Kecamatan, Kabupaten/Kota, Provinsi"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan Ayah</label>
                            <input type="text" name="pekerjaanAyah" value={formData.pekerjaanAyah} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan Ibu</label>
                            <input type="text" name="pekerjaanIbu" value={formData.pekerjaanIbu} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="col-span-2 border-t border-slate-50 mt-2 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Saudara Korban</label>
                            <input type="number" name="jumlahSaudaraKorban" value={formData.jumlahSaudaraKorban} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hubungan dengan Terlapor</label>
                            <input type="text" name="hubunganTerlapor" value={formData.hubunganTerlapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
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
    );
};

export default KorbanForm;
