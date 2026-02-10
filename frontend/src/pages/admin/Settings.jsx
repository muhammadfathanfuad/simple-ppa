import React, { useState } from 'react';
import AdminManagement from './settings/AdminManagement';
import ProfileSettings from './settings/ProfileSettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile'); // Default to profile

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Pengaturan</h2>
                <p className="text-slate-500 text-sm mt-1">Kelola profil, akun admin, dan sistem</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200 overflow-x-auto">
                    <button
                        className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50' : 'text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <i className="bi bi-person-circle mr-2"></i> Profil Saya
                    </button>
                    <button
                        className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'admin' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50' : 'text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        <i className="bi bi-people-fill mr-2"></i> Manajemen Admin
                    </button>
                    <button
                        className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'form' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50' : 'text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('form')}
                    >
                        <i className="bi bi-ui-checks mr-2"></i> Pengaturan Form
                    </button>
                    <button
                        className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'logs' ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50' : 'text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('logs')}
                    >
                        <i className="bi bi-clock-history mr-2"></i> Log Aktivitas
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'admin' && <AdminManagement />}
                    {activeTab === 'form' && <FormSettings />}
                    {activeTab === 'logs' && <ActivityLogs />}
                </div>
            </div>
        </div>
    );
};

export default Settings;
