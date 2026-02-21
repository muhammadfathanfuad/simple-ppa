import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ReportList = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showWAModal, setShowWAModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [waPhoneNumber, setWaPhoneNumber] = useState('');

    // Status Update Modal State
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusData, setStatusData] = useState({
        id: null,
        currentStatus: '',
        newStatus: '',
        note: ''
    });

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus && filterStatus !== 'All') params.append('status', filterStatus.toLowerCase());
            if (searchQuery) params.append('q', searchQuery);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`http://localhost:5000/api/laporan/all?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
                }
            });
            const data = await response.json();
            if (data.data) {
                setReports(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchReports();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [filterStatus, searchQuery, startDate, endDate]);

    const handleExportExcel = async () => {
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await fetch(`http://localhost:5000/api/laporan/export-excel?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Gagal export data');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Laporan_PPA_Excel.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Export Error:", error);
            Swal.fire('Gagal', 'Gagal mengunduh file Excel.', 'error');
        }
    };

    const openStatusModal = (report) => {
        setStatusData({
            id: report.idLaporan,
            currentStatus: toTitleCase(report.statusLaporan),
            newStatus: toTitleCase(report.statusLaporan),
            note: ''
        });
        setShowStatusModal(true);
    };

    const handleStatusSubmit = async () => {
        if (!statusData.newStatus) return;

        try {
            const response = await fetch(`http://localhost:5000/api/laporan/${statusData.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    status: statusData.newStatus.toLowerCase(),
                    catatan: statusData.note
                })
            });

            if (response.ok) {
                setShowStatusModal(false);
                fetchReports(); // Refresh data
                Swal.fire('Berhasil!', 'Status laporan berhasil diperbarui', 'success');
            } else {
                Swal.fire('Gagal', 'Gagal memperbarui status', 'error');
            }
        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire('Error', 'Terjadi kesalahan saat memperbarui status', 'error');
        }
    };

    const handleOpenWAModal = (report) => {
        setSelectedReport(report);
        setShowWAModal(true);
    };

    const handleSendWA = () => {
        if (!waPhoneNumber || !selectedReport) return;

        // Clean phone number (remove leading 0 or +62, ensure 62 prefix)
        let phone = waPhoneNumber.replace(/\D/g, '');
        if (phone.startsWith('0')) {
            phone = '62' + phone.substring(1);
        } else if (!phone.startsWith('62')) {
            phone = '62' + phone;
        }

        const message = `*TINDAK LANJUT LAPORAN*\n\n` +
            `No Tiket: ${selectedReport.kodeLaporan}\n` +
            `Tanggal: ${new Date(selectedReport.dibuatPada).toLocaleDateString('id-ID')}\n` +
            `Jenis Kasus: ${selectedReport.jenisKasus?.namaJenisKasus || selectedReport.jenisKasusLainnya || 'Umum'}\n` + // Adjust based on data structure
            `Lokasi: ${selectedReport.lokasiLengkapKejadian}\n\n` +
            `Mohon untuk segera ditindaklanjuti. Terima kasih.`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setShowWAModal(false);
        setWaPhoneNumber('');
        setSelectedReport(null);
    };

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Daftar Laporan</h2>
                    <p className="text-slate-500 text-sm mt-1">Kelola dan tindak lanjuti laporan masuk</p>
                </div>
                <button
                    onClick={handleExportExcel}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <i className="bi bi-file-earmark-spreadsheet"></i> Export Excel
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-4">
                <div className="flex-1 relative">
                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                        type="text"
                        placeholder="Cari No Tiket, Pelapor, atau Korban..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-4 flex-col md:flex-row w-full xl:w-auto">
                    <div className="w-full md:w-40">
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-slate-600"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Dari Tanggal"
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-slate-600"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="Sampai Tanggal"
                        />
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm appearance-none bg-white"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="Menunggu">Menunggu</option>
                            <option value="Diverifikasi">Diverifikasi</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Ditolak">Ditolak</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Mobile Card View (Visible on Mobile Only) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">
                        <div className="flex justify-center items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-500"></div>
                            Memuat data...
                        </div>
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 bg-white rounded-xl border border-slate-200">
                        Tidak ada laporan ditemukan.
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.idLaporan} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                                        #{report.kodeLaporan}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(report.dibuatPada).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.statusLaporan)}`}>
                                    {toTitleCase(report.statusLaporan)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-xs text-slate-500">Pelapor</p>
                                    <p className="font-medium text-slate-800 truncate">{report.pelapor?.nama || 'Anonim'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Korban</p>
                                    <p className="font-medium text-slate-800 truncate">{report.korban?.namaLengkap || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-2 pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => openStatusModal(report)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200"
                                    title="Update Status"
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>

                                <button
                                    onClick={() => handleOpenWAModal(report)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-slate-200"
                                    title="Teruskan ke WhatsApp"
                                >
                                    <i className="bi bi-whatsapp"></i>
                                </button>

                                <button
                                    onClick={() => navigate(`/admin/laporan/${report.idLaporan}/lengkap`)}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-slate-200"
                                    title="Lengkapi Formulir"
                                >
                                    <i className="bi bi-file-earmark-text"></i>
                                </button>

                                <button
                                    onClick={() => navigate(`/admin/laporan/${report.idLaporan}/lengkap`)}
                                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                                    title="Lihat Detail"
                                >
                                    <i className="bi bi-eye"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">No Tiket</th>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium">Pelapor</th>
                                <th className="px-6 py-4 font-medium">Korban</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-500"></div>
                                            Memuat data...
                                        </div>
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                        Tidak ada laporan ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.idLaporan} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            #{report.kodeLaporan}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(report.dibuatPada).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{report.pelapor?.nama || 'Anonim'}</div>
                                            <div className="text-xs text-slate-400">{report.pelapor?.nomorWhatsapp || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{report.korban?.namaLengkap || 'N/A'}</div>
                                            {/* Note: Adjust property access based on actual API response structure for relations */}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.statusLaporan)}`}>
                                                {toTitleCase(report.statusLaporan)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => openStatusModal(report)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Update Status"
                                                >
                                                    <i className="bi bi-pencil-square text-lg"></i>
                                                </button>

                                                {/* WA Forward Button */}
                                                <button
                                                    onClick={() => handleOpenWAModal(report)}
                                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="Teruskan ke WhatsApp"
                                                >
                                                    <i className="bi bi-whatsapp text-lg"></i>
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/admin/laporan/${report.idLaporan}/lengkap`)}
                                                    className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Lengkapi Formulir"
                                                >
                                                    <i className="bi bi-file-earmark-text text-lg"></i>
                                                </button>

                                                {/* View Detail Link */}
                                                <button
                                                    onClick={() => navigate(`/admin/laporan/${report.idLaporan}/lengkap`)}
                                                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <i className="bi bi-eye text-lg"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Placeholder */}
            {/* <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Menampilkan 1-10 dari {reports.length} data</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Prev</button>
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 bg-slate-100 text-slate-900 font-medium">1</button>
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
                    <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
                </div>
            </div> */}

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Update Status Laporan</h3>
                            <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status Baru</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                                    value={statusData.newStatus}
                                    onChange={(e) => setStatusData({ ...statusData, newStatus: e.target.value })}
                                >
                                    <option value="Menunggu">Menunggu</option>
                                    <option value="Diverifikasi">Diverifikasi</option>
                                    <option value="Diproses">Diproses</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Ditolak">Ditolak</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Perubahan (Opsional)</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500"
                                    rows="3"
                                    placeholder="Alasan perubahan status..."
                                    value={statusData.note}
                                    onChange={(e) => setStatusData({ ...statusData, note: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleStatusSubmit}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* WhatsApp Modal */}
            {showWAModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Teruskan ke WhatsApp</h3>
                            <button onClick={() => setShowWAModal(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp Petugas</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">+62</span>
                                <input
                                    type="tel"
                                    className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                    placeholder="81234567890"
                                    value={waPhoneNumber}
                                    onChange={(e) => setWaPhoneNumber(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Masukkan nomor tanpa awalan 0 atau 62.</p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6 text-sm text-slate-600">
                            <p className="font-medium mb-1">Preview Pesan:</p>
                            <p className="italic">
                                "Mohon tindak lanjuti laporan #{selectedReport?.kodeLaporan}..."
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowWAModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSendWA}
                                disabled={!waPhoneNumber}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <i className="bi bi-whatsapp"></i> Kirim Pesan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportList;
