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