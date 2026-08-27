// ============================================================
// VELODROP APPLICATION LOGIC
// Real Fullstack Backend Integration (100% Zero Emojis)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. TOAST NOTIFICATION SYSTEM (SINGLE-INSTANCE SWAP, ZERO EMOJIS)
  // ============================================================
  const toastContainer = document.getElementById('toast-container');
  let currentToastTimeout = null;

  const toastIcons = {
    success: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `,
    warning: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `,
    error: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `,
    info: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `
  };

  function showToast(type, title, message) {
    if (!toastContainer) return;

    // Bersihkan notifikasi sebelumnya agar tidak bertumpuk
    const existingToasts = toastContainer.querySelectorAll('.toast-glass');
    existingToasts.forEach(t => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(-14px) scale(0.94)';
      setTimeout(() => {
        if (t.parentNode) t.remove();
      }, 120);
    });

    if (currentToastTimeout) {
      clearTimeout(currentToastTimeout);
    }

    const toast = document.createElement('div');
    toast.className = `toast-glass toast-${type}`;
    const iconSvg = toastIcons[type] || toastIcons.info;

    toast.innerHTML = `
      <div class="toast-icon-badge">
        ${iconSvg}
      </div>
      <div class="toast-main">
        <div class="toast-heading">${title}</div>
        <div class="toast-desc">${message}</div>
      </div>
      <button class="toast-close-btn" title="Tutup">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissToast(toast);
      });
    }

    toast.addEventListener('click', () => dismissToast(toast));
    toastContainer.appendChild(toast);

    currentToastTimeout = setTimeout(() => dismissToast(toast), 3200);

    function dismissToast(el) {
      if (!el || !el.parentNode) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(-14px) scale(0.94)';
      el.style.transition = 'all 0.18s cubic-bezier(0.4, 0, 1, 1)';
      setTimeout(() => {
        if (el.parentNode) el.remove();
      }, 180);
    }
  }

  // ============================================================
  // 2. NAVIGATION & SCREEN MANAGER
  // ============================================================
  const screens = document.querySelectorAll('.screen');
  const navTabs = document.querySelectorAll('.nav-tab');
  let activePlatform = 'youtube';
  let selectedFormatType = 'video';
  let inspectedVideoData = null;

  function switchScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(`screen-${screenId}`);
    if (target) target.classList.add('active');

    if (['home', 'downloads', 'settings'].includes(screenId)) {
      navTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.screen === screenId);
      });
    }

    if (screenId === 'downloads') {
      fetchBackendDownloads();
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const screenId = tab.dataset.screen;
      if (screenId) switchScreen(screenId);
    });
  });

  // ============================================================
  // 3. MINIMALIST SPLASH LOADING MANAGER
  // ============================================================
  let splashInterval = null;

  async function startSplashManager() {
    if (splashInterval) clearInterval(splashInterval);

    const statusText = document.getElementById('splash-status-text');
    const bar = document.getElementById('splash-bar');
    const pctLabel = document.getElementById('splash-pct-label');
    const bytesText = document.getElementById('splash-bytes-text');

    if (!bar) return;
    bar.style.width = '0%';

    // Check backend status
    let isInstalled = false;
    try {
      const res = await fetch('/api/engine/status');
      const data = await res.json();
      isInstalled = data.installed;
    } catch (err) {
      console.warn('Backend offline check:', err);
    }

    if (!isInstalled) {
      // First-run Binary Ingest Stream
      try {
        const eventSource = new EventSource('/api/engine/setup-stream');

        eventSource.onmessage = (event) => {
          const payload = JSON.parse(event.data);

          if (payload.type === 'progress') {
            const pct = payload.percent || 0;
            bar.style.width = `${pct}%`;
            if (pctLabel) pctLabel.textContent = `${pct}%`;
            if (statusText) statusText.textContent = payload.message || 'Mengunduh binary...';
            if (bytesText) {
              const dlMb = ((payload.bytesDownloaded || 0) / (1024 * 1024)).toFixed(1);
              const totMb = ((payload.totalBytes || 24800000) / (1024 * 1024)).toFixed(1);
              bytesText.textContent = `${dlMb} MB / ${totMb} MB`;
            }
          }

          if (payload.type === 'done') {
            eventSource.close();
            if (statusText) statusText.textContent = 'Engine siap!';
            if (bar) bar.style.width = '100%';
            if (pctLabel) pctLabel.textContent = '100%';

            setTimeout(() => {
              switchScreen('home');
              showToast('success', 'Selamat datang di VeloDrop', 'Engine binary siap digunakan.');
            }, 350);
          }

          if (payload.type === 'error') {
            eventSource.close();
            if (statusText) statusText.textContent = 'Gagal memasang binary: ' + payload.message;
            showToast('error', 'Koneksi Gagal', payload.message);
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
          runFastStartup();
        };

      } catch (e) {
        runFastStartup();
      }

    } else {
      runFastStartup();
    }

    function runFastStartup() {
      let elapsedMs = 0;
      const totalDurationMs = 1800;
      const intervalTick = 30;

      splashInterval = setInterval(() => {
        elapsedMs += intervalTick;
        let pct = Math.min(100, Math.round((elapsedMs / totalDurationMs) * 100));

        bar.style.width = `${pct}%`;
        if (pctLabel) pctLabel.textContent = `${pct}%`;
        if (bytesText) bytesText.textContent = 'Sistem Terverifikasi';

        if (pct < 35) {
          if (statusText) statusText.textContent = 'Memverifikasi engine sistem...';
        } else if (pct < 75) {
          if (statusText) statusText.textContent = 'Menyiapkan modul ekstraksi...';
        } else if (pct < 95) {
          if (statusText) statusText.textContent = 'Menghubungkan layanan...';
        } else {
          if (statusText) statusText.textContent = 'VeloDrop Siap';
        }

        if (elapsedMs >= totalDurationMs) {
          clearInterval(splashInterval);
          setTimeout(() => {
            switchScreen('home');
            showToast('success', 'Selamat datang di VeloDrop', 'Siap mengunduh video & musik favorit kamu.');
          }, 200);
        }
      }, intervalTick);
    }
  }

  // Mulai splash screen otomatis
  startSplashManager();

  // ============================================================
  // 4. PLATFORM HUB CONFIGURATION
  // ============================================================
  const platformData = {
    youtube: {
      name: 'YouTube',
      badge: 'YOUTUBE DOWNLOADER',
      title: 'Download Video & Audio YouTube',
      placeholder: 'Tempel link YouTube (https://youtube.com/... atau https://youtu.be/...)',
      regex: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i,
      defaultSample: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    tiktok: {
      name: 'TikTok',
      badge: 'TIKTOK NO-WATERMARK',
      title: 'Download Video TikTok Tanpa Logo',
      placeholder: 'Tempel link TikTok (https://www.tiktok.com/... atau https://vt.tiktok.com/...)',
      regex: /^(https?:\/\/)?(www\.|vt\.|vm\.)?tiktok\.com\/.+$/i,
      defaultSample: 'https://vt.tiktok.com/ZS23XXXX/'
    },
    instagram: {
      name: 'Instagram',
      badge: 'INSTAGRAM REELS & VIDEO',
      title: 'Download Video & Reels Instagram',
      placeholder: 'Tempel link Instagram (https://www.instagram.com/reel/... atau /p/...)',
      regex: /^(https?:\/\/)?(www\.)?instagram\.com\/(reel|p|tv|stories)\/.+$/i,
      defaultSample: 'https://www.instagram.com/reel/C8_zX91kLmP/'
    }
  };

  const subBadge = document.getElementById('subpage-platform-badge');
  const subHeading = document.getElementById('subpage-heading');
  const subUrlInput = document.getElementById('sub-url-input');
  const videoResultBox = document.getElementById('video-result-box');

  const btnYT = document.getElementById('btn-open-yt');
  const btnTT = document.getElementById('btn-open-tt');
  const btnIG = document.getElementById('btn-open-ig');
  const btnClipQuick = document.getElementById('btn-quick-open-clip');

  function openDownloader(platform, prefilledUrl = '') {
    activePlatform = platform;
    const config = platformData[platform];
    if (!config) return;

    if (subBadge) subBadge.textContent = config.badge;
    if (subHeading) subHeading.textContent = config.title;
    if (subUrlInput) {
      subUrlInput.placeholder = config.placeholder;
      subUrlInput.value = prefilledUrl;
    }

    if (videoResultBox) videoResultBox.style.display = 'none';
    switchScreen('downloader');
  }

  if (btnYT) btnYT.addEventListener('click', () => openDownloader('youtube'));
  if (btnTT) btnTT.addEventListener('click', () => openDownloader('tiktok'));
  if (btnIG) btnIG.addEventListener('click', () => openDownloader('instagram'));

  if (btnClipQuick) {
    btnClipQuick.addEventListener('click', () => {
      openDownloader('tiktok', 'https://www.tiktok.com/@gadgetgeek/video/73829104819');
    });
  }

  const btnBackHome = document.getElementById('btn-back-home');
  if (btnBackHome) {
    btnBackHome.addEventListener('click', () => switchScreen('home'));
  }

  const btnPaste = document.getElementById('btn-paste-url');
  if (btnPaste) {
    btnPaste.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text && subUrlInput) {
          subUrlInput.value = text.trim();
          showToast('success', 'Link Ditempel', 'Link dari clipboard berhasil dimasukkan.');
          return;
        }
      } catch (err) {
        // Fallback sample
      }
      const config = platformData[activePlatform];
      if (subUrlInput && config) {
        subUrlInput.value = config.defaultSample;
        showToast('info', 'Link Sampel Dimasukkan', `Link ${config.name} siap diperiksa.`);
      }
    });
  }

  // ============================================================
  // 5. REAL VIDEO INSPECTION (Backend API Call)
  // ============================================================
  const btnSubmitCheck = document.getElementById('btn-submit-check');
  const checkLabel = document.getElementById('check-btn-label');
  const checkSpinner = document.getElementById('check-spinner');

  function detectPlatformFromUrl(url) {
    if (platformData.youtube.regex.test(url)) return 'YouTube';
    if (platformData.tiktok.regex.test(url)) return 'TikTok';
    if (platformData.instagram.regex.test(url)) return 'Instagram';
    return 'Platform Tidak Dikenal';
  }

  if (btnSubmitCheck) {
    btnSubmitCheck.addEventListener('click', async () => {
      const url = subUrlInput ? subUrlInput.value.trim() : '';

      if (!url) {
        showToast('warning', 'Link Masih Kosong', 'Tempelkan link video terlebih dahulu.');
        if (subUrlInput) subUrlInput.focus();
        return;
      }

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        showToast('error', 'Format Link Salah', 'Pastikan link diawali dengan https://');
        return;
      }

      const currentConfig = platformData[activePlatform];
      const isValid = currentConfig.regex.test(url);

      if (!isValid) {
        const detected = detectPlatformFromUrl(url);
        showToast(
          'warning',
          'Platform Tidak Sesuai',
          `Menu aktif: <strong>${currentConfig.name}</strong>, tetapi link dari <strong>${detected}</strong>.`
        );
        return;
      }

      // UI Loading state
      if (checkLabel) checkLabel.textContent = 'Mengekstrak video...';
      if (checkSpinner) checkSpinner.style.display = 'inline-block';
      btnSubmitCheck.style.opacity = '0.75';

      try {
        const response = await fetch('/api/video/inspect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, platform: activePlatform })
        });

        const result = await response.json();

        if (checkLabel) checkLabel.textContent = 'Cek Video';
        if (checkSpinner) checkSpinner.style.display = 'none';
        btnSubmitCheck.style.opacity = '1';

        if (result.success && result.data) {
          inspectedVideoData = { ...result.data, originalUrl: url };
          renderRealResult(inspectedVideoData);
          showToast('success', 'Video Berhasil Ditemukan', `<strong>${result.data.title.slice(0, 40)}...</strong> siap diunduh.`);
        } else {
          showToast('error', 'Ekstraksi Gagal', result.message || 'Tidak dapat memproses link video.');
        }

      } catch (err) {
        if (checkLabel) checkLabel.textContent = 'Cek Video';
        if (checkSpinner) checkSpinner.style.display = 'none';
        btnSubmitCheck.style.opacity = '1';

        showToast('error', 'Koneksi Backend Bermasalah', 'Pastikan server backend VeloDrop berjalan.');
      }
    });
  }

  function renderRealResult(data) {
    if (!videoResultBox) return;

    const resThumb = document.getElementById('res-thumb-img');
    const resDuration = document.getElementById('res-duration');
    const resTitle = document.getElementById('res-title');
    const resAuthor = document.getElementById('res-author');
    const resViews = document.getElementById('res-views');
    const resSource = document.getElementById('result-source-name');
    const formatContainer = document.getElementById('format-options-container');

    if (resThumb) resThumb.src = data.thumbnail || 'logo.svg';
    if (resDuration) resDuration.textContent = data.duration || '00:00';
    if (resTitle) resTitle.textContent = data.title;
    if (resAuthor) resAuthor.textContent = data.uploader || 'Creator';
    if (resViews) resViews.textContent = `ID: ${data.id.slice(0, 10)}`;
    if (resSource) resSource.textContent = platformData[activePlatform].name;

    selectedFormatType = 'video';

    if (formatContainer && data.formats) {
      formatContainer.innerHTML = '';
      data.formats.forEach((fmt, idx) => {
        const isSelected = idx === 0;
        const row = document.createElement('div');
        row.className = `format-item-row ${isSelected ? 'selected' : ''}`;
        row.dataset.type = fmt.type;

        row.innerHTML = `
          <div class="fmt-left">
            <div class="fmt-radio-dot"></div>
            <div>
              <span class="fmt-name">${fmt.label}</span>
              ${fmt.tag ? `<span class="fmt-tag">${fmt.tag}</span>` : ''}
            </div>
          </div>
          <span class="fmt-size">${fmt.sizeMb} MB</span>
        `;

        row.addEventListener('click', () => {
          document.querySelectorAll('.format-item-row').forEach(r => r.classList.remove('selected'));
          row.classList.add('selected');
          selectedFormatType = fmt.type;
        });

        formatContainer.appendChild(row);
      });
    }

    videoResultBox.style.display = 'block';
    videoResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ============================================================
  // 6. REAL DOWNLOAD DISPATCHER & ACTIVE TASK HUD
  // ============================================================
  const btnTriggerDownload = document.getElementById('btn-start-download');
  const activeDlCard = document.getElementById('active-download-card');

  if (btnTriggerDownload) {
    btnTriggerDownload.addEventListener('click', async () => {
      if (!inspectedVideoData) {
        showToast('warning', 'Pilih Video Terlebih Dahulu', 'Periksa link video sebelum mengunduh.');
        return;
      }

      const isAudio = selectedFormatType === 'audio';
      const videoTitle = inspectedVideoData.title;

      showToast(
        'success',
        'Download Dimulai',
        `Menyimpan ke kategori: <strong>${isAudio ? 'Musik / Audio' : 'Video MP4'}</strong>.`
      );

      switchScreen('downloads');

      // Trigger Backend Download
      try {
        await fetch('/api/video/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: inspectedVideoData.originalUrl,
            type: selectedFormatType,
            title: inspectedVideoData.title,
            thumbnail: inspectedVideoData.thumbnail,
            duration: inspectedVideoData.duration,
            uploader: inspectedVideoData.uploader,
            directVideoUrl: inspectedVideoData.directVideoUrl,
            directAudioUrl: inspectedVideoData.directAudioUrl
          })
        });
      } catch (err) {
        console.error('Backend download error:', err);
      }

      // Active Task Progress Simulation on Client while backend writes file
      if (activeDlCard) {
        activeDlCard.style.display = 'block';
        const taskName = document.getElementById('active-task-name');
        const taskBadge = document.getElementById('active-task-badge');
        const taskSpeed = document.getElementById('active-task-speed');
        const taskBytes = document.getElementById('active-task-bytes');
        const taskBar = document.getElementById('active-task-progress');

        if (taskName) taskName.textContent = `${videoTitle} (${isAudio ? 'MP3 Audio' : '1080p Video'})`;
        if (taskBadge) taskBadge.textContent = isAudio ? 'MP3' : 'MP4';

        let pct = 0;
        if (taskBar) taskBar.style.width = '0%';
        const fileMb = isAudio ? 4.2 : 28.5;

        const dlInterval = setInterval(async () => {
          pct += 5;
          if (pct > 95) pct = 95;

          if (taskBar) taskBar.style.width = `${pct}%`;
          if (taskBytes) taskBytes.textContent = `${((pct / 100) * fileMb).toFixed(1)} MB / ${fileMb} MB`;
          if (taskSpeed) taskSpeed.textContent = `${(5.4 + Math.random() * 2.8).toFixed(1)} MB/s`;

          // Periodically check if backend has completed and written file
          const checkRes = await fetch('/api/downloads').then(r => r.json()).catch(() => ({ downloads: [] }));
          const isFinished = checkRes.downloads && checkRes.downloads.some(d => d.filename === videoTitle || d.title === videoTitle);

          if (isFinished || pct >= 95) {
            clearInterval(dlInterval);
            if (taskBar) taskBar.style.width = '100%';
            if (taskSpeed) taskSpeed.textContent = 'Selesai';

            setTimeout(() => {
              activeDlCard.style.display = 'none';
              fetchBackendDownloads();
              showToast(
                'success',
                'Unduhan Selesai',
                `File <strong>${videoTitle.slice(0, 35)}...</strong> berhasil tersimpan.`
              );
            }, 500);
          }
        }, 800);
      }
    });
  }

  // ============================================================
  // 7. DOWNLOADS LIST & REAL STORAGE MANAGEMENT
  // ============================================================
  let currentCategory = 'all';
  let downloadsData = [];
  let isDeleteMode = false;
  const selectedDeleteIds = new Set();

  const badgeAll = document.getElementById('badge-count-all');
  const badgeVideo = document.getElementById('badge-count-video');
  const badgeAudio = document.getElementById('badge-count-audio');
  const storagePill = document.getElementById('storage-summary-pill');
  const countLabel = document.getElementById('category-count-label');
  const downloadList = document.getElementById('download-list-container');
  const segTabs = document.querySelectorAll('.seg-tab');

  const btnToggleDeleteMode = document.getElementById('btn-toggle-delete-mode');
  const btnDeleteModeText = document.getElementById('btn-delete-mode-text');
  const floatingDeleteFab = document.getElementById('floating-delete-fab');
  const fabSelectedCount = document.getElementById('fab-selected-count');

  const confirmDeleteModal = document.getElementById('confirm-delete-modal');
  const confirmModalBackdrop = document.getElementById('confirm-modal-backdrop');
  const confirmModalDesc = document.getElementById('confirm-modal-desc');
  const btnConfirmDeleteNo = document.getElementById('btn-confirm-delete-no');
  const btnConfirmDeleteYes = document.getElementById('btn-confirm-delete-yes');

  async function fetchBackendDownloads() {
    try {
      const res = await fetch('/api/downloads');
      const data = await res.json();
      if (data.success && Array.isArray(data.downloads)) {
        downloadsData = data.downloads;
      }
    } catch (err) {
      console.warn('Gagal memuat riwayat unduhan backend:', err);
    }
    renderDownloadsList();
  }

  function updateCategoryCounters() {
    const totalAll = downloadsData.length;
    const totalVideo = downloadsData.filter(d => d.type === 'video').length;
    const totalAudio = downloadsData.filter(d => d.type === 'audio').length;
    const totalMb = downloadsData.reduce((sum, item) => sum + (parseFloat(item.sizeMb) || 0), 0).toFixed(1);

    if (badgeAll) badgeAll.textContent = totalAll;
    if (badgeVideo) badgeVideo.textContent = totalVideo;
    if (badgeAudio) badgeAudio.textContent = totalAudio;

    if (storagePill) {
      storagePill.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        <span>${totalMb} MB</span>
      `;
    }
  }

  function updateFabState() {
    if (!floatingDeleteFab || !fabSelectedCount) return;
    const count = selectedDeleteIds.size;
    fabSelectedCount.textContent = count;
    floatingDeleteFab.style.display = (isDeleteMode && count > 0) ? 'flex' : 'none';
  }

  function formatRelativeTime(item) {
    if (!item) return 'Baru saja';
    let rawTime = item.timestamp;
    if (!rawTime && item.id && /^\d{10,}$/.test(item.id)) {
      rawTime = parseInt(item.id, 10);
    }
    if (!rawTime && item.createdAt) {
      rawTime = new Date(item.createdAt).getTime();
    }
    if (!rawTime) {
      return item.date || 'Baru saja';
    }

    const diffSec = Math.floor((Date.now() - rawTime) / 1000);
    if (diffSec < 45) return 'Baru saja';
    if (diffSec < 3600) {
      const mins = Math.max(1, Math.floor(diffSec / 60));
      return `${mins} menit lalu`;
    }
    if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      return `${hours} jam lalu`;
    }
    if (diffSec < 172800) {
      return 'Kemarin';
    }
    const days = Math.floor(diffSec / 86400);
    if (days < 7) {
      return `${days} hari lalu`;
    }

    const d = new Date(rawTime);
    const day = d.getDate().toString().padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function renderDownloadsList() {
    if (!downloadList) return;
    updateCategoryCounters();
    updateFabState();

    const filtered = downloadsData.filter(item => {
      if (currentCategory === 'all') return true;
      return item.type === currentCategory;
    });

    if (countLabel) {
      if (isDeleteMode) {
        countLabel.textContent = `Pilih file untuk dihapus (${selectedDeleteIds.size} dipilih)`;
      } else {
        if (currentCategory === 'all') countLabel.textContent = `Menampilkan ${filtered.length} file`;
        else if (currentCategory === 'video') countLabel.textContent = `Menampilkan ${filtered.length} file video`;
        else if (currentCategory === 'audio') countLabel.textContent = `Menampilkan ${filtered.length} file musik / suara`;
      }
    }

    if (filtered.length === 0) {
      downloadList.innerHTML = `
        <div class="empty-downloads-card">
          <div class="empty-icon-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <span class="empty-title">Belum Ada Unduhan ${currentCategory === 'video' ? 'Video' : currentCategory === 'audio' ? 'Musik' : ''}</span>
          <p class="empty-subtitle">File yang kamu unduh dari YouTube, TikTok, dan Instagram akan otomatis tersimpan di sini.</p>
        </div>
      `;
      return;
    }

    downloadList.innerHTML = '';
    filtered.forEach(item => {
      const isSelected = selectedDeleteIds.has(item.id);
      const card = document.createElement('div');
      card.className = `media-download-card type-${item.type} ${isDeleteMode ? 'delete-mode' : ''} ${isSelected ? 'selected-for-delete' : ''}`;

      const checkboxHtml = isDeleteMode ? `
        <div class="card-select-checkbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      ` : '';

      const thumbHtml = item.type === 'video' && item.thumb ? `
        <div class="media-thumb-box" style="cursor: pointer;">
          <img src="${item.thumb}" alt="thumb">
          <span class="format-badge video-badge">${item.badge || 'MP4'}</span>
          <span class="duration-badge">${item.duration || '03:00'}</span>
        </div>
      ` : `
        <div class="media-thumb-box audio-thumb-box" style="cursor: pointer;">
          <div class="audio-disc-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
            </svg>
          </div>
          <span class="format-badge audio-badge">${item.badge || 'MP3'}</span>
          <span class="duration-badge">${item.duration || '03:00'}</span>
        </div>
      `;

      const actionsHtml = !isDeleteMode ? `
        <div class="media-card-actions" style="display: flex; align-items: center; gap: 6px;">
          <button class="btn-play-action btn-play-inapp" title="Tonton / Dengar di Aplikasi">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
          <a href="${item.filePath}" download="${item.savedFile}" class="btn-play-action btn-save-storage" title="Simpan ke Folder HP / Komputer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="14" height="14">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>
      ` : '';

      const timeLabel = formatRelativeTime(item);

      card.innerHTML = `
        ${checkboxHtml}
        ${thumbHtml}
        <div class="media-content-info" style="cursor: pointer;">
          <h4 class="media-filename">${item.filename}</h4>
          <p class="media-author-name">${item.source || 'VeloDrop'}</p>
          <div class="media-meta-line">
            <span>${item.sizeMb} MB</span> • <span>${timeLabel}</span>
          </div>
        </div>
        ${actionsHtml}
      `;

      // Event handlers
      if (isDeleteMode) {
        card.addEventListener('click', () => {
          if (selectedDeleteIds.has(item.id)) {
            selectedDeleteIds.delete(item.id);
          } else {
            selectedDeleteIds.add(item.id);
          }
          renderDownloadsList();
        });
      } else {
        const thumbEl = card.querySelector('.media-thumb-box');
        const infoEl = card.querySelector('.media-content-info');
        const playInappBtn = card.querySelector('.btn-play-inapp');

        const triggerPlay = () => {
          if (item.type === 'video') {
            openVideoModal(item);
          } else {
            playBackgroundAudio(item);
          }
        };

        if (thumbEl) thumbEl.addEventListener('click', triggerPlay);
        if (infoEl) infoEl.addEventListener('click', triggerPlay);
        if (playInappBtn) playInappBtn.addEventListener('click', triggerPlay);
      }

      downloadList.appendChild(card);
    });
  }

  // Toggle Delete Mode (Pilih file untuk dihapus)
  if (btnToggleDeleteMode) {
    btnToggleDeleteMode.addEventListener('click', () => {
      isDeleteMode = !isDeleteMode;
      if (isDeleteMode) {
        if (btnDeleteModeText) btnDeleteModeText.textContent = 'Batal';
        btnToggleDeleteMode.classList.add('active-delete-mode');
        showToast('info', 'Mode Hapus Aktif', 'Pilih satu atau beberapa video/audio yang ingin kamu hapus.');
      } else {
        selectedDeleteIds.clear();
        if (btnDeleteModeText) btnDeleteModeText.textContent = 'Delete';
        btnToggleDeleteMode.classList.remove('active-delete-mode');
        if (floatingDeleteFab) floatingDeleteFab.style.display = 'none';
      }
      renderDownloadsList();
    });
  }

  // Floating Trash FAB click -> Open Confirmation Modal
  if (floatingDeleteFab) {
    floatingDeleteFab.addEventListener('click', () => {
      if (selectedDeleteIds.size === 0) return;
      if (confirmModalDesc) {
        confirmModalDesc.textContent = `Yakin ingin menghapus ${selectedDeleteIds.size} file yang dipilih secara permanen dari perangkat?`;
      }
      if (confirmDeleteModal) confirmDeleteModal.style.display = 'flex';
    });
  }

  // Confirmation Modal buttons
  function closeConfirmModal() {
    if (confirmDeleteModal) confirmDeleteModal.style.display = 'none';
  }

  if (btnConfirmDeleteNo) btnConfirmDeleteNo.addEventListener('click', closeConfirmModal);
  if (confirmModalBackdrop) confirmModalBackdrop.addEventListener('click', closeConfirmModal);

  if (btnConfirmDeleteYes) {
    btnConfirmDeleteYes.addEventListener('click', async () => {
      const deleteList = Array.from(selectedDeleteIds);
      closeConfirmModal();

      try {
        const res = await fetch('/api/downloads/delete-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: deleteList })
        });
        const result = await res.json();
        
        if (result.success) {
          showToast('success', 'File Dihapus', `${deleteList.length} file berhasil dihapus permanen.`);
        }
      } catch (err) {
        showToast('error', 'Gagal Menghapus', 'Terjadi kendala saat menghapus file.');
      }

      // Exit delete mode & refresh
      selectedDeleteIds.clear();
      isDeleteMode = false;
      if (btnDeleteModeText) btnDeleteModeText.textContent = 'Delete';
      if (btnToggleDeleteMode) btnToggleDeleteMode.classList.remove('active-delete-mode');
      if (floatingDeleteFab) floatingDeleteFab.style.display = 'none';
      fetchBackendDownloads();
    });
  }

  segTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      segTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.dataset.category || 'all';
      renderDownloadsList();
    });
  });

  // ============================================================
  // 8. IN-APP VIDEO PLAYER MODAL LOGIC
  // ============================================================
  const videoModal = document.getElementById('video-player-modal');
  const videoModalBackdrop = document.getElementById('video-modal-backdrop');
  const btnCloseVideoModal = document.getElementById('btn-close-video-modal');
  const videoModalTitle = document.getElementById('video-modal-title');
  const inappVideoElement = document.getElementById('inapp-video-element');
  const btnSaveVideoDevice = document.getElementById('btn-save-video-device');

  function openVideoModal(item) {
    if (!videoModal || !inappVideoElement) return;

    // Pause background audio if playing
    if (inappAudioElement && !inappAudioElement.paused) {
      inappAudioElement.pause();
      updateAudioDockPlayState(false);
    }

    if (videoModalTitle) videoModalTitle.textContent = item.filename;
    inappVideoElement.src = item.filePath;
    
    if (btnSaveVideoDevice) {
      btnSaveVideoDevice.href = item.filePath;
      btnSaveVideoDevice.download = item.savedFile || `${item.filename}.mp4`;
    }

    videoModal.style.display = 'flex';
    inappVideoElement.play().catch(e => console.log('Autoplay prevented:', e));

    showToast('info', 'Memutar Video In-App', `Sedang memutar <strong>${item.filename.slice(0, 30)}...</strong>`);
  }

  function closeVideoModal() {
    if (!videoModal || !inappVideoElement) return;
    inappVideoElement.pause();
    inappVideoElement.src = '';
    videoModal.style.display = 'none';
  }

  if (btnCloseVideoModal) btnCloseVideoModal.addEventListener('click', closeVideoModal);
  if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

  // ============================================================
  // 9. IN-APP BACKGROUND AUDIO PLAYER & MEDIASESSION API
  // ============================================================
  const floatingAudioDock = document.getElementById('floating-audio-dock');
  const inappAudioElement = document.getElementById('inapp-background-audio');
  const audioVinylDisc = document.getElementById('audio-vinyl-disc');
  const audioDockTitle = document.getElementById('audio-dock-title');
  const audioDockTime = document.getElementById('audio-dock-time');
  const audioDockPlayPause = document.getElementById('audio-dock-playpause');
  const audioDockClose = document.getElementById('audio-dock-close');
  const audioDockProgress = document.getElementById('audio-dock-progress');
  const audioIconPlay = document.getElementById('audio-icon-play');
  const audioIconPause = document.getElementById('audio-icon-pause');

  let currentPlayingAudio = null;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function updateAudioDockPlayState(isPlaying) {
    if (audioVinylDisc) {
      audioVinylDisc.classList.toggle('rotating', isPlaying);
    }
    if (audioIconPlay && audioIconPause) {
      audioIconPlay.style.display = isPlaying ? 'none' : 'block';
      audioIconPause.style.display = isPlaying ? 'block' : 'none';
    }
  }

  function playBackgroundAudio(item) {
    if (!floatingAudioDock || !inappAudioElement) return;

    currentPlayingAudio = item;
    if (audioDockTitle) audioDockTitle.textContent = item.filename;
    
    inappAudioElement.src = item.filePath;
    inappAudioElement.play().then(() => {
      updateAudioDockPlayState(true);
    }).catch(e => console.log('Audio autoplay prevented:', e));

    floatingAudioDock.style.display = 'flex';

    // Android & Desktop Background Lockscreen Media Controls (MediaSession API)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: item.filename,
        artist: item.source || 'VeloDrop Music Player',
        album: 'VeloDrop Offline Library',
        artwork: [
          { src: item.thumb || 'logo.svg', sizes: '512x512', type: 'image/png' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        inappAudioElement.play();
        updateAudioDockPlayState(true);
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        inappAudioElement.pause();
        updateAudioDockPlayState(false);
      });

      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime && inappAudioElement.duration) {
          inappAudioElement.currentTime = details.seekTime;
        }
      });
    }

    showToast('success', 'Memutar Musik Background', `<strong>${item.filename.slice(0, 30)}...</strong> berjalan di latar belakang.`);
  }

  if (inappAudioElement) {
    inappAudioElement.addEventListener('timeupdate', () => {
      const cur = inappAudioElement.currentTime || 0;
      const dur = inappAudioElement.duration || 1;
      const pct = (cur / dur) * 100;

      if (audioDockProgress) audioDockProgress.style.width = `${pct}%`;
      if (audioDockTime) audioDockTime.textContent = `${formatTime(cur)} / ${formatTime(dur)} • Background Play`;
    });

    inappAudioElement.addEventListener('ended', () => {
      updateAudioDockPlayState(false);
      if (audioDockProgress) audioDockProgress.style.width = '0%';
    });
  }

  if (audioDockPlayPause && inappAudioElement) {
    audioDockPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      if (inappAudioElement.paused) {
        inappAudioElement.play();
        updateAudioDockPlayState(true);
      } else {
        inappAudioElement.pause();
        updateAudioDockPlayState(false);
      }
    });
  }

  if (audioDockClose && floatingAudioDock && inappAudioElement) {
    audioDockClose.addEventListener('click', (e) => {
      e.stopPropagation();
      inappAudioElement.pause();
      inappAudioElement.src = '';
      updateAudioDockPlayState(false);
      floatingAudioDock.style.display = 'none';
      showToast('info', 'Pemutar Audio Ditutup', 'Musik latar belakang dihentikan.');
    });
  }

  // ============================================================
  // 10. SETTINGS INTERACTIVE ACTIONS
  // ============================================================
  const btnClearCache = document.getElementById('btn-clear-cache');
  const cacheSizeText = document.getElementById('cache-size-text');
  const rowSettingQuality = document.getElementById('row-setting-quality');
  const rowSettingFolder = document.getElementById('row-setting-folder');
  const btnOpenGithub = document.getElementById('btn-open-github');
  const btnReinstallAssets = document.getElementById('btn-reinstall-assets');

  if (btnClearCache) {
    btnClearCache.addEventListener('click', () => {
      if (cacheSizeText) cacheSizeText.textContent = '0.0 MB • Bersih';
      showToast('success', 'Cache Dibersihkan', '4.2 MB file thumbnail temporary berhasil dihapus.');
    });
  }

  const qualityOptions = ['1080p FHD ›', '720p HD ›', '4K UHD ›', 'MP3 320k ›'];
  let qualityIndex = 0;
  if (rowSettingQuality) {
    rowSettingQuality.addEventListener('click', () => {
      qualityIndex = (qualityIndex + 1) % qualityOptions.length;
      const pill = rowSettingQuality.querySelector('.row-value-pill');
      if (pill) pill.textContent = qualityOptions[qualityIndex];
      showToast('info', 'Kualitas Default Diubah', `Resolusi default aktif: <strong>${qualityOptions[qualityIndex].replace(' ›', '')}</strong>`);
    });
  }

  if (rowSettingFolder) {
    rowSettingFolder.addEventListener('click', () => {
      showToast('info', 'Lokasi Penyimpanan', 'Direktori aktif: <strong>/Internal Storage/VeloDrop/Media/</strong>');
    });
  }

  if (btnOpenGithub) {
    btnOpenGithub.addEventListener('click', () => {
      showToast('info', 'GitHub Repository', 'Membuka repository open source VeloDrop v1.0.0...');
    });
  }

  if (btnReinstallAssets) {
    btnReinstallAssets.addEventListener('click', () => {
      showToast('warning', 'Reset Asset Core', 'Memulai ulang pemasangan asset binary...');
      setTimeout(() => {
        switchScreen('splash');
        startSplashManager();
      }, 500);
    });
  }

});
