import React, { useState, useEffect } from 'react';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/logs', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await response.json();
                if (Array.isArray(data)) setLogs(data);
            } catch (error) {
                console.error("Error fetching logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Log Aktivitas Sistem</h3>

            <div className="border-l-2 border-slate-200 ml-3 space-y-6">
                {loading ? <p className="pl-6 text-slate-500">Memuat log...</p> :
                    logs.length === 0 ? <p className="pl-6 text-slate-500">Belum ada aktivitas tercatat.</p> :
                        logs.map((log) => (
                            <div key={log.idLog} className="relative pl-6">
                                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                    <span className="font-semibold text-slate-800 text-sm">
                                        {log.admin?.namaAdmin || 'Sistem'}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(log.dibuatPada).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Mengubah status laporan <span className="font-medium">#{log.laporan?.kodeLaporan}</span> dari
                                    <span className="mx-1 px-2 py-0.5 bg-slate-100 rounded text-xs">{log.statusLama}</span>
                                    menjadi
                                    <span className="mx-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{log.statusBaru}</span>
                                </p>
                                {log.catatanPerubahan && (
                                    <p className="text-xs text-slate-500 mt-1 italic">"{log.catatanPerubahan}"</p>
                                )}
                            </div>
                        ))}
            </div>
        </div>
    );
};

export default ActivityLogs;
