const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const verifyToken = (req, res, next) => {
  // Ambil token dari header Authorization (format: Bearer <token>)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Simpan data admin hasil decode ke object request
    req.admin = decoded;
    next(); // Lanjut ke controller berikutnya
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluwarsa' });
  }
};

module.exports = { verifyToken };