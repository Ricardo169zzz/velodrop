# VeloDrop Development Guidelines & Invariants

## 1. Edit Scope Isolation (Anti Scope-Creep)
- Edit HANYA bagian/komponen yang diminta oleh user.
- Jangan menyentuh layout global, container utama (`.app-root`, `.screen`), atau fixed bottom navigation bar saat diminta merombak komponen spesifik di dalam suatu sub-halaman.

## 2. JavaScript & Backend Coding Safety
- **No Duplicate Identifiers:** Sebelum membuat `const`/`let`/`function`/`route`/`handler`, selalu grep dan verifikasi apakah nama tersebut sudah ada di file.
- **Verification Rule:** Selalu lakukan validasi sintaks (`node --check` / linting) sebelum melaporkan tugas selesai ke user.
- **Backend Architecture & Execution:**
  - Fungsi backend harus single-purpose, modular, dan menangani error secara eksplisit tanpa asumsi.
  - Jangan buat endpoint/rute/handler duplikat.
  - Validasi ketat untuk URL YouTube, TikTok, dan Instagram sebelum memproses download binary atau scraping.
  - Tangani error network, binary fail, atau timeout dengan respons JSON terstruktur dan notifikasi jelas.

## 3. UI Overlay & State Management
- **Single-Instance Overlay Guard:** Floating feedback (Toast, Dialog, Modal) harus *single-instance* (maksimal 1 aktif pada satu waktu, auto-dismiss instan/swap saat ada feedback baru agar tidak menutupi layar).
- **Zero-Emoji Rule:** 100% Zero-Emoji di seluruh teks, tombol, notifikasi, dan checklist. Gunakan vektor SVG presisi tinggi murni.
- **Concise & High-Signal UI:** Hindari teks panjang bertele-tele (anti AI-slop). Buat UI padat, minimalis, dan berkelas seperti flagship native app.
