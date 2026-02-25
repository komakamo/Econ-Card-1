import GameLogic from '../src/logic';

const { clampInflation, INFLATION_MIN, INFLATION_MAX } = GameLogic;

describe('clampInflation', () => {
    test('should return value within range as is (rounded to 1 decimal)', () => {
        const mid = (INFLATION_MIN + INFLATION_MAX) / 2;
        expect(clampInflation(mid)).toBe(mid);
        expect(clampInflation(INFLATION_MIN + 1)).toBe(INFLATION_MIN + 1);
        expect(clampInflation(INFLATION_MAX - 1)).toBe(INFLATION_MAX - 1);
    });

    test('should clamp values below minimum', () => {
        expect(clampInflation(INFLATION_MIN - 1)).toBe(INFLATION_MIN);
        expect(clampInflation(INFLATION_MIN - 100)).toBe(INFLATION_MIN);
    });

    test('should clamp values above maximum', () => {
        expect(clampInflation(INFLATION_MAX + 1)).toBe(INFLATION_MAX);
        expect(clampInflation(INFLATION_MAX + 100)).toBe(INFLATION_MAX);
    });

    test('should handle boundary values correctly', () => {
        expect(clampInflation(INFLATION_MIN)).toBe(INFLATION_MIN);
        expect(clampInflation(INFLATION_MAX)).toBe(INFLATION_MAX);
    });

    test('should round to 1 decimal place', () => {
        expect(clampInflation(1.23)).toBe(1.2);
        expect(clampInflation(1.27)).toBe(1.3);
        expect(clampInflation(1.25)).toBe(1.3);
    });

    test('should correct negative zero', () => {
         // -0.01 rounds to -0.0 which is -0 in JS Number.
         // We use toBeCloseTo to treat -0 and 0 as equivalent for test purposes.
         expect(clampInflation(-0.01)).toBeCloseTo(0);
    });
});
