# Ringkasan Proyek: Client Progress Tracker (Client Progress Tracker)

Client Progress Tracker adalah platform manajemen progres proyek yang dirancang untuk menjembatani komunikasi antara **PAM Techno** dan klien mereka. Platform ini memungkinkan tim internal mengelola proyek secara terstruktur sementara klien mendapatkan transparansi penuh atas progres proyek mereka secara real-time.

---

## 1. Arsitektur & Tech Stack

### Frontend & Framework
- **Next.js 16 (App Router)**: Framework utama untuk React dengan sistem routing modern.
- **TypeScript**: Memastikan keamanan tipe data di seluruh aplikasi.
- **Tailwind CSS 4**: Framework CSS utility-first untuk desain responsif.
- **shadcn/ui**: Koleksi komponen UI yang dapat dikustomisasi (Radix UI + Lucide Icons).
- **Framer Motion**: Digunakan untuk animasi transisi dan interaksi UI yang halus.

### Backend & Database
- **PostgreSQL**: Database relasional sebagai penyimpanan utama.
- **Prisma (v7.2.0)**: ORM untuk pemodelan data dan migrasi database.
- **Next.js API Routes**: Backend serverless terintegrasi dalam aplikasi Next.js.
- **Bcrypt.js**: Digunakan untuk enkripsi password admin.

### Integrasi Pihak Ketiga
- **Cloudinary**: Digunakan sebagai penyimpanan cloud untuk aset gambar dan file progres.
- **WhatsApp (via Fonnte)**: Digunakan untuk notifikasi otomatis dan pemulihan token (magic link) kepada klien.

---

## 2. Struktur Proyek

- **`/app`**: Direktori utama Next.js App Router.
    - **`/admin`**: Dashboard internal untuk tim PAM Techno (Protected).
    - **`/track/[token]`**: Halaman publik untuk klien yang diakses via Magic Link.
    - **`/api`**: Endpoint backend untuk CRUD proyek, autentikasi, dan tracking.
- **`/components`**: Komponen UI yang dapat digunakan kembali.
    - **`/admin`**: Komponen khusus dashboard admin (table, modal, charts).
    - **`/track`**: Komponen khusus halaman tracking klien (timeline, feedback form).
    - **`/ui`**: Komponen dasar dari shadcn/ui.
- **`/lib`**: Logika bisnis dan utilitas.
    - **`prisma.ts`**: Instansiasi Prisma client.
    - **`whatsapp.ts`**: Integrasi dengan API Fonnte.
    - **`cloudinary.ts`**: Utilitas untuk upload file ke Cloudinary.
- **`/prisma`**: Definisi skema database (`schema.prisma`) dan file seeding.

---

## 3. Model Data (Database Schema)

Database terdiri dari beberapa tabel utama yang saling berelasi:

1.  **`User`**: Data kredensial admin (username & password).
2.  **`Project`**: Entitas utama yang menyimpan informasi klien (nama, no HP), nama proyek, deadline, dan **Magic Token**.
3.  **`ProjectLog`**: Catatan progres setiap kali ada perubahan persentase atau fase.
4.  **`ProgressUpdate`**: Update detail proyek yang bisa berisi teks deskripsi, gambar, dan link eksternal.
5.  **`DiscussionArtifact`**: Dokumen atau file yang dihasilkan selama fase diskusi (Wireframe, User Flow, dll).
6.  **`ClientFeedback`**: Masukan atau pesan yang dikirimkan klien melalui halaman tracking.

---

## 4. Fitur Utama

### A. Dashboard Admin
- **Statistik Ringkas**: Visualisasi jumlah proyek berjalan, selesai, dan total.
- **Manajemen Proyek (CRUD)**: Membuat proyek baru yang otomatis menghasilkan token unik.
- **Update Progres Dua Fase**:
    - **Fase Development**: Tracking pengembangan awal.
    - **Fase Maintenance**: Tracking dukungan setelah rilis.
- **Timeline Management**: Menambahkan log progres dengan persentase dan deskripsi detail.
- **Feedback Viewer**: Melihat semua masukan dari klien di tiap proyek.

### B. Portal Klien (Public Tracking)
- **Akses Tanpa Login (Magic Link)**: Klien cukup mengklik link unik untuk masuk.
- **Timeline Interaktif**: Visualisasi progres proyek dari awal hingga akhir dengan status per fase.
- **Discussion Archive**: Melihat kembali dokumen-dokumen penting hasil diskusi (seperti desain/wireframe).
- **Feedback Form**: Memberikan masukan langsung kepada tim pengembang.
- **Token Recovery**: Jika klien kehilangan link, mereka bisa meminta link baru yang akan dikirim via WhatsApp.

---

## 5. Alur Kerja Inti (Core Workflows)

1.  **Inisiasi Proyek**: Admin membuat proyek di dashboard -> Sistem generate token unik -> Admin membagikan link ke klien.
2.  **Update Progres**: Admin menambahkan `ProgressUpdate` -> Sistem mencatat `ProjectLog` -> Progres persentase diperbarui secara otomatis.
3.  **Interaksi Klien**: Klien melihat update -> Memberikan feedback -> Admin melihat feedback tersebut di dashboard admin.
4.  **Penyelesaian**: Setelah fase Development mencapai 100%, proyek dapat beralih ke fase Maintenance.

---

## 6. Konfigurasi Lingkungan (.env)

Aplikasi membutuhkan beberapa variabel lingkungan untuk berjalan:
- `DATABASE_URL`: Koneksi ke PostgreSQL.
- `FONNTE_API_KEY`: Kunci API untuk pengiriman pesan WhatsApp.
- `CLOUDINARY_URL`: Konfigurasi untuk penyimpanan gambar.

---

## 7. Perintah Pengembangan

- `pnpm dev`: Menjalankan server pengembangan.
- `pnpm db:migrate`: Menjalankan migrasi database terbaru.
- `pnpm db:seed`: Mengisi data awal untuk testing (admin default: `jaeyi` / `jaeyipam`).
- `pnpm build`: Membangun aplikasi untuk produksi.

---

## 8. Deployment & Infrastruktur

- **Vercel**: Siap dideploy ke Vercel dengan konfigurasi `vercel.json`.
- **Docker**: Dilengkapi dengan `Dockerfile` dan `docker-compose.yml` untuk orkestrasi container.
- **Middleware / Proxy**: Penanganan autentikasi admin dilakukan melalui logika proxy/middleware untuk memproteksi rute `/admin` dan API internal.

---

## 9. Keamanan & Performa

- **Autentikasi Berbasis Cookie**: Menggunakan session cookie untuk mengamankan area admin.
- **Input Validation**: Validasi data pada level API untuk memastikan integritas database.
- **Optimasi Gambar**: Integrasi Cloudinary untuk penyajian gambar yang cepat dan teroptimasi.
- **Modern Styling**: Menggunakan Tailwind CSS 4 dan Framer Motion untuk UX yang responsif dan interaktif.
