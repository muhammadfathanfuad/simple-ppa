import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen = true, setIsOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // Helper to close sidebar on mobile when link is clicked
    const handleLinkClick = () => {
        if (window.innerWidth < 768 && setIsOpen) {
            setIsOpen(false);
        }
    };

    return (
        <div className={`
            fixed md:relative z-40 h-full bg-slate-900 text-slate-100 flex flex-col transition-all duration-300
            ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
        `}>
            {/* Logo Section */}
            <div className={`p-6 border-b border-slate-700 flex items-center ${!isOpen && 'md:justify-center'} overflow-hidden whitespace-nowrap`}>
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

                    <div className={`${!isOpen ? 'md:hidden' : 'block'}`}>
                        <h2 className="text-sm font-bold font-display text-teal-400 truncate w-32">
                            {JSON.parse(localStorage.getItem('user') || '{}').nama || 'Admin Panel'}
                        </h2>
                        <p className="text-[10px] text-slate-400">DP3A Sultra</p>
                    </div>
                </div>

                {/* Close button for mobile */}
                <button
                    className="md:hidden ml-auto text-slate-400 hover:text-white"
                    onClick={() => setIsOpen && setIsOpen(false)}
                >
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <NavLink
                    to="/admin"
                    end
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center md:px-2 px-4 gap-3'} py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${isActive
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`
                    }
                >
                    <i className="bi bi-grid-1x2-fill text-lg flex-shrink-0"></i>
                    <span className={`font-medium ${!isOpen ? 'md:hidden' : 'block'}`}>Dashboard</span>
                </NavLink>

                {!isOpen && <div className="h-px bg-slate-800 my-2 mx-2 hidden md:block"></div>}

                <NavLink
                    to="/admin/laporan"
                    end
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center md:px-2 px-4 gap-3'} py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${isActive
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`
                    }
                >
                    <i className="bi bi-file-earmark-text text-lg flex-shrink-0"></i>
                    <span className={`font-medium ${!isOpen ? 'md:hidden' : 'block'}`}>Semua Laporan</span>
                </NavLink>

                <NavLink
                    to="/admin/laporan/baru"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center md:px-2 px-4 gap-3'} py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${isActive
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`
                    }
                >
                    <i className="bi bi-pencil-square text-lg flex-shrink-0"></i>
                    <span className={`font-medium ${!isOpen ? 'md:hidden' : 'block'}`}>Input Manual</span>
                </NavLink>
                <NavLink
                    to="/admin/pengaturan"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                        `flex items-center ${isOpen ? 'gap-3 px-4' : 'justify-center md:px-2 px-4 gap-3'} py-3 rounded-lg transition-colors overflow-hidden whitespace-nowrap ${isActive
                            ? 'bg-teal-600 text-white shadow-lg'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`
                    }
                >
                    <i className="bi bi-gear-fill text-lg flex-shrink-0"></i>
                    <span className={`font-medium ${!isOpen ? 'md:hidden' : 'block'}`}>Pengaturan</span>
                </NavLink>
            </nav>

            <div className="p-4 border-t border-slate-700 overflow-hidden whitespace-nowrap">
                <button
                    onClick={handleLogout}
                    className={`flex items-center ${isOpen ? 'gap-3 px-4 w-full' : 'justify-center w-full md:px-0'} py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors`}
                >
                    <i className="bi bi-box-arrow-left text-lg flex-shrink-0"></i>
                    <span className={`font-medium ${!isOpen ? 'md:hidden' : 'block'}`}>Keluar</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
