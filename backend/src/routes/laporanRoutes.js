const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route publik: Pelapor bisa mengirim laporan
router.post('/submit', laporanController.buatLaporan);
router.get('/status/:kode_laporan', laporanController.cekStatusLaporan); // Feature: Tracking

// Admin Routes (Protected)
router.get('/all', verifyToken, laporanController.getAllLaporan);
router.get('/stats', verifyToken, laporanController.getStatistik);    // Feature: Dashboard Stats
router.put('/:id/status', verifyToken, laporanController.updateStatus); // Feature: Status Update
router.get('/gis', verifyToken, laporanController.getLokasiKasus);      // Feature: GIS
router.get('/export', verifyToken, laporanController.exportLaporan);    // Feature: Export

module.exports = router;