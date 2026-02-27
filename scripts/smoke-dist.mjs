import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

const indexHtml = await readFile(indexPath, 'utf8');

if (!indexHtml.includes('<div id="root"></div>')) {
  throw new Error('Smoke test failed: dist/index.html is missing #root.');
}

const jsMatch = indexHtml.match(/<script[^>]*src="([^\"]+)"/);
if (!jsMatch) {
  throw new Error('Smoke test failed: script entry was not found in dist/index.html.');
}

const assetPath = jsMatch[1].replace(/^\//, '');
const entryPath = path.join(distDir, assetPath);

const entryStat = await stat(entryPath);
if (entryStat.size <= 0) {
  throw new Error('Smoke test failed: production entry bundle is empty.');
}

const entryJs = await readFile(entryPath, 'utf8');
if (!entryJs.includes('START GAME')) {
  throw new Error('Smoke test failed: production bundle does not contain expected UI text marker.');
}

const unresolvedImports = ['from"react"', "from'react'", 'from"react-dom/client"', "from'react-dom/client'", 'from"react/jsx-runtime"', "from'react/jsx-runtime'"];
for (const token of unresolvedImports) {
  if (entryJs.includes(token)) {
    throw new Error(`Smoke test failed: unresolved dependency import remains in bundle (${token}).`);
  }
}

if (indexHtml.includes('text/babel')) {
  throw new Error('Smoke test failed: legacy inlined Babel script still exists in production entry.');
}

if (indexHtml.includes('importmap')) {
  throw new Error('Smoke test failed: import map should not be required for production distribution.');
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

console.log('Smoke test passed: dist output is self-contained and static-host ready.');
