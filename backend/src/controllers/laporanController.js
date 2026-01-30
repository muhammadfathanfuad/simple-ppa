const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const generateTicket = require("../utils/generateTicket");
const prisma = new PrismaClient();

const buatLaporan = async (req, res) => {
  // 1. Ekstraksi data dari body (Atomic: Semua data dikirim sekaligus) [cite: 8]
  const { pelapor, korban, laporan } = req.body;
  const files = req.files; // Hasil dari Multer
  const nomorTiket = generateTicket();

  try {
    // 2. Eksekusi Transaksi Database [cite: 5]
    const result = await prisma.$transaction(async (tx) => {
      // Upsert Pelapor (Cek berdasarkan NIK) [cite: 8]
      const pelaporData = await tx.pelapor.upsert({
        where: { nik: pelapor.nik || 'ANONIM-' + Date.now() },
        update: { ...pelapor },
        create: { ...pelapor },
      });

      // Create Korban [cite: 8]
      const korbanData = await tx.korban.create({
        data: { ...korban },
      });

      // Create Laporan Utama & Hubungkan relasinya [cite: 13, 16]
      const laporanBaru = await tx.laporan.create({
        data: {
          nomor_tiket: nomorTiket,
          kategori_kekerasan: laporan.kategori_kekerasan,
          deskripsi_kejadian: laporan.deskripsi,
          tanggal_kejadian: new Date(laporan.tanggal),
          lokasi_kejadian: laporan.lokasi,
          latitude: parseFloat(laporan.latitude),
          longitude: parseFloat(laporan.longitude),
          pelaporId: pelaporData.id,
          korbanId: korbanData.id,
        },
      });

      // Simpan path file bukti ke database [cite: 8]
      if (files && files.length > 0) {
        await tx.bukti.createMany({
          data: files.map((file) => ({
            file_url: file.path,
            tipe_file: file.mimetype,
            laporanId: laporanBaru.id,
          })),
        });
      }

      return laporanBaru;
    });

    // 3. Respon Sukses
    res.status(201).json({
      message: "Laporan berhasil terkirim",
      nomor_tiket: result.nomor_tiket, // Untuk Cek Status 
    });

  } catch (error) {
    // 4. Manajemen Error & Rollback Fisik (Hapus file jika DB gagal)
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    console.error("Error Pelaporan:", error);
    res.status(500).json({ message: "Gagal memproses laporan, silakan coba lagi." });
  }
};

module.exports = { buatLaporan };

const cekStatusLaporan = async (req, res) => {
  const { nomor_tiket } = req.params;

  try {
    const dataLaporan = await prisma.laporan.findUnique({
      where: { nomor_tiket: nomor_tiket },
      select: {
        nomor_tiket: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Kita hanya kirim data status, jangan kirim data sensitif korban ke publik
      }
    });

    if (!dataLaporan) {
      return res.status(404).json({ message: "Nomor tiket tidak ditemukan." });
    }

    res.json(dataLaporan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data status." });
  }
};