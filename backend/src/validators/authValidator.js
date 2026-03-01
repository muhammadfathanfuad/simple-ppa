const { body, validationResult } = require('express-validator');

// Validation rules for admin login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter')
];

// Validation rules for creating admin
const createAdminValidation = [
  body('nama')
    .notEmpty()
    .withMessage('Nama wajib diisi')
    .isLength({ max: 100 })
    .withMessage('Nama maksimal 100 karakter'),
  
  body('email')
    .isEmail()
    .withMessage('Email tidak valid')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password minimal 6 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password harus mengandung huruf besar, huruf kecil, dan angka'),
  
  body('role')
    .optional()
    .isIn(['admin', 'super_admin'])
    .withMessage('Role tidak valid')
];

// Validation rules for updating admin profile
const updateProfileValidation = [
  body('nama')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Nama maksimal 100 karakter'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email tidak valid')
    .normalizeEmail(),
  
  body('password_lama')
    .if(body('password_baru').exists())
    .notEmpty()
    .withMessage('Password lama wajib diisi saat mengubah password'),
  
  body('password_baru')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password baru minimal 6 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password baru harus mengandung huruf besar, huruf kecil, dan angka')
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
  loginValidation,
  createAdminValidation,
  updateProfileValidation,
  checkValidation
};