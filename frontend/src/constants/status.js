// Laporan Status Constants
export const LAPORAN_STATUS = {
  MENUNGGU: 'menunggu',
  DIVERIFIKASI: 'diverifikasi',
  DIPROSES: 'diproses',
  SELESAI: 'selesai',
  DITOLAK: 'ditolak',
};

// Status Color Mapping
export const STATUS_COLORS = {
  [LAPORAN_STATUS.MENUNGGU]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [LAPORAN_STATUS.DIVERIFIKASI]: 'bg-blue-100 text-blue-800 border-blue-200',
  [LAPORAN_STATUS.DIPROSES]: 'bg-purple-100 text-purple-800 border-purple-200',
  [LAPORAN_STATUS.SELESAI]: 'bg-green-100 text-green-800 border-green-200',
  [LAPORAN_STATUS.DITOLAK]: 'bg-red-100 text-red-800 border-red-200',
};

// Status Labels
export const STATUS_LABELS = {
  [LAPORAN_STATUS.MENUNGGU]: 'Menunggu',
  [LAPORAN_STATUS.DIVERIFIKASI]: 'Diverifikasi',
  [LAPORAN_STATUS.DIPROSES]: 'Diproses',
  [LAPORAN_STATUS.SELESAI]: 'Selesai',
  [LAPORAN_STATUS.DITOLAK]: 'Ditolak',
};