/**
 * @jest-environment node
 */
import {
    SETTINGS_STORAGE_KEY,
    validateSettings,
    validateObject,
    loadAndApplySettings,
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
});
