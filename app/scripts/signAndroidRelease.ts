import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const appDir = path.resolve(__dirname, '..');
const androidBuildDir = path.join(appDir, 'android/app/build/outputs');
const keystorePath = path.join(appDir, 'android/ednova-release.keystore');
const releaseApkPath = path.join(androidBuildDir, 'apk/release/app-release-unsigned.apk');
const signedApkPath = path.join(appDir, 'EDNOVA-release.apk');
const releaseAabPath = path.join(androidBuildDir, 'bundle/release/app-release.aab');
const signedAabPath = path.join(appDir, 'EDNOVA-release.aab');

console.log('1. Generating EDNOVA Android Release Keystore...');
if (!fs.existsSync(keystorePath)) {
  execSync(`keytool -genkeypair -v -keystore "${keystorePath}" -storepass ednova2026 -alias ednova-key -keypass ednova2026 -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Ednova, OU=Mobile, O=Ednova School OS, L=San Francisco, ST=CA, C=US"`);
}

console.log('2. Signing Release APK...');
if (fs.existsSync(releaseApkPath)) {
  fs.copyFileSync(releaseApkPath, signedApkPath);
  execSync(`jarsigner -keystore "${keystorePath}" -storepass ednova2026 -keypass ednova2026 "${signedApkPath}" ednova-key`);
  console.log(`✓ Signed APK created: ${signedApkPath} (${(fs.statSync(signedApkPath).size / (1024 * 1024)).toFixed(2)} MB)`);
}

console.log('3. Signing Release AAB Bundle...');
if (fs.existsSync(releaseAabPath)) {
  fs.copyFileSync(releaseAabPath, signedAabPath);
  execSync(`jarsigner -keystore "${keystorePath}" -storepass ednova2026 -keypass ednova2026 "${signedAabPath}" ednova-key`);
  console.log(`✓ Signed AAB Bundle created: ${signedAabPath} (${(fs.statSync(signedAabPath).size / (1024 * 1024)).toFixed(2)} MB)`);
}
