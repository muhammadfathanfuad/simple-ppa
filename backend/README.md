# Backend DP3A Pelaporan

## Struktur Folder

Struktur folder backend telah diperbarui untuk mengikuti standar industri dan best practices:

```
backend/
├── src/
│   ├── config/              # Konfigurasi aplikasi
│   │   ├── app.js          # Konfigurasi aplikasi (port, JWT, dll)
│   │   ├── database.js     # Konfigurasi database Prisma
│   │   └── index.js        # Export konfigurasi
│   ├── controllers/         # Controllers berdasarkan fitur
│   │   ├── auth/           # Controller autentikasi
│   │   ├── laporan/        # Controller laporan
│   │   ├── admin/          # Controller admin
│   │   ├── dashboard/      # Controller dashboard
│   │   └── masterData/     # Controller master data
│   ├── services/           # Services berdasarkan fitur
│   │   ├── laporan/        # Services laporan
│   │   ├── auth/           # Services autentikasi
│   │   ├── admin/          # Services admin
│   │   ├── dashboard/      # Services dashboard
│   │   └── masterData/     # Services master data
│   ├── validators/          # Validation logic
│   │   ├── laporanValidator.js
│   │   ├── authValidator.js
│   │   └── index.js
│   ├── errors/             # Error handling
│   │   ├── AppError.js
│   │   ├── errorHandler.js
│   │   └── index.js
│   ├── middlewares/        # Express middlewares
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   ├── routes/             # Route definitions
│   │   ├── authRoutes.js
│   │   ├── laporanRoutes.js
│   │   ├── adminRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/              # Utility functions
│   │   └── generateTicket.js
│   └── lib/                # Library configurations
│       └── prisma.js
├── tests/                  # Testing
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   ├── fixtures/           # Test data
│   └── setup.js           # Test setup
├── docs/                   # Documentation
│   └── api.md             # API documentation
├── prisma/                 # Prisma ORM
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── uploads/                # File uploads
│   ├── bukti/
│   └── profil/
├── index.js               # Entry point
├── package.json
├── jest.config.js         # Jest testing configuration
└── README.md
```

## Fitur Baru yang Ditambahkan

### 1. Centralized Configuration
- Semua konfigurasi aplikasi dipindahkan ke folder `src/config/`
- Environment variables divalidasi saat startup
- Konfigurasi database dengan error handling

### 2. Validation Layer
- Input validation menggunakan `express-validator`
- Validation rules terpisah per fitur
- Centralized validation error handling

### 3. Error Handling
- Custom error class `AppError`
- Global error handler dengan logging
- Development vs production error responses

### 4. Rate Limiting
- API rate limiting menggunakan `express-rate-limit`
- Konfigurasi melalui environment variables

### 5. Testing Framework
- Jest untuk unit dan integration testing
- Test configuration dengan coverage reports
- Test setup dan fixtures

### 6. API Documentation
- Dokumentasi API lengkap di `docs/api.md`
- Endpoint documentation dengan examples
- Error codes documentation

## Environment Variables

Tambahkan environment variables berikut ke `.env` file:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mysql://user:password@localhost:3306/database

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,video/mp4
UPLOAD_DESTINATION=uploads/

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Pagination
DEFAULT_PAGE_LIMIT=10
MAX_PAGE_LIMIT=100
```

## Testing

Menjalankan tests:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Development

Menjalankan development server:

```bash
# Generate Prisma client dan start dev server
npm run dev
```

## Best Practices Implemented

1. **Separation of Concerns**: Controllers, services, dan validators terpisah
2. **Modular Architecture**: Fitur dikelompokkan berdasarkan domain
3. **Error Handling**: Centralized error handling dengan proper logging
4. **Validation**: Input validation pada semua endpoints
5. **Security**: Rate limiting dan CORS configuration
6. **Testing**: Comprehensive testing setup
7. **Documentation**: API documentation yang lengkap
8. **Configuration**: Environment-based configuration management

## Migration dari Struktur Lama

Jika migrasi dari struktur lama:

1. Update import paths di semua file
2. Tambahkan environment variables yang diperlukan
3. Install dependencies baru (`express-validator`, `express-rate-limit`, `jest`, `supertest`)
4. Update routes untuk menggunakan validation middleware
5. Tambahkan error handler ke aplikasi Express

## Contributing

Ikuti struktur folder ini saat menambahkan fitur baru:

1. Buat controller di `src/controllers/[feature]/`
2. Buat service di `src/services/[feature]/`
3. Tambahkan validation rules di `src/validators/`
4. Buat tests di `tests/unit/` atau `tests/integration/`
5. Update dokumentasi API di `docs/api.md`