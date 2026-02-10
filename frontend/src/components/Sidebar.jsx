import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen = true }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-100 min-h-screen flex flex-col transition-all duration-300 relative`}>
            {/* Logo Section */}
            <div className={`p-6 border-b border-slate-700 flex items-center ${!isOpen && 'justify-center'} overflow-hidden whitespace-nowrap`}>
                {isOpen ? (
                    <div className="flex items-center gap-3">
                        {/* Profile Image */}
                        <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center overflow-hidden shrink-0">
                            {JSON.parse(localStorage.getItem('user') || '{}').fotoProfil ? (
                                <img
                                    src={`http://localhost:5000${JSON.parse(localStorage.getItem('user')).fotoProfil}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white font-bold text-lg">
                                    {(JSON.parse(localStorage.getItem('user') || '{}').nama || 'A').charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-sm font-bold font-display text-teal-400 truncate w-32">
                                {JSON.parse(localStorage.getItem('user') || '{}').nama || 'Admin Panel'}
                            </h2>
                            <p className="text-[10px] text-slate-400">DP3A Sultra</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {(JSON.parse(localStorage.getItem('user') || '{}').nama || 'A').charAt(0)}
                    </div>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${isActive
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`
                    }
                >
                    <i className="bi bi-grid-1x2-fill text-lg"></i>
                    {isOpen && <span className="font-medium">Dashboard</span>}
                </NavLink>

                {/* Placeholder for future links */}
                <div className={`pt-4 pb-2 ${!isOpen && 'hidden'}`}>
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Laporan</p>
                </div>
                {!isOpen && <div className="h-px bg-slate-800 my-2 mx-2"></div>}

                <NavLink
                    to="/admin/laporan"
                    end
                    className={({ isActive }) =>
                        `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${isActive
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`
                    }
                >
                    <i className="bi bi-file-earmark-text text-lg"></i>
                    {isOpen && <span className="font-medium">Semua Laporan</span>}
                </NavLink>

                <NavLink
                    to="/admin/laporan/baru"
                    className={({ isActive }) =>
                        `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${isActive
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`
                    }
                >
                    <i className="bi bi-pencil-square text-lg"></i>
                    {isOpen && <span className="font-medium">Input Manual</span>}
                </NavLink>
                <NavLink
                    to="/admin/pengaturan"
                    className={({ isActive }) =>
                        `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${isActive
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`
                    }
                >
                    <i className="bi bi-gear-fill text-lg"></i>
                    {isOpen && <span className="font-medium">Pengaturan</span>}
                </NavLink>
            </nav>

            <div className="p-4 border-t border-slate-700 overflow-hidden whitespace-nowrap">
                <button
                    onClick={handleLogout}
                    className={`flex items-center ${isOpen ? 'gap-3 px-4 w-full' : 'justify-center w-full'} py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors`}
                >
                    <i className="bi bi-box-arrow-left text-lg"></i>
                    {isOpen && <span className="font-medium">Keluar</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
