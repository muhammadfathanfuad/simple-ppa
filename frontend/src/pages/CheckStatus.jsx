import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CheckStatus = () => {
    const [ticketId, setTicketId] = useState('');
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Helper to format status display (Title Case)
    const toTitleCase = (str) => {
        if (!str) return '-';
        return str.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    // Helper to get status badge color
    const getStatusColor = (status) => {
        if (!status) return 'bg-slate-100 text-slate-800 border-slate-200';
        const normalizedStatus = toTitleCase(status);
        switch (normalizedStatus) {
            case 'Menunggu': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Diverifikasi': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Diproses': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'Selesai': return 'bg-green-100 text-green-800 border-green-200';
            case 'Ditolak': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getTimeline = (data) => {
        const status = data.statusLaporan ? data.statusLaporan.toLowerCase() : '';
        const logs = data.logStatus || [];

        // Helper to find log for a specific status
        const getLog = (targetStatus) => logs.find(l => l.statusBaru === targetStatus);

        const createdDate = new Date(data.dibuatPada).toLocaleString('id-ID');
        const updatedDate = data.diperbaruiPada ? new Date(data.diperbaruiPada).toLocaleString('id-ID') : '-';

        if (status === 'ditolak') {
            const logDitolak = getLog('ditolak');
            return [
                { date: createdDate, status: 'Laporan Diterima', active: true },
                {
                    date: logDitolak ? new Date(logDitolak.dibuatPada).toLocaleString('id-ID') : updatedDate,
                    status: 'Laporan Ditolak',
                    active: true,
                    color: 'text-red-600',
                    note: logDitolak?.catatanPerubahan
                }
            ];
        }

        const levels = ['menunggu', 'diverifikasi', 'diproses', 'selesai'];
        const currentLevel = levels.indexOf(status);

        const logMenunggu = getLog('menunggu');
        const logVerifikasi = getLog('diverifikasi');
        const logProses = getLog('diproses');
        const logSelesai = getLog('selesai');

        return [
            {
                date: logMenunggu ? new Date(logMenunggu.dibuatPada).toLocaleString('id-ID') : createdDate,
                status: 'Laporan Diterima',
                active: currentLevel >= 0,
                note: currentLevel === 0 ? logMenunggu?.catatanPerubahan : null
            },
            {
                date: logVerifikasi ? new Date(logVerifikasi.dibuatPada).toLocaleString('id-ID') : (currentLevel >= 1 ? updatedDate : '-'),
                status: 'Verifikasi Data',
                active: currentLevel >= 1,
                note: currentLevel === 1 ? logVerifikasi?.catatanPerubahan : null
            },
            {
                date: logProses ? new Date(logProses.dibuatPada).toLocaleString('id-ID') : (currentLevel >= 2 ? updatedDate : '-'),
                status: 'Tindak Lanjut / Proses',
                active: currentLevel >= 2,
                note: currentLevel === 2 ? logProses?.catatanPerubahan : null
            },
            {
                date: logSelesai ? new Date(logSelesai.dibuatPada).toLocaleString('id-ID') : (data.selesaiPada ? new Date(data.selesaiPada).toLocaleString('id-ID') : (currentLevel === 3 ? updatedDate : '-')),
                status: 'Selesai',
                active: currentLevel === 3,
                note: currentLevel === 3 ? logSelesai?.catatanPerubahan : null
            }
        ];
    };

    const handleCheck = async (e) => {
        e.preventDefault();

        const cleanTicketId = ticketId.replace(/^#/, '').trim();
        if (!cleanTicketId) {
            setError('Masukan ID Laporan terlebih dahulu.');
            return;
        }

        setLoading(true);
        setError('');
        setStatusData(null);

        try {
            const response = await fetch(`http://localhost:5000/api/laporan/status/${cleanTicketId}`);

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Respon server tidak valid (bukan JSON).");
            }

            const data = await response.json();

            if (response.ok) {
                // Map backend response to frontend structure
                setStatusData({
                    id: data.kodeLaporan,
                    status: data.statusLaporan,
                    date: new Date(data.dibuatPada).toLocaleDateString('id-ID'),
                    description: 'Pantau terus status laporan Anda disini.',
                    timeline: getTimeline(data)
                });
            } else {
                setError(data.message || 'ID Laporan tidak ditemukan.');
            }
        } catch (err) {
            console.error("Check Status Error:", err);
            setError('Terjadi kesalahan penulisan tiket atau ID tidak valid.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header Section */}
            <div className="bg-teal-700 pt-32 pb-12 px-6 lg:px-12 text-center text-white rounded-b-[3rem] shadow-lg">
                <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">Cek Status Laporan</h1>
                <p className="text-lg lg:text-xl text-teal-100 max-w-2xl mx-auto">
                    Pantau perkembangan laporan Anda secara real-time dengan memasukkan ID Laporan.
                </p>
            </div>

            {/* Main Content */}
            <div className="flex-grow container mx-auto px-6 lg:px-12 py-12 -mt-16">
                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto border border-slate-100 relative z-10">

                    {/* Search Form */}
                    <form onSubmit={handleCheck} className="mb-12">
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Masukkan ID Laporan (Contoh: 12345)"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                className="flex-grow px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none text-lg transition-all"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Memeriksa...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-search"></i> Cek Sekarang
                                    </>
                                )}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3 animate-fade-in">
                                <i className="bi bi-exclamation-circle-fill text-xl"></i>
                                {error}
                            </div>
                        )}
                    </form>

                    {/* Result Section */}
                    {statusData && (
                        <div className="animate-fade-in-up">
                            <div className="border-t border-slate-100 pt-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Status Laporan #{statusData.id}</h2>
                                        <p className="text-slate-500">Diajukan pada: {statusData.date}</p>
                                    </div>
                                    <span className={`px-5 py-2 rounded-full font-bold text-sm border ${getStatusColor(statusData.status)}`}>
                                        {toTitleCase(statusData.status)}
                                    </span>
                                </div>

                                {/* Timeline */}
                                <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-8 pb-4">
                                    {statusData.timeline.map((item, index) => (
                                        <div key={index} className="relative pl-8 md:pl-12">
                                            {/* Dot */}
                                            <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-4 border-white ${item.active ? 'bg-teal-600 ring-4 ring-teal-100' : 'bg-slate-300'} transition-all`}></div>

                                            {/* Content */}
                                            <div className={`transition-all ${item.active ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                                <h3 className={`text-lg font-bold ${item.color || (item.active ? 'text-teal-700' : 'text-slate-600')}`}>{item.status}</h3>
                                                <p className="text-slate-500 text-sm mb-1">{item.date}</p>
                                                {item.note && (
                                                    <div className="bg-yellow-50 border border-yellow-100 p-2 rounded-lg text-xs text-yellow-800 mt-1 max-w-md">
                                                        <span className="font-semibold block mb-0.5">{item.note}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                                    <p className="text-slate-600 mb-4">Butuh bantuan lebih lanjut?</p>
                                    <Link to="/#hubungi" className="text-teal-600 font-bold hover:underline">Hubungi Layanan Pengaduan</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckStatus;
