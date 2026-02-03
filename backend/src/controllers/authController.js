const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari admin berdasarkan email
    const admin = await prisma.admin.findUnique({
      where: { email: email }
    });

    if (!admin) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 2. Cek status aktif
    if (!admin.aktif) {
      return res.status(403).json({ message: 'Akun admin tidak aktif' });
    }

    // 3. Bandingkan password dengan hash di database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 4. Generate JWT Token
    const token = jwt.sign(
      { id_admin: admin.id_admin, email: admin.email },
      JWT_SECRET,
      { expiresIn: '1d' } // Token berlaku 1 hari
    );

    res.json({
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id_admin,
        nama: admin.namaAdmin,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};

module.exports = { login };