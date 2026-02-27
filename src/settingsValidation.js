export const SETTINGS_STORAGE_KEY = 'economic_game_settings';

export const SETTINGS_DEFAULTS = {
    lang: 'ja',
    fontSizeLevel: 'medium',
    skipTurnSummary: false,
    isMuted: false,
    masterVolume: 50,
};

export const validateObject = (parsed) => {
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
};

export const validateSettings = (parsed) => {
    const validated = {};
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

export const loadSettingsFromStorage = (storage, key = SETTINGS_STORAGE_KEY) => {
    if (!storage || typeof storage.getItem !== 'function') return {};

    try {
        const raw = storage.getItem(key);
        if (!raw) return {};

        const parsed = JSON.parse(raw);
        const validObject = validateObject(parsed);
        return validObject ? validateSettings(validObject) : {};
    } catch {
        return {};
    }
};

export const applyValidatedSettings = (validated, handlers = {}) => {
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

export const loadAndApplySettings = (handlers, storage, key = SETTINGS_STORAGE_KEY) => {
    const validated = loadSettingsFromStorage(storage, key);
    return applyValidatedSettings(validated, handlers);
};

export const sanitizeSettingsForStorage = (settings) => {
    return {
        ...SETTINGS_DEFAULTS,
        ...validateSettings(settings),
    };
};

export const saveSettingsToStorage = (storage, settings, key = SETTINGS_STORAGE_KEY) => {
    if (!storage || typeof storage.setItem !== 'function') return null;
    const sanitized = sanitizeSettingsForStorage(settings);
    try {
        storage.setItem(key, JSON.stringify(sanitized));
    } catch {
        return sanitized;
    }
    return sanitized;
};
