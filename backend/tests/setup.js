const { prisma } = require('../src/config');

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from test database
  await prisma.$disconnect();
});

// Reset database before each test
beforeEach(async () => {
  // Clean up test data
  await prisma.laporan.deleteMany({
    where: {
      pelapor: {
        nama_pelapor: {
          contains: 'Test'
        }
      }
    }
  });
  
  await prisma.admin.deleteMany({
    where: {
      email: {
        contains: 'test'
      }
    }
  });
});