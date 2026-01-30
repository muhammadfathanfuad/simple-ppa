-- CreateTable
CREATE TABLE `Laporan` (
    `id` VARCHAR(191) NOT NULL,
    `nomor_tiket` VARCHAR(191) NOT NULL,
    `kategori_kekerasan` ENUM('FISIK', 'PSIKIS', 'SEKSUAL', 'EKSPLOITASI', 'PENELANTARAN', 'LAINNYA') NOT NULL,
    `deskripsi_kejadian` TEXT NOT NULL,
    `tanggal_kejadian` DATETIME(3) NOT NULL,
    `lokasi_kejadian` TEXT NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `status` ENUM('PENDING', 'VERIFIKASI', 'PROSES', 'SELESAI') NOT NULL DEFAULT 'PENDING',
    `catatan_internal` TEXT NULL,
    `pelaporId` VARCHAR(191) NOT NULL,
    `korbanId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Laporan_nomor_tiket_key`(`nomor_tiket`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pelapor` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NULL,
    `nik` VARCHAR(191) NULL,
    `telepon` VARCHAR(191) NOT NULL,
    `alamat` TEXT NULL,

    UNIQUE INDEX `Pelapor_nik_key`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Korban` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `usia` INTEGER NOT NULL,
    `jenis_kelamin` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bukti` (
    `id` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `tipe_file` VARCHAR(191) NOT NULL,
    `laporanId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'PETUGAS') NOT NULL DEFAULT 'PETUGAS',

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_pelaporId_fkey` FOREIGN KEY (`pelaporId`) REFERENCES `Pelapor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Laporan` ADD CONSTRAINT `Laporan_korbanId_fkey` FOREIGN KEY (`korbanId`) REFERENCES `Korban`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bukti` ADD CONSTRAINT `Bukti_laporanId_fkey` FOREIGN KEY (`laporanId`) REFERENCES `Laporan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
