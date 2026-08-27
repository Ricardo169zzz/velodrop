# VeloDrop - Project State & Architecture Summary ⚡

> **Dokumentasi Progres & Status Akhir Projek VeloDrop**  
> Gunakan file ini sebagai titik acuan utama (*context handover*) setiap kali memulai sesi obrolan baru.

---

## 📌 1. Informasi Umum & Repositori

- **Nama Projek**: VeloDrop (High-Velocity Media Ingest & Downloader)
- **Tujuan Utama**: Aplikasi web & mobile untuk mengunduh video dan audio kualitas tinggi dari YouTube, TikTok (Tanpa Watermark), dan Instagram, dilengkapi pemutar in-app dan background audio.
- **GitHub Repository**: [https://github.com/Ricardo169zzz/velodrop](https://github.com/Ricardo169zzz/velodrop)
- **Live Production URL (Railway)**: [https://velodrop-production.up.railway.app](https://velodrop-production.up.railway.app)
- **Port Lokal**: `3344` (`http://localhost:3344`)

---

## ✨ 2. Fitur-Fitur yang Sudah Selesai & Aktif 100%

### A. Engine Ekstraksi Media Multi-Platform:
1. **YouTube**:
   - Video Full HD (1080p, 720p, 4K) format MP4 & Audio MP3 320kbps.
2. **TikTok**:
   - Ekstraksi video HD **Tanpa Watermark** super cepat (< 1 detik) dengan kalkulasi ukuran MB nyata.
   - Ekstraksi audio musik/sound asli TikTok.
3. **Instagram Reels & Video**:
   - Engine ekstraksi multi-strategi (pembersihan query tracking `?igsh=...` & direct stream resolver).
   - Ekstraksi Reels MP4 HD & Audio MP3.

### B. Pemutar Media In-App & Background Audio:
1. **In-App Video Player Modal**:
   - Modal video HTML5 bawaan dengan tombol simpan langsung ke folder perangkat.
2. **Floating Background Audio Player (MP3)**:
   - Dock audio mengambang dengan piringan hitam (*vinyl disc*) yang berputar.
   - **MediaSession API Integration**: Audio tetap berjalan saat layar HP dimatikan.

### C. Manajemen Penyimpanan & Riwayat Unduhan:
1. **Simpan ke Folder Native**:
   - Unduh langsung ke folder Downloads perangkat (`/sdcard/Download/` di Android).
2. **Fitur Hapus Selektif (*Multi-Delete*)**:
   - Checkbox di setiap kartu media + Floating Trash FAB + Dialog konfirmasi interaktif.
3. **Waktu Relatif Dinamis (*Relative Time Tracker*)**:
   - Menghitung waktu (*Baru saja*, *15 menit lalu*, *Kemarin*).

### D. Tampilan & UI/UX Minimalis (Zero AI-Slop):
1. **Dynamic Platform Header**:
   - Judul subpage, badge, hint target, dan placeholder otomatis menyesuaikan platform yang dipilih (YouTube, TikTok, Instagram).
2. **Clean Hero Card**:
   - Tampilan banner berkelas, kontras tinggi, dan rapi tanpa elemen sesak.
3. **Smooth Navigation Transitions**:
   - Transisi layar GPU-accelerated yang mulus tanpa lag.
4. **Changelog Modal & Auto-Update Notification**:
   - Riwayat versi rilis resmi di Pengaturan dan notifikasi otomatis saat rilis versi baru tersedia di GitHub.

### E. PWA & Native Android APK (Capacitor Engine):
1. **Progressive Web App (PWA)**:
   - `manifest.json`, `sw.js` (Service Worker), icon PNG resolusi tinggi (`icon-192.png`, `icon-512.png`), dan `display_override: ["standalone", "fullscreen"]`.
   - Bisa di-install langsung dari browser Chrome/Edge menjadi aplikasi mandiri di HP Android & PC.
2. **Capacitor Native Android Project**:
   - Inisialisasi platform Android native (`android/`) dengan Gradle wrapper (`gradlew`).
   - Ikon launcher Android resmi VeloDrop di seluruh folder `mipmap` (mdpi hingga xxxhdpi) dengan background obsidian dark `#08090C`.
   - **Dark System Navigation Bar & Status Bar**: Bilah navigasi bawah HP (tombol back, home, recent apps) dan bilah status atas Android diwarnai `#08090C` sehingga menyatu 100% dengan tema aplikasi.
   - Terhubung langsung ke live backend Railway (`https://velodrop-production.up.railway.app`).
3. **Automated GitHub Release APK Workflow**:
   - File `.github/workflows/build-apk.yml` otomatis meng-compile `VeloDrop-v1.0.0-debug.apk` dan mempublikasikannya langsung di **GitHub Releases**.

---

## 📁 3. Struktur File & Tanggung Jawab

| File / Folder | Fungsi & Deskripsi |
| :--- | :--- |
| `index.html` | Struktur antarmuka modular 3 layar (*Splash Loading*, *Home Platform Hub*, *Downloads*, *Settings*) serta komponen player dan modal delete. |
| `style.css` | Sistem desain lengkap, tema obsidian dark, aksen crimson (`#DC2626`), animasi vinyl, floating FAB, dan modal pop-up. |
| `app.js` | Logika frontend, event handler, inspect link, dispatcher download, player video/audio, MediaSession API, dynamic relative time, dan PWA installer. |
| `server.js` | Backend Express.js, router API `/api/video/inspect`, `/api/video/download`, `/api/downloads`, `/api/downloads/delete-items`, dan auto-setup binary. |
| `manifest.json` | Konfigurasi PWA (nama aplikasi, domain start URL, icons, standalone mode). |
| `sw.js` | Service Worker untuk caching asset statis dan PWA support. |
| `downloads/` | Folder penyimpanan file media dan file riwayat database lokal `history.json`. |
| `bin/` | Folder binary `yt-dlp` (otomatis disiapkan oleh server). |
| `.github/workflows/build-apk.yml` | Workflow GitHub Actions untuk build APK otomatis di cloud. |

---

## 🛠️ 4. Panduan Menjalankan Secara Lokal

```bash
# 1. Masuk direktori
cd "e:\Aplikasi Chat"

# 2. Pasang dependensi
npm install

# 3. Jalankan server lokal
node server.js
```
Akses di browser: **`http://localhost:3344`**

---

## 📝 5. Catatan untuk Sesi Obrolan Selanjutnya
- **Aturan Zero-Emoji:** Pertahankan aturan tidak menggunakan emoji Unicode (gunakan tag `<svg>` untuk semua ikon).
- **Backend Stability:** Server mendukung multi-platform (Windows & Linux Cloud Hosting).
- **Live URL:** URL Railway aktif di `https://velodrop-production.up.railway.app`.
