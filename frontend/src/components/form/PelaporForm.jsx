import React from 'react';

const PelaporForm = ({ formData, handleChange, hubunganKorbanList }) => {
    return (
        <div id="identitas-pelapor" className="border-t border-slate-100 pt-4 scroll-mt-[100px]">
            <h3 className="text-lg font-bold text-slate-800 mb-4 sticky top-[100px] bg-white z-10 py-2 border-b border-slate-100 shadow-sm px-2 -mx-2 rounded">I. Identitas Pelapor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
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
                <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
                    <textarea name="alamatPelapor" value={formData.alamatPelapor} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Pekerjaan</label>
                    <input type="text" name="pekerjaanPelapor" value={formData.pekerjaanPelapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hubungan dengan Korban</label>
                    <select
                        name="hubunganKorban"
                        value={formData.hubunganKorban || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                        <option value="">Pilih Hubungan</option>
                        {hubunganKorbanList?.map((item) => (
                            <option key={item.idHubungan} value={item.namaHubungan}>{item.namaHubungan}</option>
                        ))}
                        <option value="Lainnya">Lainnya</option>
                    </select>
                    {formData.hubunganKorban === 'Lainnya' && (
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sebutkan Hubungan Lainnya</label>
                            <input
                                type="text"
                                name="hubunganKorbanLainnya"
                                value={formData.hubunganKorbanLainnya || ''}
                                onChange={handleChange}
                                placeholder="Masukkan hubungan lainnya..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Hubungan dengan Terlapor</label>
                    <input type="text" name="hubunganTerlaporPelapor" value={formData.hubunganTerlaporPelapor} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default PelaporForm;
