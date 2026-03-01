# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Error description",
  "errors": [
    "Detailed error messages"
  ]
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 1,
      "nama": "Admin User",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

#### POST /auth/register
Register a new admin user (requires super admin).

**Request Body:**
```json
{
  "nama": "New Admin",
  "email": "newadmin@example.com",
  "password": "password123",
  "role": "admin"
}
```

### Laporan (Reports)

#### POST /laporan/submit
Submit a new laporan (public endpoint).

**Request Body:**
```json
{
  "pelapor": {
    "nama_pelapor": "John Doe",
    "no_hp_pelapor": "08123456789",
    "status_pelapor": "Keluarga"
  },
  "korban": {
    "nama_korban": "Jane Doe",
    "umur_korban": 25,
    "jenis_kelamin_korban": "P"
  },
  "terlapor": {
    "nama_terlapor": "Unknown Person"
  },
  "jenis_kekerasan": [1, 2],
  "lokasi": {
    "kecamatan_id": 1,
    "desa": "Example Village",
    "detail_lokasi": "Near the market"
  },
  "kronologi": "Detailed description of the incident",
  "sumber_laporan": "web"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Laporan berhasil disubmit",
  "data": {
    "id": 123,
    "kode_laporan": "LP-20231201-001",
    "status": "menunggu"
  }
}
```

#### GET /laporan/all
Get all laporan (requires authentication).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `start_date` (optional): Filter by start date (YYYY-MM-DD)
- `end_date` (optional): Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
  "status": "success",
  "data": {
    "laporan": [
      {
        "id": 1,
        "kode_laporan": "LP-20231201-001",
        "status": "menunggu",
        "created_at": "2023-12-01T10:00:00Z",
        "pelapor": {
          "nama_pelapor": "John Doe"
        },
        "korban": {
          "nama_korban": "Jane Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### GET /laporan/status/:kode_laporan
Check laporan status by kode_laporan (public endpoint).

**Response:**
```json
{
  "status": "success",
  "data": {
    "kode_laporan": "LP-20231201-001",
    "status": "diproses",
    "updated_at": "2023-12-01T14:30:00Z"
  }
}
```

#### GET /laporan/detail/:id
Get detailed laporan information (requires authentication).

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "kode_laporan": "LP-20231201-001",
    "status": "menunggu",
    "pelapor": {
      "nama_pelapor": "John Doe",
      "no_hp_pelapor": "08123456789",
      "status_pelapor": "Keluarga"
    },
    "korban": {
      "nama_korban": "Jane Doe",
      "umur_korban": 25,
      "jenis_kelamin_korban": "P"
    },
    "terlapor": {
      "nama_terlapor": "Unknown Person"
    },
    "jenis_kekerasan": [
      {
        "id": 1,
        "nama": "Kekerasan Fisik"
      }
    ],
    "lokasi": {
      "kecamatan": "Kecamatan Example",
      "desa": "Example Village",
      "detail_lokasi": "Near the market"
    },
    "kronologi": "Detailed description of the incident",
    "bukti": [
      {
        "id": 1,
        "filename": "evidence1.jpg",
        "jenis": "Foto"
      }
    ],
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z"
  }
}
```

#### PUT /laporan/:id/status
Update laporan status (requires authentication).

**Request Body:**
```json
{
  "status": "diverifikasi",
  "catatan": "Laporan telah diverifikasi"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Status laporan berhasil diperbarui",
  "data": {
    "id": 1,
    "kode_laporan": "LP-20231201-001",
    "status": "diverifikasi",
    "updated_at": "2023-12-01T14:30:00Z"
  }
}
```

#### GET /laporan/export
Export laporan data as CSV (requires authentication).

**Query Parameters:**
- `status` (optional): Filter by status
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date

**Response:** CSV file download

#### GET /laporan/export-excel
Export laporan data as Excel (requires authentication).

**Query Parameters:**
- `status` (optional): Filter by status
- `start_date` (optional): Filter by start date
- `end_date` (optional): Filter by end date

**Response:** Excel file download

### Master Data

#### GET /master/kecamatan
Get all kecamatan (public endpoint).

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama_kecamatan": "Kecamatan Example"
    }
  ]
}
```

#### GET /master/jenis-kasus
Get all jenis kasus (public endpoint).

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama": "Kekerasan Fisik"
    },
    {
      "id": 2,
      "nama": "Kekerasan Psikis"
    }
  ]
}
```

#### GET /master/bentuk-kekerasan
Get all bentuk kekerasan (public endpoint).

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama": "Pukul"
    },
    {
      "id": 2,
      "nama": "Tendang"
    }
  ]
}
```

### Dashboard

#### GET /dashboard/stats
Get dashboard statistics (requires authentication).

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalLaporan": 100,
    "menunggu": 20,
    "diverifikasi": 30,
    "diproses": 25,
    "selesai": 20,
    "ditolak": 5
  }
}
```

#### GET /dashboard/rekap
Get rekapitulasi data (requires authentication).

**Query Parameters:**
- `tahun` (optional): Filter by year (default: current year)
- `bulan` (optional): Filter by month (1-12)

**Response:**
```json
{
  "status": "success",
  "data": {
    "perBulan": [
      {
        "bulan": "Januari",
        "total": 10
      }
    ],
    "perKecamatan": [
      {
        "kecamatan": "Kecamatan Example",
        "total": 15
      }
    ],
    "perJenisKekerasan": [
      {
        "jenis": "Kekerasan Fisik",
        "total": 20
      }
    ]
  }
}
```

## Error Codes

- `400` - Bad Request: Validation errors or invalid input
- `401` - Unauthorized: Authentication required or invalid token
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Server-side error

## Rate Limiting
API requests are limited to 100 requests per 15 minutes per IP address.

## File Upload
- Maximum file size: 5MB
- Allowed file types: JPEG, PNG, GIF, PDF, MP4
- Upload endpoint: `/api/laporan/submit` (multipart/form-data)