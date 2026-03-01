const fs = require("fs");
const { buildDateFilter } = require("./laporanUtils");

/**
 * Validates required fields for laporan (report)
 * @param {Object} laporan - Laporan data object
 * @returns {Object} Validation result with isValid flag and message
 */
const validateLaporanData = (laporan) => {
    if (!laporan.idKecamatan || isNaN(parseInt(laporan.idKecamatan))) {
        return { isValid: false, message: "Kecamatan harus dipilih." };
    }
    if (!laporan.idJenisKasus || isNaN(parseInt(laporan.idJenisKasus))) {
        return { isValid: false, message: "Jenis kasus harus dipilih." };
    }
    return { isValid: true };
};

/**
 * Handles file cleanup in case of errors
 * @param {Array} files - Array of file objects
 */
const cleanupFiles = (files) => {
    if (files && files.length > 0) {
        files.forEach((file) => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
    }
};

/**
 * Parses request body data from FormData
 * @param {Object} req - Express request object
 * @returns {Object} Parsed data object { data, files }
 */
const parseRequestData = (req) => {
    let pelapor, korban, terlapor, trafficking, laporan;

    // Handle FormData JSON string if present (for file uploads with nested data)
    if (req.body.data) {
        try {
            const parsedData = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
            pelapor = parsedData.pelapor;
            korban = parsedData.korban;
            terlapor = parsedData.terlapor;
            trafficking = parsedData.trafficking;
            laporan = parsedData.laporan;
        } catch (e) {
            throw new Error("Format data tidak valid");
        }
    } else {
        // Handle individual stringified JSON fields from FormData
        try {
            pelapor = req.body.pelapor ? (typeof req.body.pelapor === 'string' ? JSON.parse(req.body.pelapor) : req.body.pelapor) : undefined;
            korban = req.body.korban ? (typeof req.body.korban === 'string' ? JSON.parse(req.body.korban) : req.body.korban) : undefined;
            terlapor = req.body.terlapor ? (typeof req.body.terlapor === 'string' ? JSON.parse(req.body.terlapor) : req.body.terlapor) : undefined;
            trafficking = req.body.trafficking ? (typeof req.body.trafficking === 'string' ? JSON.parse(req.body.trafficking) : req.body.trafficking) : undefined;
            laporan = req.body.laporan ? (typeof req.body.laporan === 'string' ? JSON.parse(req.body.laporan) : req.body.laporan) : undefined;
        } catch (e) {
            throw new Error("Format field JSON tidak valid");
        }
    }

    // Ensure files fallback properly
    let files = req.files;
    if (req.files && !Array.isArray(req.files) && req.files.bukti) {
        files = req.files.bukti;
    } else if (!req.files) {
        files = [];
    }

    return {
        data: { pelapor, korban, terlapor, trafficking, laporan },
        files
    };
};

/**
 * Logs error to file for debugging purposes
 * @param {Error} error - Error object to log
 */
const logErrorToFile = (error) => {
    fs.writeFileSync('backend_error.log', error.toString() + "\n" + (error.stack || ''));
};

/**
 * Creates an upsert object for Prisma operations
 * @param {Object} data - Data to use for both create and update
 * @returns {Object} Upsert object with create and update properties
 */
const createUpsertObject = (data) => {
    return {
        create: data,
        update: data
    };
};

/**
 * Saves evidence files to the database
 * @param {Object} tx - Prisma transaction object
 * @param {number} idLaporan - ID of the laporan
 * @param {Array} files - Array of uploaded files
 */
const saveEvidenceFiles = async (tx, idLaporan, files) => {
    if (files && files.length > 0) {
        await tx.buktiLaporan.createMany({
            data: files.map((file) => ({
                idLaporan,
                jenisBukti: 'Foto',
                lokasiFile: file.path,
                namaFileAsli: file.originalname,
                tipeFile: file.mimetype,
                ukuranFile: BigInt(file.size)
            })),
        });
    }
};

/**
 * Builds query filters for laporan searches
 * @param {Object} query - Query parameters from request
 * @returns {Object} Where clause for Prisma query
 */
const buildLaporanQuery = (query) => {
    const { status, q, startDate, endDate } = query;
    const whereClause = buildDateFilter(startDate, endDate);

    if (status && status !== 'All') {
        whereClause.statusLaporan = status;
    }

    if (q) {
        whereClause.OR = [
            { kodeLaporan: { contains: q } },
            { pelapor: { nama: { contains: q } } },
            { korban: { namaLengkap: { contains: q } } }
        ];
    }

    return whereClause;
};

module.exports = {
    validateLaporanData,
    cleanupFiles,
    parseRequestData,
    logErrorToFile,
    createUpsertObject,
    saveEvidenceFiles,
    buildLaporanQuery
};