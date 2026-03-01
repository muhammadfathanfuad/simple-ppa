const prisma = require("../../lib/prisma");
const ExcelJS = require('exceljs');
const { buildDateFilter, buildYearMonthFilter } = require("../../services/laporan/laporanUtils");
const {
    createRekapKeseluruhanSheet,
    createRekapKasusSheet,
    createRekapDemografiUsiaSheet,
    createRekapitulasiWorksheet,
    createRekapitulasiPerempuanWorksheet,
    createRekapitulasiAnakWorksheet,
    setExcelResponseHeaders
} = require("../../services/laporan/laporanExportService");
const {
    aggregateRekapitulasiData,
    aggregateRekapitulasiPerempuanData,
    aggregateRekapitulasiAnakData
} = require("../../services/laporan/laporanDataAggregator");

const exportLaporan = async (req, res) => {
    try {
        const laporan = await prisma.laporan.findMany({
            include: {
                pelapor: true,
                korban: true,
            },
            orderBy: { dibuatPada: 'desc' }
        });

        // Simple CSV Generation
        const header = "Tiket,Status,Tanggal,Pelapor,Telp Pelapor,Korban,Jenis Kasus,Lokasi Pelapor,Lokasi Kejadian\n";
        const rows = laporan.map(l => {
            const tgl = l.dibuatPada ? new Date(l.dibuatPada).toISOString().split('T')[0] : '-';
            // Sanitizing strings for CSV (replacing commas with space)
            const safe = (str) => str ? String(str).replace(/,/g, ' ').replace(/\n/g, ' ') : '-';

            return `${l.kodeLaporan},${l.statusLaporan},${tgl},${safe(l.pelapor?.nama)},${safe(l.pelapor?.nomorWhatsapp)},${safe(l.korban?.namaLengkap)},${l.idJenisKasus},${safe(l.lokasiLengkapKejadian)},${safe(l.lokasiKejadianPerkara)}`;
        }).join("\n");

        const csvData = header + rows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="data_laporan.csv"');
        res.send(csvData);

    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: "Gagal export data." });
    }
};

const exportExcel = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const whereClause = buildDateFilter(startDate, endDate);

        const laporan = await prisma.laporan.findMany({
            where: whereClause,
            include: {
                pelapor: true,
                korban: true,
                terlapor: true,
                jenisKasus: true,
                bentukKekerasan: true,
                kecamatan: true,
                buktiLaporan: true
            },
            orderBy: { dibuatPada: 'desc' }
        });

        const workbook = new ExcelJS.Workbook();

        // Create all three sheets using the service functions
        createRekapKeseluruhanSheet(workbook, laporan);
        createRekapKasusSheet(workbook, laporan);
        createRekapDemografiUsiaSheet(workbook, laporan);

        // Set response headers and send the file
        setExcelResponseHeaders(res, "Laporan_PPA_Excel.xlsx");
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error("Export Excel Error:", error);
        res.status(500).json({ message: "Gagal export data excel." });
    }
};

const exportRekapitulasiExcel = async (req, res) => {
    try {
        const { tahun, bulan } = req.query;

        const whereClause = buildYearMonthFilter(tahun, bulan);

        const laporans = await prisma.laporan.findMany({
            where: whereClause,
            include: {
                kecamatan: true,
                korban: true,
                terlapor: true,
                bentukKekerasan: true,
                jenisKasus: true,
                layananLaporan: {
                    include: { jenisLayanan: true }
                }
            }
        });

        const kecamatans = await prisma.kecamatan.findMany({
            orderBy: { namaKecamatan: 'asc' }
        });

        const jenisLayananList = await prisma.jenisLayanan.findMany({
            orderBy: { idJenisLayanan: 'asc' }
        });
        const layananHeaders = jenisLayananList.map(jl => jl.namaJenisLayanan);

        const tempatKejadianList = await prisma.tempatKejadian.findMany({
            orderBy: { idTempatKejadian: 'asc' }
        });
        const tempatHeaders = tempatKejadianList.map(t => t.namaTempatKejadian);

        const hubunganKorbanList = await prisma.hubunganKorban.findMany({
            orderBy: { idHubungan: 'asc' }
        });
        const hubunganHeaders = hubunganKorbanList.map(h => h.namaHubungan);

        // Use the data aggregator service to process the data
        const rekap = aggregateRekapitulasiData(laporans, kecamatans, layananHeaders, tempatHeaders, hubunganHeaders);

        const workbook = new ExcelJS.Workbook();

        // Use the export service to create the worksheet
        createRekapitulasiWorksheet(workbook, rekap, layananHeaders, tempatHeaders, hubunganHeaders);

        // Set response headers and send the file
        setExcelResponseHeaders(res, "Rekapitulasi_Data.xlsx");
        await workbook.xlsx.write(res);
        res.status(200).end();

    } catch (error) {
        console.error("Export Rekapitulasi Excel Error:", error);
        res.status(500).json({ message: "Gagal export rekapitulasi data excel." });
    }
};

const exportRekapitulasiPerempuan = async (req, res) => {
    try {
        const { tahun, bulan } = req.query;

        const whereClause = buildYearMonthFilter(tahun, bulan);

        const laporans = await prisma.laporan.findMany({
            where: whereClause,
            include: {
                kecamatan: true,
                korban: true,
                bentukKekerasan: true,
            }
        });

        const kecamatans = await prisma.kecamatan.findMany({
            orderBy: { namaKecamatan: 'asc' }
        });

        // Use the data aggregator service to process the data
        const rekap = aggregateRekapitulasiPerempuanData(laporans, kecamatans);

        const workbook = new ExcelJS.Workbook();

        // Use the export service to create the worksheet
        createRekapitulasiPerempuanWorksheet(workbook, rekap);

        // Set response headers and send the file
        setExcelResponseHeaders(res, "Rekapitulasi_Data_Perempuan.xlsx");
        await workbook.xlsx.write(res);
        res.status(200).end();

    } catch (error) {
        console.error("Export Rekapitulasi Perempuan Error:", error);
        res.status(500).json({ message: "Gagal export rekapitulasi data perempuan excel." });
    }
};

const exportRekapitulasiAnak = async (req, res) => {
    try {
        const { tahun, bulan } = req.query;

        const whereClause = buildYearMonthFilter(tahun, bulan);

        const laporans = await prisma.laporan.findMany({
            where: whereClause,
            include: {
                kecamatan: true,
                korban: true,
                bentukKekerasan: true,
            }
        });

        const kecamatans = await prisma.kecamatan.findMany({
            orderBy: { namaKecamatan: 'asc' }
        });

        // Use the data aggregator service to process the data
        const rekap = aggregateRekapitulasiAnakData(laporans, kecamatans);

        const workbook = new ExcelJS.Workbook();

        // Use the export service to create the worksheet
        createRekapitulasiAnakWorksheet(workbook, rekap);

        // Set response headers and send the file
        setExcelResponseHeaders(res, "Rekapitulasi_Data_Anak.xlsx");
        await workbook.xlsx.write(res);
        res.status(200).end();

    } catch (error) {
        console.error("Export Rekapitulasi Anak Error:", error);
        res.status(500).json({ message: "Gagal export rekapitulasi data anak excel." });
    }
};

module.exports = {
    exportLaporan,
    exportExcel,
    exportRekapitulasiExcel,
    exportRekapitulasiPerempuan,
    exportRekapitulasiAnak
};
