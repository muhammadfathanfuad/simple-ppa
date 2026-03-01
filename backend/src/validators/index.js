const { 
  createLaporanValidation, 
  updateStatusValidation, 
  getLaporanDetailValidation, 
  checkStatusValidation, 
  getLaporanListValidation, 
  checkValidation 
} = require('./laporanValidator');

const { 
  loginValidation, 
  createAdminValidation, 
  updateProfileValidation 
} = require('./authValidator');

module.exports = {
  // Laporan validators
  createLaporanValidation,
  updateStatusValidation,
  getLaporanDetailValidation,
  checkStatusValidation,
  getLaporanListValidation,
  
  // Auth validators
  loginValidation,
  createAdminValidation,
  updateProfileValidation,
  
  // Common validation checker
  checkValidation
};