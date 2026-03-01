const mapToEnum = (value, enumType, existingOtherValue) => {
    if (!value) return { enumVal: undefined, otherVal: existingOtherValue };
    const valUpper = value.toString().toUpperCase().trim();
    const mappings = {
        Pekerjaan: {
            "GURU": "Guru", "PEDAGANG": "Pedagang", "BURUH": "Buruh", "WIRASWASTA": "Wiraswasta", "KARYAWAN": "Karyawan",
            "TNI/POLRI": "TNI_POLRI", "TNI_POLRI": "TNI_POLRI", "TANI": "Tani", "PETANI": "Tani",
            "PELAJAR/MAHASISWA": "Pelajar_Mahasiswa", "PELAJAR_MAHASISWA": "Pelajar_Mahasiswa", "PELAJAR": "Pelajar_Mahasiswa", "MAHASISWA": "Pelajar_Mahasiswa",
            "IBU RUMAH TANGGA": "Ibu_Rumah_Tangga", "IBU_RUMAH_TANGGA": "Ibu_Rumah_Tangga", "IRT": "Ibu_Rumah_Tangga", "LAINNYA": "Lainnya"
        },
        Agama: {
            "ISLAM": "Islam", "KRISTEN": "Kristen", "KATOLIK": "Katolik", "HINDU": "Hindu",
            "BUDHA": "Budha", "KONGHUCHU": "Konghuchu", "LAINNYA": "Lainnya"
        },
        Pendidikan: {
            "TIDAK SEKOLAH": "Tidak_Sekolah", "TIDAK_SEKOLAH": "Tidak_Sekolah", "SD": "SD",
            "SLTP": "SLTP", "SMP": "SLTP", "SLTA": "SLTA", "SMA": "SLTA", "SMK": "SLTA",
            "PERGURUAN TINGGI": "Perguruan_Tinggi", "PERGURUAN_TINGGI": "Perguruan_Tinggi", "D1/D2/D3": "Perguruan_Tinggi", "D1_D2_D3": "Perguruan_Tinggi", "D3": "Perguruan_Tinggi",
            "S1/S2/S3": "PAUD_TK", "S1_S2_S3": "PAUD_TK", "S1": "PAUD_TK", "SARJANA": "PAUD_TK", "PAUD/TK": "PAUD_TK", "PAUD_TK": "PAUD_TK", "LAINNYA": "Lainnya"
        },
        StatusPelapor: {
            "KORBAN LANGSUNG": "Korban_Langsung", "KORBAN_LANGSUNG": "Korban_Langsung", "KELUARGA": "Keluarga",
            "TETANGGA": "Tetangga", "TEMAN": "Teman", "SAKSI": "Saksi", "LAINNYA": "Lainnya"
        },
        JenisKelamin: {
            "LAKI-LAKI": "Laki_laki", "LAKI_LAKI": "Laki_laki", "PEREMPUAN": "Perempuan"
        },
        Kewarganegaraan: {
            "WNI": "WNI", "WNA": "WNA"
        }
    };
    const map = mappings[enumType];
    if (!map) return { enumVal: undefined, otherVal: existingOtherValue };
    if (map[valUpper]) return { enumVal: map[valUpper], otherVal: existingOtherValue };
    return { enumVal: "Lainnya", otherVal: value };
};

const buildDateFilter = (startDate, endDate) => {
    const whereClause = {};
    if (startDate && endDate) {
        whereClause.dibuatPada = {
            gte: new Date(startDate),
            lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        };
    } else if (startDate) {
        whereClause.dibuatPada = {
            gte: new Date(startDate)
        };
    }
    return whereClause;
};

const buildYearMonthFilter = (tahun, bulan) => {
    const whereClause = {};
    if (tahun) {
        const year = parseInt(tahun);
        if (bulan) {
            const month = parseInt(bulan) - 1;
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
            whereClause.dibuatPada = { gte: start, lte: end };
        } else {
            const start = new Date(year, 0, 1);
            const end = new Date(year, 11, 31, 23, 59, 59, 999);
            whereClause.dibuatPada = { gte: start, lte: end };
        }
    }
    return whereClause;
};

const getRelasi = (str) => {
    if (!str) return 'na';
    str = str.toLowerCase();
    if (str.includes('ortu') || str.includes('ayah') || str.includes('ibu') || str.includes('bapak')) return 'ortu';
    if (str.includes('keluarga') || str.includes('saudara') || str.includes('paman') || str.includes('bibi')) return 'keluarga';
    if (str.includes('suami') || str.includes('istri')) return 'suamiIstri';
    if (str.includes('tetangga')) return 'tetangga';
    if (str.includes('pacar') || str.includes('teman')) return 'pacar';
    if (str.includes('guru') || str.includes('dosen')) return 'guru';
    if (str.includes('majikan') || str.includes('bos')) return 'majikan';
    if (str.includes('kerja') || str.includes('rekan')) return 'rekan';
    return 'lainnya';
};

const calculateAge = (birthDate, referenceDate = new Date()) => {
    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const m = referenceDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && referenceDate.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

module.exports = {
    mapToEnum,
    buildDateFilter,
    buildYearMonthFilter,
    getRelasi,
    calculateAge
};
