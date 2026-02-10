const prisma = require("../lib/prisma");
const fs = require("fs");
const generateTicket = require("../utils/generateTicket");

const getAllLaporan = async (req, res) => {
  const { status, q, startDate, endDate } = req.query;

  try {
    const whereClause = {};

    if (status && status !== 'All') {
      whereClause.statusLaporan = status;
    }

    if (q) {
      whereClause.OR = [
        { kodeLaporan: { contains: q } },
        { pelapor: { nama: { contains: q } } },
        { korban: { namaLengkap: { contains: q } } }
      ];
    }

    if (startDate && endDate) {
      whereClause.dibuatPada = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
      };
    } else if (startDate) {
      whereClause.dibuatPada = {
        gte: new Date(startDate)
      };
    }

    const laporan = await prisma.laporan.findMany({
      where: whereClause,
      include: {
        pelapor: true,
        korban: true,
        buktiLaporan: true,
        jenisKasus: true,
      },
      orderBy: {
        dibuatPada: 'desc',
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
          nama: pelapor.namaPelapor,
          alamatLengkap: pelapor.alamatPelapor,
          nomorWhatsapp: pelapor.noTelpPelapor,
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
                  namaLengkap: korban.namaKorban,
                  nik: korban.nikKorban,
                  alamatLengkap: korban.alamatKorban,
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

const getStatistik = async (req, res) => {
  try {
    const totalLaporan = await prisma.laporan.count();

    const byStatus = await prisma.laporan.groupBy({
      by: ['statusLaporan'],
      _count: {
        statusLaporan: true,
      },
    });

    // Format output status
    const statusStats = {
      Menunggu: 0,
      Diproses: 0,
      Selesai: 0,
      Ditolak: 0
    };

    byStatus.forEach(item => {
      statusStats[item.statusLaporan] = item._count.statusLaporan;
    });

    // Count by Jenis Kasus (assuming relation or id check, here generic count)
    // Note: To group by relation field name might be complex, so we group by idJenisKasus
    // and ideally we would fetch the names, but for now returning IDs or if schema permits
    const byJenis = await prisma.laporan.groupBy({
      by: ['idJenisKasus'],
      _count: {
        idJenisKasus: true,
      }
    });

    res.json({
      total: totalLaporan,
      status: statusStats,
      jenisKasus: byJenis
    });

  } catch (error) {
    console.error("Error Statistik:", error);
    res.status(500).json({ message: "Gagal mengambil statistik." });
  }
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expecting: Menunggu, Diproses, Selesai, Ditolak

  try {
    const updated = await prisma.laporan.update({
      where: { idLaporan: parseInt(id) },
      data: { statusLaporan: status },
    });
    res.json({ message: "Status berhasil diperbarui", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Gagal update status." });
  }
};

const getLokasiKasus = async (req, res) => {
  try {
    const lokasi = await prisma.laporan.findMany({
      select: {
        idLaporan: true,
        kodeLaporan: true,
        latitude: true,
        longitude: true,
        lokasiLengkapKejadian: true,
        idJenisKasus: true
      },
      where: {
        latitude: { not: null },
        longitude: { not: null }
      }
    });

    res.json(lokasi);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data GIS." });
  }
};

const exportLaporan = async (req, res) => {
  try {
    const laporan = await prisma.laporan.findMany({
      include: {
        pelapor: true,
        korban: true,
      },
      orderBy: { dibuatPada: 'desc' }
    });

    // Simple CSV Generation
    const header = "Tiket,Status,Tanggal,Pelapor,Telp Pelapor,Korban,Jenis Kasus,Lokasi\n";
    const rows = laporan.map(l => {
      const tgl = l.dibuatPada ? new Date(l.dibuatPada).toISOString().split('T')[0] : '-';
      // Sanitizing strings for CSV (replacing commas with space)
      const safe = (str) => str ? String(str).replace(/,/g, ' ').replace(/\n/g, ' ') : '-';

      return `${l.kodeLaporan},${l.statusLaporan},${tgl},${safe(l.pelapor?.nama)},${safe(l.pelapor?.nomorWhatsapp)},${safe(l.korban?.namaLengkap)},${l.idJenisKasus},${safe(l.lokasiLengkapKejadian)}`;
    }).join("\n");

    const csvData = header + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data_laporan.csv"');
    res.send(csvData);

  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ message: "Gagal export data." });
  }
};

const getLaporanDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const laporan = await prisma.laporan.findUnique({
      where: { idLaporan: parseInt(id) },
      include: {
        pelapor: true,
        korban: true,
        buktiLaporan: true,
        jenisKasus: true,
        bentukKekerasan: true, // Added for completeness
        kecamatan: true // Added for completeness
      },
    });

    if (!laporan) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    res.json(laporan);
  } catch (error) {
    console.error("Error fetching report detail:", error);
    res.status(500).json({ message: "Gagal mengambil detail laporan" });
  }
};

module.exports = {
  buatLaporan,
  cekStatusLaporan,
  getAllLaporan,
  getStatistik,
  updateStatus,
  getLokasiKasus,
  exportLaporan,
  getLaporanDetail
};