const prisma = require("../lib/prisma");
const fs = require("fs");
const generateTicket = require("../utils/generateTicket");

const getAllLaporan = async (req, res) => {
  try {
    const laporan = await prisma.laporan.findMany({
      include: {
        pelapor: true,
        korban: true,
        buktiLaporan: true, // Sesuai nama relasi di model Laporan
      },
      orderBy: {
        dibuatPada: 'desc', // Sesuai nama field di schema
      },
    });

    res.json({
      message: "Berhasil mengambil semua data laporan",
      count: laporan.length,
      data: laporan,
    });
  } catch (error) {
    console.error("Error Get All Laporan:", error);
    res.status(500).json({ message: "Gagal mengambil data laporan." });
  }
};

const buatLaporan = async (req, res) => {
  const { pelapor, korban, laporan } = req.body;
  const files = req.files; 
  const nomorTiket = generateTicket();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Upsert Pelapor (Gunakan idLaporan sebagai unique karena di schema @unique)
      const pelaporData = await tx.pelapor.create({
        data: {
          ...pelapor,
          // Tangani field enum atau date jika perlu
          tanggalLahir: pelapor.tanggalLahir ? new Date(pelapor.tanggalLahir) : null,
          laporan: {
            create: {
              kodeLaporan: nomorTiket, // Di schema namanya kodeLaporan
              idKecamatan: parseInt(laporan.idKecamatan),
              idJenisKasus: parseInt(laporan.idJenisKasus),
              idBentukKekerasan: parseInt(laporan.idBentukKekerasan),
              lokasiLengkapKejadian: laporan.lokasiLengkapKejadian,
              tanggalKejadian: new Date(laporan.tanggalKejadian),
              kronologiKejadian: laporan.kronologiKejadian,
              latitude: laporan.latitude ? parseFloat(laporan.latitude) : null,
              longitude: laporan.longitude ? parseFloat(laporan.longitude) : null,
              // Relasi Korban dalam satu nest
              korban: {
                create: {
                  ...korban,
                  tanggalLahir: korban.tanggalLahir ? new Date(korban.tanggalLahir) : null,
                }
              }
            }
          }
        },
        include: { laporan: true }
      });

      const laporanBaru = pelaporData.laporan;

      // Simpan bukti laporan
      if (files && files.length > 0) {
        await tx.buktiLaporan.createMany({
          data: files.map((file) => ({
            idLaporan: laporanBaru.idLaporan,
            jenisBukti: 'Foto', // Sesuaikan dengan enum JenisBukti di schema
            lokasiFile: file.path,
            namaFileAsli: file.originalname,
            tipeFile: file.mimetype,
            ukuranFile: BigInt(file.size)
          })),
        });
      }

      return laporanBaru;
    });

    res.status(201).json({
      message: "Laporan berhasil terkirim",
      nomor_tiket: result.kodeLaporan,
    });

  } catch (error) {
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    console.error("Error Pelaporan:", error);
    res.status(500).json({ message: "Gagal memproses laporan.", error: error.message });
  }
};

const cekStatusLaporan = async (req, res) => {
  const { kode_laporan } = req.params; // Sesuaikan parameter

  try {
    const dataLaporan = await prisma.laporan.findUnique({
      where: { kodeLaporan: kode_laporan },
      select: {
        kodeLaporan: true,
        statusLaporan: true,
        dibuatPada: true,
        diperbaruiPada: true,
      }
    });

    if (!dataLaporan) {
      return res.status(404).json({ message: "Kode laporan tidak ditemukan." });
    }

    res.json(dataLaporan);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data status." });
  }
};

module.exports = { 
  buatLaporan, 
  cekStatusLaporan,
  getAllLaporan 
};