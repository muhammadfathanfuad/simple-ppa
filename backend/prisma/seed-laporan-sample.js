const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Menambahkan data sample laporan...');

  // Get existing data
  const admin = await prisma.admin.findFirst();
  const kecamatanList = await prisma.kecamatan.findMany();
  const jenisKasusList = await prisma.jenisKasus.findMany();
  const bentukKekerasanList = await prisma.bentukKekerasan.findMany();

  if (!admin) {
    console.error('Admin tidak ditemukan. Jalankan seed.js terlebih dahulu.');
    return;
  }

  if (kecamatanList.length === 0 || jenisKasusList.length === 0 || bentukKekerasanList.length === 0) {
    console.error('Data master tidak lengkap. Jalankan seed.js terlebih dahulu.');
    return;
  }

  // Sample laporan data
  const sampleLaporanData = [
    {
      kodeLaporan: 'LP-001',
      sumberLaporan: 'manual',
      statusLaporan: 'diproses',
      idKecamatan: kecamatanList[0].idKecamatan,
      idJenisKasus: jenisKasusList[0].idJenisKasus,
      idBentukKekerasan: bentukKekerasanList[0].idBentukKekerasan,
      jenisKasusLainnya: null,
      bentukKekerasanLainnya: null,
      tanggalKejadian: new Date('2024-01-15'),
      waktuKejadian: new Date('2024-01-15T10:00:00'),
      lokasiLengkapKejadian: 'Jl. Sample No. 1, Kecamatan ' + kecamatanList[0].namaKecamatan,
      lokasiKejadianPerkara: 'Rumah Pelapor',
      uraianSingkat: 'Kasus kekerasan dalam rumah tangga',
      harapanKorban: 'Mendapatkan perlindungan dan keadilan',
      kronologiKejadian: 'Kronologi lengkap kejadian...',
      latitude: -3.9985,
      longitude: 122.5126,
      pernyataanKebenaran: true,
      idAdminPenanggungjawab: admin.idAdmin,
      diverifikasiPada: new Date(),
      selesaiPada: null,
      dibuatPada: new Date('2024-01-15'),
      diperbaruiPada: new Date('2024-01-15'),
      layananDibutuhkan: 'Konseling',
      rujukanDari: 'Masyarakat',
      caraDatang: 'Langsung',
      namaKlien: 'Siti A',
      alamatKlien: 'Jl. Sample No. 1',
      penerimaPengaduan: admin.namaAdmin,
      pelapor: {
        create: {
          nama: 'Siti A',
          tanggalLahir: new Date('1990-01-01'),
          jenisKelamin: 'Perempuan',
          pekerjaan: 'Ibu_Rumah_Tangga',
          alamatLengkap: 'Jl. Sample No. 1',
          nomorWhatsapp: '081234567890',
          hubunganDenganKorban: 'Diri Sendiri'
        }
      },
      korban: {
        create: {
          namaKorban: 'Siti A',
          nik: '1234567890123456',
          tanggalLahir: new Date('1990-01-01'),
          jenisKelamin: 'Perempuan',
          pekerjaan: 'Ibu_Rumah_Tangga',
          alamatLengkap: 'Jl. Sample No. 1',
          nomorTelepon: '081234567890',
          email: 'siti@example.com'
        }
      },
      terlapor: {
        create: {
          nama: 'Budi B',
          tempatLahir: 'Jakarta',
          tanggalLahir: new Date('1985-01-01'),
          jenisKelamin: 'Laki_laki',
          alamat: 'Jl. Sample No. 1',
          nomorTelepon: '081234567891',
          email: 'budi@example.com',
          hubunganDenganKorban: 'Suami'
        }
      }
    },
    {
      kodeLaporan: 'LP-002',
      sumberLaporan: 'web',
      statusLaporan: 'selesai',
      idKecamatan: kecamatanList[1]?.idKecamatan || kecamatanList[0].idKecamatan,
      idJenisKasus: jenisKasusList[1]?.idJenisKasus || jenisKasusList[0].idJenisKasus,
      idBentukKekerasan: bentukKekerasanList[1]?.idBentukKekerasan || bentukKekerasanList[0].idBentukKekerasan,
      jenisKasusLainnya: null,
      bentukKekerasanLainnya: null,
      tanggalKejadian: new Date('2024-02-20'),
      waktuKejadian: new Date('2024-02-20T14:30:00'),
      lokasiLengkapKejadian: 'Jl. Sample No. 2, Kecamatan ' + (kecamatanList[1]?.namaKecamatan || kecamatanList[0].namaKecamatan),
      lokasiKejadianPerkara: 'Tempat Kerja',
      uraianSingkat: 'Kasus kekerasan di tempat kerja',
      harapanKorban: 'Mendapatkan keadilan dan kompensasi',
      kronologiKejadian: 'Kronologi lengkap kejadian...',
      latitude: -3.9785,
      longitude: 122.5226,
      pernyataanKebenaran: true,
      idAdminPenanggungjawab: admin.idAdmin,
      diverifikasiPada: new Date('2024-02-21'),
      selesaiPada: new Date('2024-03-15'),
      dibuatPada: new Date('2024-02-20'),
      diperbaruiPada: new Date('2024-03-15'),
      layananDibutuhkan: 'Bantuan Hukum',
      rujukanDari: 'Instansi Terkait',
      caraDatang: 'Online',
      namaKlien: 'Ani C',
      alamatKlien: 'Jl. Sample No. 2',
      penerimaPengaduan: admin.namaAdmin,
      pelapor: {
        create: {
          nama: 'Ani C',
          tanggalLahir: new Date('1992-05-15'),
          jenisKelamin: 'Perempuan',
          pekerjaan: 'Karyawan',
          alamatLengkap: 'Jl. Sample No. 2',
          nomorWhatsapp: '081234567892',
          hubunganDenganKorban: 'Teman'
        }
      },
      korban: {
        create: {
          namaKorban: 'Dewi D',
          nik: '1234567890123458',
          tanggalLahir: new Date('1995-08-20'),
          jenisKelamin: 'Perempuan',
          pekerjaan: 'Karyawan',
          alamatLengkap: 'Jl. Sample No. 2',
          nomorTelepon: '081234567893',
          email: 'dewi@example.com'
        }
      },
      terlapor: {
        create: {
          nama: 'Eko E',
          tempatLahir: 'Surabaya',
          tanggalLahir: new Date('1980-03-10'),
          jenisKelamin: 'Laki_laki',
          alamat: 'Jl. Sample No. 99',
          nomorTelepon: '081234567894',
          email: 'eko@example.com',
          hubunganDenganKorban: 'Atasan'
        }
      }
    },
    {
      kodeLaporan: 'LP-003',
      sumberLaporan: 'manual',
      statusLaporan: 'diproses',
      idKecamatan: kecamatanList[2]?.idKecamatan || kecamatanList[0].idKecamatan,
      idJenisKasus: jenisKasusList[0].idJenisKasus,
      idBentukKekerasan: bentukKekerasanList[1]?.idBentukKekerasan || bentukKekerasanList[0].idBentukKekerasan,
      jenisKasusLainnya: null,
      bentukKekerasanLainnya: null,
      tanggalKejadian: new Date('2024-03-10'),
      waktuKejadian: new Date('2024-03-10T09:15:00'),
      lokasiLengkapKejadian: 'Jl. Sample No. 3, Kecamatan ' + (kecamatanList[2]?.namaKecamatan || kecamatanList[0].namaKecamatan),
      lokasiKejadianPerkara: 'Sekolah',
      uraianSingkat: 'Kasus kekerasan terhadap anak',
      harapanKorban: 'Mendapatkan perlindungan dan rehabilitasi',
      kronologiKejadian: 'Kronologi lengkap kejadian...',
      latitude: -3.9885,
      longitude: 122.5026,
      pernyataanKebenaran: true,
      idAdminPenanggungjawab: admin.idAdmin,
      diverifikasiPada: new Date('2024-03-11'),
      selesaiPada: null,
      dibuatPada: new Date('2024-03-10'),
      diperbaruiPada: new Date('2024-03-11'),
      layananDibutuhkan: 'Konseling Anak',
      rujukanDari: 'Sekolah',
      caraDatang: 'Diwakilkan',
      namaKlien: 'Fani F (Orang Tua)',
      alamatKlien: 'Jl. Sample No. 3',
      penerimaPengaduan: admin.namaAdmin,
      pelapor: {
        create: {
          nama: 'Fani F',
          tanggalLahir: new Date('1980-12-25'),
          jenisKelamin: 'Perempuan',
          pekerjaan: 'Ibu_Rumah_Tangga',
          alamatLengkap: 'Jl. Sample No. 3',
          nomorWhatsapp: '081234567895',
          hubunganDenganKorban: 'Orang Tua'
        }
      },
      korban: {
        create: {
          namaKorban: 'Gina G',
          nik: '1234567890123460',
          tanggalLahir: new Date('2010-06-15'),
          jenisKelamin: 'Perempuan',
          pekerjaan: 'Pelajar_Mahasiswa',
          alamatLengkap: 'Jl. Sample No. 3',
          nomorTelepon: '-',
          email: '-'
        }
      },
      terlapor: {
        create: {
          nama: 'Hani H',
          tempatLahir: 'Bandung',
          tanggalLahir: new Date('1985-09-30'),
          jenisKelamin: 'Perempuan',
          alamat: 'Jl. Sample No. 100',
          nomorTelepon: '081234567896',
          email: 'hani@example.com',
          hubunganDenganKorban: 'Guru'
        }
      }
    }
  ];

  // Insert sample data
  for (const laporanData of sampleLaporanData) {
    try {
      const laporan = await prisma.laporan.create({
        data: laporanData,
        include: {
          pelapor: true,
          korban: true,
          terlapor: true
        }
      });
      
      console.log(`✅ Laporan ${laporan.kodeLaporan} berhasil ditambahkan`);
      
      // Add log status
      await prisma.logStatusLaporan.create({
        data: {
          idLaporan: laporan.idLaporan,
          idAdmin: admin.idAdmin,
          statusLama: 'menunggu',
          statusBaru: laporanData.statusLaporan,
          catatanPerubahan: 'Laporan dibuat dan diverifikasi',
          dibuatPada: new Date()
        }
      });
      
      // Add catatan admin
      await prisma.catatanAdmin.create({
        data: {
          idLaporan: laporan.idLaporan,
          idAdmin: admin.idAdmin,
          isiCatatan: 'Catatan awal untuk laporan ' + laporan.kodeLaporan,
          dibuatPada: new Date()
        }
      });
      
    } catch (error) {
      console.error(`❌ Gagal menambahkan laporan:`, error);
    }
  }

  console.log('✅ Data sample laporan berhasil ditambahkan');
}

main()
  .catch((e) => {
    console.error('❌ Gagal seeding data sample:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });