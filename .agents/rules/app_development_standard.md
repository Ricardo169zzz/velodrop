# Standar Pembuatan Aplikasi Mobile & Fullstack (The MeowKit & VeloDrop Standard)

Aturan ini otomatis menjadi acuan standar setiap kali USER meminta pembuatan aplikasi baru (Mobile App, Web App, Android APK, atau Fullstack App).

---

## 🎯 1. Desain & Antarmuka (UI/UX)
- **Zero-Emoji Rule (Wajib)**: Dilarang menggunakan emoji Unicode di antarmuka maupun teks pengguna. Wajib menggunakan 100% pure SVG icons yang tajam dan presisi.
- **Bebas AI-Slop (Minimalis & Elegan)**: Hindari animasi fiksi ilmiah palsu, radar berlebihan, atau checklist bertumpuk. Gunakan desain clean, tenang, dan berkelas seperti standar aplikasi native modern (Linear, Spotify, Raycast).
- **Responsive & Safe Layout**: Pastikan tombol aksi melayang (FAB) dan dock mengambang memiliki jarak aman (`bottom: 76px`) agar tidak pernah bertabrakan dengan bottom navigation bar.

---

## ⚙️ 2. Standar Backend & Deployment Cloud
- **Cross-Platform Ready**: Backend (Node.js/Express) harus mendukung eksekusi di Windows (lokal) dan Linux Container (Hosting Cloud). Gunakan `process.env.PORT || 3344`.
- **Hosting Backend 24/7**: Hubungkan backend ke hosting container persisten (seperti Railway.app) untuk mendapatkan domain publik HTTPS aktif 24 jam.
- **Git & GitHub Standard**: Selalu siapkan `.gitignore` yang ketat (mengabaikan `node_modules`, file media berat, binary) dan `README.md` dokumentasi profesional.

---

## 📱 3. Standar Build APK Android & PWA (Metode MeowKit & Capacitor)
Setiap aplikasi harus bisa diinstall langsung ke HP Android dengan 2 jalur:
1. **PWA Standalone**:
   - Sertakan `manifest.json` (`display_override: ["standalone", "fullscreen"]`), `sw.js` (Service Worker), serta icon PNG resolusi tinggi `icon-192.png` & `icon-512.png`.
2. **Capacitor Native Android Project**:
   - Inisialisasi Capacitor Android (`@capacitor/core`, `@capacitor/android`, `@capacitor/cli`).
   - Buat folder native `android/` dengan `gradlew`.
   - Sambungkan `capacitor.config.json` ke domain live backend (`server.url`).
3. **Automated GitHub Actions Release**:
   - Buat file `.github/workflows/build-apk.yml` yang otomatis meng-compile APK menggunakan Gradle di cloud (`./gradlew assembleDebug`).
   - Otomatis mempublikasikan rilis di **GitHub Releases** (`softprops/action-gh-release@v2`) sehingga user bisa mendownload file `.apk` langsung dengan 1 klik dari halaman rilis GitHub di HP Android.

---

## 📄 4. Kontinuitas Sesi (Context Continuity)
- Selalu buat/perbarui file **`PROJECT_STATE.md`** di root direktori projek pada setiap akhir pencapaian besar.
- File ini merangkum status fitur, link repo GitHub, live URL, dan struktur file agar sesi obrolan baru di masa depan bisa langsung melanjutkan pekerjaan tanpa kehilangan konteks.
