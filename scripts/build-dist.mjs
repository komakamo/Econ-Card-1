import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { transformFileAsync } from '@babel/core';

const OUT_DIR = path.resolve('dist');
await mkdir(OUT_DIR, { recursive: true });

const babelOptions = {
  babelrc: false,
  configFile: false,
  presets: [
    ['@babel/preset-env', { modules: false, targets: { esmodules: true } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  sourceMaps: false,
};

const compile = async (input, output) => {
  const result = await transformFileAsync(path.resolve(input), babelOptions);
  if (!result?.code) {
    throw new Error(`Failed to compile ${input}`);
  }
  await writeFile(path.join(OUT_DIR, output), result.code, 'utf8');
};

await compile('src/logic.js', 'logic.js');
await compile('src/Game.js', 'Game.js');
await compile('src/settingsValidation.js', 'settingsValidation.js');
await compile('src/main.jsx', 'main.js');

const distHtml = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline' https://esm.sh; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://esm.sh; object-src 'none'; base-uri 'self'; form-action 'self'"
    />
    <title>Economic Card Game</title>
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@18",
          "react-dom/client": "https://esm.sh/react-dom@18/client",
          "react/jsx-runtime": "https://esm.sh/react@18/jsx-runtime"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
`;

await writeFile(path.join(OUT_DIR, 'index.html'), distHtml, 'utf8');
console.log('Built dist/ from src/.');
