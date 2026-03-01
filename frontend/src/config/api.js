// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
  },

  // Laporan endpoints
  LAPORAN: {
    SUBMIT: '/laporan/submit',
    ALL: '/laporan/all',
    DETAIL: '/laporan/detail',
    STATUS: '/laporan/status',
    UPDATE_STATUS: '/laporan/status',
    UPDATE: '/laporan/update',
    EXPORT: '/laporan/export',
    EXPORT_EXCEL: '/laporan/export-excel',
    REKAP: '/laporan/rekap',
    REKAP_EXPORT: '/laporan/rekap/export',
    REKAP_EXPORT_PEREMPUAN: '/laporan/rekap/export/perempuan',
    REKAP_EXPORT_ANAK: '/laporan/rekap/export/anak',
    GIS: '/laporan/gis',

    // Master data
    MASTER_KECAMATAN: '/laporan/master/kecamatan',
    MASTER_JENIS_KASUS: '/laporan/master/jenis-kasus',
    MASTER_BENTUK_KEKERASAN: '/laporan/master/bentuk-kekerasan',
    MASTER_JENIS_LAYANAN: '/laporan/master/jenis-layanan',
    MASTER_TEMPAT_KEJADIAN: '/laporan/master/tempat-kejadian',
    MASTER_HUBUNGAN_KORBAN: '/laporan/master/hubungan-korban',
  },

  // Admin endpoints
  ADMIN: {
    USERS: '/admin/users',
    LOGS: '/admin/logs',

    // Master data
    MASTER_JENIS_KASUS: '/admin/master/jenis-kasus',
    MASTER_BENTUK_KEKERASAN: '/admin/master/bentuk-kekerasan',
    MASTER_KECAMATAN: '/admin/master/kecamatan',
    MASTER_JENIS_LAYANAN: '/admin/master/jenis-layanan',
    MASTER_TEMPAT_KEJADIAN: '/admin/master/tempat-kejadian',
    MASTER_HUBUNGAN_KORBAN: '/admin/master/hubungan-korban',
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
};

// Request configuration
const REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
};

// File upload configuration
const UPLOAD_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'video/mp4'
  ],
};

export {
  API_BASE_URL,
  API_ENDPOINTS,
  REQUEST_CONFIG,
  UPLOAD_CONFIG,
};