# LocalStorage settings spec (`economic_game_settings`)

`src/settingsValidation.js` がゲーム設定の唯一の入出力境界です。

## Storage key

- Key: `economic_game_settings`
- Format: JSON object

## Allowed fields

| field | type | allowed values | default |
|---|---|---|---|
| `lang` | string | `"ja"` / `"en"` | `"ja"` |
| `fontSizeLevel` | string | `"small"` / `"medium"` / `"large"` | `"medium"` |
| `skipTurnSummary` | boolean | `true` / `false` | `false` |
| `isMuted` | boolean | `true` / `false` | `false` |
| `masterVolume` | number | finite number, written as 0..100 に clamp | `50` |

## Read behavior

- `loadSettingsFromStorage` は以下の場合に空オブジェクト `{}` を返す。
  - storage API が存在しない
  - キーが未保存
  - JSON parse 失敗
  - object 以外
- 不正なフィールドは破棄し、許可済みフィールドのみ返す。

## Write behavior

- `saveSettingsToStorage` は `sanitizeSettingsForStorage` を必ず通して保存する。
- 保存時は defaults と validate 済み入力を merge した完全なオブジェクトを JSON 化して書き込む。
- storage API が無い環境では `null` を返して no-op。
