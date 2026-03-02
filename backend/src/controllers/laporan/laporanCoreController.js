const { prisma } = require("../../config");
const generateTicket = require("../../utils/generateTicket");
const {
    processPelaporEnums,
    processKorbanEnums,
    processTerlaporEnums
} = require("../../services/laporan/laporanDataProcessor");
const {
    validateLaporanData,
    cleanupFiles,
    parseRequestData,
    logErrorToFile,
    createUpsertObject,
    saveEvidenceFiles,
    buildLaporanQuery
} = require("../../services/laporan/laporanHelpers");
const {
    createPelaporData,
    createKorbanData,
    createTerlaporData,
    createTraffickingData,
    createLaporanData
} = require("../../services/laporan/laporanDataCreator");
const {
    createPelaporUpdateData,
    createKorbanUpdateData,
    createTerlaporUpdateData,
    createTraffickingUpdateData,
    createLaporanUpdateData
} = require("../../services/laporan/laporanDataUpdater");
const { AppError } = require("../../errors");

/**
 * Retrieves all laporan (reports) with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllLaporan = async (req, res) => {
    try {
        const whereClause = buildLaporanQuery(req.query);
        const laporan = await prisma.laporan.findMany({
            where: whereClause,
            include: {
                pelapor: true,
                korban: true,
                terlapor: true,
                jenisKasus: {
                    select: { idJenisKasus: true, namaJenisKasus: true }
                },
                bentukKekerasan: {
                    select: { idBentukKekerasan: true, namaBentukKekerasan: true }
                },
                kecamatan: {
                    select: { idKecamatan: true, namaKecamatan: true }
                },
                buktiLaporan: {
                    select: { idBukti: true, lokasiFile: true, jenisBukti: true, tipeFile: true, namaFileAsli: true }
                }
            },
            orderBy: { dibuatPada: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            message: 'Laporan retrieved successfully',
            data: laporan
        });
    } catch (error) {
        logErrorToFile(error, 'getAllLaporan');
        throw new AppError('Failed to retrieve laporan', 500);
    }
};

/**
 * Retrieves a specific laporan by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLaporanDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const laporan = await prisma.laporan.findUnique({
            where: { idLaporan: parseInt(id) },
            include: {
                pelapor: true,
                korban: true,
                terlapor: true,
                jenisKasus: {
                    select: { idJenisKasus: true, namaJenisKasus: true }
                },
                bentukKekerasan: {
                    select: { idBentukKekerasan: true, namaBentukKekerasan: true }
                },
                kecamatan: {
                    select: { idKecamatan: true, namaKecamatan: true }
                },
                buktiLaporan: {
                    select: { idBukti: true, lokasiFile: true, jenisBukti: true, tipeFile: true, namaFileAsli: true }
                }
            }
        });

        if (!laporan) {
            return res.status(404).json({
                status: 'fail',
                message: 'Laporan not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Laporan detail retrieved successfully',
            data: {
                ...laporan,
                idLaporan: laporan.idLaporan?.toString(),
                idAdminPenanggungjawab: laporan.idAdminPenanggungjawab?.toString()
            }
        });
    } catch (error) {
        logErrorToFile(error, 'getLaporanDetail');
        throw new AppError('Failed to retrieve laporan detail', 500);
    }
};

/**
 * Creates a new laporan (report)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const buatLaporan = async (req, res) => {
    let transaction;
    try {
        // Start transaction
        transaction = await prisma.$transaction(async (tx) => {
            // Parse and validate request data
            const { data, files } = parseRequestData(req);
            const validationErrors = validateLaporanData(data);

            if (validationErrors.length > 0) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Validation failed',
                    errors: validationErrors
                });
            }

            // Generate ticket
            const kodeLaporan = generateTicket();

            // Process Enums
            const pelaporEnums = processPelaporEnums(data.pelapor);
            const korbanEnums = processKorbanEnums(data.korban);
            const terlaporEnums = processTerlaporEnums(data.terlapor);

            // Create data objects
            const pelaporData = createPelaporData(data.pelapor, pelaporEnums);
            const korbanData = createKorbanData(data.korban, korbanEnums);
            const terlaporData = createTerlaporData(data.terlapor, terlaporEnums);
            const traffickingData = createTraffickingData(data.trafficking);
            // Create laporan record
            const laporanData = createLaporanData(data.laporan, kodeLaporan);

            const laporan = await tx.laporan.create({
                data: laporanData
            });

            // Create related records using idLaporan
            await tx.pelapor.create({
                data: { ...pelaporData, idLaporan: laporan.idLaporan }
            });

            await tx.korban.create({
                data: { ...korbanData, idLaporan: laporan.idLaporan }
            });

            if (terlaporData) {
                await tx.terlapor.create({
                    data: { ...terlaporData, idLaporan: laporan.idLaporan }
                });
            }

            if (traffickingData) {
                await tx.trafficking.create({
                    data: { ...traffickingData, idLaporan: laporan.idLaporan }
                });
            }

            // Save evidence records
            await saveEvidenceFiles(tx, laporan.idLaporan, files);

            return laporan;
        });

        // Cleanup temporary files after success, no longer needed in temp if saved properly
        // wait, we shouldn't delete the files if we just moved them or need them in uploads!
        // cleanupFiles(files); 
        // Actually, multer usually puts them in the correct destination directly. 

        res.status(201).json({
            status: 'success',
            message: 'Laporan berhasil disubmit',
            data: {
                kode_laporan: transaction.kodeLaporan,
                id: transaction.idLaporan ? transaction.idLaporan.toString() : undefined
            }
        });
    } catch (error) {
        // Cleanup files on error
        if (req.files && req.files.bukti) {
            await cleanupFiles(req.files.bukti);
        }

        logErrorToFile(error, 'buatLaporan');
        throw new AppError('Failed to create laporan', 500);
    }
};

/**
 * Updates the status of a laporan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, catatan } = req.body;

        // Validate status
        const validStatuses = ['menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Status tidak valid'
            });
        }

        const idNum = parseInt(id);

        await prisma.$transaction(async (tx) => {
            // Fetch existing laporan to get the old status
            const existingLaporan = await tx.laporan.findUnique({
                where: { idLaporan: idNum },
                select: { statusLaporan: true }
            });

            if (!existingLaporan) {
                throw new AppError('Laporan not found', 404);
            }

            const statusLama = existingLaporan.statusLaporan;

            // Update the status on Laporan
            await tx.laporan.update({
                where: { idLaporan: idNum },
                data: {
                    statusLaporan: status,
                    idAdminPenanggungjawab: req.user?.id ? parseInt(req.user.id) : null,
                    diperbaruiPada: new Date(),
                    ...(status === 'diverifikasi' && { diverifikasiPada: new Date() }),
                    ...(status === 'selesai' && { selesaiPada: new Date() })
                }
            });

            // If status changed, create LogStatusLaporan
            if (statusLama !== status) {
                await tx.logStatusLaporan.create({
                    data: {
                        idLaporan: idNum,
                        statusLama: statusLama,
                        statusBaru: status,
                        idAdmin: req.user?.id ? parseInt(req.user.id) : null,
                        catatanPerubahan: catatan || null,
                        dibuatPada: new Date()
                    }
                });
            }

            // If a note exists, add it to CatatanAdmin
            if (catatan) {
                await tx.catatanAdmin.create({
                    data: {
                        idLaporan: idNum,
                        idAdmin: req.user?.id ? parseInt(req.user.id) : 1, // Fallback to 1 if no user context
                        isiCatatan: catatan,
                        dibuatPada: new Date()
                    }
                });
            }
        });

        // Fetch the updated report
        const updatedLaporan = await prisma.laporan.findUnique({
            where: { idLaporan: idNum }
        });

        res.status(200).json({
            status: 'success',
            message: 'Status laporan berhasil diperbarui',
            data: {
                ...updatedLaporan,
                idLaporan: updatedLaporan?.idLaporan?.toString(),
                idAdminPenanggungjawab: updatedLaporan?.idAdminPenanggungjawab?.toString()
            }
        });
    } catch (error) {
        logErrorToFile(error, 'updateStatus');
        throw new AppError('Failed to update laporan status', 500);
    }
};

/**
 * Retrieves all locations for GIS mapping
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getLokasiKasus = async (req, res) => {
    try {
        const laporan = await prisma.laporan.findMany({
            where: {
                lokasi: {
                    NOT: {
                        detail_lokasi: null,
                        kecamatan_id: null
                    }
                }
            },
            select: {
                id: true,
                kode_laporan: true,
                lokasi: {
                    select: {
                        kecamatan_id: true,
                        kecamatan: {
                            select: { id: true, nama_kecamatan: true }
                        },
                        desa: true,
                        detail_lokasi: true
                    }
                }
            }
        });

        // Format data for GIS
        const locations = laporan.map(item => ({
            id: item.id,
            kode_laporan: item.kode_laporan,
            lat: item.lokasi?.lat || null,
            lng: item.lokasi?.lng || null,
            kecamatan: item.lokasi?.kecamatan?.nama_kecamatan || '',
            kecamatan_id: item.lokasi?.kecamatan_id || null,
            desa: item.lokasi?.desa || '',
            detail_lokasi: item.lokasi?.detail_lokasi || ''
        }));

        res.status(200).json({
            status: 'success',
            message: 'Lokasi kasus retrieved successfully',
            data: locations
        });
    } catch (error) {
        logErrorToFile(error, 'getLokasiKasus');
        throw new AppError('Failed to retrieve lokasi kasus', 500);
    }
};

/**
 * Updates a complete laporan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateLaporan = async (req, res) => {
    let transaction;
    try {
        const { id } = req.params;
        const { data, files } = parseRequestData(req);

        // Validate request data
        const validationErrors = validateLaporanData(data.laporan || data);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        transaction = await prisma.$transaction(async (tx) => {
            // Get existing laporan
            const existingLaporan = await tx.laporan.findUnique({
                where: { idLaporan: BigInt(id) },
                include: {
                    pelapor: true,
                    korban: true,
                    terlapor: true,
                    jenisKasus: true,
                    bentukKekerasan: true,
                    kecamatan: true,
                    buktiLaporan: true
                }
            });

            if (!existingLaporan) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Laporan not found'
                });
            }

            // Update data objects
            const pelaporEnums = processPelaporEnums(data.pelapor);
            const korbanEnums = processKorbanEnums(data.korban);
            const terlaporEnums = processTerlaporEnums(data.terlapor);

            const pelaporData = createPelaporUpdateData(data.pelapor, pelaporEnums);
            const korbanData = createKorbanUpdateData(data.korban, korbanEnums);
            const terlaporData = createTerlaporUpdateData(data.terlapor, terlaporEnums);
            const traffickingData = createTraffickingUpdateData(data.trafficking);
            // Update laporan record
            const laporanData = createLaporanUpdateData(data.laporan);

            await tx.laporan.update({
                where: { idLaporan: BigInt(id) },
                data: laporanData
            });

            // Update related records
            // For updates, checking existence is better but for simple-ppa they're 1-to-1 required 
            // except terlapor and trafficking.
            await tx.pelapor.update({
                where: { idLaporan: BigInt(id) },
                data: { ...pelaporData }
            });

            await tx.korban.update({
                where: { idLaporan: BigInt(id) },
                data: { ...korbanData }
            });

            if (terlaporData && Object.keys(terlaporData).length > 0) {
                const tl = await tx.terlapor.findUnique({ where: { idLaporan: BigInt(id) } });
                if (tl) {
                    await tx.terlapor.update({
                        where: { idLaporan: BigInt(id) },
                        data: { ...terlaporData }
                    });
                } else {
                    await tx.terlapor.create({
                        data: { ...terlaporData, idLaporan: BigInt(id) }
                    });
                }
            }

            if (traffickingData && traffickingData.isTrafficking) {
                const tr = await tx.trafficking.findUnique({ where: { idLaporan: BigInt(id) } });
                delete traffickingData.isTrafficking;
                if (tr) {
                    await tx.trafficking.update({
                        where: { idLaporan: BigInt(id) },
                        data: { ...traffickingData }
                    });
                } else {
                    await tx.trafficking.create({
                        data: { ...traffickingData, idLaporan: BigInt(id) }
                    });
                }
            } else if (traffickingData && traffickingData.isTrafficking === false) {
                try {
                    await tx.trafficking.delete({
                        where: { idLaporan: BigInt(id) }
                    });
                } catch (e) { } // ignore if not exists
            }

            // Handle evidence files (Appends if new files uploaded)
            if (files && files.length > 0) {
                await saveEvidenceFiles(tx, BigInt(id), files);
            }

            return existingLaporan;
        });

        res.status(200).json({
            status: 'success',
            message: 'Laporan berhasil diperbarui',
            data: {
                id: transaction.idLaporan ? transaction.idLaporan.toString() : id
            }
        });
    } catch (error) {
        // Cleanup files on error
        if (req.files && req.files.bukti) {
            await cleanupFiles(req.files.bukti);
        }

        logErrorToFile(error, 'updateLaporan');
        throw new AppError('Failed to update laporan', 500);
    }
};

/**
 * Checks the status of a laporan by kode_laporan
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const cekStatusLaporan = async (req, res) => {
    try {
        const { kode_laporan } = req.params;

        // Clean the ticket ID (allow hyphens)
        const cleanTicketId = kode_laporan.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();

        const laporan = await prisma.laporan.findUnique({
            where: { kodeLaporan: cleanTicketId },
            select: {
                idLaporan: true,
                kodeLaporan: true,
                statusLaporan: true,
                dibuatPada: true,
                pelapor: {
                    select: {
                        nama: true,
                        nomorWhatsapp: true
                    }
                },
                logStatus: {
                    orderBy: {
                        dibuatPada: 'desc'
                    }
                }
            }
        });

        if (!laporan) {
            return res.status(404).json({
                status: 'fail',
                message: 'Laporan tidak ditemukan'
            });
        }

        const formattedLaporan = {
            id: laporan.idLaporan.toString(),
            kode_laporan: laporan.kodeLaporan,
            status: laporan.statusLaporan,
            created_at: laporan.dibuatPada,
            pelapor: {
                nama_pelapor: laporan.pelapor?.nama,
                no_hp_pelapor: laporan.pelapor?.nomorWhatsapp
            },
            logStatus: laporan.logStatus
        };

        res.status(200).json({
            status: 'success',
            message: 'Status laporan ditemukan',
            data: formattedLaporan
        });
    } catch (error) {
        logErrorToFile(error, 'cekStatusLaporan');
        throw new AppError('Failed to check laporan status', 500);
    }
};

/**
 * Deletes a specific laporan by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteLaporan = async (req, res) => {
    try {
        const { id } = req.params;
        const idNum = parseInt(id);

        const laporan = await prisma.laporan.findUnique({
            where: { idLaporan: idNum }
        });

        if (!laporan) {
            return res.status(404).json({
                status: 'fail',
                message: 'Laporan not found'
            });
        }

        // Delete laporan (cascade will handle related records)
        await prisma.laporan.delete({
            where: { idLaporan: idNum }
        });

        res.status(200).json({
            status: 'success',
            message: 'Laporan berhasil dihapus'
        });
    } catch (error) {
        logErrorToFile(error, 'deleteLaporan');
        throw new AppError('Failed to delete laporan', 500);
    }
};

module.exports = {
    getAllLaporan,
    getLaporanDetail,
    buatLaporan,
    updateStatus,
    getLokasiKasus,
    updateLaporan,
    cekStatusLaporan,
    deleteLaporan
};
