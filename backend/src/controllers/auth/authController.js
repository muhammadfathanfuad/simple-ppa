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
      { id_admin: admin.idAdmin, email: admin.email }, // Updated to use idAdmin (BigInt handling might require conversion if passed to JSON directly, but JWT stringifies payload)
      JWT_SECRET,
      { expiresIn: '1d' } // Token berlaku 1 hari
    );

    // Convert BigInt to string for JSON response
    const adminData = {
      id: admin.idAdmin.toString(),
      nama: admin.namaAdmin,
      email: admin.email,
      fotoProfil: admin.fotoProfil
    };

    res.json({
      message: 'Login berhasil',
      token,
      admin: adminData
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const adminId = req.admin.id_admin;
    const admin = await prisma.admin.findUnique({
      where: { idAdmin: BigInt(adminId) },
      select: {
        idAdmin: true,
        namaAdmin: true,
        email: true,
        fotoProfil: true,
        dibuatPada: true
      }
    });

    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

    res.json({
      id: admin.idAdmin.toString(),
      nama: admin.namaAdmin,
      email: admin.email,
      fotoProfil: admin.fotoProfil,
      dibuatPada: admin.dibuatPada
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data profil" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const adminId = req.admin.id_admin;
    const { nama, email, password, passwordLama } = req.body;
    const fotoProfil = req.file ? `/uploads/profil/${req.file.filename}` : undefined;

    const admin = await prisma.admin.findUnique({ where: { idAdmin: BigInt(adminId) } });
    if (!admin) return res.status(404).json({ message: "Admin tidak ditemukan" });

    const dataToUpdate = {};
    if (nama) dataToUpdate.namaAdmin = nama;
    if (email) dataToUpdate.email = email;
    if (fotoProfil) dataToUpdate.fotoProfil = fotoProfil;

    // Change Password Logic
    if (password) {
      if (!passwordLama) {
        return res.status(400).json({ message: "Password lama wajib diisi untuk mengubah password" });
      }
      const isMatch = await bcrypt.compare(passwordLama, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password lama salah" });
      }
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { idAdmin: BigInt(adminId) },
      data: dataToUpdate
    });

    res.json({
      message: "Profil berhasil diperbarui",
      admin: {
        id: updatedAdmin.idAdmin.toString(),
        nama: updatedAdmin.namaAdmin,
        email: updatedAdmin.email,
        fotoProfil: updatedAdmin.fotoProfil
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Gagal memperbarui profil" });
  }
};

module.exports = { login, getMe, updateProfile };