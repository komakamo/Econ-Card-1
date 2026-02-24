
/**
 * @jest-environment node
 */
const validateSettings = (parsed) => {
    const validated = {};
    if (parsed && typeof parsed === 'object') {
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
    }
    return validated;
};

const validateObject = (parsed) => {
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : null;
};

describe('Security Validation Logic', () => {
    test('validateSettings handles valid inputs', () => {
        const input = {
            lang: 'en',
            fontSizeLevel: 'large',
            skipTurnSummary: true,
            isMuted: false,
            masterVolume: 80
        };
        const result = validateSettings(input);
        expect(result).toEqual(input);
    });

    test('validateSettings rejects invalid lang', () => {
        const input = { lang: 'fr' }; // Invalid lang
        const result = validateSettings(input);
        expect(result.lang).toBeUndefined();
    });

    test('validateSettings rejects invalid types', () => {
        const input = {
            lang: 123,
            fontSizeLevel: true,
            skipTurnSummary: 'yes',
            masterVolume: 'loud'
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
        // Ideally we also reject arrays if we expect a map-like object
        expect(validateObject([1, 2])).toBeNull();
    });
});
