const { body, param, query, validationResult } = require('express-validator');

// Validation rules for creating a laporan
const createLaporanValidation = [
  body('pelapor.nama_pelapor')
    .notEmpty()
    .withMessage('Nama pelapor wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Nama pelapor maksimal 100 karakter'),
  
  body('pelapor.no_hp_pelapor')
    .notEmpty()
    .withMessage('Nomor HP pelapor wajib diisi')
    .isMobilePhone('id-ID')
    .withMessage('Format nomor HP tidak valid'),
  
  body('pelapor.status_pelapor')
    .notEmpty()
    .withMessage('Status pelapor wajib diisi')
    .isIn(['Korban Langsung', 'Keluarga', 'Tetangga', 'Teman', 'Saksi', 'Lainnya'])
    .withMessage('Status pelapor tidak valid'),
  
  body('korban.nama_korban')
    .notEmpty()
    .withMessage('Nama korban wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Nama korban maksimal 100 karakter'),
  
  body('korban.umur_korban')
    .notEmpty()
    .withMessage('Umur korban wajib diisi')
    .isInt({ min: 0, max: 150 })
    .withMessage('Umur korban harus antara 0-150 tahun'),
  
  body('korban.jenis_kelamin_korban')
    .notEmpty()
    .withMessage('Jenis kelamin korban wajib diisi')
    .isIn(['L', 'P'])
    .withMessage('Jenis kelamin korban harus L atau P'),
  
  body('terlapor.nama_terlapor')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Nama terlapor maksimal 100 karakter'),
  
  body('jenis_kekerasan')
    .notEmpty()
    .withMessage('Jenis kekerasan wajib diisi')
    .isArray()
    .withMessage('Jenis kekerasan harus berupa array'),
  
  body('lokasi.kecamatan_id')
    .notEmpty()
    .withMessage('Kecamatan wajib diisi')
    .isInt()
    .withMessage('ID kecamatan harus berupa angka'),
  
  body('lokasi.desa')
    .notEmpty()
    .withMessage('Desa wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Nama desa maksimal 100 karakter'),
  
  body('lokasi.detail_lokasi')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Detail lokasi maksimal 255 karakter'),
  
  body('kronologi')
    .notEmpty()
    .withMessage('Kronologi kejadian wajib diisi')
    .isLength({ min: 10 })
    .withMessage('Kronologi kejadian minimal 10 karakter'),
  
  body('sumber_laporan')
    .optional()
    .isIn(['web', 'whatsapp', 'manual'])
    .withMessage('Sumber laporan tidak valid')
];

// Validation rules for updating laporan status
const updateStatusValidation = [
  param('id')
    .isInt()
    .withMessage('ID laporan harus berupa angka'),
  
  body('status')
    .notEmpty()
    .withMessage('Status wajib diisi')
    .isIn(['menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak'])
    .withMessage('Status tidak valid'),
  
  body('catatan')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Catatan maksimal 500 karakter')
];

// Validation rules for getting laporan detail
const getLaporanDetailValidation = [
  param('id')
    .isInt()
    .withMessage('ID laporan harus berupa angka')
];

// Validation rules for checking laporan status
const checkStatusValidation = [
  param('kode_laporan')
    .notEmpty()
    .withMessage('Kode laporan wajib diisi')
    .isLength({ min: 5, max: 20 })
    .withMessage('Kode laporan harus 5-20 karakter')
];

// Validation rules for getting laporan list with filters
const getLaporanListValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page harus berupa angka positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit harus berupa angka antara 1-100'),
  
  query('status')
    .optional()
    .isIn(['menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak'])
    .withMessage('Status filter tidak valid'),
  
  query('start_date')
    .optional()
    .isISO8601()
    .withMessage('Format start date tidak valid'),
  
  query('end_date')
    .optional()
    .isISO8601()
    .withMessage('Format end date tidak valid')
];

// Function to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      status: 'fail',
      message: 'Input tidak valid',
      errors: errorMessages
    });
  }
  next();
};

module.exports = {
  createLaporanValidation,
  updateStatusValidation,
  getLaporanDetailValidation,
  checkStatusValidation,
  getLaporanListValidation,
  checkValidation
};