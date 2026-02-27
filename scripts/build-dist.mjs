import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { transformFileAsync } from '@babel/core';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const ROOT = path.resolve('.');
const OUT_DIR = path.resolve('dist');
const ENTRY_FILE = path.resolve('src/main.jsx');

await mkdir(OUT_DIR, { recursive: true });

const moduleCache = new Map();

const toModuleId = (filePath) => path.relative(ROOT, filePath).split(path.sep).join('/');

const resolveDep = (dep, fromFile) => require.resolve(dep, { paths: [path.dirname(fromFile)] });

const parseRequires = (code) => {
  const deps = [];
  const requirePattern = /require\((['"])(.+?)\1\)/g;
  for (const match of code.matchAll(requirePattern)) {
    deps.push(match[2]);
  }
  return deps;
};

const compileSrc = async (filePath) => {
  const result = await transformFileAsync(filePath, {
    babelrc: false,
    configFile: false,
    presets: [
      ['@babel/preset-env', { modules: 'commonjs', targets: { esmodules: true } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    sourceMaps: false,
    comments: false,
    compact: true,
  });
  if (!result?.code) {
    throw new Error(`Failed to compile ${filePath}`);
  }
  return result.code;
};

const loadModule = async (filePath) => {
  const resolvedPath = path.resolve(filePath);
  if (moduleCache.has(resolvedPath)) {
    return;
  }

  const isSourceFile = resolvedPath.startsWith(path.resolve('src') + path.sep);
  const code = isSourceFile ? await compileSrc(resolvedPath) : await readFile(resolvedPath, 'utf8');

  const depSpecs = parseRequires(code);
  const depMap = {};
  for (const spec of depSpecs) {
    const depPath = resolveDep(spec, resolvedPath);
    depMap[spec] = toModuleId(depPath);
    await loadModule(depPath);
  }

  moduleCache.set(resolvedPath, {
    id: toModuleId(resolvedPath),
    code,
    depMap,
  });
};

await loadModule(ENTRY_FILE);

const modulesObject = [...moduleCache.values()]
  .map((mod) => {
    const depMapJson = JSON.stringify(mod.depMap);
    return `"${mod.id}":[function(require,module,exports){${mod.code}},${depMapJson}]`;
  })
  .join(',');

const entryId = toModuleId(ENTRY_FILE);

const bundle = `(()=>{const __mods={${modulesObject}};const __cache={};const process={env:{NODE_ENV:'production'}};function __req(id){if(__cache[id])return __cache[id].exports;const row=__mods[id];if(!row)throw new Error('Module not found: '+id);const fn=row[0];const depMap=row[1];const module={exports:{}};__cache[id]=module;function localRequire(spec){const depId=depMap[spec];if(!depId)throw new Error('Cannot resolve "'+spec+'" from '+id);return __req(depId);}fn(localRequire,module,module.exports);return module.exports;}__req("${entryId}");})();`;

await writeFile(path.join(OUT_DIR, 'main.js'), bundle, 'utf8');

const distHtml = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
    />
    <title>Economic Card Game</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="./main.js"></script>
  </body>
</html>
`;

await writeFile(path.join(OUT_DIR, 'index.html'), distHtml, 'utf8');
await copyFile(path.join(OUT_DIR, 'index.html'), path.resolve('index.html'));

console.log('Built dist/ as a self-contained static bundle.');
