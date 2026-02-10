import React, { useState, useEffect } from 'react';

const ProfileSettings = () => {
    const [profile, setProfile] = useState({
        nama: '',
        email: '',
        fotoProfil: null
    });
    const [passwordData, setPasswordData] = useState({
        passwordLama: '',
        passwordBaru: '',
        konfirmasiPassword: ''
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch current profile
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await res.json();
                if (data) {
                    setProfile({
                        nama: data.nama,
                        email: data.email,
                        fotoProfil: data.fotoProfil
                    });
                    // Update local storage user info
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    localStorage.setItem('user', JSON.stringify({ ...user, nama: data.nama, email: data.email, fotoProfil: data.fotoProfil }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, fotoBaru: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.passwordBaru && passwordData.passwordBaru !== passwordData.konfirmasiPassword) {
            setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('nama', profile.nama);
        formData.append('email', profile.email);
        if (profile.fotoBaru) {
            formData.append('fotoProfil', profile.fotoBaru);
        }
        if (passwordData.passwordBaru) {
            formData.append('password', passwordData.passwordBaru);
            formData.append('passwordLama', passwordData.passwordLama);
        }

        try {
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
                // Update local storage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({ ...user, ...data.admin }));

                // Clear password fields
                setPasswordData({ passwordLama: '', passwordBaru: '', konfirmasiPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Gagal memperbarui profil.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Edit Profil Saya</h3>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200">
                        {previewImage || profile.fotoProfil ? (
                            <img
                                src={previewImage || `http://localhost:5000${profile.fotoProfil}`}
                                alt="Profil"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <i className="bi bi-person-fill text-4xl"></i>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Foto Profil</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                        />
                        <p className="text-xs text-slate-500 mt-1">Format JPG/PNG, maks 2MB.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            value={profile.nama}
                            onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-6 mt-6">
                    <h4 className="text-md font-semibold text-slate-800 mb-4">Ubah Password</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
                            <input
                                type="password"
                                placeholder="Kosongkan jika tidak ingin mengubah"
                                value={passwordData.passwordBaru}
                                onChange={(e) => setPasswordData({ ...passwordData, passwordBaru: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                        {passwordData.passwordBaru && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password Baru</label>
                                    <input
                                        type="password"
                                        value={passwordData.konfirmasiPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, konfirmasiPassword: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Password Lama (Verifikasi)</label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.passwordLama}
                                        onChange={(e) => setPasswordData({ ...passwordData, passwordLama: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-70"
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
