import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

const indexHtml = await readFile(indexPath, 'utf8');

if (!indexHtml.includes('<div id="root"></div>')) {
  throw new Error('Smoke test failed: dist/index.html is missing #root.');
}

const jsMatch = indexHtml.match(/<script[^>]*type="module"[^>]*src="([^\"]+)"/);
if (!jsMatch) {
  throw new Error('Smoke test failed: module script entry was not found in dist/index.html.');
}

const assetPath = jsMatch[1].replace(/^\//, '');
const entryPath = path.join(distDir, assetPath);

const entryStat = await stat(entryPath);
if (entryStat.size <= 0) {
  throw new Error('Smoke test failed: production entry bundle is empty.');
}

const entryJs = await readFile(entryPath, 'utf8');
if (!entryJs.includes("from './Game.js'")) {
  throw new Error('Smoke test failed: entry bundle does not import the game implementation module.');
}

const gameBundle = await readFile(path.join(distDir, 'Game.js'), 'utf8');
if (!gameBundle.includes('START GAME')) {
  throw new Error('Smoke test failed: built game module does not contain expected UI text marker.');
}

if (indexHtml.includes('text/babel')) {
  throw new Error('Smoke test failed: legacy inlined Babel script still exists in production entry.');
}


const cspMatch = indexHtml.match(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*content="([^"]+)"/i);
if (!cspMatch) {
  throw new Error('Smoke test failed: CSP meta tag is missing from dist/index.html.');
}

const csp = cspMatch[1];
if (!csp.includes("script-src 'self'")) {
  throw new Error("Smoke test failed: CSP script-src is not restricted to 'self'.");
}

const forbiddenCspTokens = ["'unsafe-inline'", "'unsafe-eval'"];
for (const token of forbiddenCspTokens) {
  if (csp.includes(token)) {
    throw new Error(`Smoke test failed: CSP still contains forbidden token ${token}.`);
  }
}

const forbiddenExternalHosts = ['cdn.tailwindcss.com', 'unpkg.com', 'cdnjs.cloudflare.com'];
for (const host of forbiddenExternalHosts) {
  if (indexHtml.includes(host)) {
    throw new Error(`Smoke test failed: dist/index.html still references external CDN ${host}.`);
  }
}

console.log('Smoke test passed: dist entrypoint and bundle look valid.');
