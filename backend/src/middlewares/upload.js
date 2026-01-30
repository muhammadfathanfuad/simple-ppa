const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Pastikan folder upload ada, jika tidak, buat otomatis
const uploadDir = 'uploads/bukti';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Konfigurasi Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Format: BUKTI-TIMESTAMP-RANDOM.ekstensi
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `BUKTI-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 3. Filter Tipe File (Keamanan Dasar)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Hanya diperbolehkan mengunggah file gambar (jpg/png) atau PDF!'));
    }
};

// 4. Inisialisasi Multer
const uploadBukti = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Batas 5MB sesuai standar server
    fileFilter: fileFilter
});

module.exports = uploadBukti;