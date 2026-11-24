# BRIKETA — Smart Briketisasi IoT

Kode sumber situs [briketa-official.web.app](https://briketa-official.web.app/): landing page dan dashboard monitoring IoT mesin smart briketisasi untuk limbah organik dapur MBG.

Situs ini memakai HTML, CSS, dan JS biasa tanpa langkah build. Dashboard (`/app`) membaca data live dari Firebase Realtime Database (`briketa/…`, perangkat `BRK-01`). Kalau koneksi gagal, dashboard otomatis beralih ke mode demo (`/app?demo`).

## Struktur

```
public/
  index.html, landing.css, landing.js, design.js   # landing page
  app.html, app.js, styles.css                     # dashboard monitoring (/app)
  sw.js, manifest.json, icon*                      # PWA
  assets/                                          # gambar mesin, ikon, file CAD (DXF/PDF/SVG)
firebase.json                                      # Firebase Hosting (cleanUrls aktif)
```

Konfigurasi Firebase web ada di `public/app.js` (`FB_CONFIG`).

## Menjalankan lokal

```bash
npm i -g firebase-tools
firebase emulators:start --only hosting   # atau: firebase serve
```

Buka http://localhost:5000 untuk landing page dan http://localhost:5000/app untuk dashboard.

## Deploy

```bash
firebase login
firebase deploy --only hosting
```
