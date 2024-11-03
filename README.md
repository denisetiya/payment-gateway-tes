
# JWT Authentication with NestJS

## Deskripsi

Proyek ini adalah template dasar untuk menerapkan otentikasi menggunakan JSON Web Tokens (JWT) di aplikasi NestJS. Proyek ini mencakup fungsi dasar untuk pendaftaran pengguna, login, dan otentikasi dengan JWT.

## Fitur

- Pendaftaran pengguna
- Login pengguna
- Perlindungan rute menggunakan JWT
- Middleware untuk verifikasi token
- Penggunaan `bcrypt` untuk hashing password

## Prerequisites

Pastikan Anda telah menginstal perangkat lunak berikut:

- [Node.js](https://nodejs.org/) (v14 atau lebih tinggi)
- [Bun.js](https://bun.sh/)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (opsional, jika ingin membuat proyek baru)
- [PostgreSQL](https://www.postgresql.org/) atau database lain yang didukung (opsional)

## Instalasi

1. Clone repositori ini ke mesin lokal Anda:

   ```bash
   git clone https://github.com/username/repo-name.git
   ```

2. Masuk ke direktori proyek:

   ```bash
   cd repo-name
   ```

3. Install dependensi:

   ```bash
   npm install
   ```

4. Buat file `.env` berdasarkan file `.env.example`:

   ```bash
   cp .env.example .env
   ```

5. Sesuaikan pengaturan database dan konfigurasi lainnya di file `.env`.

## Menjalankan Proyek

Untuk menjalankan aplikasi dalam mode pengembangan, gunakan perintah berikut:

```bash
npm run start:dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

## Pengujian

Untuk menjalankan pengujian, gunakan perintah berikut:

```bash
npm run test
```

## Penggunaan

### Registrasi Pengguna

Untuk mendaftar pengguna baru, kirimkan permintaan POST ke `/auth/register` dengan data berikut:

```json
{
  "username": "user123",
  "password": "password"
}
```

### Login Pengguna

Untuk login pengguna, kirimkan permintaan POST ke `/auth/login` dengan data berikut:

```json
{
  "username": "user123",
  "password": "password"
}
```

Jika login berhasil, Anda akan menerima token JWT dalam respons.

### Mengakses Rute Terproteksi

Untuk mengakses rute yang dilindungi, Anda perlu menyertakan token JWT di header permintaan:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Struktur Proyek

```
src
├── auth
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── user.entity.ts
├── app.module.ts
└── main.ts
```

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan buat pull request atau buka issue untuk diskusi.

