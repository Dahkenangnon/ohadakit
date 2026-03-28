#!/usr/bin/env node

/**
 * Build report — verifies all outputs exist and displays sizes with gzip ratios.
 * Run via: npm run build:report
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

async function getGzipSize(filePath) {
  try {
    const input = fs.createReadStream(filePath);
    const gzip = createGzip();
    let size = 0;
    gzip.on('data', chunk => { size += chunk.length; });
    await pipeline(input, gzip);
    return size;
  } catch {
    return 0;
  }
}

function verifyBuild() {
  const requiredFiles = [
    'esm/index.js',
    'esm/index.js.map',
    'cjs/index.js',
    'cjs/index.js.map',
    'types/index.d.ts',
    'browser/ohadakit.umd.js',
    'browser/ohadakit.umd.js.map',
    'browser/ohadakit.iife.js',
    'browser/ohadakit.iife.js.map',
  ];

  const missing = [];
  const existing = [];

  for (const file of requiredFiles) {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
      existing.push(file);
    } else {
      missing.push(file);
    }
  }

  return { existing, missing };
}

async function generateReport() {
  console.log(
    `\n${colors.bright}${colors.cyan}OhadaKit SDK - Build Report${colors.reset}\n`
  );
  console.log(
    `${colors.blue}${'━'.repeat(62)}${colors.reset}\n`
  );

  const { missing } = verifyBuild();

  if (missing.length > 0) {
    console.log(`${colors.red}Build Incomplete${colors.reset}`);
    console.log(`\n${colors.red}Missing files:${colors.reset}`);
    missing.forEach(file => console.log(`  - ${file}`));
    console.log('');
    process.exit(1);
  }

  console.log(
    `${colors.green}Build Complete - All files generated${colors.reset}\n`
  );

  // NPM Package
  console.log(
    `${colors.bright}${colors.yellow}NPM Package${colors.reset}`
  );
  console.log(
    `${colors.yellow}${'─'.repeat(62)}${colors.reset}\n`
  );

  const npmFiles = [
    { path: 'esm/index.js', label: 'ESM Bundle' },
    { path: 'cjs/index.js', label: 'CJS Bundle' },
    { path: 'types/index.d.ts', label: 'TypeScript Definitions' },
  ];

  for (const { path: filePath, label } of npmFiles) {
    const fullPath = path.join(distDir, filePath);
    const size = getFileSize(fullPath);
    const gzipSize = await getGzipSize(fullPath);

    console.log(`  ${colors.cyan}${label}${colors.reset}`);
    console.log(`    Path: dist/${filePath}`);
    console.log(`    Size: ${formatSize(size)}`);
    console.log(
      `    Gzip: ${formatSize(gzipSize)} ${colors.green}(${((gzipSize / size) * 100).toFixed(1)}%)${colors.reset}`
    );
    console.log('');
  }

  // Browser Bundles
  console.log(
    `${colors.bright}${colors.yellow}Browser/CDN${colors.reset}`
  );
  console.log(
    `${colors.yellow}${'─'.repeat(62)}${colors.reset}\n`
  );

  const browserFiles = [
    { path: 'browser/ohadakit.umd.js', label: 'UMD Bundle' },
    { path: 'browser/ohadakit.iife.js', label: 'IIFE Bundle' },
  ];

  for (const { path: filePath, label } of browserFiles) {
    const fullPath = path.join(distDir, filePath);
    const size = getFileSize(fullPath);
    const gzipSize = await getGzipSize(fullPath);

    console.log(`  ${colors.cyan}${label}${colors.reset}`);
    console.log(`    Path: dist/${filePath}`);
    console.log(`    Size: ${formatSize(size)}`);
    console.log(
      `    Gzip: ${formatSize(gzipSize)} ${colors.green}(${((gzipSize / size) * 100).toFixed(1)}%)${colors.reset}`
    );
    console.log('');
  }

  // Summary
  console.log(
    `${colors.blue}${'━'.repeat(62)}${colors.reset}\n`
  );

  const esmSize = getFileSize(path.join(distDir, 'esm/index.js'));
  const cjsSize = getFileSize(path.join(distDir, 'cjs/index.js'));
  const umdSize = getFileSize(path.join(distDir, 'browser/ohadakit.umd.js'));
  const iifeSize = getFileSize(path.join(distDir, 'browser/ohadakit.iife.js'));

  const esmGzip = await getGzipSize(path.join(distDir, 'esm/index.js'));
  const cjsGzip = await getGzipSize(path.join(distDir, 'cjs/index.js'));
  const umdGzip = await getGzipSize(path.join(distDir, 'browser/ohadakit.umd.js'));
  const iifeGzip = await getGzipSize(path.join(distDir, 'browser/ohadakit.iife.js'));

  console.log(`${colors.bright}Summary${colors.reset}\n`);
  console.log(
    `  NPM:     ${formatSize(esmSize)} ESM / ${formatSize(cjsSize)} CJS  (gzip: ${formatSize(esmGzip)} / ${formatSize(cjsGzip)})`
  );
  console.log(
    `  Browser: ${formatSize(umdSize)} UMD / ${formatSize(iifeSize)} IIFE (gzip: ${formatSize(umdGzip)} / ${formatSize(iifeGzip)})`
  );

  console.log(
    `\n${colors.green}Build ready for production.${colors.reset}\n`
  );
}

generateReport().catch(error => {
  console.error(`${colors.red}Build report failed:${colors.reset}`, error);
  process.exit(1);
});
