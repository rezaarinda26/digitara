# DIGITARA Landing Page

Landing page portfolio untuk **DIGITARA — Nuansa Digitara Teknologi**. Dibangun dengan React dan Vite, dengan tampilan modern/Swiss, showcase proyek, formulir konsultasi yang terhubung ke WhatsApp, serta CMS Studio untuk kebutuhan prototyping lokal.

## Fitur

- Halaman layanan, portfolio, proses kerja, testimoni, dan kontak.
- Form konsultasi membuka WhatsApp dengan pesan yang terisi dari data form.
- Tema Modern dan Swiss, warna aksen, tipografi, serta konten yang dapat diatur di CMS Studio.
- Gambar dan konten prototype tersimpan di browser saat mode prototype.
- Favicon mengikuti warna aksen yang dipilih.
- Build production menyembunyikan seluruh akses CMS Studio dan Editorial Mode.

## Teknologi

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## Menjalankan Secara Lokal

Prasyarat: Node.js 20 atau lebih baru.

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (umumnya `http://localhost:3000`). Mode development adalah **prototype mode**, sehingga CMS Studio tersedia untuk mengatur konten.

## Mode Build

| Perintah | Mode | CMS Studio |
| --- | --- | --- |
| `npm run dev` | Prototype lokal | Aktif |
| `npm run build:prototype` | Prototype build | Aktif |
| `npm run build` | Production | Nonaktif/disembunyikan |

Untuk memeriksa hasil production sebelum upload:

```bash
npm run build
npm run preview
```

Lalu buka URL preview yang tampil di terminal, biasanya `http://localhost:4173`.

## Deployment

Jalankan build production terlebih dahulu:

```bash
npm run build
```

Hasil build dibuat di folder `dist/`.

- **Vercel / Netlify / Cloudflare Pages:** hubungkan repository ini dan gunakan build command `npm run build` dengan output directory `dist`.
- **Shared hosting (cPanel, DirectAdmin, dan sejenisnya):** upload seluruh isi folder `dist/` ke web root seperti `public_html` atau `htdocs`.

Jangan membuka `dist/index.html` dengan klik dua kali. Gunakan `npm run preview` untuk simulasi server lokal, atau upload ke web hosting.

## CMS Studio

CMS Studio saat ini dirancang untuk pengeditan dan prototyping lokal. Datanya disimpan di `localStorage` browser, sehingga perubahan tidak otomatis tersinkron antarperangkat dan bukan database production.

Untuk mengubah konten yang akan ikut dalam source code, jalankan situs dalam mode development, buka CMS Studio, lalu gunakan **Apply ke Kode**. Setelah itu lakukan build dan deploy ulang.

## Form Konsultasi

Saat formulir valid dikirim, pengguna akan diarahkan ke WhatsApp dengan pesan yang sudah berisi nama, email, layanan, anggaran, serta deskripsi proyek. Pesan baru benar-benar terkirim setelah pengguna menekan tombol **Kirim** di WhatsApp.

Nomor tujuan WhatsApp saat ini dikonfigurasi di `src/components/Contact.tsx`.
