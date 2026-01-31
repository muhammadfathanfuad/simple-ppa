const prisma = require("../lib/prisma"); // Pastikan menggunakan singleton agar tidak error lagi
const fs = require("fs");
const generateTicket = require("../utils/generateTicket");

const buatLaporan = async (req, res) => {
  const { pelapor, korban, laporan } = req.body;
  const files = req.files; 
  const nomorTiket = generateTicket();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Upsert Pelapor
      const pelaporData = await tx.pelapor.upsert({
        where: { nik: pelapor.nik || 'ANONIM-' + Date.now() },
        update: { ...pelapor },
        create: { ...pelapor },
      });

      // Create Korban
      const korbanData = await tx.korban.create({
        data: { ...korban },
      });

      // Create Laporan Utama
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

      // Simpan path file bukti
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

    res.status(201).json({
      message: "Laporan berhasil terkirim",
      nomor_tiket: result.nomor_tiket,
    });

  } catch (error) {
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    console.error("Error Pelaporan:", error);
    res.status(500).json({ message: "Gagal memproses laporan." });
  }
};

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

// PERBAIKAN: King harus mengekspor semua fungsi di akhir file dalam satu objek
module.exports = { 
  buatLaporan, 
  cekStatusLaporan 
};