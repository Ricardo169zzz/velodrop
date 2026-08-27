const fs = require('fs');
const path = require('path');
const https = require('https');

const isWindows = process.platform === 'win32';
const binDir = path.join(__dirname, 'bin');
const binName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';
const targetPath = path.join(binDir, binName);

if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

if (fs.existsSync(targetPath)) {
  console.log('[Setup] Binary already present at:', targetPath);
  process.exit(0);
}

const url = isWindows
  ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
  : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

console.log('[Setup] Downloading yt-dlp binary from:', url);

function download(downloadUrl, dest) {
  https.get(downloadUrl, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
      return download(res.headers.location, dest);
    }
    if (res.statusCode !== 200) {
      console.error('[Setup] Failed to download binary:', res.statusCode);
      return;
    }

    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close(() => {
        if (!isWindows) {
          try {
            fs.chmodSync(dest, 0o755);
          } catch (e) {}
        }
        console.log('[Setup] Binary downloaded and ready at:', dest);
      });
    });
  }).on('error', (err) => {
    console.error('[Setup] Network error during binary download:', err.message);
  });
}

download(url, targetPath);
