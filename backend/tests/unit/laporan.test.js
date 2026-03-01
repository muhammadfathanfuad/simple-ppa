const request = require('supertest');
const { app } = require('../../src/config');
const { prisma } = require('../../src/config');

// Mock data for testing
const mockLaporanData = {
  pelapor: {
    nama_pelapor: 'Test Pelapor',
    no_hp_pelapor: '08123456789',
    status_pelapor: 'Keluarga'
  },
  korban: {
    nama_korban: 'Test Korban',
    umur_korban: 25,
    jenis_kelamin_korban: 'P'
  },
  terlapor: {
    nama_terlapor: 'Test Terlapor'
  },
  jenis_kekerasan: [1, 2],
  lokasi: {
    kecamatan_id: 1,
    desa: 'Test Desa',
    detail_lokasi: 'Test Detail Lokasi'
  },
  kronologi: 'Test kronologi kejadian',
  sumber_laporan: 'web'
};

describe('Laporan API', () => {
  let authToken;
  
  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
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
    
    await prisma.$disconnect();
  });

  describe('POST /api/laporan/submit', () => {
    it('should create a new laporan', async () => {
      const response = await request(app)
        .post('/api/laporan/submit')
        .send(mockLaporanData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toContain('berhasil');
      expect(response.body.data).toHaveProperty('kode_laporan');
    });

    it('should return validation error for missing required fields', async () => {
      const invalidData = { ...mockLaporanData };
      delete invalidData.pelapor.nama_pelapor;

      const response = await request(app)
        .post('/api/laporan/submit')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('tidak valid');
    });
  });

  describe('GET /api/laporan/all', () => {
    it('should get all laporan with auth token', async () => {
      const response = await request(app)
        .get('/api/laporan/all')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .get('/api/laporan/all')
        .expect(401);
    });
  });

  describe('GET /api/laporan/status/:kode_laporan', () => {
    let testKodeLaporan;

    beforeAll(async () => {
      // Create a test laporan first
      const createResponse = await request(app)
        .post('/api/laporan/submit')
        .send(mockLaporanData);
      
      testKodeLaporan = createResponse.body.data.kode_laporan;
    });

    it('should return laporan status by kode_laporan', async () => {
      const response = await request(app)
        .get(`/api/laporan/status/${testKodeLaporan}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('status');
    });

    it('should return 404 for non-existent kode_laporan', async () => {
      const response = await request(app)
        .get('/api/laporan/status/NONEXISTENT')
        .expect(404);

      expect(response.body.status).toBe('fail');
    });
  });

  describe('PUT /api/laporan/:id/status', () => {
    let testLaporanId;

    beforeAll(async () => {
      // Create a test laporan first
      const createResponse = await request(app)
        .post('/api/laporan/submit')
        .send(mockLaporanData);
      
      testLaporanId = createResponse.body.data.id;
    });

    it('should update laporan status with auth token', async () => {
      const updateData = {
        status: 'diverifikasi',
        catatan: 'Test update status'
      };

      const response = await request(app)
        .put(`/api/laporan/${testLaporanId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.status).toBe('diverifikasi');
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .put(`/api/laporan/${testLaporanId}/status`)
        .send({ status: 'diproses' })
        .expect(401);
    });
  });
});