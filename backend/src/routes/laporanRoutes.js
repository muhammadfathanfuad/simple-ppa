const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const masterDataController = require('../controllers/masterDataController');
const uploadBukti = require('../middlewares/upload');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route publik: Pelapor bisa mengirim laporan
router.get('/master/kecamatan', masterDataController.kecamatan.getAll);
router.get('/master/jenis-kasus', masterDataController.jenisKasus.getAll);
router.get('/master/bentuk-kekerasan', masterDataController.bentukKekerasan.getAll); // Added route
router.post('/submit', uploadBukti.array('bukti'), laporanController.buatLaporan);
router.get('/status/:kode_laporan', laporanController.cekStatusLaporan); // Feature: Tracking

// Admin Routes (Protected)
router.get('/all', verifyToken, laporanController.getAllLaporan);
router.get('/detail/:id', verifyToken, laporanController.getLaporanDetail);
router.get('/stats', verifyToken, laporanController.getStatistik);    // Feature: Dashboard Stats
router.put('/:id/status', verifyToken, laporanController.updateStatus); // Feature: Status Update
router.get('/gis', verifyToken, laporanController.getLokasiKasus);      // Feature: GIS
router.get('/export', verifyToken, laporanController.exportLaporan);    // Feature: Export CSV
router.get('/export-excel', verifyToken, laporanController.exportExcel); // Feature: Export Excel
router.put('/update/:id', verifyToken, laporanController.updateLaporan); // Feature: Update Full Report

module.exports = router;