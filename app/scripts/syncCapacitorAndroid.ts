import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const appDir = path.resolve(__dirname, '..');
const outDir = path.join(appDir, 'out');
const androidAssetsDir = path.join(appDir, 'android/app/src/main/assets/public');

console.log('1. Preparing Capacitor static web assets directory in out/...');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Generate standalone HTML shell for native Android webview
const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>EDNOVA Mobile App</title>
  <style>
    body { margin: 0; padding: 0; background-color: #020617; color: #f8fafc; font-family: system-ui, -apple-system, sans-serif; }
    #app-root { width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; items-center; }
  </style>
</head>
<body>
  <div id="app-root">
    <iframe src="https://ednova-lake.vercel.app/mobile" style="width:100%; height:100%; border:none;" allow="camera; microphone; notifications"></iframe>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'index.html'), indexHtmlContent);

console.log('2. Syncing Capacitor Android native project...');
try {
  execSync('npx cap sync android', { cwd: appDir, stdio: 'inherit' });
  console.log('✓ Capacitor Android Sync Complete!');
} catch (err: any) {
  console.error('Capacitor sync error:', err.message);
}
