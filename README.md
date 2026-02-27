# Economic Card Game

## 起動方法

### 開発用（リポジトリルートで確認）
1. 依存インストール
   ```bash
   npm install
   ```
2. 配布ビルドを生成（`dist/` とルート `index.html` を更新）
   ```bash
   npm run build
   ```
3. ルートを静的配信して確認
   ```bash
   python3 -m http.server 4173
   ```
4. ブラウザで `http://localhost:4173/` を開く

### 配布用（`dist` をそのまま配る場合）
1. ビルド済み `dist/` を任意の静的ホスティングへ配置
2. `dist/index.html` をエントリーポイントとして配信
   - `dist/main.js` は React / ReactDOM を含む自己完結バンドルのため、追加の import map や CDN は不要

## 補足
- `npm run smoke:dist` で、`dist/` が自己完結しているか（未解決依存が残っていないか）を検査できます。
