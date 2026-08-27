# VeloDrop ⚡

> **High-Velocity Media Ingest & Downloader**  
> Unduh Video HD & Audio MP3 dari **YouTube**, **TikTok (Tanpa Watermark)**, dan **Instagram** dengan antarmuka web modern, pemutar in-app, serta background audio player.

---

## ✨ Fitur Unggulan

- **🎬 Multi-Platform Engine**:
  - **YouTube**: Video MP4 hingga 1080p / 4K & Audio MP3 320kbps.
  - **TikTok**: Direct Stream HD **Tanpa Watermark** dalam hitungan detik.
  - **Instagram**: Ekstraksi Reels dan Video Publik secara instan.
- **🎧 In-App Media Player & Background Audio**:
  - Pemutar video HTML5 langsung di dalam aplikasi.
  - Floating Audio Player dengan animasi piringan hitam (*vinyl disc*) dan integrasi **MediaSession API** (bisa diputar di latar belakang / lockscreen HP).
- **💾 Penyimpanan Langsung**:
  - Tombol simpan langsung ke folder *Downloads* perangkat (Android / PC).
- **🗑️ Fitur Hapus Selektif (*Multi-Delete*)**:
  - Pilih satu atau beberapa file dengan checkbox, FAB sampah mengambang yang aman dari navbar, serta dialog konfirmasi.
- **🕒 Relative Time Tracker**:
  - Waktu unduhan dinamis (*Baru saja*, *15 menit lalu*, *Kemarin*).
- **🎨 100% Zero-Emoji UI**:
  - Menggunakan ikon murni SVG yang tajam dan konsisten di semua resolusi layar.

---

## 🚀 Panduan Menjalankan

### 1. Kloning Repositori
```bash
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Jalankan Server
```bash
node server.js
```

Buka browser dan akses: **`http://localhost:3344`**

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+ Modules, MediaSession API)
- **Backend**: Node.js, Express.js
- **Media Engine**: Native Streams & yt-dlp binary integration
