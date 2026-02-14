require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors'); // Tambahkan ini agar frontend bisa akses backend nanti

// Handle BigInt serialization
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const laporanRoutes = require('./src/routes/laporanRoutes');
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes'); // Move dashboardRoutes import here
const adminRoutes = require('./src/routes/adminRoutes'); // Import admin routes

const app = express();
const port = 5000;

// 1. Middleware Dasar
app.use(cors()); // Mengizinkan akses dari domain berbeda (CORS)
app.use(express.json()); // Agar bisa membaca body request format JSON
app.use(express.urlencoded({ extended: true })); // Agar bisa membaca form-data

// 2. Folder Statis untuk Bukti (Penting agar admin bisa melihat file)
// Akses via: http://localhost:5000/uploads/bukti/nama-file.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Routing API (Versioning)
// Inilah yang membuat URL kamu menjadi /api/v1/laporan
app.use('/api/laporan', laporanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// 4. Test Route Dasar
app.get('/', (req, res) => {
  res.send('Backend DP3A Pelaporan is running!');
});

// 5. Jalankan Server
app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});