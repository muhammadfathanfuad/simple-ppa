/**
 * Creates pelapor data object for database update
 * @param {Object} pelapor - Pelapor data from request
 * @param {Object} enums - Processed enum values for pelapor
 * @returns {Object} Pelapor data object for database update
 */
const createPelaporUpdateData = (pelapor, enums) => {
    return {
        nama: pelapor.nama,
        jenisKelamin: enums.jenisKelamin.enumVal,
        tempatLahir: pelapor.tempatLahir,
        alamatLengkap: pelapor.alamatLengkap,
        nomorWhatsapp: pelapor.nomorWhatsapp,
        pekerjaan: enums.pekerjaan.enumVal,
        pekerjaanLainnya: enums.pekerjaan.otherVal,
        agama: enums.agama.enumVal,
        agamaLainnya: enums.agama.otherVal,
        hubunganDenganKorban: pelapor.hubunganDenganKorban,
        hubunganDenganTerlapor: pelapor.hubunganDenganTerlapor,
        statusPelapor: enums.statusPelapor.enumVal,
        statusPelaporLainnya: enums.statusPelapor.otherVal,
        tanggalLahir: pelapor.tanggalLahir ? new Date(pelapor.tanggalLahir) : null,
    };
};

/**
 * Creates korban data object for database update
 * @param {Object} korban - Korban data from request
 * @param {Object} enums - Processed enum values for korban
 * @returns {Object} Korban data object for database update
 */
const createKorbanUpdateData = (korban, enums) => {
    return {
        namaLengkap: korban.namaLengkap,
        nik: korban.nik,
        nomorWhatsapp: korban.nomorWhatsapp,
        alamatLengkap: korban.alamatLengkap,
        tempatLahir: korban.tempatLahir,
        tanggalLahir: korban.tanggalLahir ? new Date(korban.tanggalLahir) : null,
        jenisKelamin: enums.jenisKelamin.enumVal,
        kewarganegaraan: enums.kewarganegaraan.enumVal,
        pendidikan: enums.pendidikan.enumVal,
        pendidikanLainnya: enums.pendidikan.otherVal,
        pekerjaan: enums.pekerjaan.enumVal,
        pekerjaanLainnya: enums.pekerjaan.otherVal,
        agama: enums.agama.enumVal,
        agamaLainnya: enums.agama.otherVal,
        statusPerkawinan: korban.statusPerkawinan,
        disabilitas: korban.disabilitas,
        jenisDisabilitas: korban.jenisDisabilitas,
        nomorTelepon: korban.nomorTelepon,
        jumlahAnak: korban.jumlahAnak ? parseInt(korban.jumlahAnak) : null,
        namaOrtuWali: korban.namaOrtuWali,
        alamatOrtuWali: korban.alamatOrtuWali,
        kewarganegaraanOrtuWali: enums.kewarganegaraanOrtuWali.enumVal,
        pekerjaanAyah: korban.pekerjaanAyah,
        pekerjaanIbu: korban.pekerjaanIbu,
        jumlahSaudara: korban.jumlahSaudara ? parseInt(korban.jumlahSaudara) : null,
        hubunganDenganTerlapor: korban.hubunganDenganTerlapor,
    };
};

/**
 * Creates terlapor data object for database update
 * @param {Object} terlapor - Terlapor data from request
 * @param {Object} enums - Processed enum values for terlapor
 * @returns {Object} Terlapor data object for database update
 */
const createTerlaporUpdateData = (terlapor, enums) => {
    return {
        nama: terlapor.nama,
        umur: terlapor.umurTerlapor || terlapor.umur || undefined,
        jenisKelamin: enums.jenisKelamin.enumVal,
        kewarganegaraan: enums.kewarganegaraan.enumVal,
        alamat: terlapor.alamat,
        nomorTelepon: terlapor.nomorTelepon,
        pendidikan: enums.pendidikan.enumVal,
        agama: enums.agama.enumVal,
        pekerjaan: terlapor.pekerjaan,
        statusPerkawinan: terlapor.statusPerkawinan,
        namaOrtuWali: terlapor.namaOrtuWali,
        alamatOrtuWali: terlapor.alamatOrtuWali,
        pekerjaanOrtu: terlapor.pekerjaanOrtu,
        jumlahSaudara: terlapor.jumlahSaudara ? parseInt(terlapor.jumlahSaudara) : null,
        jumlahAnak: terlapor.jumlahAnak ? parseInt(terlapor.jumlahAnak) : null,
        hubunganDenganKorban: terlapor.hubunganDenganKorban,
    };
};

/**
 * Creates trafficking data object for database update
 * @param {Object} trafficking - Trafficking data from request
 * @returns {Object} Trafficking data object for database update
 */
const createTraffickingUpdateData = (trafficking) => {
    return {
        isTrafficking: trafficking.isTrafficking,
        ruteTrafficking: trafficking.ruteTrafficking,
        alatTransportasi: trafficking.alatTransportasi,
        caraDigunakan: trafficking.caraDigunakan,
        bentukEksploitasi: trafficking.bentukEksploitasi,
        bentukPelanggaran: trafficking.bentukPelanggaran,
        bentukKriminalisasi: trafficking.bentukKriminalisasi,
    };
};

/**
 * Creates laporan data object for database update
 * @param {Object} laporan - Laporan data from request
 * @returns {Object} Laporan data object for database update
 */
const createLaporanUpdateData = (laporan) => {
    return {
        dibuatPada: laporan.tanggal ? new Date(laporan.tanggal) : undefined,
        kodeLaporan: laporan.noRegistrasi || undefined,
        tanggalKejadian: laporan.tanggalKejadian ? new Date(laporan.tanggalKejadian) : undefined,
        waktuKejadian: laporan.waktuKejadian ? new Date(`1970-01-01T${laporan.waktuKejadian}:00Z`) : undefined,
        lokasiLengkapKejadian: laporan.lokasiLengkapKejadian,
        lokasiKejadianPerkara: laporan.lokasiKejadianPerkara,
        kronologiKejadian: laporan.kronologiKejadian,
        harapanKorban: laporan.harapanKorban,
        layananDibutuhkan: laporan.layananDibutuhkan,
        rujukanDari: laporan.rujukanDari,
        caraDatang: laporan.caraDatang,
        namaKlien: laporan.namaKlien,
        alamatKlien: laporan.alamatKlien,
        penerimaPengaduan: laporan.penerimaPengaduan,
        // Relations (Using direct IDs since they are exposed in the schema)
        idKecamatan: laporan.idKecamatan ? parseInt(laporan.idKecamatan) : undefined,
        idJenisKasus: laporan.idJenisKasus ? parseInt(laporan.idJenisKasus) : undefined,
        idBentukKekerasan: laporan.idBentukKekerasan ? parseInt(laporan.idBentukKekerasan) : undefined,
    };
};

module.exports = {
    createPelaporUpdateData,
    createKorbanUpdateData,
    createTerlaporUpdateData,
    createTraffickingUpdateData,
    createLaporanUpdateData
};