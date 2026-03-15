# 🚀 PAMTrack: Client Progress Tracker

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)

**PAMTrack** adalah platform manajemen progres proyek modern yang dirancang untuk menjembatani komunikasi antara tim pengembang (**PAM Techno**) dan klien. Platform ini memberikan transparansi penuh melalui pelacakan progres real-time tanpa perlu login bagi klien.

---

## ✨ Fitur Utama

### 👨‍💼 Dashboard Admin (Internal)
- **Analytics Overview**: Visualisasi statistik proyek aktif, selesai, dan total beban kerja.
- **Project Management (CRUD)**: Kelola data proyek dengan sistem *auto-generate magic token*.
- **Multi-Phase Tracking**: Sistem pelacakan dua fase utama: *Development* dan *Maintenance*.
- **Timeline Logs**: Pencatatan log progres mendetail disertai persentase dan deskripsi visual.
- **Feedback Management**: Pantau dan respon masukan langsung dari klien di setiap proyek.

### 👤 Portal Klien (Public)
- **Magic Link Access**: Akses instan ke dashboard tracking tanpa perlu registrasi atau login.
- **Interactive Timeline**: Visualisasi perjalanan proyek dari inisiasi hingga serah terima.
- **Discussion Archive**: Akses cepat ke artefak diskusi seperti wireframe, user flow, dan dokumen desain.
- **Instant Feedback**: Form komunikasi langsung untuk memberikan catatan pada setiap milestone.
- **Token Recovery**: Sistem pemulihan link otomatis yang dikirimkan langsung ke WhatsApp klien via Fonnte.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) & [Prisma](https://www.prisma.io/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & [AOS](https://michalsnik.github.io/aos/)
- **Integrasi**:
    - **Cloudinary**: Cloud storage untuk aset gambar dan dokumen.
    - **Fonnte**: Gateway API untuk notifikasi WhatsApp dan pemulihan token.

---

## 🚀 Memulai (Local Development)

### Prasyarat
- Node.js 18+
- pnpm
- PostgreSQL instance

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/pamtrack-client-progress-tracker.git
   cd pamtrack-client-progress-tracker
   ```

2. **Install Dependensi**
   ```bash
   pnpm install
   ```

3. **Konfigurasi Environment**
   Salin `.env.example` menjadi `.env` dan isi variabel yang diperlukan:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pamtrack"
   FONNTE_API_KEY="your_api_key"
   CLOUDINARY_URL="your_cloudinary_url"
   ```

4. **Setup Database**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

5. **Jalankan Server**
   ```bash
   pnpm dev
   ```
   Akses aplikasi di [http://localhost:3000](http://localhost:3000)

---

## 📂 Struktur Proyek Utama

```text
├── app/                # Next.js App Router (Pages & API)
│   ├── admin/          # Dashboard Internal (Protected)
│   ├── track/          # Portal Klien (Public Tracking)
│   └── api/            # Backend API Endpoints
├── components/         # Reusable UI Components
│   ├── admin/          # Komponen khusus Dashboard Admin
│   ├── track/          # Komponen khusus Portal Klien
│   └── ui/             # Base UI components (shadcn)
├── lib/                # Business Logic & Utilities
├── prisma/             # Database Schema & Seed scripts
└── public/             # Static Assets
```

---

## 📝 Script Tersedia

- `pnpm dev`: Menjalankan server pengembangan.
- `pnpm build`: Membangun aplikasi untuk produksi.
- `pnpm start`: Menjalankan aplikasi hasil build.
- `pnpm lint`: Menjalankan pengecekan ESLint.
- `pnpm db:studio`: Membuka GUI Prisma Studio untuk mengelola database.

---

## 🔐 Keamanan & Autentikasi

- **Session-Based**: Area admin diamankan menggunakan cookie session.
- **Magic Tokens**: Akses klien menggunakan token unik (UUID) yang sulit ditebak.
- **Input Sanitization**: Semua input divalidasi pada level API sebelum diproses ke database.

---

## 📄 Lisensi

Proyek ini dikembangkan untuk kebutuhan internal **PAM Techno**. Hak cipta dilindungi.

---

## 📧 Kontak & Dukungan

- **Developer**: Rahmat Fajar Saputra
- **Email**: fajar.saputra2907@gmail.com
- **Website**: [PAM Techno](https://pam-techno.id)
