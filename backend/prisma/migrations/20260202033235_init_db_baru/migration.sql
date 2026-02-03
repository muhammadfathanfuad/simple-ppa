-- CreateTable
CREATE TABLE `admin` (
    `id_admin` BIGINT NOT NULL AUTO_INCREMENT,
    `nama_admin` VARCHAR(120) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `aktif` BOOLEAN NULL DEFAULT true,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `diperbarui_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `admin_email_key`(`email`),
    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laporan` (
    `id_laporan` BIGINT NOT NULL AUTO_INCREMENT,
    `kode_laporan` VARCHAR(30) NOT NULL,
    `sumber_laporan` ENUM('web', 'whatsapp', 'manual') NULL DEFAULT 'web',
    `status_laporan` ENUM('menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak') NULL DEFAULT 'menunggu',
    `id_kecamatan` INTEGER NOT NULL,
    `id_jenis_kasus` INTEGER NOT NULL,
    `id_bentuk_kekerasan` INTEGER NOT NULL,
    `jenis_kasus_lainnya` VARCHAR(120) NULL,
    `bentuk_kekerasan_lainnya` VARCHAR(120) NULL,
    `tanggal_kejadian` DATE NOT NULL,
    `waktu_kejadian` TIME(0) NULL,
    `lokasi_lengkap_kejadian` VARCHAR(255) NOT NULL,
    `uraian_singkat` VARCHAR(255) NULL,
    `harapan_korban` TEXT NULL,
    `kronologi_kejadian` TEXT NOT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `pernyataan_kebenaran` BOOLEAN NULL DEFAULT false,
    `disetujui_pada` DATETIME(0) NULL,
    `id_admin_penanggungjawab` BIGINT NULL,
    `diverifikasi_pada` DATETIME(0) NULL,
    `selesai_pada` DATETIME(0) NULL,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `diperbarui_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `laporan_kode_laporan_key`(`kode_laporan`),
    PRIMARY KEY (`id_laporan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelapor` (
    `id_pelapor` BIGINT NOT NULL AUTO_INCREMENT,
    `id_laporan` BIGINT NOT NULL,
    `status_pelapor` ENUM('Korban Langsung', 'Keluarga', 'Tetangga', 'Teman', 'Saksi', 'Lainnya') NULL,
    `status_pelapor_lainnya` VARCHAR(80) NULL,
    `anonimkan_identitas` BOOLEAN NULL DEFAULT false,
    `nama` VARCHAR(120) NULL,
    `alamat_lengkap` VARCHAR(255) NULL,
    `tempat_lahir` VARCHAR(80) NULL,
    `tanggal_lahir` DATE NULL,
    `nomor_whatsapp` VARCHAR(30) NULL,
    `pekerjaan` ENUM('Guru', 'Pedagang', 'Buruh', 'Wiraswasta', 'Karyawan', 'TNI/POLRI', 'Tani', 'Pelajar/Mahasiswa', 'Ibu Rumah Tangga', 'Lainnya') NULL,
    `pekerjaan_lainnya` VARCHAR(80) NULL,
    `agama` ENUM('Islam', 'Katolik', 'Budha', 'Kristen', 'Hindu', 'Konghuchu', 'Lainnya') NULL,
    `agama_lainnya` VARCHAR(50) NULL,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `pelapor_id_laporan_key`(`id_laporan`),
    PRIMARY KEY (`id_pelapor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `korban` (
    `id_korban` BIGINT NOT NULL AUTO_INCREMENT,
    `id_laporan` BIGINT NOT NULL,
    `nama_lengkap` VARCHAR(120) NOT NULL,
    `nik` VARCHAR(30) NULL,
    `nomor_whatsapp` VARCHAR(30) NULL,
    `alamat_lengkap` VARCHAR(255) NULL,
    `tempat_lahir` VARCHAR(80) NULL,
    `tanggal_lahir` DATE NULL,
    `jenis_kelamin` ENUM('Laki-laki', 'Perempuan') NULL,
    `kewarganegaraan` ENUM('WNI', 'WNA') NULL,
    `pendidikan` ENUM('Tidak Sekolah', 'SD', 'SLTP', 'SLTA', 'D1/D2/D3', 'S1/S2/S3', 'Lainnya') NULL,
    `pendidikan_lainnya` VARCHAR(80) NULL,
    `pekerjaan` ENUM('Guru', 'Pedagang', 'Buruh', 'Wiraswasta', 'Karyawan', 'TNI/POLRI', 'Tani', 'Pelajar/Mahasiswa', 'Ibu Rumah Tangga', 'Lainnya') NULL,
    `pekerjaan_lainnya` VARCHAR(80) NULL,
    `agama` ENUM('Islam', 'Katolik', 'Budha', 'Kristen', 'Hindu', 'Konghuchu', 'Lainnya') NULL,
    `agama_lainnya` VARCHAR(50) NULL,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `korban_id_laporan_key`(`id_laporan`),
    PRIMARY KEY (`id_korban`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kecamatan` (
    `id_kecamatan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kecamatan` VARCHAR(100) NOT NULL,
    `kode_kecamatan` VARCHAR(20) NULL,
    `file_geojson` TEXT NULL,
    `warna` VARCHAR(50) NULL,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_kecamatan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jenis_kasus` (
    `id_jenis_kasus` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_jenis_kasus` VARCHAR(60) NOT NULL,
    `aktif` BOOLEAN NULL DEFAULT true,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_jenis_kasus`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bentuk_kekerasan` (
    `id_bentuk_kekerasan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_bentuk_kekerasan` VARCHAR(60) NOT NULL,
    `aktif` BOOLEAN NULL DEFAULT true,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_bentuk_kekerasan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bukti_laporan` (
    `id_bukti` BIGINT NOT NULL AUTO_INCREMENT,
    `id_laporan` BIGINT NOT NULL,
    `jenis_bukti` ENUM('Foto', 'Video', 'Dokumen', 'Lainnya') NOT NULL,
    `nama_file_asli` VARCHAR(255) NULL,
    `lokasi_file` VARCHAR(255) NOT NULL,
    `tipe_file` VARCHAR(100) NULL,
    `ukuran_file` BIGINT NULL,
    `diunggah_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_bukti`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `catatan_admin` (
    `id_catatan` BIGINT NOT NULL AUTO_INCREMENT,
    `id_laporan` BIGINT NOT NULL,
    `id_admin` BIGINT NOT NULL,
    `isi_catatan` TEXT NOT NULL,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_catatan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jenis_layanan` (
    `id_jenis_layanan` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_jenis_layanan` VARCHAR(80) NOT NULL,
    `aktif` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id_jenis_layanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `layanan_laporan` (
    `id_layanan_laporan` BIGINT NOT NULL AUTO_INCREMENT,
    `id_laporan` BIGINT NOT NULL,
    `id_jenis_layanan` INTEGER NOT NULL,

    PRIMARY KEY (`id_layanan_laporan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_status_laporan` (
    `id_log` BIGINT NOT NULL AUTO_INCREMENT,
    `id_laporan` BIGINT NOT NULL,
    `status_lama` ENUM('menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak') NOT NULL,
    `status_baru` ENUM('menunggu', 'diverifikasi', 'diproses', 'selesai', 'ditolak') NOT NULL,
    `id_admin` BIGINT NULL,
    `catatan_perubahan` TEXT NULL,
    `dibuat_pada` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `laporan` ADD CONSTRAINT `laporan_id_kecamatan_fkey` FOREIGN KEY (`id_kecamatan`) REFERENCES `kecamatan`(`id_kecamatan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `laporan` ADD CONSTRAINT `laporan_id_jenis_kasus_fkey` FOREIGN KEY (`id_jenis_kasus`) REFERENCES `jenis_kasus`(`id_jenis_kasus`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `laporan` ADD CONSTRAINT `laporan_id_bentuk_kekerasan_fkey` FOREIGN KEY (`id_bentuk_kekerasan`) REFERENCES `bentuk_kekerasan`(`id_bentuk_kekerasan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `laporan` ADD CONSTRAINT `laporan_id_admin_penanggungjawab_fkey` FOREIGN KEY (`id_admin_penanggungjawab`) REFERENCES `admin`(`id_admin`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pelapor` ADD CONSTRAINT `pelapor_id_laporan_fkey` FOREIGN KEY (`id_laporan`) REFERENCES `laporan`(`id_laporan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `korban` ADD CONSTRAINT `korban_id_laporan_fkey` FOREIGN KEY (`id_laporan`) REFERENCES `laporan`(`id_laporan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bukti_laporan` ADD CONSTRAINT `bukti_laporan_id_laporan_fkey` FOREIGN KEY (`id_laporan`) REFERENCES `laporan`(`id_laporan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catatan_admin` ADD CONSTRAINT `catatan_admin_id_laporan_fkey` FOREIGN KEY (`id_laporan`) REFERENCES `laporan`(`id_laporan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `catatan_admin` ADD CONSTRAINT `catatan_admin_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `admin`(`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `layanan_laporan` ADD CONSTRAINT `layanan_laporan_id_laporan_fkey` FOREIGN KEY (`id_laporan`) REFERENCES `laporan`(`id_laporan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `layanan_laporan` ADD CONSTRAINT `layanan_laporan_id_jenis_layanan_fkey` FOREIGN KEY (`id_jenis_layanan`) REFERENCES `jenis_layanan`(`id_jenis_layanan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_status_laporan` ADD CONSTRAINT `log_status_laporan_id_laporan_fkey` FOREIGN KEY (`id_laporan`) REFERENCES `laporan`(`id_laporan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_status_laporan` ADD CONSTRAINT `log_status_laporan_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `admin`(`id_admin`) ON DELETE SET NULL ON UPDATE CASCADE;
