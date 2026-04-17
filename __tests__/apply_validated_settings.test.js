/**
 * @jest-environment node
 */
import { applyValidatedSettings } from '../src/settingsValidation';

describe('applyValidatedSettings', () => {
    test('calls all handlers when all keys are present in validated object', () => {
        const validated = {
            lang: 'en',
            fontSizeLevel: 'large',
            skipTurnSummary: true,
            isMuted: true,
            masterVolume: 75,
        };
        const handlers = {
            setLang: jest.fn(),
            setFontSizeLevel: jest.fn(),
            setSkipTurnSummary: jest.fn(),
            setIsMuted: jest.fn(),
            setMasterVolume: jest.fn(),
        };

        applyValidatedSettings(validated, handlers);

        expect(handlers.setLang).toHaveBeenCalledWith('en');
        expect(handlers.setFontSizeLevel).toHaveBeenCalledWith('large');
        expect(handlers.setSkipTurnSummary).toHaveBeenCalledWith(true);
        expect(handlers.setIsMuted).toHaveBeenCalledWith(true);
        expect(handlers.setMasterVolume).toHaveBeenCalledWith(75);
    });

    test('calls only relevant handlers when some keys are missing', () => {
        const validated = {
            lang: 'ja',
            isMuted: false,
        };
        const handlers = {
            setLang: jest.fn(),
            setFontSizeLevel: jest.fn(),
            setSkipTurnSummary: jest.fn(),
            setIsMuted: jest.fn(),
            setMasterVolume: jest.fn(),
        };

        applyValidatedSettings(validated, handlers);

        expect(handlers.setLang).toHaveBeenCalledWith('ja');
        expect(handlers.setIsMuted).toHaveBeenCalledWith(false);

        expect(handlers.setFontSizeLevel).not.toHaveBeenCalled();
        expect(handlers.setSkipTurnSummary).not.toHaveBeenCalled();
        expect(handlers.setMasterVolume).not.toHaveBeenCalled();
    });

    test('does not throw and calls other handlers if some handlers are missing', () => {
        const validated = {
            lang: 'en',
            fontSizeLevel: 'small',
        };
        const handlers = {
            setLang: jest.fn(),
            // setFontSizeLevel is missing
        };

        expect(() => applyValidatedSettings(validated, handlers)).not.toThrow();
        expect(handlers.setLang).toHaveBeenCalledWith('en');
    });

    test('returns the validated object', () => {
        const validated = { lang: 'en' };
        const result = applyValidatedSettings(validated, {});
        expect(result).toBe(validated);
    });

    test('handles default handlers parameter (empty object)', () => {
        const validated = { lang: 'en', masterVolume: 50 };
        expect(() => applyValidatedSettings(validated)).not.toThrow();
    });

    test('ignores unrecognized properties in validated object', () => {
        const validated = {
            lang: 'en',
            unrecognized: 'value',
        };
        const handlers = {
            setLang: jest.fn(),
        };

        applyValidatedSettings(validated, handlers);
        expect(handlers.setLang).toHaveBeenCalledWith('en');
        // No crash or unexpected behavior
    });
});
