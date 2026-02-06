const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Sedang melakukan seeding admin...');

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('admin123', saltRounds);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@dp3a.kendari.go.id' },
    update: {},
    create: {
      namaAdmin: 'Admin DP3A Kota Kendari',
      email: 'admin@dp3a.kendari.go.id',
      password: hashedPassword,
      aktif: true,
    },
  });

  // Seed Kecamatan
  await prisma.kecamatan.createMany({
    skipDuplicates: true,
    data: [
      { idKecamatan: 1, namaKecamatan: 'Kendari' },
      { idKecamatan: 2, namaKecamatan: 'Kendari Barat' },
    ]
  });

  // Seed Jenis Kasus
  await prisma.jenisKasus.createMany({
    skipDuplicates: true,
    data: [
      { idJenisKasus: 1, namaJenisKasus: 'Kekerasan Fisik' },
      { idJenisKasus: 2, namaJenisKasus: 'Kekerasan Psikis' },
    ]
  });

  // Seed Bentuk Kekerasan
  await prisma.bentukKekerasan.createMany({
    skipDuplicates: true,
    data: [
      { idBentukKekerasan: 1, namaBentukKekerasan: 'Pemukulan' },
      { idBentukKekerasan: 2, namaBentukKekerasan: 'Hinaan' },
    ]
  });

  console.log('✅ Admin berhasil ditambahkan:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Gagal seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });