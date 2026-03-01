const prisma = require("../../lib/prisma");

const getStatistik = async (req, res) => {
    try {
        const totalLaporan = await prisma.laporan.count();

        const byStatus = await prisma.laporan.groupBy({
            by: ['statusLaporan'],
            _count: {
                statusLaporan: true,
            },
        });

        // Format output status
        const statusStats = {
            Menunggu: 0,
            Diproses: 0,
            Selesai: 0,
            Ditolak: 0
        };

        byStatus.forEach(item => {
            statusStats[item.statusLaporan] = item._count.statusLaporan;
        });

        // Count by Jenis Kasus (assuming relation or id check, here generic count)
        // Note: To group by relation field name might be complex, so we group by idJenisKasus
        // and ideally we would fetch the names, but for now returning IDs or if schema permits
        const byJenis = await prisma.laporan.groupBy({
            by: ['idJenisKasus'],
            _count: {
                idJenisKasus: true,
            }
        });

        res.json({
            total: totalLaporan,
            status: statusStats,
            jenisKasus: byJenis
        });

    } catch (error) {
        console.error("Error Statistik:", error);
        res.status(500).json({ message: "Gagal mengambil statistik." });
    }
};

const getRekapitulasiData = async (req, res) => {
    try {
        const { tahun, bulan } = req.query;

        const { buildYearMonthFilter, calculateAge, getRelasi } = require("../../services/laporan/laporanUtils");
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

        if (laporans.length === 0) {
            return res.json({
                message: "Berhasil mengambil rekapitulasi data",
                message: "Berhasil mengambil rekapitulasi data",
                data: [],
                layananHeaders: [],
                tempatHeaders: []
            });
        }

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

        const rekap = kecamatans.map(kec => {
            const dataLokasi = laporans.filter(l => l.idKecamatan === kec.idKecamatan);

            // Profil Korban
            let jk = { l: 0, p: 0, total: 0 };
            let usia = { '<6': 0, '6-12': 0, '13-17': 0, '18-24': 0, '25-44': 0, '45-59': 0, '60+': 0 };
            let pend = { tidakSekolah: 0, sd: 0, sltp: 0, slta: 0, pt: 0, paud: 0, na: 0 };

            // Kasus (Bentuk Kekerasan, Layanan, Tempat)
            let bentuk = { fisik: 0, psikis: 0, seksual: 0, eksploitasi: 0, trafficking: 0, penelantaran: 0, lainnya: 0 };
            let layanan = {};
            layananHeaders.forEach(header => {
                layanan[header] = 0;
            });
            let tempat = {};
            tempatHeaders.forEach(header => {
                tempat[header] = 0;
            });
            tempat.lainnya = 0;

            // Relasi Pelaku
            let relasi = {};
            hubunganHeaders.forEach(header => {
                relasi[header] = 0;
            });
            relasi.lainnya = 0;
            relasi.na = 0;

            let kdrt = 0;

            dataLokasi.forEach(l => {
                const korban = l.korban;
                const terlapor = l.terlapor;

                if (korban) {
                    jk.total++;
                    if (korban.jenisKelamin === 'Laki_laki') jk.l++;
                    else if (korban.jenisKelamin === 'Perempuan') jk.p++;

                    if (korban.tanggalLahir) {
                        const age = calculateAge(korban.tanggalLahir);
                        if (age < 6) usia['<6']++;
                        else if (age <= 12) usia['6-12']++;
                        else if (age <= 17) usia['13-17']++;
                        else if (age <= 24) usia['18-24']++;
                        else if (age <= 44) usia['25-44']++;
                        else if (age <= 59) usia['45-59']++;
                        else usia['60+']++;
                    }

                    const p = korban.pendidikan;
                    if (p === 'Tidak_Sekolah') pend.tidakSekolah++;
                    else if (p === 'SD') pend.sd++;
                    else if (p === 'SLTP') pend.sltp++;
                    else if (p === 'SLTA') pend.slta++;
                    else if (p === 'Perguruan_Tinggi') pend.pt++;
                    else if (p === 'PAUD_TK') pend.paud++;
                    else pend.na++;
                }

                const bkName = l.bentukKekerasan?.namaBentukKekerasan?.toLowerCase() || '';
                if (bkName.includes('fisik')) bentuk.fisik++;
                else if (bkName.includes('psikis')) bentuk.psikis++;
                else if (bkName.includes('seksual')) bentuk.seksual++;
                else if (bkName.includes('eksploitasi')) bentuk.eksploitasi++;
                else if (bkName.includes('trafficking')) bentuk.trafficking++;
                else if (bkName.includes('penelantaran')) bentuk.penelantaran++;
                else bentuk.lainnya++;

                const lay = (l.layananDibutuhkan || '');
                if (lay) {
                    if (layanan[lay] === undefined) {
                        layanan[lay] = 0;
                    }
                    layanan[lay]++;
                }

                const tempatStr = (l.lokasiKejadianPerkara || l.lokasiLengkapKejadian || '').toLowerCase();
                let matched = false;
                if (tempatStr) {
                    const matchedHeader = tempatHeaders.find(h => tempatStr.includes(h.toLowerCase()));
                    if (matchedHeader) {
                        tempat[matchedHeader]++;
                        matched = true;
                    }
                }
                if (!matched) {
                    tempat.lainnya++;
                }

                let relStr = '';
                if (korban && korban.hubunganDenganTerlapor) relStr = korban.hubunganDenganTerlapor;
                else if (terlapor && terlapor.hubunganDenganKorban) relStr = terlapor.hubunganDenganKorban;

                let relMatched = false;
                if (relStr) {
                    const matchedRel = hubunganHeaders.find(h => relStr.toLowerCase().includes(h.toLowerCase()));
                    if (matchedRel) {
                        relasi[matchedRel]++;
                        relMatched = true;
                    }
                }

                if (!relMatched && relStr && relStr !== '') {
                    relasi.lainnya++;
                } else if (!relStr) {
                    relasi.na++;
                }

                const kasusName = l.jenisKasus?.namaJenisKasus?.toLowerCase() || '';
                if (kasusName.includes('kdrt') || kasusName.includes('rumah tangga')) {
                    kdrt++;
                }
            });

            return {
                id: kec.idKecamatan,
                kecamatan: kec.namaKecamatan,
                profil: jk,
                usia,
                pend,
                bentuk,
                layanan,
                tempat,
                relasi,
                kdrt: { jumlah: kdrt, persentase: laporans.length > 0 ? ((kdrt / laporans.length) * 100).toFixed(1) : 0 }
            };
        });

        res.json({
            message: "Berhasil mengambil rekapitulasi data",
            data: rekap,
            layananHeaders,
            tempatHeaders,
            hubunganHeaders
        });
    } catch (error) {
        console.error("Error Get Rekapitulasi Data:", error);
        res.status(500).json({ message: "Gagal mengambil rekapitulasi data." });
    }
};

module.exports = {
    getStatistik,
    getRekapitulasiData
};
