import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors focus:outline-none"
                        >
                            <i className={`bi ${isSidebarOpen ? 'bi-text-indent-right' : 'bi-text-indent-left'} text-xl`}></i>
                        </button>
                        <h1 className="text-lg font-semibold text-slate-700">Dashboard Overview</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200 overflow-hidden">
                                    {user.fotoProfil ? (
                                        <img
                                            src={`http://localhost:5000${user.fotoProfil}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        (user.nama || 'A').charAt(0)
                                    )}
                                </div>
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.nama || 'Admin'}</span>
                                <i className="bi bi-chevron-down text-xs text-slate-400"></i>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50">
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            navigate('/admin/pengaturan');
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                        <i className="bi bi-person-circle text-slate-400"></i> Profil Saya
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <i className="bi bi-box-arrow-right"></i> Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
