const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const masterDataController = require('../controllers/masterDataController');
const { verifyToken } = require('../middlewares/authMiddleware');

// --- Admin Management ---
router.get('/users', verifyToken, adminController.getAllAdmins);
router.post('/users', verifyToken, adminController.createAdmin);
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

module.exports = router;
