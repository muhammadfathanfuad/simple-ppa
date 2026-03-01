// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Indonesian format)
export const isValidPhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indonesian phone number
  // Starts with 08 (mobile) or 62 (country code)
  const phoneRegex = /^(08\d{8,12}|62\d{8,12})$/;
  return phoneRegex.test(cleaned);
};

// NIK (Indonesian ID number) validation
export const isValidNIK = (nik) => {
  // NIK should be 16 digits
  const nikRegex = /^\d{16}$/;
  return nikRegex.test(nik);
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} wajib diisi`;
  }
  return null;
};

// Length validation
export const validateLength = (value, minLength, maxLength, fieldName = 'Field') => {
  if (!value) return null;
  
  const length = value.toString().length;
  
  if (length < minLength) {
    return `${fieldName} minimal ${minLength} karakter`;
  }
  
  if (length > maxLength) {
    return `${fieldName} maksimal ${maxLength} karakter`;
  }
  
  return null;
};

// Number validation
export const validateNumber = (value, fieldName = 'Field', options = {}) => {
  const { min, max, integer = false } = options;
  
  if (value === '' || value === null || value === undefined) return null;
  
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return `${fieldName} harus berupa angka`;
  }
  
  if (integer && !Number.isInteger(num)) {
    return `${fieldName} harus berupa angka bulat`;
  }
  
  if (min !== undefined && num < min) {
    return `${fieldName} minimal ${min}`;
  }
  
  if (max !== undefined && num > max) {
    return `${fieldName} maksimal ${max}`;
  }
  
  return null;
};

// Age validation
export const validateAge = (age, fieldName = 'Umur') => {
  const num = parseInt(age);
  
  if (isNaN(num)) {
    return `${fieldName} harus berupa angka`;
  }
  
  if (num < 0) {
    return `${fieldName} tidak boleh negatif`;
  }
  
  if (num > 150) {
    return `${fieldName} tidak realistis`;
  }
  
  return null;
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = [],
    required = false,
  } = options;
  
  if (!file) {
    return required ? 'File wajib diunggah' : null;
  }
  
  // Check file size
  if (file.size > maxSize) {
    return `Ukuran file maksimal ${formatFileSize(maxSize)}`;
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return 'Tipe file tidak didukung';
  }
  
  return null;
};

// Multiple files validation
export const validateFiles = (files, options = {}) => {
  const {
    maxCount = 5,
    maxSize = 5 * 1024 * 1024, // 5MB default per file
    allowedTypes = [],
    required = false,
  } = options;
  
  if (!files || files.length === 0) {
    return required ? 'File wajib diunggah' : null;
  }
  
  // Check file count
  if (files.length > maxCount) {
    return `Maksimal ${maxCount} file`;
  }
  
  // Validate each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const error = validateFile(file, { maxSize, allowedTypes });
    if (error) {
      return `File ${i + 1}: ${error}`;
    }
  }
  
  return null;
};

// Date validation
export const validateDate = (date, fieldName = 'Tanggal', options = {}) => {
  const { minDate, maxDate, required = false } = options;
  
  if (!date) {
    return required ? `${fieldName} wajib diisi` : null;
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} tidak valid`;
  }
  
  if (minDate && dateObj < new Date(minDate)) {
    return `${fieldName} tidak boleh kurang dari ${formatDate(minDate)}`;
  }
  
  if (maxDate && dateObj > new Date(maxDate)) {
    return `${fieldName} tidak boleh lebih dari ${formatDate(maxDate)}`;
  }
  
  return null;
};

// Select/choice validation
export const validateSelect = (value, options = {}) => {
  const { required = false, fieldName = 'Pilihan' } = options;
  
  if (required && (!value || value === '' || value === null || value === undefined)) {
    return `${fieldName} wajib dipilih`;
  }
  
  return null;
};

// Array validation (for checkboxes or multi-select)
export const validateArray = (array, options = {}) => {
  const { minLength = 0, maxLength, required = false, fieldName = 'Pilihan' } = options;
  
  if (!array || array.length === 0) {
    return required ? `${fieldName} wajib dipilih` : null;
  }
  
  if (array.length < minLength) {
    return `Pilih minimal ${minLength} ${fieldName}`;
  }
  
  if (maxLength && array.length > maxLength) {
    return `Pilih maksimal ${maxLength} ${fieldName}`;
  }
  
  return null;
};

// Password validation
export const validatePassword = (password, fieldName = 'Password') => {
  if (!password) {
    return `${fieldName} wajib diisi`;
  }
  
  if (password.length < 6) {
    return `${fieldName} minimal 6 karakter`;
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return `${fieldName} harus mengandung huruf kecil`;
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return `${fieldName} harus mengandung huruf besar`;
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return `${fieldName} harus mengandung angka`;
  }
  
  return null;
};

// Password confirmation validation
export const validatePasswordConfirmation = (password, confirmation, fieldName = 'Konfirmasi Password') => {
  if (!confirmation) {
    return `${fieldName} wajib diisi`;
  }
  
  if (password !== confirmation) {
    return `${fieldName} tidak cocok`;
  }
  
  return null;
};

// URL validation
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Comprehensive form validator
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];
    
    // Apply each validation rule
    rules.forEach(rule => {
      const error = rule(value, formData);
      if (error && !errors[fieldName]) {
        errors[fieldName] = error;
      }
    });
  });
  
  return errors;
};

// Helper function to create validation rules
export const createValidationRule = (validator, options = {}) => {
  return (value, formData) => validator(value, options.fieldName, options);
};