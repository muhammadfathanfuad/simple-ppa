import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CheckStatus = () => {
    const [ticketId, setTicketId] = useState('');
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheck = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setStatusData(null);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            if (ticketId === '12345') {
                setStatusData({
                    id: '12345',
                    status: 'Sedang Diproses',
                    date: '2023-10-27',
                    description: 'Laporan kekerasan dalam rumah tangga.',
                    timeline: [
                        { date: '2023-10-27 10:00', status: 'Laporan Diterima', active: true },
                        { date: '2023-10-28 09:00', status: 'Verifikasi Data', active: true },
                        { date: '2023-10-29 14:00', status: 'Penanganan Tim', active: false },
                        { date: '-', status: 'Selesai', active: false },
                    ]
                });
            } else if (ticketId === 'ERROR') {
                setError('Terjadi kesalahan sistem. Silakan coba lagi.');
            } else {
                setError('ID Laporan tidak ditemukan. Silakan periksa kembali ID Anda.');
            }
        }, 1500);
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
                                    <span className="px-5 py-2 bg-yellow-100 text-yellow-700 rounded-full font-bold text-sm border border-yellow-200">
                                        {statusData.status}
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
                                                <h3 className={`text-lg font-bold ${item.active ? 'text-teal-700' : 'text-slate-600'}`}>{item.status}</h3>
                                                <p className="text-slate-500 text-sm">{item.date}</p>
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
