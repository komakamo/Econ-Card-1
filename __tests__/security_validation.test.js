/**
 * @jest-environment node
 */
import {
    SETTINGS_STORAGE_KEY,
    validateSettings,
    validateObject,
    loadAndApplySettings,
    loadSettingsFromStorage,
    sanitizeSettingsForStorage,
    saveSettingsToStorage,
    SETTINGS_DEFAULTS,
} from '../src/settingsValidation';

describe('Security Validation Logic', () => {
    test('validateSettings handles valid inputs', () => {
        const input = {
            lang: 'en',
            fontSizeLevel: 'large',
            skipTurnSummary: true,
            isMuted: false,
            masterVolume: 80,
        };
        const result = validateSettings(input);
        expect(result).toEqual(input);
    });

    test('validateSettings rejects invalid lang', () => {
        const input = { lang: 'fr' };
        const result = validateSettings(input);
        expect(result.lang).toBeUndefined();
    });

    test('validateSettings rejects invalid types', () => {
        const input = {
            lang: 123,
            fontSizeLevel: true,
            skipTurnSummary: 'yes',
            masterVolume: 'loud',
        };
        const result = validateSettings(input);
        expect(result).toEqual({});
    });

    test('validateSettings clamps volume', () => {
        const input = { masterVolume: 150 };
        const result = validateSettings(input);
        expect(result.masterVolume).toBe(100);

        const input2 = { masterVolume: -50 };
        const result2 = validateSettings(input2);
        expect(result2.masterVolume).toBe(0);
    });

    test('validateObject ensures object structure', () => {
        expect(validateObject({ a: 1 })).toEqual({ a: 1 });
        expect(validateObject(null)).toBeNull();
        expect(validateObject('string')).toBeNull();
        expect(validateObject(123)).toBeNull();
        expect(validateObject(true)).toBeNull();
        expect(validateObject([1, 2])).toBeNull();
    });

    test('loadAndApplySettings loads from storage and applies sanitized values through validateSettings path', () => {
        const storage = {
            getItem: jest.fn(() => JSON.stringify({
                lang: 'en',
                fontSizeLevel: 'large',
                skipTurnSummary: true,
                isMuted: false,
                masterVolume: 150,
                unknown: 'ignored',
            })),
        };
        const handlers = {
            setLang: jest.fn(),
            setFontSizeLevel: jest.fn(),
            setSkipTurnSummary: jest.fn(),
            setIsMuted: jest.fn(),
            setMasterVolume: jest.fn(),
        };

        const applied = loadAndApplySettings(handlers, storage, SETTINGS_STORAGE_KEY);

        expect(storage.getItem).toHaveBeenCalledWith(SETTINGS_STORAGE_KEY);
        expect(applied).toEqual({
            lang: 'en',
            fontSizeLevel: 'large',
            skipTurnSummary: true,
            isMuted: false,
            masterVolume: 100,
        });
        expect(handlers.setLang).toHaveBeenCalledWith('en');
        expect(handlers.setFontSizeLevel).toHaveBeenCalledWith('large');
        expect(handlers.setSkipTurnSummary).toHaveBeenCalledWith(true);
        expect(handlers.setIsMuted).toHaveBeenCalledWith(false);
        expect(handlers.setMasterVolume).toHaveBeenCalledWith(100);
    });

    describe('loadSettingsFromStorage', () => {
        test('returns empty object when storage is missing', () => {
            expect(loadSettingsFromStorage(null)).toEqual({});
            expect(loadSettingsFromStorage(undefined)).toEqual({});
        });

        test('returns empty object when getItem is not a function', () => {
            expect(loadSettingsFromStorage({})).toEqual({});
            expect(loadSettingsFromStorage({ getItem: 'not a function' })).toEqual({});
        });

        test('returns empty object when item is not found (returns null)', () => {
            const storage = {
                getItem: jest.fn(() => null),
            };
            const result = loadSettingsFromStorage(storage, 'test_key');
            expect(storage.getItem).toHaveBeenCalledWith('test_key');
            expect(result).toEqual({});
        });

        test('returns empty object when JSON is invalid', () => {
            const storage = {
                getItem: jest.fn(() => 'invalid { json'),
            };
            const result = loadSettingsFromStorage(storage);
            expect(result).toEqual({});
        });

        test('returns empty object when parsed JSON is not an object', () => {
            const storage = {
                getItem: jest.fn(() => JSON.stringify(['not', 'an', 'object'])),
            };
            expect(loadSettingsFromStorage(storage)).toEqual({});

            const storage2 = {
                getItem: jest.fn(() => JSON.stringify('just a string')),
            };
            expect(loadSettingsFromStorage(storage2)).toEqual({});
        });

        test('returns validated settings when JSON is valid', () => {
            const validSettings = {
                lang: 'en',
                fontSizeLevel: 'large',
                skipTurnSummary: true,
                isMuted: true,
                masterVolume: 75,
            };
            const storage = {
                getItem: jest.fn(() => JSON.stringify(validSettings)),
            };
            const result = loadSettingsFromStorage(storage);
            expect(result).toEqual(validSettings);
        });

        test('returns partially validated settings when some fields are invalid', () => {
            const mixedSettings = {
                lang: 'fr', // invalid
                fontSizeLevel: 'large', // valid
                skipTurnSummary: 'yes', // invalid type
                masterVolume: 150, // valid but needs clamping
            };
            const storage = {
                getItem: jest.fn(() => JSON.stringify(mixedSettings)),
            };
            const result = loadSettingsFromStorage(storage);
            expect(result).toEqual({
                fontSizeLevel: 'large',
                masterVolume: 100,
            });
        });

        test('returns empty object when getItem throws an error', () => {
            const storage = {
                getItem: jest.fn(() => {
                    throw new Error('Storage access denied');
                }),
            };
            const result = loadSettingsFromStorage(storage);
            expect(result).toEqual({});
        });
    });
});

test('sanitizeSettingsForStorage fills defaults and removes invalid values', () => {
    const sanitized = sanitizeSettingsForStorage({ lang: 'en', masterVolume: 200, fontSizeLevel: 'bad' });
    expect(sanitized).toEqual({
        ...SETTINGS_DEFAULTS,
        lang: 'en',
        masterVolume: 100,
    });
});

test('saveSettingsToStorage writes sanitized payload', () => {
    const storage = { setItem: jest.fn() };
    const saved = saveSettingsToStorage(storage, { skipTurnSummary: true, masterVolume: -10 }, SETTINGS_STORAGE_KEY);

    expect(saved).toEqual({
        ...SETTINGS_DEFAULTS,
        skipTurnSummary: true,
        masterVolume: 0,
    });
    expect(storage.setItem).toHaveBeenCalledWith(SETTINGS_STORAGE_KEY, JSON.stringify(saved));
});

test('saveSettingsToStorage does not throw when setItem throws', () => {
    const storage = {
        setItem: jest.fn(() => {
            throw new Error('quota exceeded');
        }),
    };

    expect(() => saveSettingsToStorage(storage, { lang: 'en' }, SETTINGS_STORAGE_KEY)).not.toThrow();
    expect(saveSettingsToStorage(storage, { lang: 'en' }, SETTINGS_STORAGE_KEY)).toEqual({
        ...SETTINGS_DEFAULTS,
        lang: 'en',
    });
});

test('loadAndApplySettings does not throw when getItem throws', () => {
    const storage = {
        getItem: jest.fn(() => {
            throw new Error('storage blocked');
        }),
    };
    const handlers = {
        setLang: jest.fn(),
        setFontSizeLevel: jest.fn(),
        setSkipTurnSummary: jest.fn(),
        setIsMuted: jest.fn(),
        setMasterVolume: jest.fn(),
    };

    expect(() => loadAndApplySettings(handlers, storage, SETTINGS_STORAGE_KEY)).not.toThrow();
    expect(loadAndApplySettings(handlers, storage, SETTINGS_STORAGE_KEY)).toEqual({});
    expect(storage.getItem).toHaveBeenCalledWith(SETTINGS_STORAGE_KEY);
    expect(handlers.setLang).not.toHaveBeenCalled();
    expect(handlers.setFontSizeLevel).not.toHaveBeenCalled();
    expect(handlers.setSkipTurnSummary).not.toHaveBeenCalled();
    expect(handlers.setIsMuted).not.toHaveBeenCalled();
    expect(handlers.setMasterVolume).not.toHaveBeenCalled();
});
