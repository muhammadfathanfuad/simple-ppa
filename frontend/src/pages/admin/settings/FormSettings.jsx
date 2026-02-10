import React, { useState, useEffect } from 'react';

const MasterTable = ({ title, endpoint, columns, onCreate, onUpdate, onDelete }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [editId, setEditId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/admin/master/${endpoint}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const result = await response.json();
            if (Array.isArray(result)) setData(result);
            else setData([]);
        } catch (error) {
            console.error(`Error fetching ${title}:`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editId
            ? `http://localhost:5000/api/admin/master/${endpoint}/${editId}`
            : `http://localhost:5000/api/admin/master/${endpoint}`;
        const method = editId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                fetchData();
                setShowModal(false);
                setFormData({});
                setEditId(null);
            } else {
                const err = await res.json();
                alert(err.message || 'Gagal menyimpan data');
            }
        } catch (error) {
            console.error("Error saving:", error);
        }
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('Hapus data ini?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/master/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) fetchData();
            else {
                const err = await res.json();
                alert(err.message || 'Gagal menghapus');
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-700">{title}</h4>
                <button
                    onClick={() => {
                        setFormData({});
                        setEditId(null);
                        setShowModal(true);
                    }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium"
                >
                    + Tambah
                </button>
            </div>

            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100 text-slate-500 border-b border-slate-200">
                        <tr>
                            {columns.map((col, idx) => <th key={idx} className="px-4 py-2 font-medium">{col.label}</th>)}
                            <th className="px-4 py-2 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {loading ? (
                            <tr><td colSpan={columns.length + 1} className="text-center py-3">Memuat...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={columns.length + 1} className="text-center py-3 text-slate-400">Kosong</td></tr>
                        ) : (
                            data.map((item, idx) => (
                                <tr key={idx}>
                                    {columns.map((col, cIdx) => (
                                        <td key={cIdx} className="px-4 py-2">{item[col.key]}</td>
                                    ))}
                                    <td className="px-4 py-2 text-right">
                                        <button onClick={() => { setFormData(item); setEditId(Object.values(item)[0]); setShowModal(true); }} className="text-blue-600 hover:underline text-xs mr-2">Edit</button>
                                        <button onClick={() => handleDeleteClick(Object.values(item)[0])} className="text-red-600 hover:underline text-xs">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5">
                        <h3 className="font-bold text-slate-800 mb-4">{editId ? 'Edit' : 'Tambah'} {title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {columns.map((col) => (
                                <div key={col.key}>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">{col.label}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData[col.key] || ''}
                                        onChange={(e) => setFormData({ ...formData, [col.key]: e.target.value })}
                                        className="w-full px-3 py-2 border rounded text-sm"
                                    />
                                </div>
                            ))}
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded text-sm">Batal</button>
                                <button type="submit" className="px-3 py-1.5 bg-teal-600 text-white rounded text-sm hover:bg-teal-700">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FormSettings = () => {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Pengaturan Master Data Form</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MasterTable
                    title="Jenis Kasus"
                    endpoint="jenis-kasus"
                    columns={[{ label: 'Nama Jenis Kasus', key: 'namaJenisKasus' }]}
                />
                <MasterTable
                    title="Bentuk Kekerasan"
                    endpoint="bentuk-kekerasan"
                    columns={[{ label: 'Nama Bentuk', key: 'namaBentukKekerasan' }]}
                />
                <MasterTable
                    title="Kecamatan"
                    endpoint="kecamatan"
                    columns={[
                        { label: 'Nama Kecamatan', key: 'namaKecamatan' },
                        { label: 'Kode', key: 'kodeKecamatan' },
                        { label: 'Warna Peta', key: 'warna' }
                    ]}
                />
            </div>
        </div>
    );
};

export default FormSettings;
