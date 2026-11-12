# ICanFix.ID — Website

Situs statis (HTML + CSS + JavaScript, tanpa framework) untuk layanan servis laptop dan HP (Android & iPhone) ICanFix.ID.

## Struktur konten

Halaman memakai dua pilar perangkat yang setara:

- **Laptop** — layanan dan gejala laptop (service 001–006).
- **HP / Smartphone** — layanan dan gejala HP (service 007–012).

Pemilih perangkat ada di section **Layanan** (`#layanan`) dan **Gejala** (`#gejala`) memakai tab aksesibel. Section **Service Notes** (`#service-notes`) punya filter All / Laptop / HP. Tautan "Lihat service laptop/HP" memakai atribut `data-device-jump` untuk langsung membuka tab yang sesuai.

## Menjalankan lokal

Dari folder ini:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Buka `http://127.0.0.1:4173/`.

## Mengubah informasi bisnis

Semua data kontak utama ada di **`assets/js/config.js`**:

- `contact.whatsapp` — nomor WhatsApp utama format internasional tanpa `+`/spasi (dipakai untuk semua tautan `wa.me`).
- `contact.whatsappDisplay` — nomor utama yang tampil di halaman.
- `contact.whatsappAlt` dan `contact.whatsappAltDisplay` — nomor WhatsApp kedua admin (tampil di kontak CTA & footer, tautan memakai `data-wa-alt`).
- `brand.instagramHandle` dan `brand.instagramUrl` — handle dan tautan Instagram.
- `location.area` — area layanan yang tampil.
- `hours.display` — jam operasional.
- `messages.*` — pesan WhatsApp otomatis (default, layanan, gejala laptop, gejala HP).

Nilai yang tampil di halaman ditandai dengan `data-site` di `index.html` dan otomatis diganti dari config saat halaman dimuat. Tautan WhatsApp memakai `data-wa` / `data-wa-default`; tautan Instagram memakai `data-ig`.

Jika alamat lengkap, email, atau jam operasional sudah dikonfirmasi, isi juga `location.address`, `location.mapsUrl`, `contact.email`, dan `hours.display` — lalu tambahkan tampilannya di footer/CTA bila diperlukan.

## Mengganti foto

Semua gambar ada di `assets/img/` dalam format WebP. Ganti file dengan nama yang sama agar tidak perlu mengubah HTML. Pertahankan rasio dan ukuran mendekati aslinya agar layout stabil.

- `hero-board-1100.webp` / `hero-board-700.webp` — foto utama hero laptop (srcset).
- `phone-screen-after-900.webp` — inset HP di hero.
- `phone-screen-before-900.webp` / `phone-screen-after-900.webp` — pasangan before/after display HP.
- `phone-repair-1200.webp`, `phone-board-1000.webp`, `phone-battery-1000.webp`, `phone-flex-1000.webp`, `phone-open-1200.webp` — foto layanan dan pilar HP.
- `thermal-before-1000.webp` / `thermal-after-1000.webp` — pasangan before/after pada Service Notes.
- `og-icanfix.jpg` — gambar pratinjau media sosial (1200×630, laptop + HP). Perbarui bila foto utama berubah.

Kredit dan lisensi foto dokumentasi tercantum di footer (bagian "Kredit & lisensi foto dokumentasi"). Perbarui bagian itu bila mengganti foto.

## Struktur

```
index.html              Halaman utama
assets/css/style.css    Seluruh gaya dan breakpoint
assets/js/config.js     Data bisnis yang mudah diubah
assets/js/site.js       Menu, tautan WhatsApp, tab perangkat, filter case, slider, animasi
assets/img/             Foto teroptimasi + OG image
assets/favicon.svg      Favicon
```

## Catatan deploy

Situs siap diunggah ke hosting statis (Netlify, Vercel, GitHub Pages, dsb.). Metadata canonical dan Open Graph memakai domain `https://icanfix.id/` — sesuaikan di `index.html` bila domain berbeda.
