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
  let { pelapor, korban, terlapor, trafficking, laporan } = req.body;
  const files = req.files;
  const nomorTiket = generateTicket();

  // Handle FormData JSON string if present (for file uploads with nested data)
  if (req.body.data) {
    try {
      const parsedData = JSON.parse(req.body.data);
      pelapor = parsedData.pelapor;
      korban = parsedData.korban;
      terlapor = parsedData.terlapor;
      laporan = parsedData.laporan;
    } catch (e) {
      return res.status(400).json({ message: "Format data tidak valid" });
    }
  }

  // Validate Required Fields
  if (!laporan.idKecamatan || isNaN(parseInt(laporan.idKecamatan))) {
    return res.status(400).json({ message: "Kecamatan harus dipilih." });
  }
  if (!laporan.idJenisKasus || isNaN(parseInt(laporan.idJenisKasus))) {
    return res.status(400).json({ message: "Jenis kasus harus dipilih." });
  }

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
              // Fix Time Parsing: append dummy date if only time string
              waktuKejadian: laporan.waktuKejadian ? new Date(`1970-01-01T${laporan.waktuKejadian}:00Z`) : null,
              kronologiKejadian: laporan.kronologiKejadian,
              harapanKorban: laporan.harapanKorban,
              layananDibutuhkan: laporan.layananDibutuhkan,
              rujukanDari: laporan.rujukanDari,
              caraDatang: laporan.caraDatang,
              namaKlien: laporan.namaKlien,
              alamatKlien: laporan.alamatKlien,
              penerimaPengaduan: laporan.penerimaPengaduan,
              latitude: laporan.latitude ? parseFloat(laporan.latitude) : null,
              longitude: laporan.longitude ? parseFloat(laporan.longitude) : null,
              // Relasi Korban dalam satu nest
              korban: {
                create: {
                  namaLengkap: korban.namaKorban,
                  nik: korban.nikKorban,
                  alamatLengkap: korban.alamatKorban,
                  jenisKelamin: korban.jenisKelamin,
                  tanggalLahir: korban.tanggalLahir ? new Date(korban.tanggalLahir) : null,
                  nomorTelepon: korban.nomorTelepon,
                  jumlahAnak: korban.jumlahAnak ? parseInt(korban.jumlahAnak) : null,
                  namaOrtuWali: korban.namaOrtuWali,
                  alamatOrtuWali: korban.alamatOrtuWali,
                  kewarganegaraanOrtuWali: korban.kewarganegaraanOrtuWali,
                  pekerjaanAyah: korban.pekerjaanAyah,
                  pekerjaanIbu: korban.pekerjaanIbu,
                  jumlahSaudara: korban.jumlahSaudara ? parseInt(korban.jumlahSaudara) : null,
                  hubunganDenganTerlapor: korban.hubunganDenganTerlapor,
                }
              },
              terlapor: {
                create: {
                  nama: terlapor.nama,
                  tempatLahir: terlapor.tempatLahir,
                  tanggalLahir: terlapor.tanggalLahir ? new Date(terlapor.tanggalLahir) : null,
                  alamat: terlapor.alamat,
                  nomorTelepon: terlapor.nomorTelepon,
                  pendidikan: terlapor.pendidikan,
                  agama: terlapor.agama,
                  pekerjaan: terlapor.pekerjaan,
                  statusPerkawinan: terlapor.statusPerkawinan,
                  namaOrtuWali: terlapor.namaOrtuWali,
                  alamatOrtuWali: terlapor.alamatOrtuWali,
                  pekerjaanOrtu: terlapor.pekerjaanOrtu,
                  jumlahSaudara: terlapor.jumlahSaudara ? parseInt(terlapor.jumlahSaudara) : null,
                  hubunganDenganKorban: terlapor.hubunganDenganKorban,
                }
              },
              trafficking: trafficking && trafficking.isTrafficking ? {
                create: {
                  ruteTrafficking: trafficking.ruteTrafficking,
                  alatTransportasi: trafficking.alatTransportasi,
                  caraDigunakan: trafficking.caraDigunakan,
                  bentukEksploitasi: trafficking.bentukEksploitasi,
                  bentukPelanggaran: trafficking.bentukPelanggaran,
                  bentukKriminalisasi: trafficking.bentukKriminalisasi,
                }
              } : undefined,
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
    fs.writeFileSync('backend_error.log', error.toString() + "\n" + (error.stack || ''));
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
        logStatus: {
          orderBy: { dibuatPada: 'desc' },
          select: {
            statusLama: true,
            statusBaru: true,
            catatanPerubahan: true,
            dibuatPada: true
          }
        }
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
  const { status, catatan } = req.body; // Added 'catatan' for optional log notes

  try {
    // 1. Get current status first for logging
    const currentLaporan = await prisma.laporan.findUnique({
      where: { idLaporan: parseInt(id) },
      select: { statusLaporan: true }
    });

    if (!currentLaporan) {
      return res.status(404).json({ message: "Laporan tidak ditemukan" });
    }

    // 2. Perform Update and Log creation in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.laporan.update({
        where: { idLaporan: parseInt(id) },
        data: { statusLaporan: status.toLowerCase() }, // Ensure lowercase for Enum
      });

      // Create Log Entry
      await tx.logStatusLaporan.create({
        data: {
          idLaporan: parseInt(id),
          statusLama: currentLaporan.statusLaporan,
          statusBaru: status.toLowerCase(), // Ensure lowercase here too
          idAdmin: req.admin?.id_admin ? BigInt(req.admin.id_admin) : null, // Assumes req.admin is set by authMiddleware
          catatanPerubahan: catatan || null
        }
      });

      return updated;
    });

    res.json({ message: "Status berhasil diperbarui", data: result });
  } catch (error) {
    console.error("Update Status Error:", error);
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
        kecamatan: true, // Added for completeness
        terlapor: true
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

const updateLaporan = async (req, res) => {
  const { id } = req.params;
  let { pelapor, korban, terlapor, trafficking, laporan } = req.body;

  try {
    // --- Helper for Enum Mapping ---
    // Maps a string input to a Prisma Enum value.
    // If exact match (case-insensitive), returns it.
    // If it matches a known alias (e.g. "TNI/POLRI"), returns the enum key.
    // Otherwise, returns "Lainnya" and the original string is returned as the 'other' value.
    const mapToEnum = (value, enumType, existingOtherValue) => {
      if (!value) return { enumVal: undefined, otherVal: existingOtherValue };

      // Normalization helpers
      const valUpper = value.toString().toUpperCase().trim();

      // Define Mappings for each Enum Type
      const mappings = {
        Pekerjaan: {
          "GURU": "Guru",
          "PEDAGANG": "Pedagang",
          "BURUH": "Buruh",
          "WIRASWASTA": "Wiraswasta",
          "KARYAWAN": "Karyawan",
          "TNI/POLRI": "TNI_POLRI", "TNI_POLRI": "TNI_POLRI",
          "TANI": "Tani", "PETANI": "Tani",
          "PELAJAR/MAHASISWA": "Pelajar_Mahasiswa", "PELAJAR_MAHASISWA": "Pelajar_Mahasiswa", "PELAJAR": "Pelajar_Mahasiswa", "MAHASISWA": "Pelajar_Mahasiswa",
          "IBU RUMAH TANGGA": "Ibu_Rumah_Tangga", "IBU_RUMAH_TANGGA": "Ibu_Rumah_Tangga", "IRT": "Ibu_Rumah_Tangga",
          "LAINNYA": "Lainnya"
        },
        Agama: {
          "ISLAM": "Islam",
          "KRISTEN": "Kristen",
          "KATOLIK": "Katolik",
          "HINDU": "Hindu",
          "BUDHA": "Budha",
          "ISLAM": "Islam",
          "KONGHUCHU": "Konghuchu",
          "LAINNYA": "Lainnya"
        },
        Pendidikan: {
          "TIDAK SEKOLAH": "Tidak_Sekolah", "TIDAK_SEKOLAH": "Tidak_Sekolah",
          "SD": "SD",
          "SLTP": "SLTP", "SMP": "SLTP",
          "SLTA": "SLTA", "SMA": "SLTA", "SMK": "SLTA",
          "D1/D2/D3": "D1_D2_D3", "D3": "D1_D2_D3",
          "S1/S2/S3": "S1_S2_S3", "S1": "S1_S2_S3", "SARJANA": "S1_S2_S3",
          "LAINNYA": "Lainnya"
        },
        StatusPelapor: {
          "KORBAN LANGSUNG": "Korban_Langsung", "KORBAN_LANGSUNG": "Korban_Langsung",
          "KELUARGA": "Keluarga",
          "TETANGGA": "Tetangga",
          "TEMAN": "Teman",
          "SAKSI": "Saksi",
          "LAINNYA": "Lainnya"
        },
        JenisKelamin: { // Not strictly needed if dropdown, but good for safety
          "LAKI-LAKI": "Laki_laki", "LAKI_LAKI": "Laki_laki",
          "PEREMPUAN": "Perempuan"
        }
      };

      const map = mappings[enumType];
      if (!map) return { enumVal: undefined, otherVal: existingOtherValue }; // Should not happen if used correctly

      // Check for direct match or mapped alias
      if (map[valUpper]) {
        return { enumVal: map[valUpper], otherVal: existingOtherValue };
      }

      // No match -> Lainnya
      return { enumVal: "Lainnya", otherVal: value };
    };


    // Process Enums for Pelapor
    const pelaporPekerjaan = mapToEnum(pelapor.pekerjaan, 'Pekerjaan', pelapor.pekerjaanLainnya);
    const pelaporAgama = mapToEnum(pelapor.agama, 'Agama', pelapor.agamaLainnya);
    const pelaporStatus = mapToEnum(pelapor.statusPelapor, 'StatusPelapor', pelapor.statusPelaporLainnya);
    const pelaporJK = mapToEnum(pelapor.jenisKelamin, 'JenisKelamin', null);

    // Process Enums for Korban
    const korbanPekerjaan = mapToEnum(korban.pekerjaan, 'Pekerjaan', korban.pekerjaanLainnya);
    const korbanAgama = mapToEnum(korban.agama, 'Agama', korban.agamaLainnya);
    const korbanPendidikan = mapToEnum(korban.pendidikan, 'Pendidikan', korban.pendidikanLainnya);
    const korbanJK = mapToEnum(korban.jenisKelamin, 'JenisKelamin', null);

    // Process Enums for Terlapor (Note: Terlapor Job is String, but Pending/Agama are Enums)
    const terlaporPendidikan = mapToEnum(terlapor.pendidikan, 'Pendidikan', null);
    const terlaporAgama = mapToEnum(terlapor.agama, 'Agama', null);

    const updatedLaporan = await prisma.laporan.update({
      where: { idLaporan: BigInt(id) },
      data: {
        tanggalKejadian: laporan.tanggalKejadian ? new Date(laporan.tanggalKejadian) : undefined,
        waktuKejadian: laporan.waktuKejadian ? new Date(`1970-01-01T${laporan.waktuKejadian}:00Z`) : undefined,
        lokasiLengkapKejadian: laporan.lokasiLengkapKejadian,
        kronologiKejadian: laporan.kronologiKejadian,
        harapanKorban: laporan.harapanKorban,
        layananDibutuhkan: laporan.layananDibutuhkan,
        rujukanDari: laporan.rujukanDari,
        caraDatang: laporan.caraDatang,
        namaKlien: laporan.namaKlien,
        alamatKlien: laporan.alamatKlien,
        penerimaPengaduan: laporan.penerimaPengaduan,

        // Relations
        jenisKasus: laporan.idJenisKasus ? { connect: { idJenisKasus: parseInt(laporan.idJenisKasus) } } : undefined,
        bentukKekerasan: laporan.idBentukKekerasan ? { connect: { idBentukKekerasan: parseInt(laporan.idBentukKekerasan) } } : undefined,

        pelapor: {
          upsert: {
            create: {
              nama: pelapor.nama,
              // jenisKelamin removed from Pelapor schema check
              tempatLahir: pelapor.tempatLahir,
              alamatLengkap: pelapor.alamatLengkap,
              nomorWhatsapp: pelapor.nomorWhatsapp,
              pekerjaan: pelaporPekerjaan.enumVal,
              pekerjaanLainnya: pelaporPekerjaan.otherVal,
              agama: pelaporAgama.enumVal,
              agamaLainnya: pelaporAgama.otherVal,
              hubunganDenganKorban: pelapor.hubunganDenganKorban,
              statusPelapor: pelaporStatus.enumVal,
              statusPelaporLainnya: pelaporStatus.otherVal,
              tanggalLahir: pelapor.tanggalLahir ? new Date(pelapor.tanggalLahir) : null,
            },
            update: {
              nama: pelapor.nama,
              // jenisKelamin removed
              tempatLahir: pelapor.tempatLahir,
              alamatLengkap: pelapor.alamatLengkap,
              nomorWhatsapp: pelapor.nomorWhatsapp,
              pekerjaan: pelaporPekerjaan.enumVal,
              pekerjaanLainnya: pelaporPekerjaan.otherVal,
              agama: pelaporAgama.enumVal,
              agamaLainnya: pelaporAgama.otherVal,
              hubunganDenganKorban: pelapor.hubunganDenganKorban,
              statusPelapor: pelaporStatus.enumVal,
              statusPelaporLainnya: pelaporStatus.otherVal,
              tanggalLahir: pelapor.tanggalLahir ? new Date(pelapor.tanggalLahir) : null,
            }
          }
        },
        korban: {
          upsert: {
            create: {
              namaLengkap: korban.namaLengkap,
              nik: korban.nik,
              nomorWhatsapp: korban.nomorWhatsapp,
              alamatLengkap: korban.alamatLengkap,
              tempatLahir: korban.tempatLahir,
              tanggalLahir: korban.tanggalLahir ? new Date(korban.tanggalLahir) : null,
              jenisKelamin: korbanJK.enumVal,
              pendidikan: korbanPendidikan.enumVal,
              pendidikanLainnya: korbanPendidikan.otherVal,
              pekerjaan: korbanPekerjaan.enumVal,
              pekerjaanLainnya: korbanPekerjaan.otherVal,
              agama: korbanAgama.enumVal,
              agamaLainnya: korbanAgama.otherVal,
              statusPerkawinan: korban.statusPerkawinan,
              disabilitas: korban.disabilitas,
              jenisDisabilitas: korban.jenisDisabilitas,
              nomorTelepon: korban.nomorTelepon,
              jumlahAnak: korban.jumlahAnak ? parseInt(korban.jumlahAnak) : null,
              namaOrtuWali: korban.namaOrtuWali,
              alamatOrtuWali: korban.alamatOrtuWali,
              kewarganegaraanOrtuWali: korban.kewarganegaraanOrtuWali,
              pekerjaanAyah: korban.pekerjaanAyah,
              pekerjaanIbu: korban.pekerjaanIbu,
              jumlahSaudara: korban.jumlahSaudara ? parseInt(korban.jumlahSaudara) : null,
              hubunganDenganTerlapor: korban.hubunganDenganTerlapor,
            },
            update: {
              namaLengkap: korban.namaLengkap,
              nik: korban.nik,
              nomorWhatsapp: korban.nomorWhatsapp,
              alamatLengkap: korban.alamatLengkap,
              tempatLahir: korban.tempatLahir,
              tanggalLahir: korban.tanggalLahir ? new Date(korban.tanggalLahir) : null,
              jenisKelamin: korbanJK.enumVal,
              pendidikan: korbanPendidikan.enumVal,
              pendidikanLainnya: korbanPendidikan.otherVal,
              pekerjaan: korbanPekerjaan.enumVal,
              pekerjaanLainnya: korbanPekerjaan.otherVal,
              agama: korbanAgama.enumVal,
              agamaLainnya: korbanAgama.otherVal,
              statusPerkawinan: korban.statusPerkawinan,
              disabilitas: korban.disabilitas,
              jenisDisabilitas: korban.jenisDisabilitas,
              nomorTelepon: korban.nomorTelepon,
              jumlahAnak: korban.jumlahAnak ? parseInt(korban.jumlahAnak) : null,
              namaOrtuWali: korban.namaOrtuWali,
              alamatOrtuWali: korban.alamatOrtuWali,
              kewarganegaraanOrtuWali: korban.kewarganegaraanOrtuWali,
              pekerjaanAyah: korban.pekerjaanAyah,
              pekerjaanIbu: korban.pekerjaanIbu,
              jumlahSaudara: korban.jumlahSaudara ? parseInt(korban.jumlahSaudara) : null,
              hubunganDenganTerlapor: korban.hubunganDenganTerlapor,
            }
          }
        },
        terlapor: {
          upsert: {
            create: {
              nama: terlapor.nama,
              tempatLahir: terlapor.tempatLahir,
              tanggalLahir: terlapor.tanggalLahir ? new Date(terlapor.tanggalLahir) : null,
              alamat: terlapor.alamat,
              nomorTelepon: terlapor.nomorTelepon,
              pendidikan: terlaporPendidikan.enumVal,
              agama: terlaporAgama.enumVal,
              pekerjaan: terlapor.pekerjaan, // String in schema
              statusPerkawinan: terlapor.statusPerkawinan,
              namaOrtuWali: terlapor.namaOrtuWali,
              alamatOrtuWali: terlapor.alamatOrtuWali,
              pekerjaanOrtu: terlapor.pekerjaanOrtu,
              jumlahSaudara: terlapor.jumlahSaudara ? parseInt(terlapor.jumlahSaudara) : null,
              hubunganDenganKorban: terlapor.hubunganDenganKorban,
            },
            update: {
              nama: terlapor.nama,
              tempatLahir: terlapor.tempatLahir,
              tanggalLahir: terlapor.tanggalLahir ? new Date(terlapor.tanggalLahir) : null,
              alamat: terlapor.alamat,
              nomorTelepon: terlapor.nomorTelepon,
              pendidikan: terlaporPendidikan.enumVal,
              agama: terlaporAgama.enumVal,
              pekerjaan: terlapor.pekerjaan,
              statusPerkawinan: terlapor.statusPerkawinan,
              namaOrtuWali: terlapor.namaOrtuWali,
              alamatOrtuWali: terlapor.alamatOrtuWali,
              pekerjaanOrtu: terlapor.pekerjaanOrtu,
              jumlahSaudara: terlapor.jumlahSaudara ? parseInt(terlapor.jumlahSaudara) : null,
              hubunganDenganKorban: terlapor.hubunganDenganKorban,
            }
          }
        },
        trafficking: trafficking && trafficking.isTrafficking ? {
          upsert: {
            create: {
              ruteTrafficking: trafficking.ruteTrafficking,
              alatTransportasi: trafficking.alatTransportasi,
              caraDigunakan: trafficking.caraDigunakan,
              bentukEksploitasi: trafficking.bentukEksploitasi,
              bentukPelanggaran: trafficking.bentukPelanggaran,
              bentukKriminalisasi: trafficking.bentukKriminalisasi,
            },
            update: {
              ruteTrafficking: trafficking.ruteTrafficking,
              alatTransportasi: trafficking.alatTransportasi,
              caraDigunakan: trafficking.caraDigunakan,
              bentukEksploitasi: trafficking.bentukEksploitasi,
              bentukPelanggaran: trafficking.bentukPelanggaran,
              bentukKriminalisasi: trafficking.bentukKriminalisasi,
            }
          }
        } : undefined,
      }
    });

    res.status(200).json({ message: "Laporan berhasil diperbarui", data: updatedLaporan });
  } catch (error) {
    console.error("Error updating report:", error);
    fs.writeFileSync('backend_error.log', error.toString() + "\n" + (error.stack || ''));
    res.status(500).json({ message: "Gagal memperbarui laporan.", error: error.message });
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
  getLaporanDetail,
  updateLaporan
};