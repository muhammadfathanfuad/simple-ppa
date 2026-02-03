const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Route publik: Pelapor bisa mengirim laporan
router.post('/submit', laporanController.buatLaporan);

router.get('/all', verifyToken, laporanController.getAllLaporan);

module.exports = router;