const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const uploadBukti = require('../middlewares/upload');

// Menggunakan .array('bukti', 5) artinya menerima maksimal 5 file dengan field name 'bukti'
router.post('/laporan', uploadBukti.array('bukti', 5), laporanController.buatLaporan);

module.exports = router;