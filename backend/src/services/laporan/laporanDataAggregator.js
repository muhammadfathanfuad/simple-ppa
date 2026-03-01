const { calculateAge, getRelasi } = require("./laporanUtils");

/**
 * Aggregates data for Rekapitulasi Excel export by kecamatan
 * @param {Array} laporans - Array of laporan data
 * @param {Array} kecamatans - Array of kecamatan data
 * @param {Array} layananHeaders - Array of dynamic layanan headers
 * @param {Array} hubunganHeaders - Array of dynamic hubungan korban headers
 * @returns {Array} Aggregated data by kecamatan
 */
const aggregateRekapitulasiData = (laporans, kecamatans, layananHeaders = [], tempatHeaders = [], hubunganHeaders = []) => {
    return kecamatans.map(kec => {
        const dataLokasi = laporans.filter(l => l.idKecamatan === kec.idKecamatan);

        // Profil Korban
        let jk = { l: 0, p: 0, total: 0 };
        let usia = { '<6': 0, '6-12': 0, '13-17': 0, '18-24': 0, '25-44': 0, '45-59': 0, '60+': 0 };
        let pend = { tidakSekolah: 0, sd: 0, sltp: 0, slta: 0, pt: 0, paud: 0, na: 0 };

        // Kasus (Bentuk Kekerasan, Layanan, Tempat)
        let bentuk = { fisik: 0, psikis: 0, seksual: 0, eksploitasi: 0, trafficking: 0, penelantaran: 0, lainnya: 0 };
        let layanan = {};
        if (layananHeaders.length > 0) {
            layananHeaders.forEach(h => { layanan[h] = 0; });
        } else {
            layanan = { pengaduan: 0, kesehatan: 0, hukum: 0, penegakan_hukum: 0, rehab_sosial: 0, reintegrasi: 0, pemulangan: 0 };
        }

        let tempat = {};
        if (tempatHeaders.length > 0) {
            tempatHeaders.forEach(h => { tempat[h] = 0; });
            tempat.lainnya = 0;
        } else {
            tempat = { rumah: 0, kerja: 0, lainnya: 0, sekolah: 0, faskes: 0, lembaga: 0 };
        }

        // Relasi Pelaku
        let relasi = {};
        if (hubunganHeaders.length > 0) {
            hubunganHeaders.forEach(h => { relasi[h] = 0; });
            relasi.lainnya = 0;
            relasi.na = 0;
        } else {
            relasi = { ortu: 0, keluarga: 0, suamiIstri: 0, tetangga: 0, pacar: 0, guru: 0, majikan: 0, rekan: 0, lainnya: 0, na: 0 };
        }
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

            if (layananHeaders.length > 0) {
                const lay = (l.layananDibutuhkan || '');
                if (lay) {
                    if (layanan[lay] === undefined) {
                        layanan[lay] = 0;
                    }
                    layanan[lay]++;
                }
            } else {
                const lay = (l.layananDibutuhkan || '').toLowerCase();
                if (lay.includes('pengaduan')) layanan.pengaduan++;
                if (lay.includes('kesehatan') || lay.includes('medis')) layanan.kesehatan++;
                if (lay.includes('hukum')) layanan.hukum++;
                if (lay.includes('penegak')) layanan.penegakan_hukum++;
                if (lay.includes('rehab')) layanan.rehab_sosial++;
                if (lay.includes('reintegrasi')) layanan.reintegrasi++;
                if (lay.includes('pemulangan')) layanan.pemulangan++;
            }

            if (tempatHeaders.length > 0) {
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
            } else {
                const tempatStr = (l.lokasiKejadianPerkara || l.lokasiLengkapKejadian || '').toLowerCase();
                if (tempatStr.includes('rumah')) tempat.rumah++;
                else if (tempatStr.includes('kerja') || tempatStr.includes('kantor')) tempat.kerja++;
                else if (tempatStr.includes('sekolah') || tempatStr.includes('kampus')) tempat.sekolah++;
                else if (tempatStr.includes('umum') || tempatStr.includes('jalan')) tempat.faskes++;
                else if (tempatStr.includes('lembaga')) tempat.lembaga++;
                else tempat.lainnya++;
            }

            if (hubunganHeaders.length > 0) {
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
            } else {
                let rel = 'na';
                if (korban && korban.hubunganDenganTerlapor) rel = getRelasi(korban.hubunganDenganTerlapor);
                else if (terlapor && terlapor.hubunganDenganKorban) rel = getRelasi(terlapor.hubunganDenganKorban);
                relasi[rel]++;
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
};

/**
 * Aggregates data for Rekapitulasi Perempuan Excel export by kecamatan
 * @param {Array} laporans - Array of laporan data
 * @param {Array} kecamatans - Array of kecamatan data
 * @returns {Array} Aggregated data for women by kecamatan
 */
const aggregateRekapitulasiPerempuanData = (laporans, kecamatans) => {
    return kecamatans.map(kec => {
        const dataLokasi = laporans.filter(l => l.idKecamatan === kec.idKecamatan);

        let jumlahKorban = 0;
        let bentuk = { fisik: 0, psikis: 0, seksual: 0, penelantaran: 0, tppo: 0, lainnya: 0 };

        dataLokasi.forEach(l => {
            const korban = l.korban;
            if (korban && korban.jenisKelamin === 'Perempuan' && korban.tanggalLahir) {
                const age = calculateAge(korban.tanggalLahir);
                if (age >= 18) {
                    jumlahKorban++;

                    const bkName = l.bentukKekerasan?.namaBentukKekerasan?.toLowerCase() || '';
                    if (bkName.includes('fisik')) bentuk.fisik++;
                    else if (bkName.includes('psikis')) bentuk.psikis++;
                    else if (bkName.includes('seksual')) bentuk.seksual++;
                    else if (bkName.includes('penelantaran')) bentuk.penelantaran++;
                    else if (bkName.includes('trafficking') || bkName.includes('tppo')) bentuk.tppo++;
                    else bentuk.lainnya++;
                }
            }
        });

        return {
            kecamatan: kec.namaKecamatan,
            jumlahKorban,
            bentuk
        };
    });
};

/**
 * Aggregates data for Rekapitulasi Anak Excel export by kecamatan
 * @param {Array} laporans - Array of laporan data
 * @param {Array} kecamatans - Array of kecamatan data
 * @returns {Array} Aggregated data for children by kecamatan
 */
const aggregateRekapitulasiAnakData = (laporans, kecamatans) => {
    return kecamatans.map(kec => {
        const dataLokasi = laporans.filter(l => l.idKecamatan === kec.idKecamatan);

        let jumlahL = 0;
        let jumlahP = 0;
        let totalKorban = 0;
        let bentuk = { fisik: 0, psikis: 0, seksual: 0, penelantaran: 0, tppo: 0, lainnya: 0 };

        dataLokasi.forEach(l => {
            const korban = l.korban;
            if (korban && korban.tanggalLahir) {
                const age = calculateAge(korban.tanggalLahir);
                if (age < 18) {
                    totalKorban++;

                    if (korban.jenisKelamin === 'Laki-Laki' || korban.jenisKelamin === 'Laki-laki') {
                        jumlahL++;
                    } else if (korban.jenisKelamin === 'Perempuan') {
                        jumlahP++;
                    }

                    const bkName = l.bentukKekerasan?.namaBentukKekerasan?.toLowerCase() || '';
                    if (bkName.includes('fisik')) bentuk.fisik++;
                    else if (bkName.includes('psikis')) bentuk.psikis++;
                    else if (bkName.includes('seksual')) bentuk.seksual++;
                    else if (bkName.includes('penelantaran')) bentuk.penelantaran++;
                    else if (bkName.includes('trafficking') || bkName.includes('tppo')) bentuk.tppo++;
                    else bentuk.lainnya++;
                }
            }
        });

        return {
            kecamatan: kec.namaKecamatan,
            jumlahL,
            jumlahP,
            totalKorban,
            bentuk
        };
    });
};

module.exports = {
    aggregateRekapitulasiData,
    aggregateRekapitulasiPerempuanData,
    aggregateRekapitulasiAnakData
};