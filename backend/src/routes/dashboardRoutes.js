const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Public route for now, can be protected later
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
