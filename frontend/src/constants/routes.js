// Route Constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  LAPORKAN: '/laporkan',
  CEK_STATUS: '/cek-status',
  LOGIN: '/login',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_REKAPITULASI: '/admin/rekapitulasi',
  ADMIN_LAPORAN: '/admin/laporan',
  ADMIN_LAPORAN_BARU: '/admin/laporan/baru',
  ADMIN_LAPORAN_DETAIL: '/admin/laporan/:id/lengkap',
  ADMIN_PENGATURAN: '/admin/pengaturan',
  
  // Admin settings routes
  ADMIN_SETTINGS_PROFILE: '/admin/pengaturan/profile',
  ADMIN_SETTINGS_ADMIN: '/admin/pengaturan/admin',
  ADMIN_SETTINGS_FORM: '/admin/pengaturan/form',
  ADMIN_SETTINGS_LOGS: '/admin/pengaturan/logs',
};

// Navigation items for admin sidebar
export const ADMIN_NAVIGATION = [
  {
    name: 'Dashboard',
    path: ROUTES.ADMIN_DASHBOARD,
    icon: 'bi-speedometer2',
  },
  {
    name: 'Rekapitulasi Data',
    path: ROUTES.ADMIN_REKAPITULASI,
    icon: 'bi-clipboard-data',
  },
  {
    name: 'Daftar Laporan',
    path: ROUTES.ADMIN_LAPORAN,
    icon: 'bi-file-earmark-text',
  },
  {
    name: 'Pengaturan',
    path: ROUTES.ADMIN_PENGATURAN,
    icon: 'bi-gear',
    children: [
      {
        name: 'Profil',
        path: ROUTES.ADMIN_SETTINGS_PROFILE,
        icon: 'bi-person',
      },
      {
        name: 'Manajemen Admin',
        path: ROUTES.ADMIN_SETTINGS_ADMIN,
        icon: 'bi-people',
      },
      {
        name: 'Pengaturan Form',
        path: ROUTES.ADMIN_SETTINGS_FORM,
        icon: 'bi-form',
      },
      {
        name: 'Log Aktivitas',
        path: ROUTES.ADMIN_SETTINGS_LOGS,
        icon: 'bi-clock-history',
      },
    ],
  },
];

// Public navigation items
export const PUBLIC_NAVIGATION = [
  {
    name: 'Beranda',
    path: ROUTES.HOME,
  },
  {
    name: 'Buat Laporan',
    path: ROUTES.LAPORKAN,
  },
  {
    name: 'Cek Status',
    path: ROUTES.CEK_STATUS,
  },
];