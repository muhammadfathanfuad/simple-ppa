import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { laporanService } from '../../services';

const RekapitulasiData = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tab1');
    const [dataRekap, setDataRekap] = useState([]);
    const [layananHeaders, setLayananHeaders] = useState([]);
    const [tempatHeaders, setTempatHeaders] = useState([]);
    const [hubunganHeaders, setHubunganHeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterTahun, setFilterTahun] = useState('');
    const [filterBulan, setFilterBulan] = useState('');
    const [isExportOpen, setIsExportOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = {
                    ...(filterTahun && { tahun: filterTahun }),
                    ...(filterBulan && { bulan: filterBulan })
                };

                const response = await laporanService.getRekapitulasiData(params);
                setDataRekap(Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []));
                if (response?.layananHeaders) setLayananHeaders(response.layananHeaders);
                if (response?.tempatHeaders) setTempatHeaders(response.tempatHeaders);
                if (response?.hubunganHeaders) setHubunganHeaders(response.hubunganHeaders);
            } catch (err) {
                console.error("Gagal mengambil data rekap:", err);
                setError(err.message || 'Gagal memuat data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [filterTahun, filterBulan]);

    const handleExportExcel = () => {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (filterTahun) params.append('tahun', filterTahun);
        if (filterBulan) params.append('bulan', filterBulan);
        if (token) params.append('token', token);
        const queryString = `?${params.toString()}`;

        // Open the download URL in a new tab/window
        window.open(`http://localhost:5000/api/laporan/rekap/export${queryString}`, '_blank');
    };

    const handleExportPerempuanExcel = () => {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (filterTahun) params.append('tahun', filterTahun);
        if (filterBulan) params.append('bulan', filterBulan);
        if (token) params.append('token', token);
        const queryString = `?${params.toString()}`;

        window.open(`http://localhost:5000/api/laporan/rekap/export/perempuan${queryString}`, '_blank');
    };

    const handleExportAnakExcel = () => {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (filterTahun) params.append('tahun', filterTahun);
        if (filterBulan) params.append('bulan', filterBulan);
        if (token) params.append('token', token);
        const queryString = `?${params.toString()}`;

        window.open(`http://localhost:5000/api/laporan/rekap/export/anak${queryString}`, '_blank');
    };

    // Generate years for dropdown (e.g., last 5 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

    const months = [
        { value: '', label: 'Semua Bulan' },
        { value: '1', label: 'Januari' },
        { value: '2', label: 'Februari' },
        { value: '3', label: 'Maret' },
        { value: '4', label: 'April' },
        { value: '5', label: 'Mei' },
        { value: '6', label: 'Juni' },
        { value: '7', label: 'Juli' },
        { value: '8', label: 'Agustus' },
        { value: '9', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' }
    ];

    const tabs = [
        { id: 'tab1', label: 'Profil Korban' },
        { id: 'tab2', label: 'Statistik & Klasifikasi Kasus' },
        { id: 'tab3', label: 'Relasi Pelaku & Data KDRT' }
    ];

    const renderProfilKorbanTableSkeleton = () => (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse table-fixed min-w-[1000px]">
                    <thead className="text-[10px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th rowSpan="2" className="px-3 py-3 font-medium border-b border-r border-slate-200 align-middle min-w-[100px] w-[100px] break-words">Kecamatan</th>
                            <th colSpan="3" className="px-1 py-3 font-medium border-b border-r border-slate-200 text-center">Jumlah Korban berdasarkan Jenis Kelamin</th>
                            <th colSpan="7" className="px-1 py-3 font-medium border-b border-r border-slate-200 text-center">Jumlah Korban berdasarkan Usia</th>
                            <th colSpan="7" className="px-1 py-3 font-medium border-b border-slate-200 text-center">Jumlah Korban berdasarkan Pendidikan</th>
                        </tr>
                        <tr>
                            {/* Jenis Kelamin */}
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight w-[6%]">Laki-laki</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight w-[6%]">Perempuan</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight w-[6%]">Total</th>

                            {/* Usia */}
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">&lt;6</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">6-12</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">13-17</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">18-24</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">25-44</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">45-59</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">60+</th>

                            {/* Pendidikan */}
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight w-[8%]">Tidak/Belum Pernah Sekolah</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">SD</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">SLTP</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[5%]">SLTA</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight w-[8%]">Perguruan Tinggi</th>
                            <th className="px-1 py-2 font-medium border-r border-slate-200 text-center leading-tight w-[6%]">PAUD/TK</th>
                            <th className="px-1 py-2 font-medium text-center leading-tight w-[5%]">NA</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            [1, 2, 3, 4, 5].map((item) => (
                                <tr key={item} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-2 py-3 border-r border-slate-100"><div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div></td>
                                    {Array.from({ length: 17 }).map((_, idx) => (
                                        <td key={idx} className={`px-1 py-3 ${idx < 16 ? 'border-r border-slate-100' : ''}`}>
                                            <div className="h-4 bg-slate-200 rounded animate-pulse w-full mx-auto"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : dataRekap.length === 0 ? (
                            <tr><td colSpan="18" className="px-3 py-4 text-center text-slate-500">Data tidak tersedia</td></tr>
                        ) : dataRekap.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-3 py-2 border-r border-slate-200 font-medium text-slate-700 break-words whitespace-normal">{row.kecamatan}</td>
                                {/* Jenis Kelamin */}
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.profil.l}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.profil.p}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-200 font-medium bg-slate-50">{row.profil.total}</td>
                                {/* Usia */}
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.usia['<6']}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.usia['6-12']}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.usia['13-17']}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.usia['18-24']}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.usia['25-44']}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.usia['45-59']}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-200 bg-slate-50">{row.usia['60+']}</td>
                                {/* Pendidikan */}
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.pend.tidakSekolah}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.pend.sd}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.pend.sltp}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.pend.slta}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.pend.pt}</td>
                                <td className="px-1 py-2 text-center border-r border-slate-100">{row.pend.paud}</td>
                                <td className="px-1 py-2 text-center">{row.pend.na}</td>
                            </tr>
                        ))}
                    </tbody>
                    {dataRekap.length > 0 && !loading && (
                        <tfoot className="bg-slate-100 font-bold text-slate-800">
                            <tr>
                                <td className="px-3 py-3 border-r border-t border-slate-200">Jumlah</td>
                                {/* Jenis Kelamin */}
                                <td className="px-1 py-3 text-center border-r border-t border-slate-200">{dataRekap.reduce((acc, row) => acc + (Number(row.profil?.l) || 0), 0)}</td>
                                <td className="px-1 py-3 text-center border-r border-t border-slate-200">{dataRekap.reduce((acc, row) => acc + (Number(row.profil?.p) || 0), 0)}</td>
                                <td className="px-1 py-3 text-center border-r border-t border-slate-300 bg-slate-200/70">{dataRekap.reduce((acc, row) => acc + (Number(row.profil?.total) || 0), 0)}</td>
                                {/* Usia */}
                                {['<6', '6-12', '13-17', '18-24', '25-44', '45-59', '60+'].map(key => (
                                    <td key={key} className={`px-1 py-3 text-center border-t ${key === '60+' ? 'border-r border-slate-300 bg-slate-200/70' : 'border-r border-slate-200'}`}>
                                        {dataRekap.reduce((acc, row) => acc + (Number(row.usia?.[key]) || 0), 0)}
                                    </td>
                                ))}
                                {/* Pendidikan */}
                                {['tidakSekolah', 'sd', 'sltp', 'slta', 'pt', 'paud', 'na'].map((key, idx, arr) => (
                                    <td key={key} className={`px-1 py-3 text-center border-t ${idx === arr.length - 1 ? '' : 'border-r border-slate-200'}`}>
                                        {dataRekap.reduce((acc, row) => acc + (Number(row.pend?.[key]) || 0), 0)}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );

    const renderStatistikKasusTableSkeleton = () => (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse table-fixed min-w-[1500px]">
                        <thead className="text-[10px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th rowSpan="2" className="px-3 py-3 font-medium border-b border-r border-slate-200 align-middle min-w-[100px] w-[100px] break-words">Kecamatan</th>
                                <th colSpan="7" className="px-1 py-3 font-medium border-b border-r border-slate-200 text-center">Jumlah Korban berdasarkan Bentuk Kekerasan</th>
                                <th colSpan={layananHeaders.length > 0 ? layananHeaders.length : 7} className="px-1 py-3 font-medium border-b border-r border-slate-200 text-center">Jumlah Korban berdasarkan Jenis Pelayanan</th>
                                <th colSpan={tempatHeaders.length > 0 ? tempatHeaders.length + 1 : 6} className="px-1 py-3 font-medium border-b border-slate-200 text-center">Jumlah Kasus berdasarkan Tempat Kejadian</th>
                            </tr>
                            <tr>
                                {/* Bentuk Kekerasan */}
                                <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Fisik</th>
                                <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Psikis</th>
                                <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Seksual</th>
                                <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Eksploitasi</th>
                                <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Trafficking</th>
                                <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Penelantaran</th>
                                <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight bg-slate-50">Lainnya</th>

                                {/* Jenis Pelayanan */}
                                {layananHeaders.length > 0 ? (
                                    layananHeaders.map((header, idx) => (
                                        <th key={idx} className={`px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight ${idx === layananHeaders.length - 1 ? 'bg-slate-50' : ''}`}>{header}</th>
                                    ))
                                ) : (
                                    <>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Pengaduan</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Kesehatan</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Bantuan Hukum</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Penegakkan Hukum</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Rehabilitasi Sosial</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Reintegrasi Sosial</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight bg-slate-50">Pemulangan</th>
                                    </>
                                )}

                                {/* Tempat Kejadian */}
                                {tempatHeaders.length > 0 ? (
                                    <>
                                        {tempatHeaders.map((header, idx) => (
                                            <th key={idx} className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">{header}</th>
                                        ))}
                                        <th className="px-1 py-2 font-medium border-slate-200 text-center break-words leading-tight bg-slate-50">Lainnya</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Rumah Tangga</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Tempat Kerja</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Lainnya</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Sekolah</th>
                                        <th className="px-1 py-2 font-medium border-r border-slate-200 text-center break-words leading-tight">Fasilitas Umum</th>
                                        <th className="px-1 py-2 font-medium border-slate-200 text-center break-words leading-tight">Lembaga Pendidikan Kilat</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-2 py-3 border-r border-slate-100"><div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div></td>
                                        {Array.from({ length: 20 }).map((_, idx) => (
                                            <td key={idx} className={`px-1 py-3 ${idx < 19 ? 'border-r border-slate-100' : ''}`}>
                                                <div className="h-4 bg-slate-200 rounded animate-pulse w-full mx-auto"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : dataRekap.length === 0 ? (
                                <tr><td colSpan={8 + (layananHeaders.length > 0 ? layananHeaders.length : 7) + (tempatHeaders.length > 0 ? tempatHeaders.length + 1 : 6)} className="px-3 py-4 text-center text-slate-500">Data tidak tersedia</td></tr>
                            ) : dataRekap.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2 border-r border-slate-200 font-medium text-slate-700 break-words whitespace-normal">{row.kecamatan}</td>

                                    <td className="px-1 py-2 text-center border-r border-slate-100">{row.bentuk.fisik}</td>
                                    <td className="px-1 py-2 text-center border-r border-slate-100">{row.bentuk.psikis}</td>
                                    <td className="px-1 py-2 text-center border-r border-slate-100">{row.bentuk.seksual}</td>
                                    <td className="px-1 py-2 text-center border-r border-slate-100">{row.bentuk.eksploitasi}</td>
                                    <td className="px-1 py-2 text-center border-r border-slate-100">{row.bentuk.trafficking}</td>
                                    <td className="px-1 py-2 text-center border-r border-slate-100">{row.bentuk.penelantaran}</td>
                                    <td className="px-1 py-2 text-center border-r border-slate-200 bg-slate-50">{row.bentuk.lainnya}</td>

                                    {layananHeaders.length > 0 ? (
                                        layananHeaders.map((header, idx) => (
                                            <td key={idx} className={`px-1 py-2 text-center border-r ${idx === layananHeaders.length - 1 ? 'border-slate-200 bg-slate-50' : 'border-slate-100'}`}>{row.layanan[header] || 0}</td>
                                        ))
                                    ) : (
                                        <>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.layanan.pengaduan}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.layanan.kesehatan}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.layanan.hukum}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.layanan.penegakan_hukum}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.layanan.rehab_sosial}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.layanan.reintegrasi}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-200 bg-slate-50">{row.layanan.pemulangan}</td>
                                        </>
                                    )}

                                    {tempatHeaders.length > 0 ? (
                                        <>
                                            {tempatHeaders.map((header, idx) => (
                                                <td key={idx} className="px-1 py-2 text-center border-r border-slate-100">{row.tempat[header] || 0}</td>
                                            ))}
                                            <td className="px-1 py-2 text-center bg-slate-50">{row.tempat.lainnya || 0}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.tempat.rumah}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.tempat.kerja}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.tempat.lainnya}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.tempat.sekolah}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.tempat.faskes}</td>
                                            <td className="px-1 py-2 text-center">{row.tempat.lembaga}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        {dataRekap.length > 0 && !loading && (
                            <tfoot className="bg-slate-100 font-bold text-slate-800">
                                <tr>
                                    <td className="px-3 py-3 border-r border-t border-slate-200">Jumlah</td>

                                    {/* Bentuk Kekerasan */}
                                    {['fisik', 'psikis', 'seksual', 'eksploitasi', 'trafficking', 'penelantaran', 'lainnya'].map(key => (
                                        <td key={key} className={`px-1 py-3 text-center border-t ${key === 'lainnya' ? 'border-r border-slate-300 bg-slate-200/70' : 'border-r border-slate-200'}`}>
                                            {dataRekap.reduce((acc, row) => acc + (Number(row.bentuk?.[key]) || 0), 0)}
                                        </td>
                                    ))}

                                    {/* Jenis Pelayanan */}
                                    {layananHeaders.length > 0 ? (
                                        layananHeaders.map((header, idx) => (
                                            <td key={idx} className={`px-1 py-3 text-center border-t border-r ${idx === layananHeaders.length - 1 ? 'border-slate-300 bg-slate-200/70' : 'border-slate-200'}`}>
                                                {dataRekap.reduce((acc, row) => acc + (Number(row.layanan?.[header]) || 0), 0)}
                                            </td>
                                        ))
                                    ) : (
                                        ['pengaduan', 'kesehatan', 'hukum', 'penegakan_hukum', 'rehab_sosial', 'reintegrasi', 'pemulangan'].map(key => (
                                            <td key={key} className={`px-1 py-3 text-center border-t ${key === 'pemulangan' ? 'border-r border-slate-300 bg-slate-200/70' : 'border-r border-slate-200'}`}>
                                                {dataRekap.reduce((acc, row) => acc + (Number(row.layanan?.[key]) || 0), 0)}
                                            </td>
                                        ))
                                    )}

                                    {/* Tempat Kejadian */}
                                    {tempatHeaders.length > 0 ? (
                                        <>
                                            {tempatHeaders.map((header, idx) => (
                                                <td key={idx} className="px-1 py-3 text-center border-t border-r border-slate-200">
                                                    {dataRekap.reduce((acc, row) => acc + (Number(row.tempat?.[header]) || 0), 0)}
                                                </td>
                                            ))}
                                            <td className="px-1 py-3 text-center border-t bg-slate-200/70">
                                                {dataRekap.reduce((acc, row) => acc + (Number(row.tempat?.lainnya) || 0), 0)}
                                            </td>
                                        </>
                                    ) : (
                                        ['rumah', 'kerja', 'lainnya', 'sekolah', 'faskes', 'lembaga'].map((key, idx, arr) => (
                                            <td key={key} className={`px-1 py-3 text-center border-t ${idx === arr.length - 1 ? '' : 'border-r border-slate-200'}`}>
                                                {dataRekap.reduce((acc, row) => acc + (Number(row.tempat?.[key]) || 0), 0)}
                                            </td>
                                        ))
                                    )}
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );

    const renderRelasiPelakuTableSkeleton = () => (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse table-fixed min-w-[1000px]">
                        <thead className="text-[10px] text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th rowSpan="2" className="px-3 py-3 font-medium border-b border-r border-slate-200 align-middle min-w-[100px] w-[100px] break-words">Kecamatan</th>
                                <th colSpan={hubunganHeaders.length > 0 ? hubunganHeaders.length + 2 : 10} className="px-1 py-3 font-medium border-b border-r border-slate-200 text-center">Jumlah Pelaku berdasarkan Hubungan dengan Korban</th>
                                <th rowSpan="2" className="px-1 py-3 font-medium border-b border-r border-slate-200 text-center align-middle w-[15%]">Jumlah Kasus KDRT</th>
                                <th rowSpan="2" className="px-1 py-3 font-medium border-b border-slate-200 text-center align-middle w-[15%]">Persentase Kasus KDRT</th>
                            </tr>
                            <tr>
                                {hubunganHeaders.length > 0 ? (
                                    <>
                                        {hubunganHeaders.map((header, idx) => (
                                            <th key={idx} className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">{header}</th>
                                        ))}
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Lainnya</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight bg-slate-50">NA</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Orang Tua</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Keluarga</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Suami/Istri</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Tetangga</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Pacar/Teman</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Guru</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Majikan</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Rekan Kerja</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight">Lainnya</th>
                                        <th className="px-1 py-2 font-medium border-b border-r border-slate-200 text-center break-words leading-tight bg-slate-50">NA</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((item) => (
                                    <tr key={item} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-2 py-3 border-r border-slate-100"><div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div></td>
                                        {Array.from({ length: 12 }).map((_, idx) => (
                                            <td key={idx} className={`px-1 py-3 ${idx < 11 ? 'border-r border-slate-100' : ''}`}>
                                                <div className="h-4 bg-slate-200 rounded animate-pulse w-full mx-auto"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : dataRekap.length === 0 ? (
                                <tr><td colSpan={3 + (hubunganHeaders.length > 0 ? hubunganHeaders.length + 2 : 10)} className="px-3 py-4 text-center text-slate-500">Data tidak tersedia</td></tr>
                            ) : dataRekap.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-3 py-2 border-r border-slate-200 font-medium text-slate-700 break-words whitespace-normal">{row.kecamatan}</td>

                                    {hubunganHeaders.length > 0 ? (
                                        <>
                                            {hubunganHeaders.map((header, idx) => (
                                                <td key={idx} className="px-1 py-2 text-center border-r border-slate-100">{row.relasi[header] || 0}</td>
                                            ))}
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.lainnya || 0}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-200 bg-slate-50">{row.relasi.na || 0}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.ortu}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.keluarga}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.suamiIstri}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.tetangga}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.pacar}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.guru}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.majikan}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.rekan}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-100">{row.relasi.lainnya}</td>
                                            <td className="px-1 py-2 text-center border-r border-slate-200 bg-slate-50">{row.relasi.na}</td>
                                        </>
                                    )}

                                    <td className="px-1 py-2 text-center border-r border-slate-200 font-medium text-indigo-600 bg-indigo-50/30">{row.kdrt.jumlah}</td>
                                    <td className="px-1 py-2 text-center font-medium bg-slate-50">{row.kdrt.persentase}%</td>
                                </tr>
                            ))}
                        </tbody>
                        {dataRekap.length > 0 && !loading && (
                            <tfoot className="bg-slate-100 font-bold text-slate-800">
                                <tr>
                                    <td className="px-3 py-3 border-r border-t border-slate-200">Jumlah</td>

                                    {hubunganHeaders.length > 0 ? (
                                        <>
                                            {hubunganHeaders.map((header, idx) => (
                                                <td key={idx} className="px-1 py-3 text-center border-t border-r border-slate-200">
                                                    {dataRekap.reduce((acc, row) => acc + (Number(row.relasi?.[header]) || 0), 0)}
                                                </td>
                                            ))}
                                            <td className="px-1 py-3 text-center border-t border-r border-slate-200">
                                                {dataRekap.reduce((acc, row) => acc + (Number(row.relasi?.lainnya) || 0), 0)}
                                            </td>
                                            <td className="px-1 py-3 text-center border-t border-r border-slate-300 bg-slate-200/70">
                                                {dataRekap.reduce((acc, row) => acc + (Number(row.relasi?.na) || 0), 0)}
                                            </td>
                                        </>
                                    ) : (
                                        ['ortu', 'keluarga', 'suamiIstri', 'tetangga', 'pacar', 'guru', 'majikan', 'rekan', 'lainnya', 'na'].map((key) => (
                                            <td key={key} className={`px-1 py-3 text-center border-t ${key === 'na' ? 'border-r border-slate-300 bg-slate-200/70' : 'border-r border-slate-200'}`}>
                                                {dataRekap.reduce((acc, row) => acc + (Number(row.relasi?.[key]) || 0), 0)}
                                            </td>
                                        ))
                                    )}

                                    <td className="px-1 py-3 text-center border-t border-r border-slate-300 text-indigo-700 bg-indigo-100/50">
                                        {dataRekap.reduce((acc, row) => acc + (Number(row.kdrt?.jumlah) || 0), 0)}
                                    </td>
                                    <td className="px-1 py-3 text-center border-t bg-slate-200/70">-</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Rekapitulasi Data</h2>
                    <p className="text-slate-500 text-sm mt-1">Ringkasan data laporan pengaduan berdasarkan wilayah</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                    <div className="relative w-full sm:w-auto">
                        <button
                            onClick={() => setIsExportOpen(!isExportOpen)}
                            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                            <i className="bi bi-file-earmark-excel"></i>
                            Export Excel
                            <i className={`bi bi-chevron-${isExportOpen ? 'up' : 'down'} text-xs ml-1`}></i>
                        </button>

                        {isExportOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-50 overflow-hidden">
                                <div className="p-2 flex flex-col gap-2">
                                    <button
                                        onClick={() => { handleExportExcel(); setIsExportOpen(false); }}
                                        className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md flex items-center justify-start gap-2 transition-colors"
                                    >
                                        <i className="bi bi-file-earmark-excel w-4 text-center"></i>
                                        Semua
                                    </button>
                                    <button
                                        onClick={() => { handleExportPerempuanExcel(); setIsExportOpen(false); }}
                                        className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md flex items-center justify-start gap-2 transition-colors"
                                    >
                                        <i className="bi bi-gender-female w-4 text-center"></i>
                                        Perempuan
                                    </button>
                                    <button
                                        onClick={() => { handleExportAnakExcel(); setIsExportOpen(false); }}
                                        className="w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-md flex items-center justify-start gap-2 transition-colors"
                                    >
                                        <i className="bi bi-person-hearts w-4 text-center"></i>
                                        Anak-anak
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative w-full sm:w-auto">
                        <select
                            value={filterTahun}
                            onChange={(e) => setFilterTahun(e.target.value)}
                            className="w-full sm:w-32 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 appearance-none shadow-sm cursor-pointer"
                        >
                            <option value="">Semua Tahun</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <i className="bi bi-chevron-down text-xs"></i>
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={filterBulan}
                            onChange={(e) => setFilterBulan(e.target.value)}
                            className="w-full sm:w-40 bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 appearance-none shadow-sm cursor-pointer disabled:opacity-50 disabled:bg-slate-50"
                            disabled={!filterTahun}
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>{month.label}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                            <i className="bi bi-chevron-down text-xs"></i>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <i className="bi bi-exclamation-triangle"></i>
                    <span>{error}</span>
                </div>
            )}

            {/* Tabs Navigation */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                ${activeTab === tab.id
                                    ? 'border-teal-500 text-teal-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Contents */}
            <div className="mt-6">
                {activeTab === 'tab1' && (
                    <div className="animate-in fade-in duration-300 space-y-4">
                        {renderProfilKorbanTableSkeleton()}
                    </div>
                )}

                {activeTab === 'tab2' && (
                    <div className="animate-in fade-in duration-300 space-y-4">
                        {renderStatistikKasusTableSkeleton()}
                    </div>
                )}

                {activeTab === 'tab3' && (
                    <div className="animate-in fade-in duration-300 space-y-4">
                        {renderRelasiPelakuTableSkeleton()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RekapitulasiData;
