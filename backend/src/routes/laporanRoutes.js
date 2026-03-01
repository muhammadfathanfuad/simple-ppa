const express = require('express');
const router = express.Router();
const { laporanCoreController, laporanStatistikController, laporanExportController } = require('../controllers/laporan');
const { masterDataController } = require('../controllers/masterData');
const uploadBukti = require('../middlewares/upload');
const { verifyToken } = require('../middlewares/authMiddleware');
const { createLaporanValidation, updateStatusValidation, getLaporanDetailValidation, checkStatusValidation, getLaporanListValidation, checkValidation } = require('../validators');

// Route publik: Pelapor bisa mengirim laporan
router.get('/master/kecamatan', masterDataController.kecamatan.getAll);
router.get('/master/jenis-kasus', masterDataController.jenisKasus.getAll);
router.get('/master/bentuk-kekerasan', masterDataController.bentukKekerasan.getAll);
router.get('/master/jenis-layanan', masterDataController.jenisLayanan.getAll);
router.get('/master/tempat-kejadian', masterDataController.tempatKejadian.getAll);
router.get('/master/hubungan-korban', masterDataController.hubunganKorban.getAll);
router.post('/submit', uploadBukti.array('bukti'), laporanCoreController.buatLaporan);
const { searchLimiter } = require('../middlewares/rateLimiter');

router.get('/status/:kode_laporan', searchLimiter, checkStatusValidation, checkValidation, laporanCoreController.cekStatusLaporan);

// Admin Routes (Protected)
router.get('/all', verifyToken, getLaporanListValidation, checkValidation, laporanCoreController.getAllLaporan);
router.get('/rekap', verifyToken, laporanStatistikController.getRekapitulasiData);
router.get('/rekap/export', verifyToken, laporanExportController.exportRekapitulasiExcel);
router.get('/rekap/export/perempuan', verifyToken, laporanExportController.exportRekapitulasiPerempuan);
router.get('/rekap/export/anak', verifyToken, laporanExportController.exportRekapitulasiAnak);
router.get('/detail/:id', verifyToken, getLaporanDetailValidation, checkValidation, laporanCoreController.getLaporanDetail);
router.get('/stats', verifyToken, laporanStatistikController.getStatistik);
router.put('/status/:id', verifyToken, updateStatusValidation, checkValidation, laporanCoreController.updateStatus);
router.get('/gis', verifyToken, laporanCoreController.getLokasiKasus);
router.get('/export', verifyToken, laporanExportController.exportLaporan);
router.get('/export-excel', verifyToken, laporanExportController.exportExcel);
router.put('/update/:id', verifyToken, laporanCoreController.updateLaporan);

module.exports = router;