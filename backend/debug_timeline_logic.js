
const getTimeline = (data) => {
    const status = data.statusLaporan ? data.statusLaporan.toLowerCase() : '';
    const logs = data.logStatus || [];

    // Helper to find log for a specific status
    const getLog = (targetStatus) => {
        const log = logs.find(l => l.statusBaru === targetStatus);
        return log;
    };

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

    const logVerifikasi = getLog('diverifikasi');
    const logProses = getLog('diproses');
    const logSelesai = getLog('selesai');

    console.log("Log Verifikasi Found:", logVerifikasi);
    console.log("Log Proses Found:", logProses);

    return [
        {
            date: createdDate,
            status: 'Laporan Diterima',
            active: currentLevel >= 0
        },
        {
            date: logVerifikasi ? new Date(logVerifikasi.dibuatPada).toLocaleString('id-ID') : (currentLevel >= 1 ? updatedDate : '-'),
            status: 'Verifikasi Data',
            active: currentLevel >= 1,
            note: logVerifikasi?.catatanPerubahan
        },
        {
            date: logProses ? new Date(logProses.dibuatPada).toLocaleString('id-ID') : (currentLevel >= 2 ? updatedDate : '-'),
            status: 'Tindak Lanjut / Proses',
            active: currentLevel >= 2,
            note: logProses?.catatanPerubahan
        },
        {
            date: data.selesaiPada ? new Date(data.selesaiPada).toLocaleString('id-ID') : (logSelesai ? new Date(logSelesai.dibuatPada).toLocaleString('id-ID') : (currentLevel === 3 ? updatedDate : '-')),
            status: 'Selesai',
            active: currentLevel === 3,
            note: logSelesai?.catatanPerubahan
        }
    ];
};

// Mock data from curl output
const mockData = {
    "kodeLaporan": "DP3A-20260210-3AW42",
    "statusLaporan": "diverifikasi", // Current status
    "dibuatPada": "2026-02-10T07:24:40.000Z",
    "diperbaruiPada": "2026-02-10T15:07:44.000Z",
    "logStatus": [
        { "statusLama": "diproses", "statusBaru": "diverifikasi", "catatanPerubahan": "silahkan di tunggu", "dibuatPada": "2026-02-10T15:07:44.000Z" },
        { "statusLama": "diproses", "statusBaru": "diproses", "catatanPerubahan": "silahkan ke kantor", "dibuatPada": "2026-02-10T15:06:10.000Z" },
        { "statusLama": "diproses", "statusBaru": "diproses", "catatanPerubahan": "silahkan ke kantor kami untuk tindak lanjut", "dibuatPada": "2026-02-10T14:50:19.000Z" }
        // ... older logs
    ]
};

const timeline = getTimeline(mockData);
console.log(JSON.stringify(timeline, null, 2));
