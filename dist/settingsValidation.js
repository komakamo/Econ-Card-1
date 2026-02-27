function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export var SETTINGS_STORAGE_KEY = 'economic_game_settings';
export var SETTINGS_DEFAULTS = {
  lang: 'ja',
  fontSizeLevel: 'medium',
  skipTurnSummary: false,
  isMuted: false,
  masterVolume: 50
};
export var validateObject = parsed => {
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
};
export var validateSettings = parsed => {
  var validated = {};
  if (!parsed || typeof parsed !== 'object') return validated;
  if (['ja', 'en'].includes(parsed.lang)) {
    validated.lang = parsed.lang;
  }
  if (['small', 'medium', 'large'].includes(parsed.fontSizeLevel)) {
    validated.fontSizeLevel = parsed.fontSizeLevel;
  }
  if (typeof parsed.skipTurnSummary === 'boolean') {
    validated.skipTurnSummary = parsed.skipTurnSummary;
  }
  if (typeof parsed.isMuted === 'boolean') {
    validated.isMuted = parsed.isMuted;
  }
  if (typeof parsed.masterVolume === 'number' && Number.isFinite(parsed.masterVolume)) {
    validated.masterVolume = Math.max(0, Math.min(100, parsed.masterVolume));
  }
  return validated;
};
export var loadSettingsFromStorage = function loadSettingsFromStorage(storage) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SETTINGS_STORAGE_KEY;
  if (!storage || typeof storage.getItem !== 'function') return {};
  try {
    var raw = storage.getItem(key);
    if (!raw) return {};
    var parsed = JSON.parse(raw);
    var validObject = validateObject(parsed);
    return validObject ? validateSettings(validObject) : {};
  } catch (_unused) {
    return {};
  }
};
export var applyValidatedSettings = function applyValidatedSettings(validated) {
  var handlers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (Object.prototype.hasOwnProperty.call(validated, 'lang') && handlers.setLang) {
    handlers.setLang(validated.lang);
  }
  if (Object.prototype.hasOwnProperty.call(validated, 'fontSizeLevel') && handlers.setFontSizeLevel) {
    handlers.setFontSizeLevel(validated.fontSizeLevel);
  }
  if (Object.prototype.hasOwnProperty.call(validated, 'skipTurnSummary') && handlers.setSkipTurnSummary) {
    handlers.setSkipTurnSummary(validated.skipTurnSummary);
  }
  if (Object.prototype.hasOwnProperty.call(validated, 'isMuted') && handlers.setIsMuted) {
    handlers.setIsMuted(validated.isMuted);
  }
  if (Object.prototype.hasOwnProperty.call(validated, 'masterVolume') && handlers.setMasterVolume) {
    handlers.setMasterVolume(validated.masterVolume);
  }
  return validated;
};
export var loadAndApplySettings = function loadAndApplySettings(handlers, storage) {
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : SETTINGS_STORAGE_KEY;
  var validated = loadSettingsFromStorage(storage, key);
  return applyValidatedSettings(validated, handlers);
};
export var sanitizeSettingsForStorage = settings => {
  return _objectSpread(_objectSpread({}, SETTINGS_DEFAULTS), validateSettings(settings));
};
export var saveSettingsToStorage = function saveSettingsToStorage(storage, settings) {
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : SETTINGS_STORAGE_KEY;
  if (!storage || typeof storage.setItem !== 'function') return null;
  var sanitized = sanitizeSettingsForStorage(settings);
  try {
    storage.setItem(key, JSON.stringify(sanitized));
  } catch (_unused2) {
    return sanitized;
  }
  return sanitized;
};