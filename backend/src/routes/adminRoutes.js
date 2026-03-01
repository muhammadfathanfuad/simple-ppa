const express = require('express');
const router = express.Router();
const { adminController } = require('../controllers/admin');
const { masterDataController } = require('../controllers/masterData');
const { verifyToken } = require('../middlewares/authMiddleware');
const { createAdminValidation, checkValidation } = require('../validators');

// --- Admin Management ---
router.get('/users', verifyToken, adminController.getAllAdmins);
router.post('/users', verifyToken, createAdminValidation, checkValidation, adminController.createAdmin);
router.put('/users/:id', verifyToken, adminController.updateAdmin);
// router.delete('/users/:id', verifyToken, adminController.deleteAdmin); // Optional

// --- Activity Logs ---
router.get('/logs', verifyToken, adminController.getActivityLogs);

// --- Master Data: Jenis Kasus ---
router.get('/master/jenis-kasus', verifyToken, masterDataController.jenisKasus.getAll);
router.post('/master/jenis-kasus', verifyToken, masterDataController.jenisKasus.create);
router.put('/master/jenis-kasus/:id', verifyToken, masterDataController.jenisKasus.update);
router.delete('/master/jenis-kasus/:id', verifyToken, masterDataController.jenisKasus.delete);

// --- Master Data: Bentuk Kekerasan ---
router.get('/master/bentuk-kekerasan', verifyToken, masterDataController.bentukKekerasan.getAll);
router.post('/master/bentuk-kekerasan', verifyToken, masterDataController.bentukKekerasan.create);
router.put('/master/bentuk-kekerasan/:id', verifyToken, masterDataController.bentukKekerasan.update);
router.delete('/master/bentuk-kekerasan/:id', verifyToken, masterDataController.bentukKekerasan.delete);

// --- Master Data: Kecamatan ---
router.get('/master/kecamatan', verifyToken, masterDataController.kecamatan.getAll);
router.post('/master/kecamatan', verifyToken, masterDataController.kecamatan.create);
router.put('/master/kecamatan/:id', verifyToken, masterDataController.kecamatan.update);
router.delete('/master/kecamatan/:id', verifyToken, masterDataController.kecamatan.delete);

// --- Master Data: Tempat Kejadian ---
router.get('/master/tempat-kejadian', verifyToken, masterDataController.tempatKejadian.getAll);
router.post('/master/tempat-kejadian', verifyToken, masterDataController.tempatKejadian.create);
router.put('/master/tempat-kejadian/:id', verifyToken, masterDataController.tempatKejadian.update);
router.delete('/master/tempat-kejadian/:id', verifyToken, masterDataController.tempatKejadian.delete);

// --- Master Data: Jenis Layanan ---
router.get('/master/jenis-layanan', verifyToken, masterDataController.jenisLayanan.getAll);
router.post('/master/jenis-layanan', verifyToken, masterDataController.jenisLayanan.create);
router.put('/master/jenis-layanan/:id', verifyToken, masterDataController.jenisLayanan.update);
router.delete('/master/jenis-layanan/:id', verifyToken, masterDataController.jenisLayanan.delete);

// --- Master Data: Hubungan Korban ---
router.get('/master/hubungan-korban', verifyToken, masterDataController.hubunganKorban.getAll);
router.post('/master/hubungan-korban', verifyToken, masterDataController.hubunganKorban.create);
router.put('/master/hubungan-korban/:id', verifyToken, masterDataController.hubunganKorban.update);
router.delete('/master/hubungan-korban/:id', verifyToken, masterDataController.hubunganKorban.delete);

module.exports = router;
