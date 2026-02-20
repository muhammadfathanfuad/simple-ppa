# Simple PPA (Sistem Pelaporan Kekerasan Perempuan dan Anak)

Sistem Pelaporan Kekerasan Perempuan dan Anak (Simple PPA) adalah aplikasi web yang dirancang untuk memudahkan masyarakat melaporkan kasus kekerasan. Sistem ini dilengkapi dengan dashboard admin untuk memantau dan memproses laporan yang masuk.

## 🚀 Fitur Utama
- **Sistem Pelaporan Multi-Kategori**: Formulir pengaduan responsif yang mendukung klasifikasi jenis kasus, bentuk kekerasan, hingga data spesifik *human trafficking*.
- **Pelacakan Laporan Real-Time**: Pelapor dapat memantau progres penanganan laporan secara transparan melalui nomor tiket unik.
- **Manajemen Dashboard Admin**: Visualisasi statistik kasus menggunakan grafik interaktif dan manajemen status laporan yang dilengkapi dengan riwayat perubahan (*log status*).
- **Pemetaan Kasus (Geospasial)**: Integrasi peta digital untuk menentukan dan memvisualisasikan titik lokasi kejadian secara akurat.
- **Keamanan Data & Privasi**: Perlindungan data sensitif dengan enkripsi password (Bcrypt) dan opsi anonimitas bagi pelapor untuk menjamin keamanan identitas.
- **Generasi Dokumen PDF**: Fitur otomatisasi untuk mencetak bukti lapor dan dokumen permohonan layanan ke format PDF yang profesional.
- **Manajemen Admin & Log Aktivitas**: Kendali akses penuh untuk pengelola aplikasi, termasuk pengaturan profil dan pemantauan aktivitas admin.

## 🛠 Teknologi yang Digunakan

### **Frontend**
- **Library Utama**: React 19 + Vite
- **Styling**: Tailwind CSS & Bootstrap 5
- **State Management & Routing**: React Router 7
- **Peta & Visualisasi**: Leaflet (Geospatial) & Chart.js (Statistik)
- **Reporting**: jsPDF & jspdf-autotable 

### **Backend**
- **Framework**: Express.js
- **ORM**: Prisma
- **Autentikasi**: JSON Web Token (JWT) & Bcrypt
- **File Upload**: Multer

### **Database & Tools**
- **Database**: MySQL 8.0
- **Database Management**: phpMyAdmin
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
- Email: `admin@dp3a.kendari.go.id`
- Password: `admin123` (Atau cek di database table `users` jika sudah di-hashing)

## 🤝 Kontribusi
Silakan buat *Pull Request* jika Anda ingin berkontribusi pada pengembangan fitur baru atau perbaikan bug.

## 👥 Team Developer

| Nama | Peran | Tanggung Jawab Utama |
| :--- | :--- | :--- |
| **Degus Satya** | Project Manager & Frontend | Manajemen timeline & slicing UI/UX ke kode. |
| **Muhammad Fathan** | Backend Developer | Perancangan database, API, dan integrasi sistem. |
| **Syalsa Ananda** | UI/UX Designer | Riset pengguna, wireframing, dan desain high-fidelity. |
| **Zaid Helsinki** | Quality Assurance (QA) | Testing fitur, dokumentasi bug, dan penyusunan panduan user. |

---
Dibuat dengan ❤️ oleh Tim Magang DP3A Kota Kendari 2026.
