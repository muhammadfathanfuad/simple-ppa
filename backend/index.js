require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { publicLimiter } = require('./src/middlewares/rateLimiter');

// Import configuration
const { app: appConfig, testConnection } = require('./src/config');
const { errorHandler } = require('./src/errors');

// Handle BigInt serialization
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const laporanRoutes = require('./src/routes/laporanRoutes');
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const port = appConfig.port;

// 1. Middleware Dasar (WAJIB PERTAMA agar CORS di-assign sebelum Limiter)
app.use(cors(appConfig.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Rate limiting (Public API Default)
app.use('/api/', publicLimiter);

// 3. Folder Statis untuk Bukti
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Routing API
app.use('/api/laporan', laporanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// 5. Test Route Dasar
app.get('/', (req, res) => {
  res.send('Backend DP3A Pelaporan is running!');
});

// 6. Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// 7. Global Error Handler
app.use(errorHandler);

// 8. Jalankan Server setelah koneksi database berhasil
const startServer = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📝 Environment: ${appConfig.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();