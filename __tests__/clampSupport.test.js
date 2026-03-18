import GameLogic from '../src/logic';

const { clampSupport } = GameLogic;

describe('clampSupport', () => {
    test('should return value within [0, 100] as is', () => {
        expect(clampSupport(0)).toBe(0);
        expect(clampSupport(50)).toBe(50);
        expect(clampSupport(100)).toBe(100);
    });

    test('should clamp values below 0 to 0', () => {
        expect(clampSupport(-1)).toBe(0);
        expect(clampSupport(-100)).toBe(0);
    });

    test('should clamp values above 100 to 100', () => {
        expect(clampSupport(101)).toBe(100);
        expect(clampSupport(1000)).toBe(100);
    });

    test('should use default value of 0 when no argument is provided', () => {
        expect(clampSupport()).toBe(0);
    });

    test('should handle non-integer values within range', () => {
        expect(clampSupport(50.5)).toBe(50.5);
    });
});
