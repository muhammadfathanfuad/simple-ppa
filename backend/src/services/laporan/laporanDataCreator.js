/**
 * Creates pelapor data object for database insertion
 * @param {Object} pelapor - Pelapor data from request
 * @param {Object} enums - Processed enum values for pelapor
 * @returns {Object} Pelapor data object for database
 */
const createPelaporData = (pelapor, enums) => {
    return {
        nama: pelapor.namaPelapor || pelapor.nama,
        alamatLengkap: pelapor.alamatPelapor || pelapor.alamatLengkap,
        nomorWhatsapp: pelapor.noTelpPelapor || pelapor.nomorWhatsapp || pelapor.nomorTelepon,
        pekerjaan: enums.pekerjaan.enumVal,
        pekerjaanLainnya: enums.pekerjaan.otherVal,
        agama: enums.agama.enumVal,
        agamaLainnya: enums.agama.otherVal,
        statusPelapor: enums.statusPelapor.enumVal,
        statusPelaporLainnya: enums.statusPelapor.otherVal,
        jenisKelamin: enums.jenisKelamin.enumVal,
        hubunganDenganKorban: pelapor.hubunganDenganKorban,
        hubunganDenganTerlapor: pelapor.hubunganDenganTerlapor,
        tanggalLahir: pelapor.tanggalLahir ? new Date(pelapor.tanggalLahir) : null,
    };
};

/**
 * Creates korban data object for database insertion
 * @param {Object} korban - Korban data from request
 * @param {Object} enums - Processed enum values for korban
 * @returns {Object} Korban data object for database
 */
const createKorbanData = (korban, enums) => {
    return {
        namaLengkap: korban.namaKorban || korban.namaLengkap,
        nik: korban.nikKorban || korban.nik,
        alamatLengkap: korban.alamatKorban || korban.alamatLengkap,
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
        nomorTelepon: korban.nomorTelepon || korban.nomorWhatsapp,
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
 * Creates terlapor data object for database insertion
 * @param {Object} terlapor - Terlapor data from request
 * @param {Object} enums - Processed enum values for terlapor
 * @returns {Object|null} Terlapor data object for database or null if not provided
 */
const createTerlaporData = (terlapor, enums) => {
    if (!terlapor || !terlapor.nama) return null;

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
 * Creates trafficking data object for database insertion
 * @param {Object} trafficking - Trafficking data from request
 * @returns {Object|null} Trafficking data object for database or null if not provided
 */
const createTraffickingData = (trafficking) => {
    if (!trafficking || !trafficking.isTrafficking) return null;

    return {
        ruteTrafficking: trafficking.ruteTrafficking,
        alatTransportasi: trafficking.alatTransportasi,
        caraDigunakan: trafficking.caraDigunakan,
        bentukEksploitasi: trafficking.bentukEksploitasi,
        bentukPelanggaran: trafficking.bentukPelanggaran,
        bentukKriminalisasi: trafficking.bentukKriminalisasi,
    };
};

/**
 * Creates laporan data object for database insertion
 * @param {Object} laporan - Laporan data from request
 * @param {string} nomorTiket - Generated ticket number
 * @returns {Object} Laporan data object for database
 */
const createLaporanData = (laporan, nomorTiket) => {
    return {
        dibuatPada: laporan.tanggal ? new Date(laporan.tanggal) : undefined,
        kodeLaporan: laporan.noRegistrasi || nomorTiket,
        idKecamatan: parseInt(laporan.idKecamatan),
        idJenisKasus: parseInt(laporan.idJenisKasus),
        idBentukKekerasan: parseInt(laporan.idBentukKekerasan),
        lokasiLengkapKejadian: laporan.lokasiLengkapKejadian,
        lokasiKejadianPerkara: laporan.lokasiKejadianPerkara,
        tanggalKejadian: new Date(laporan.tanggalKejadian),
        waktuKejadian: laporan.waktuKejadian ? new Date(`1970-01-01T${laporan.waktuKejadian}:00Z`) : null,
        kronologiKejadian: laporan.kronologiKejadian,
        harapanKorban: laporan.harapanKorban,
        layananDibutuhkan: laporan.layananDibutuhkan,
        rujukanDari: laporan.rujukanDari,
        caraDatang: laporan.caraDatang,
        namaKlien: laporan.namaKlien,
        alamatKlien: laporan.alamatKlien,
        penerimaPengaduan: laporan.penerimaPengaduan,
        latitude: laporan.latitude ? parseFloat(laporan.latitude) : null,
        longitude: laporan.longitude ? parseFloat(laporan.longitude) : null,
    };
};

module.exports = {
    createPelaporData,
    createKorbanData,
    createTerlaporData,
    createTraffickingData,
    createLaporanData
};