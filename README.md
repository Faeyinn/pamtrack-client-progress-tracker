# Client Progress Tracker (PAM Techno)

Platform untuk memantau progres proyek klien secara real-time, lengkap dengan dashboard admin, magic link berbasis token, feedback klien, dan notifikasi WhatsApp.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-0ea5e9)
![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2d3748)
![License](https://img.shields.io/badge/license-not%20specified-lightgrey)

---

## Deskripsi

Client Progress Tracker membantu tim PAM Techno mengelola proyek dan memberikan akses tracking yang mudah untuk klien.

Masalah yang diselesaikan:

- Klien kesulitan memantau progres tanpa update manual.
- Admin membutuhkan cara cepat untuk mencatat log progres, membagikan progress link, dan menerima feedback.

---

## Fitur

Sisi Admin:

- Login admin (cookie session).
- Dashboard ringkas untuk melihat status proyek dan progres terakhir.
- CRUD proyek + auto-generate token (magic link).
- Timeline progres (project logs) dengan persentase.
- Feedback klien tampil di detail proyek.

Sisi Klien (Public):

- Tracking via token atau magic link.
- Timeline progress dalam tampilan yang mudah dibaca.
- Form feedback.
- Token recovery (kirim ulang link via WhatsApp jika nomor terdaftar).

---

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS + shadcn/ui
- PostgreSQL
- Prisma (adapter pg)
- WhatsApp gateway via Fonnte

---

## Instalasi (Local Development)

Prasyarat:

- Node.js 18+
- pnpm
- PostgreSQL

Langkah:

1) Install dependencies

```bash
pnpm install
```

2) Siapkan environment variables

Buat file `.env` di root project dan isi minimal:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/client_progress_tracker"

FONNTE_API_KEY="your-fonnte-api-key"
FONNTE_API_URL="https://api.fonnte.com/send"
FONNTE_TIMEOUT_MS="15000"
```

3) Setup database

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

4) Jalankan dev server

```bash
pnpm dev
```

Lalu buka `http://localhost:3000`.

---

## Usage

Halaman utama:

- Landing: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin/dashboard`
- Public tracking: `/track/[token]`

Seed default (development):

- `pnpm db:seed` membuat admin user `jaeyi` dengan password `jaeyipam` dan 1 sample project (token akan diprint di console).
- Untuk production, ganti kredensial ini dan/atau buat user admin baru di database.

Script penting:

```bash
pnpm dev        # start dev server
pnpm build      # build production
pnpm start      # run production build
pnpm lint       # eslint

pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:seed
pnpm db:studio
```

---

## Konfigurasi

Environment variables:

| Variable | Wajib | Deskripsi |
| --- | --- | --- |
| `DATABASE_URL` | Ya | Connection string PostgreSQL (digunakan oleh Prisma + pg pool). |
| `FONNTE_API_KEY` | Tidak | API key untuk pengiriman WhatsApp via Fonnte. |
| `FONNTE_API_URL` | Tidak | Endpoint Fonnte (default: `https://api.fonnte.com/send`). |
| `FONNTE_TIMEOUT_MS` | Tidak | Timeout request (default: 15000 ms). |

---

## API

Auth:

- `POST /api/auth/login`
- `POST /api/auth/logout`

Projects:

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/[id]`
- `PUT /api/projects/[id]`
- `DELETE /api/projects/[id]`

Logs & feedback:

- `GET /api/projects/[id]/logs`
- `POST /api/projects/[id]/logs`
- `GET /api/projects/[id]/feedbacks`

Public tracking:

- `GET /api/track/[token]`
- `POST /api/track/validate`
- `POST /api/track/recovery`
- `POST /api/track/[token]/feedback`

---

## Database

Schema Prisma ada di [prisma/schema.prisma](prisma/schema.prisma).

Tabel utama:

- `users` (admin)
- `projects`
- `project_logs`
- `client_feedbacks`

---

## Dokumentasi

- Alur sistem: [docs/flow-system.md](docs/flow-system.md)
- Struktur halaman: [docs/pages-structure.md](docs/pages-structure.md)
- Struktur project: [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)

---

## Contributing

Kontribusi dipersilakan.

1) Buat branch fitur: `git checkout -b feature/nama-fitur`
2) Pastikan lulus lint: `pnpm lint`
3) Buat PR dengan deskripsi jelas dan langkah testing

---

## License

Repository ini belum menyertakan file lisensi. Jika proyek ini akan dipublikasikan, tambahkan file LICENSE dan perbarui badge/section ini.

---

## Support

- Email: fajar.saputra2907@gmail.com
