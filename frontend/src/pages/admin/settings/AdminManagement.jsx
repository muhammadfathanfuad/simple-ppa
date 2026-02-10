import React, { useState, useEffect } from 'react';

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ nama: '', email: '', password: '' });
    const [editId, setEditId] = useState(null);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            // Ensure data is an array
            if (Array.isArray(data)) {
                setAdmins(data);
            } else {
                setAdmins([]);
                console.error("Data received is not an array:", data);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editId
            ? `http://localhost:5000/api/admin/users/${editId}`
            : 'http://localhost:5000/api/admin/users';
        const method = editId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchAdmins();
                setShowModal(false);
                setFormData({ nama: '', email: '', password: '' });
                setEditId(null);
            } else {
                alert('Gagal menyimpan data');
            }
        } catch (error) {
            console.error("Error saving admin:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus admin ini?')) return;
        try {
            await fetch(`http://localhost:5000/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            fetchAdmins();
        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };

    const handleEdit = (admin) => {
        setFormData({ nama: admin.namaAdmin, email: admin.email, password: '' });
        setEditId(admin.idAdmin);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Daftar Admin</h3>
                <button
                    onClick={() => {
                        setFormData({ nama: '', email: '', password: '' });
                        setEditId(null);
                        setShowModal(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <i className="bi bi-plus-lg"></i> Tambah Admin
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Nama</th>
                            <th className="px-6 py-3 font-medium">Email</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-4">Memuat...</td></tr>
                        ) : admins.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-4 text-slate-500">Belum ada admin lain.</td></tr>
                        ) : (
                            admins.map(admin => (
                                <tr key={admin.idAdmin} className="hover:bg-slate-50">
                                    <td className="px-6 py-3">{admin.namaAdmin}</td>
                                    <td className="px-6 py-3">{admin.email}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {admin.aktif ? 'Aktif' : 'Non-Aktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 flex justify-center gap-2">
                                        <button onClick={() => handleEdit(admin)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><i className="bi bi-pencil"></i></button>
                                        <button onClick={() => handleDelete(admin.idAdmin)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><i className="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">{editId ? 'Edit Admin' : 'Tambah Admin'}</h3>
                            <button onClick={() => setShowModal(false)}><i className="bi bi-x-lg text-slate-400"></i></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                <input type="text" required value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password {editId && '(Kosongkan jika tidak ubah)'}</label>
                                <input type="password" required={!editId} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <button type="submit" className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">Simpan</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
