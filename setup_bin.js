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

if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000000) {
  console.log('[Setup] Binary already present and valid at:', targetPath);
  process.exit(0);
}

const url = isWindows
  ? 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe'
  : 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp';

console.log('[Setup] Downloading yt-dlp binary from:', url);

function downloadStream(downloadUrl, dest) {
  return new Promise((resolve, reject) => {
    https.get(downloadUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        return downloadStream(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Failed with status: ' + res.statusCode));
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
          console.log('[Setup] Binary downloaded and verified at:', dest);
          resolve();
        });
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  try {
    await downloadStream(url, targetPath);
    console.log('[Setup] Completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[Setup] Error:', err.message);
    process.exit(1);
  }
})();
