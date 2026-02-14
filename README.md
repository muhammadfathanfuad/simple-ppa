# Simple PPA (Sistem Pelaporan Kekerasan Perempuan dan Anak)

Sistem Pelaporan Kekerasan Perempuan dan Anak (Simple PPA) adalah aplikasi web yang dirancang untuk memudahkan masyarakat melaporkan kasus kekerasan. Sistem ini dilengkapi dengan dashboard admin untuk memantau dan memproses laporan yang masuk.

## 🚀 Fitur Utama
- **Pelaporan Online**: Formulir pengaduan yang mudah digunakan untuk korban atau saksi.
- **Tracking Tiket**: Pelapor dapat memantau status laporan menggunakan nomor tiket.
- **Dashboard Admin**: Visualisasi data laporan, peta sebaran kasus, dan manajemen status laporan.
- **Keamanan Privasi**: Identitas pelapor dan korban dijaga kerahasiaannya.
- **Geolokasi**: Integrasi peta untuk titik lokasi kejadian.
- **Cetak Laporan**: Fitur cetak bukti lapor dan surat permohonan ke PDF.

## 🛠 Teknologi yang Digunakan
- **Frontend**: React + Vite, Tailwind CSS, Leaflet (Peta)
- **Backend**: Express.js, Prisma ORM
- **Database**: MySQL
- **Containerization**: Docker & Docker Compose

---

## 📦 Panduan Instalasi & Menjalankan Project

Anda bisa menjalankan project ini menggunakan **Docker (Direkomendasikan)** atau secara **Manual**.

### Opsi 1: Menggunakan Docker (Paling Mudah)
Pastikan Docker dan Docker Compose sudah terinstall di komputer Anda.

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/simple-ppa.git
   cd simple-ppa
   ```

2. **Jalankan Project**
   ```bash
   docker-compose up --build
   ```

3. **Akses Aplikasi**
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)
   - **phpMyAdmin**: [http://localhost:8080](http://localhost:8080) (Username: root, Password: rootpassword)

---

### Opsi 2: Instalasi Manual (Tanpa Docker)

#### Prasyarat
- Node.js (v18+)
- MySQL Server

#### 1. Setup Database
- Buat database baru bernama `db_dp3a_pelaporan` di MySQL Anda.
- Atau import file SQL jika tersedia.

#### 2. Setup Backend
```bash
cd backend
npm install
```
- Buat file `.env` dari contoh:
  ```bash
  cp .env.example .env
  ```
- Sesuaikan `DATABASE_URL` di file `.env` dengan kredensial MySQL lokal Anda.
- Jalankan migrasi database (jika menggunakan Prisma):
  ```bash
  npx prisma migrate dev
  ```
- Jalankan server:
  ```bash
  npm run dev
  ```

#### 3. Setup Frontend
buka terminal baru:
```bash
cd frontend
npm install
```
- Buat file `.env` dari contoh (opsional jika default sudah sesuai):
  ```bash
  cp .env.example .env
  ```
- Jalankan aplikasi:
  ```bash
  npm run dev
  ```

---

## 📂 Struktur Folder
```
simple-ppa/
├── backend/            # Source code API (Express.js)
│   ├── src/
│   │   ├── controllers/# Logika bisnis
│   │   ├── routes/     # Definisi endpoint API
│   │   └── ...
│   ├── prisma/         # Schema database
│   └── ...
├── frontend/           # Source code UI (React)
│   ├── src/
│   │   ├── components/ # Komponen reusable
│   │   ├── pages/      # Halaman aplikasi
│   │   └── ...
│   └── ...
└── docker-compose.yml  # Konfigurasi Docker
```

## 🔐 Akun Default (Untuk Testing)
**Admin Login:**
- Username: `admin`
- Password: `password123` (Atau cek di database table `users` jika sudah di-hashing)

## 🤝 Kontribusi
Silakan buat *Pull Request* jika Anda ingin berkontribusi pada pengembangan fitur baru atau perbaikan bug.

---
Dibuat dengan ❤️ oleh Tim Pengembang.
