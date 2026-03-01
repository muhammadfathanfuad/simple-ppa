const { mapToEnum } = require('./laporanUtils');

const processPelaporEnums = (pelapor) => {
    if (!pelapor) return {};
    return {
        pekerjaan: mapToEnum(pelapor.pekerjaan, 'Pekerjaan', pelapor.pekerjaanLainnya),
        agama: mapToEnum(pelapor.agama, 'Agama', pelapor.agamaLainnya),
        statusPelapor: mapToEnum(pelapor.statusPelapor, 'StatusPelapor', pelapor.statusPelaporLainnya),
        jenisKelamin: mapToEnum(pelapor.jenisKelamin, 'JenisKelamin')
    };
};

const processKorbanEnums = (korban) => {
    if (!korban) return {};
    return {
        jenisKelamin: mapToEnum(korban.jenisKelamin, 'JenisKelamin'),
        kewarganegaraan: mapToEnum(korban.kewarganegaraan, 'Kewarganegaraan'),
        pendidikan: mapToEnum(korban.pendidikan, 'Pendidikan', korban.pendidikanLainnya),
        pekerjaan: mapToEnum(korban.pekerjaan, 'Pekerjaan', korban.pekerjaanLainnya),
        agama: mapToEnum(korban.agama, 'Agama', korban.agamaLainnya),
        kewarganegaraanOrtuWali: mapToEnum(korban.kewarganegaraanOrtuWali, 'Kewarganegaraan')
    };
};

const processTerlaporEnums = (terlapor) => {
    if (!terlapor) return {};
    return {
        jenisKelamin: mapToEnum(terlapor.jenisKelamin, 'JenisKelamin'),
        kewarganegaraan: mapToEnum(terlapor.kewarganegaraan, 'Kewarganegaraan'),
        pendidikan: mapToEnum(terlapor.pendidikan, 'Pendidikan'),
        agama: mapToEnum(terlapor.agama, 'Agama')
    };
};

module.exports = {
    processPelaporEnums,
    processKorbanEnums,
    processTerlaporEnums
};