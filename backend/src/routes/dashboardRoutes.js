const express = require('express');
const router = express.Router();
const { dashboardController } = require('../controllers/dashboard');
const { verifyToken } = require('../middlewares/authMiddleware');

// Protected route
router.get('/stats', verifyToken, dashboardController.getDashboardStats);

module.exports = router;
