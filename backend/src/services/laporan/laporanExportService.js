const ExcelJS = require('exceljs');
const { calculateAge } = require("./laporanUtils");

/**
 * Creates and configures the first sheet (Rekap Keseluruhan) for the Excel export
 * @param {Object} workbook - ExcelJS workbook object
 * @param {Array} laporan - Array of laporan data
 */
const createRekapKeseluruhanSheet = (workbook, laporan) => {
    const sheet1 = workbook.addWorksheet('Rekap Keseluruhan');

    // Define columns manually to ensure order and completeness
    sheet1.columns = [
        { header: 'No Tiket', key: 'kodeLaporan', width: 15 },
        { header: 'Status', key: 'statusLaporan', width: 15 },
        { header: 'Tanggal Lapor', key: 'tanggal', width: 15 },
        { header: 'Kecamatan', key: 'kecamatan', width: 20 },
        { header: 'Jenis Kasus', key: 'jenisKasus', width: 20 },
        { header: 'Bentuk Kekerasan', key: 'bentukKekerasan', width: 20 },
        // Pelapor
        { header: 'Nama Pelapor', key: 'namaPelapor', width: 20 },
        { header: 'Telp Pelapor', key: 'telpPelapor', width: 15 },
        { header: 'Hubungan', key: 'hubunganPelapor', width: 15 },
        // Korban
        { header: 'Nama Korban', key: 'namaKorban', width: 20 },
        { header: 'NIK Korban', key: 'nikKorban', width: 20 },
        { header: 'JK Korban', key: 'jkKorban', width: 10 },
        { header: 'Usia/TTL', key: 'ttlKorban', width: 20 },
        { header: 'Alamat Korban', key: 'alamatKorban', width: 30 },
        { header: 'Pendidikan', key: 'pendidikanKorban', width: 15 },
        { header: 'Pekerjaan', key: 'pekerjaanKorban', width: 15 },
        // Terlapor
        { header: 'Nama Terlapor', key: 'namaTerlapor', width: 20 },
        { header: 'Hubungan dgn Korban', key: 'hubunganTerlapor', width: 20 },
        // Kasus
        { header: 'Tanggal Kejadian', key: 'tglKejadian', width: 15 },
        { header: 'Lokasi Pelapor', key: 'lokasiPelapor', width: 30 },
        { header: 'Lokasi Kejadian Perkara', key: 'lokasiKejadian', width: 30 },
        { header: 'Kronologi', key: 'kronologi', width: 40 },
        { header: 'Link Bukti', key: 'linkBukti', width: 40 },
    ];

    laporan.forEach(l => {
        const buktiLinks = l.buktiLaporan.map(b => `http://localhost:5000/${b.lokasiFile}`).join(', ');

        sheet1.addRow({
            kodeLaporan: l.kodeLaporan,
            statusLaporan: l.statusLaporan,
            tanggal: l.dibuatPada ? new Date(l.dibuatPada).toISOString().split('T')[0] : '-',
            kecamatan: l.kecamatan?.namaKecamatan || '-',
            jenisKasus: l.jenisKasus?.namaJenisKasus || '-',
            bentukKekerasan: l.bentukKekerasan?.namaBentukKekerasan || '-',
            // Pelapor
            namaPelapor: l.pelapor?.nama || '-',
            telpPelapor: l.pelapor?.nomorWhatsapp || '-',
            hubunganPelapor: l.pelapor?.hubunganDenganKorban || '-',
            // Korban
            namaKorban: l.korban?.namaLengkap || '-',
            nikKorban: l.korban?.nik || '-',
            jkKorban: l.korban?.jenisKelamin || '-',
            ttlKorban: `${l.korban?.tempatLahir || ''}, ${l.korban?.tanggalLahir ? new Date(l.korban.tanggalLahir).toISOString().split('T')[0] : ''}`,
            alamatKorban: l.korban?.alamatLengkap || '-',
            pendidikanKorban: l.korban?.pendidikan || '-',
            pekerjaanKorban: l.korban?.pekerjaan || '-',
            // Terlapor
            namaTerlapor: l.terlapor?.nama || '-',
            hubunganTerlapor: l.terlapor?.hubunganDenganKorban || '-',
            // Kasus
            tglKejadian: l.tanggalKejadian ? new Date(l.tanggalKejadian).toISOString().split('T')[0] : '-',
            lokasiPelapor: l.lokasiLengkapKejadian,
            lokasiKejadian: l.lokasiKejadianPerkara,
            kronologi: l.kronologiKejadian,
            linkBukti: buktiLinks
        });
    });
};

/**
 * Creates and configures the second sheet (Rekap Kasus) for the Excel export
 * @param {Object} workbook - ExcelJS workbook object
 * @param {Array} laporan - Array of laporan data
 */
const createRekapKasusSheet = (workbook, laporan) => {
    const sheet2 = workbook.addWorksheet('Rekap Kasus');
    sheet2.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Bulan', key: 'bulan', width: 15 },
        { header: 'Nama Korban', key: 'namaKorban', width: 25 },
        { header: 'Jenis Kasus', key: 'jenisKasus', width: 20 },
        { header: 'Bentuk Kekerasan', key: 'bentukKekerasan', width: 20 },
        { header: 'Kecamatan', key: 'kecamatan', width: 20 },
    ];

    laporan.forEach((l, index) => {
        const date = l.dibuatPada ? new Date(l.dibuatPada) : new Date();
        const bulan = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

        sheet2.addRow({
            no: index + 1,
            bulan: bulan,
            namaKorban: l.korban?.namaLengkap || '-',
            jenisKasus: l.jenisKasus?.namaJenisKasus || '-',
            bentukKekerasan: l.bentukKekerasan?.namaBentukKekerasan || '-',
            kecamatan: l.kecamatan?.namaKecamatan || '-'
        });
    });
};

/**
 * Creates and configures the third sheet (Rekap Demografi Usia) for the Excel export
 * @param {Object} workbook - ExcelJS workbook object
 * @param {Array} laporan - Array of laporan data
 */
const createRekapDemografiUsiaSheet = (workbook, laporan) => {
    const sheet3 = workbook.addWorksheet('Rekap Demografi Usia');
    sheet3.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Nama Korban', key: 'namaKorban', width: 25 },
        { header: 'Tanggal Lahir', key: 'tglLahir', width: 15 },
        { header: 'Usia (Tahun)', key: 'usia', width: 10 },
        { header: 'Kelompok Usia', key: 'kelompokUsia', width: 15 },
    ];

    laporan.forEach((l, index) => {
        let usia = '-';
        let kelompokUsia = '-';

        if (l.korban?.tanggalLahir) {
            const birthDate = new Date(l.korban.tanggalLahir);
            const reportDate = new Date(l.dibuatPada);
            let age = calculateAge(birthDate, reportDate);
            usia = age;
            kelompokUsia = age < 18 ? 'Anak' : 'Dewasa';
        }

        sheet3.addRow({
            no: index + 1,
            namaKorban: l.korban?.namaLengkap || '-',
            tglLahir: l.korban?.tanggalLahir ? new Date(l.korban.tanggalLahir).toISOString().split('T')[0] : '-',
            usia: usia,
            kelompokUsia: kelompokUsia
        });
    });
};

/**
 * Creates the Rekapitulasi Data worksheet with complex header structure
 * @param {Object} workbook - ExcelJS workbook object
 * @param {Array} rekap - Array of aggregated data by kecamatan
 * @param {Array} layananHeaders - Array of layanan headers string
 * @param {Array} tempatHeaders - Array of tempat kejadian headers string
 * @param {Array} hubunganHeaders - Array of hubungan korban headers string
 */
const createRekapitulasiWorksheet = (workbook, rekap, layananHeaders = [], tempatHeaders = [], hubunganHeaders = []) => {
    const worksheet = workbook.addWorksheet('Rekapitulasi Data');
    const displayLayananHeaders = layananHeaders.length > 0 ? layananHeaders : ['Pengaduan', 'Kesehatan', 'Bantuan Hukum', 'Penegakan Hukum', 'Rehabilitasi Sosial', 'Reintegrasi Sosial', 'Pemulangan'];
    const L = displayLayananHeaders.length;

    const displayTempatHeaders = tempatHeaders.length > 0 ? [...tempatHeaders, 'Lainnya'] : ['Rumah Tangga', 'Tempat Kerja', 'Lainnya', 'Sekolah', 'Fasilitas Umum', 'Lembaga Pendidikan'];
    const T = displayTempatHeaders.length;

    const displayHubunganHeaders = hubunganHeaders.length > 0 ? [...hubunganHeaders, 'Lainnya', 'NA'] : ['Orang Tua', 'Keluarga/Saudara', 'Suami/Istri', 'Tetangga', 'Pacar/Teman', 'Guru', 'Majikan', 'Rekan Kerja', 'Lainnya', 'NA'];
    const H = displayHubunganHeaders.length;

    // Baris 1: Main Categories
    const headerRow1 = [
        'Kecamatan',
        'Jenis Kelamin', '', '',
        'Usia', '', '', '', '', '', '',
        'Pendidikan', '', '', '', '', '', '',
        'Bentuk Kekerasan', '', '', '', '', '', '',
        'Jenis Pelayanan', ...Array(Math.max(0, L - 1)).fill(''),
        'Tempat Kejadian', ...Array(Math.max(0, T - 1)).fill(''),
        'Hubungan Pelaku dengan Korban', ...Array(Math.max(0, H - 1)).fill(''),
        'Data KDRT', ''
    ];
    worksheet.addRow(headerRow1);

    // Baris 2: Sub Categories
    const headerRow2 = [
        '', // Kecamatan
        'Laki-laki', 'Perempuan', 'Total',
        '<6', '6-12', '13-17', '18-24', '25-44', '45-59', '60+',
        'Tidak/Belum Sekolah', 'SD', 'SLTP', 'SLTA', 'Perguruan Tinggi', 'PAUD/TK', 'NA',
        'Fisik', 'Psikis', 'Seksual', 'Eksploitasi', 'Trafficking', 'Penelantaran', 'Lainnya',
        ...displayLayananHeaders,
        ...displayTempatHeaders,
        ...displayHubunganHeaders,
        'Jumlah Kasus KDRT', 'Persentase Kasus KDRT (%)'
    ];
    worksheet.addRow(headerRow2);

    // Merge Cells untuk Header Utama
    worksheet.mergeCells(1, 1, 2, 1); // Kecamatan
    worksheet.mergeCells(1, 2, 1, 4); // Jenis Kelamin
    worksheet.mergeCells(1, 5, 1, 11); // Usia
    worksheet.mergeCells(1, 12, 1, 18); // Pendidikan
    worksheet.mergeCells(1, 19, 1, 25); // Bentuk Kekerasan
    worksheet.mergeCells(1, 26, 1, 25 + L); // Jenis Pelayanan
    worksheet.mergeCells(1, 26 + L, 1, 25 + L + T); // Tempat Kejadian
    worksheet.mergeCells(1, 26 + L + T, 1, 25 + L + T + H); // Hubungan Pelaku
    worksheet.mergeCells(1, 26 + L + T + H, 1, 27 + L + T + H); // Data KDRT

    // Styling Header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    worksheet.getColumn(1).width = 20;

    // Isi Data Baris
    rekap.forEach((item) => {
        const row = [
            item.kecamatan,
            item.profil.l, item.profil.p, item.profil.total,
            item.usia['<6'], item.usia['6-12'], item.usia['13-17'], item.usia['18-24'], item.usia['25-44'], item.usia['45-59'], item.usia['60+'],
            item.pend.tidakSekolah, item.pend.sd, item.pend.sltp, item.pend.slta, item.pend.pt, item.pend.paud, item.pend.na,
            item.bentuk.fisik, item.bentuk.psikis, item.bentuk.seksual, item.bentuk.eksploitasi, item.bentuk.trafficking, item.bentuk.penelantaran, item.bentuk.lainnya
        ];

        if (layananHeaders.length > 0) {
            layananHeaders.forEach(h => {
                row.push(item.layanan[h] || 0);
            });
        } else {
            row.push(item.layanan.pengaduan, item.layanan.kesehatan, item.layanan.hukum, item.layanan.penegakan_hukum, item.layanan.rehab_sosial, item.layanan.reintegrasi, item.layanan.pemulangan);
        }

        if (tempatHeaders.length > 0) {
            tempatHeaders.forEach(h => {
                row.push(item.tempat[h] || 0);
            });
            row.push(item.tempat.lainnya || 0);
        } else {
            row.push(item.tempat.rumah, item.tempat.kerja, item.tempat.lainnya, item.tempat.sekolah, item.tempat.faskes, item.tempat.lembaga);
        }

        if (hubunganHeaders.length > 0) {
            hubunganHeaders.forEach(h => {
                row.push(item.relasi[h] || 0);
            });
            row.push(item.relasi.lainnya || 0);
            row.push(item.relasi.na || 0);
        } else {
            row.push(item.relasi.ortu, item.relasi.keluarga, item.relasi.suamiIstri, item.relasi.tetangga, item.relasi.pacar, item.relasi.guru, item.relasi.majikan, item.relasi.rekan, item.relasi.lainnya, item.relasi.na);
        }

        row.push(
            item.kdrt.jumlah, parseFloat(item.kdrt.persentase)
        );

        worksheet.addRow(row);
    });

    const totalRowData = [
        'Jumlah',
        rekap.reduce((acc, curr) => acc + (Number(curr.profil?.l) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.profil?.p) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.profil?.total) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.usia?.['<6']) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.usia?.['6-12']) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.usia?.['13-17']) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.usia?.['18-24']) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.usia?.['25-44']) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.usia?.['45-59']) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.usia?.['60+']) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.pend?.tidakSekolah) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.pend?.sd) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.pend?.sltp) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.pend?.slta) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.pend?.pt) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.pend?.paud) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.pend?.na) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.bentuk?.fisik) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.bentuk?.psikis) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.bentuk?.seksual) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.bentuk?.eksploitasi) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.bentuk?.trafficking) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.bentuk?.penelantaran) || 0), 0),
        rekap.reduce((acc, curr) => acc + (Number(curr.bentuk?.lainnya) || 0), 0)
    ];

    if (layananHeaders.length > 0) {
        layananHeaders.forEach(h => {
            totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.layanan?.[h]) || 0), 0));
        });
    } else {
        ['pengaduan', 'kesehatan', 'hukum', 'penegakan_hukum', 'rehab_sosial', 'reintegrasi', 'pemulangan'].forEach(h => {
            totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.layanan?.[h]) || 0), 0));
        });
    }

    if (tempatHeaders.length > 0) {
        tempatHeaders.forEach(h => {
            totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.tempat?.[h]) || 0), 0));
        });
        totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.tempat?.lainnya) || 0), 0));
    } else {
        ['rumah', 'kerja', 'lainnya', 'sekolah', 'faskes', 'lembaga'].forEach(h => {
            totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.tempat?.[h]) || 0), 0));
        });
    }

    if (hubunganHeaders.length > 0) {
        hubunganHeaders.forEach(h => {
            totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.relasi?.[h]) || 0), 0));
        });
        totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.relasi?.lainnya) || 0), 0));
        totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.relasi?.na) || 0), 0));
    } else {
        ['ortu', 'keluarga', 'suamiIstri', 'tetangga', 'pacar', 'guru', 'majikan', 'rekan', 'lainnya', 'na'].forEach(h => {
            totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.relasi?.[h]) || 0), 0));
        });
    }

    totalRowData.push(rekap.reduce((acc, curr) => acc + (Number(curr.kdrt?.jumlah) || 0), 0), '-');

    if (rekap.length > 0) {
        const totalRow = worksheet.addRow(totalRowData);
        totalRow.font = { bold: true };
    }
};

/**
 * Creates the Rekapitulasi Perempuan worksheet
 * @param {Object} workbook - ExcelJS workbook object
 * @param {Array} rekap - Array of aggregated data for women
 */
const createRekapitulasiPerempuanWorksheet = (workbook, rekap) => {
    const worksheet = workbook.addWorksheet('Rekapitulasi Perempuan');

    worksheet.addRow(['No', 'Kecamatan', 'Jumlah Korban Kekerasan', 'Bentuk Kekerasan', '', '', '', '', '']);
    worksheet.addRow(['', '', '', 'Fisik', 'Psikis', 'Seksual', 'Penelantaran', 'TPPO', 'Lainnya']);

    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('B1:B2');
    worksheet.mergeCells('C1:C2');
    worksheet.mergeCells('D1:I1');

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 25;
    worksheet.getColumn('C').width = 25;
    worksheet.getColumn('D').width = 10;
    worksheet.getColumn('E').width = 10;
    worksheet.getColumn('F').width = 10;
    worksheet.getColumn('G').width = 15;
    worksheet.getColumn('H').width = 10;
    worksheet.getColumn('I').width = 10;

    let totalKorban = 0;
    let totalBentuk = { fisik: 0, psikis: 0, seksual: 0, penelantaran: 0, tppo: 0, lainnya: 0 };

    rekap.forEach((item, index) => {
        worksheet.addRow([
            index + 1,
            item.kecamatan,
            item.jumlahKorban,
            item.bentuk.fisik,
            item.bentuk.psikis,
            item.bentuk.seksual,
            item.bentuk.penelantaran,
            item.bentuk.tppo,
            item.bentuk.lainnya
        ]);

        totalKorban += item.jumlahKorban;
        totalBentuk.fisik += item.bentuk.fisik;
        totalBentuk.psikis += item.bentuk.psikis;
        totalBentuk.seksual += item.bentuk.seksual;
        totalBentuk.penelantaran += item.bentuk.penelantaran;
        totalBentuk.tppo += item.bentuk.tppo;
        totalBentuk.lainnya += item.bentuk.lainnya;
    });

    const totalRow = worksheet.addRow([
        'Jumlah', '', totalKorban,
        totalBentuk.fisik, totalBentuk.psikis, totalBentuk.seksual,
        totalBentuk.penelantaran, totalBentuk.tppo, totalBentuk.lainnya
    ]);

    totalRow.font = { bold: true };
    worksheet.mergeCells(`A${totalRow.number}:B${totalRow.number}`);
    totalRow.getCell(2).alignment = { horizontal: 'center' };
};

/**
 * Creates the Rekapitulasi Anak worksheet
 * @param {Object} workbook - ExcelJS workbook object
 * @param {Array} rekap - Array of aggregated data for children
 */
const createRekapitulasiAnakWorksheet = (workbook, rekap) => {
    const worksheet = workbook.addWorksheet('Rekapitulasi Anak');

    worksheet.addRow(['No', 'Kecamatan', 'Jumlah Korban Kekerasan', '', '', 'Bentuk Kekerasan', '', '', '', '', '']);
    worksheet.addRow(['', '', 'L', 'P', 'Total', 'Fisik', 'Psikis', 'Seksual', 'Penelantaran', 'TPPO', 'Lainnya']);

    worksheet.mergeCells('A1:A2');
    worksheet.mergeCells('B1:B2');
    worksheet.mergeCells('C1:E1');
    worksheet.mergeCells('F1:K1');

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getColumn('A').width = 5;
    worksheet.getColumn('B').width = 25;
    worksheet.getColumn('C').width = 8;
    worksheet.getColumn('D').width = 8;
    worksheet.getColumn('E').width = 10;
    worksheet.getColumn('F').width = 10;
    worksheet.getColumn('G').width = 10;
    worksheet.getColumn('H').width = 10;
    worksheet.getColumn('I').width = 15;
    worksheet.getColumn('J').width = 10;
    worksheet.getColumn('K').width = 10;

    let totL = 0;
    let totP = 0;
    let totKorban = 0;
    let totalBentuk = { fisik: 0, psikis: 0, seksual: 0, penelantaran: 0, tppo: 0, lainnya: 0 };

    rekap.forEach((item, index) => {
        worksheet.addRow([
            index + 1,
            item.kecamatan,
            item.jumlahL,
            item.jumlahP,
            item.totalKorban,
            item.bentuk.fisik,
            item.bentuk.psikis,
            item.bentuk.seksual,
            item.bentuk.penelantaran,
            item.bentuk.tppo,
            item.bentuk.lainnya
        ]);

        totL += item.jumlahL;
        totP += item.jumlahP;
        totKorban += item.totalKorban;
        totalBentuk.fisik += item.bentuk.fisik;
        totalBentuk.psikis += item.bentuk.psikis;
        totalBentuk.seksual += item.bentuk.seksual;
        totalBentuk.penelantaran += item.bentuk.penelantaran;
        totalBentuk.tppo += item.bentuk.tppo;
        totalBentuk.lainnya += item.bentuk.lainnya;
    });

    const totalRow = worksheet.addRow([
        'Jumlah', '', totL, totP, totKorban,
        totalBentuk.fisik, totalBentuk.psikis, totalBentuk.seksual,
        totalBentuk.penelantaran, totalBentuk.tppo, totalBentuk.lainnya
    ]);

    totalRow.font = { bold: true };
    worksheet.mergeCells(`A${totalRow.number}:B${totalRow.number}`);
    totalRow.getCell(1).alignment = { horizontal: 'center' };
};

/**
 * Sets response headers for Excel file download
 * @param {Object} res - Express response object
 * @param {string} filename - Name of the file to be downloaded
 */
const setExcelResponseHeaders = (res, filename) => {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
};

module.exports = {
    createRekapKeseluruhanSheet,
    createRekapKasusSheet,
    createRekapDemografiUsiaSheet,
    createRekapitulasiWorksheet,
    createRekapitulasiPerempuanWorksheet,
    createRekapitulasiAnakWorksheet,
    setExcelResponseHeaders
};