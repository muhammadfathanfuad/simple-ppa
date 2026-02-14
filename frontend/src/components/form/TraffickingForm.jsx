import React from 'react';

const TraffickingForm = ({ formData, handleChange }) => {
    return (
        <div className="mt-4 border-t border-slate-200 pt-4">
            <label className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    name="isTrafficking"
                    checked={formData.isTrafficking}
                    onChange={handleChange}
                    className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-bold text-slate-800">Khusus Kasus Trafficking</span>
            </label>

            {formData.isTrafficking && (
                <div className="space-y-4 pl-4 border-l-2 border-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Rute Trafficking</label>
                        <textarea name="ruteTrafficking" value={formData.ruteTrafficking} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Alat Transportasi</label>
                            <input type="text" name="alatTransportasi" value={formData.alatTransportasi} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cara yang Digunakan</label>
                            <input type="text" name="caraDigunakan" value={formData.caraDigunakan} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bentuk Eksploitasi di Negara/Daerah Tujuan</label>
                        <textarea name="bentukEksploitasi" value={formData.bentukEksploitasi} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bentuk Pelanggaran</label>
                        <textarea name="bentukPelanggaran" value={formData.bentukPelanggaran} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Bentuk Kriminalisasi (Bila ada)</label>
                        <textarea name="bentukKriminalisasi" value={formData.bentukKriminalisasi} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-300 rounded-lg"></textarea>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TraffickingForm;
